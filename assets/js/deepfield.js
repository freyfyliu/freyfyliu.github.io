/* deepfield.js — interactive JADES deep-field gravitational-lens hero
 * Vanilla JS, no dependencies. Fills its container (responsive).
 *
 * Usage in index.html:
 *   <div id="deepfield" class="image-panel"></div>
 *   <script src="assets/js/deepfield.js"></script>
 *   <script>DeepField.mount(document.getElementById('deepfield'),
 *                            { base: 'assets/img/deepfield/' });</script>
 *
 * Expects: <base>/manifest.json and <base>/atlas_<band>_<page>.png
 */
(function () {
  const BAND_KEYS = ["rgb", "xray", "uv", "optical", "nir", "dust", "radio"];
  const BAND_LABEL = { rgb: "RGB", xray: "X Ray", uv: "UV", optical: "Optical", nir: "Infrared", dust: "(Sub)Millimetre", radio: "Radio" };
  const RGB_SRC = { r: "nir", g: "optical", b: "uv" };   // false-colour: R=F444W, G=F277W, B=F115W
  const ATLAS_BANDS = ["xray", "uv", "optical", "nir", "dust", "radio"];   // real bands with PNG atlases
  const DWELL = 8000, FADE = 1400;
  const FIELD_ARCMIN = 2.22, FIELD_ARCSEC = FIELD_ARCMIN * 60;
  const FIRST_BAND = "rgb";        // shown first on load (needs uv+optical+nir)
  const FIRST_LOAD = ["nir", "optical", "uv"];   // load these first so RGB can composite
  const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

  // close-pair (interaction) probability — fixed (no redshift weighting)
  const INTERACT_PROB = 0.07;

  // arrow-cursor lens silhouette + dense SIS components
  const CURSOR_PTS = [[0.02,0.02],[0.02,0.78],[0.20,0.60],[0.31,0.86],[0.42,0.82],[0.31,0.56],[0.56,0.56]];
  function pointInArrow(rx, ry) { let inside = false; for (let i=0,j=CURSOR_PTS.length-1;i<CURSOR_PTS.length;j=i++){const xi=CURSOR_PTS[i][0],yi=CURSOR_PTS[i][1],xj=CURSOR_PTS[j][0],yj=CURSOR_PTS[j][1];if(((yi>ry)!==(yj>ry))&&(rx<(xj-xi)*(ry-yi)/(yj-yi)+xi))inside=!inside;}return inside; }
  const LENS_STEP = 0.05;
  const CURSOR_LENS = (() => { const c=[]; for(let y=0.02;y<=0.86;y+=LENS_STEP)for(let x=0.02;x<=0.56;x+=LENS_STEP)if(pointInArrow(x+LENS_STEP/2,y+LENS_STEP/2))c.push({x:x-0.25,y:y-0.42}); return c; })();

  function mount(container, opts) {
    opts = opts || {};
    const base = opts.base || "assets/img/deepfield/";

    // --- DOM scaffold ---
    container.style.position = container.style.position || "relative";
    container.style.overflow = "hidden";
    // the widget is absolutely positioned; ensure the panel has a height even if
    // the original <img> was what gave it one. Only sets a fallback, won't override CSS.
    if (!container.style.minHeight && container.getBoundingClientRect().height < 40) {
      container.style.minHeight = "70vh";
    }
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;cursor:none;background:#000004;";
    container.appendChild(canvas);
    const label = document.createElement("div");
    label.style.cssText = "position:absolute;bottom:18px;right:20px;z-index:3;pointer-events:none;font-family:'IBM Plex Mono',ui-monospace,monospace;font-weight:300;font-size:11px;letter-spacing:2.5px;color:#8a92a2;text-transform:uppercase;";
    label.textContent = BAND_LABEL[FIRST_BAND];
    container.appendChild(label);
    const ctx = canvas.getContext("2d");

    // --- state ---
    const S = {
      W: 0, H: 0, dpr: 1, manifest: null,
      atlas: {},            // band -> {pages:[Image], loaded:bool}
      bandLayers: {},       // band -> offscreen canvas
      bandData: {},         // band -> ImageData
      placed: null, zMap: null, starLayer: null, lensLUT: null,
      mouse: { x: -9999, y: -9999, active: false, scale: 1 },
      clock: { start: performance.now(), frozen: false, frozenAt: 0 },
      raf: null, built: false,
    };

    // ---------- load manifest + atlases (lazy per band) ----------
    function loadBand(band) {
      if (S.atlas[band]) return S.atlas[band].promise;
      const m = S.manifest, pages = [];
      const rec = { pages, loaded: false };
      const proms = [];
      for (let p = 0; p < m.pages; p++) {
        const img = new Image();
        const pr = new Promise((res) => { img.onload = res; img.onerror = res; });
        img.src = base + `atlas_${band}_${p}.png`;
        pages.push(img); proms.push(pr);
      }
      rec.promise = Promise.all(proms).then(() => { rec.loaded = true; if (S.built) { compositeBand(band); maybeCompositeRGB(); } });
      S.atlas[band] = rec;
      return rec.promise;
    }

    fetch(base + "manifest.json").then(r => r.json()).then(m => {
      S.manifest = m;
      Promise.all(FIRST_LOAD.map(loadBand)).then(() => { resize(); startLoop(); preloadRest(); });
    });
    function preloadRest() { ATLAS_BANDS.forEach(b => { if (!S.atlas[b]) loadBand(b); }); }
    function maybeCompositeRGB() {
      if (FIRST_LOAD.every(b => S.bandLayers[b])) compositeRGB();
    }

    // ---------- build field (sampling) ----------
    function buildField() {
      const m = S.manifest; if (!m) return;
      const W = S.W, H = S.H; if (!W || !H) return;
      const mobile = Math.min(W, H) < 520;
      const px_per_arcsec = Math.min(W, H) / FIELD_ARCSEC;
      const density = mobile ? 54 : 96;
      const COUNT = Math.round(density * FIELD_ARCMIN * FIELD_ARCMIN);

      const lib = m.gal;
      // The catalogue was brightness-selected (faint galaxies under-counted).
      // Correct toward reality: up-weight fainter galaxies, ramping from 1x for the
      // brightest (largest angular size) to 3x for the faintest. No n(z) re-weighting.
      const order = lib.map((g, i) => [i, g.ar]).sort((a, b) => b[1] - a[1]); // bright -> faint
      const weights = new Float64Array(lib.length);
      const denom = Math.max(1, lib.length - 1);
      order.forEach((o, rank) => { weights[o[0]] = 1 + 2 * (rank / denom); });   // 1 .. 3
      let wsum = 0; for (let i = 0; i < weights.length; i++) wsum += weights[i];
      const pick = () => { let r = Math.random() * wsum; for (let i = 0; i < lib.length; i++) { r -= weights[i]; if (r <= 0) return i; } return lib.length - 1; };

      const placed = [];
      for (let n = 0; n < COUNT; n++) {
        const gi = pick(), g = lib[gi];
        const x = Math.random()*W, y = Math.random()*H;
        const arPx = clamp(g.ar * px_per_arcsec, 3, Math.min(W,H)*0.5);
        placed.push({ gi, x, y, size: arPx, rot: Math.random()*Math.PI, z: g.z == null ? 1.0 : g.z });
        if (Math.random() < INTERACT_PROB) {
          const gj = pick(), g2 = lib[gj];
          const ar2 = clamp(g2.ar*px_per_arcsec, 3, Math.min(W,H)*0.4);
          placed.push({ gi: gj, x: x+(Math.random()-0.5)*arPx*1.6, y: y+(Math.random()-0.5)*arPx*1.6, size: ar2, rot: Math.random()*Math.PI, z: g2.z == null ? 1.0 : g2.z });
        }
      }
      S.placed = placed;

      // redshift weight map (high-z bends more)
      const zc = document.createElement("canvas"); zc.width=W; zc.height=H;
      const zg = zc.getContext("2d"); zg.fillStyle="#000"; zg.fillRect(0,0,W,H);
      for (const p of placed) { const wz=clamp(p.z/5.5,0,1),v=Math.round(wz*255),rad=p.size*0.7;
        const gr=zg.createRadialGradient(p.x,p.y,0,p.x,p.y,rad); gr.addColorStop(0,`rgba(${v},${v},${v},1)`); gr.addColorStop(1,"rgba(0,0,0,0)");
        zg.fillStyle=gr; zg.beginPath(); zg.arc(p.x,p.y,rad,0,Math.PI*2); zg.fill(); }
      const zd = zg.getImageData(0,0,W,H).data;
      const zw = new Float32Array(W*H); for (let i=0;i<W*H;i++) zw[i]=zd[i*4]/255; S.zMap = zw;

      // foreground Milky-Way stars (sparse, grey-white, never lensed)
      const sc = document.createElement("canvas"); sc.width=W; sc.height=H;
      const s = sc.getContext("2d"); s.globalCompositeOperation="lighter";
      const nStars = Math.floor(W*H/(mobile?100000:67000));
      for (let i=0;i<nStars;i++){const x=Math.random()*W,y=Math.random()*H,mag=Math.random();
        const r=mag<0.93?0.4+Math.random()*0.9:1.2+Math.random()*1.7,a=0.22+mag*0.6,gw=205+Math.random()*35;
        const gr=s.createRadialGradient(x,y,0,x,y,r*2.4); gr.addColorStop(0,`rgba(${gw},${gw+10},${gw+18},${a})`); gr.addColorStop(1,"rgba(255,255,255,0)");
        s.fillStyle=gr; s.beginPath(); s.arc(x,y,r*2.4,0,Math.PI*2); s.fill(); }
      for (let i=0;i<(mobile?0:(Math.random()<0.4?1:0));i++){const x=Math.random()*W,y=Math.random()*H,sz=1.5+Math.random()*2.2;
        const gr=s.createRadialGradient(x,y,0,x,y,sz*5); gr.addColorStop(0,"rgba(235,238,247,0.95)"); gr.addColorStop(0.5,"rgba(210,216,230,0.3)"); gr.addColorStop(1,"rgba(255,255,255,0)");
        s.fillStyle=gr; s.beginPath(); s.arc(x,y,sz*5,0,Math.PI*2); s.fill();
        s.strokeStyle="rgba(225,230,242,0.5)"; s.lineWidth=0.8;
        for(const an of [0,Math.PI/2,Math.PI/4,-Math.PI/4]){const ln=(an%(Math.PI/2)===0)?sz*11:sz*6; s.beginPath(); s.moveTo(x-Math.cos(an)*ln,y-Math.sin(an)*ln); s.lineTo(x+Math.cos(an)*ln,y+Math.sin(an)*ln); s.stroke();}}
      s.globalCompositeOperation="source-over"; S.starLayer = sc;

      S.lensLUT = null; S.built = true;
      // composite whatever real bands are already loaded, then the RGB layer
      ATLAS_BANDS.forEach(b => { if (S.atlas[b] && S.atlas[b].loaded) compositeBand(b); });
      maybeCompositeRGB();
    }

    // ---------- composite the false-colour RGB layer from the 3 grayscale bands ----------
    function compositeRGB() {
      const W = S.W, H = S.H;
      const Rl = S.bandData[RGB_SRC.r], Gl = S.bandData[RGB_SRC.g], Bl = S.bandData[RGB_SRC.b];
      if (!Rl || !Gl || !Bl || !W) return;
      const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
      const gctx = cv.getContext("2d");
      const out = gctx.createImageData(W, H), od = out.data;
      const R = Rl.data, G = Gl.data, B = Bl.data;
      for (let i = 0; i < W * H; i++) {
        const j = i * 4;
        od[j] = R[j];        // red   <- near-IR intensity (grayscale layers have R=G=B)
        od[j+1] = G[j+1];    // green <- optical
        od[j+2] = B[j+2];    // blue  <- UV
        od[j+3] = 255;
      }
      gctx.putImageData(out, 0, 0);
      S.bandLayers.rgb = cv;
      S.bandData.rgb = out;   // so the lens can sample/magnify the RGB image too
    }

    // ---------- composite one band's field layer ----------
    function compositeBand(band) {
      const m = S.manifest, W = S.W, H = S.H; if (!S.placed || !W) return;
      const px_per_arcsec = Math.min(W, H) / FIELD_ARCSEC;
      const cell = m.cell, cols = m.cols, pages = S.atlas[band].pages;
      const cv = document.createElement("canvas"); cv.width=W; cv.height=H;
      const g = cv.getContext("2d");
      g.fillStyle="#000004"; g.fillRect(0,0,W,H);
      // beam convolution applied on the composited field (room to spread):
      // (sub)mm ~1" (ALMA-like), radio ~5" (so emission grows beyond each source)
      const beamArcsec = band === "dust" ? 1.0 : band === "radio" ? 5.0 : 0;
      const beamPx = beamArcsec ? Math.max(1, beamArcsec * px_per_arcsec) : 0;
      const tmp = beamPx ? document.createElement("canvas") : null;
      const gg = beamPx ? (tmp.width=W, tmp.height=H, tmp.getContext("2d")) : g;
      gg.globalCompositeOperation = "lighter";
      const lib = m.gal;
      for (const p of S.placed) {
        const gal = lib[p.gi]; const img = pages[gal.page]; if (!img || !img.width) continue;
        const sx = gal.col*cell, sy = gal.row*cell, asp = gal.aspect||1;
        const dw = p.size, dh = p.size/asp;
        gg.save(); gg.translate(p.x,p.y); gg.rotate(p.rot);
        gg.drawImage(img, sx, sy, cell, cell, -dw/2, -dh/2, dw, dh);
        gg.restore();
      }
      gg.globalCompositeOperation = "source-over";
      if (beamPx) {
        g.filter = `blur(${beamPx.toFixed(1)}px)`;
        g.globalCompositeOperation = "lighter";
        g.drawImage(tmp, 0, 0);
        if (band === "dust") g.drawImage(tmp, 0, 0);   // 2x brightness for (sub)mm
        if (band === "radio") g.drawImage(tmp, 0, 0);  // beam dims radio a lot; restore
        g.globalCompositeOperation = "source-over";
        g.filter = "none";
      }
      S.bandLayers[band] = cv;
      S.bandData[band] = g.getImageData(0,0,W,H);
    }

    // ---------- resize ----------
    function resize() {
      const r = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      S.dpr = dpr; S.W = Math.max(2, Math.round(r.width*dpr)); S.H = Math.max(2, Math.round(r.height*dpr));
      canvas.width = S.W; canvas.height = S.H;
      S.bandLayers = {}; S.bandData = {};
      buildField();
    }
    const ro = new ResizeObserver(resize); ro.observe(container);

    // ---------- draw loop ----------
    function startLoop() { if (S.raf) return; const loop = () => { draw(); S.raf = requestAnimationFrame(loop); }; loop(); }
    function activeLayer(idx) { return S.bandLayers[BAND_KEYS[idx]]; }

    function draw() {
      const W = S.W, H = S.H; if (!W || !S.built) return;
      const now = performance.now(), ck = S.clock;
      const elapsed = ck.frozen ? ck.frozenAt : now - ck.start;
      const period = DWELL, phase = elapsed % (period*BAND_KEYS.length);
      let idx = Math.floor(phase/period); const into = phase - idx*period;
      const frac = into > period-FADE ? (into-(period-FADE))/FADE : 0;
      const nextIdx = (idx+1)%BAND_KEYS.length, activeBand = frac>0.5?nextIdx:idx;

      ctx.fillStyle = "#000004"; ctx.fillRect(0,0,W,H);
      const la = activeLayer(idx), lb = activeLayer(nextIdx);
      ctx.globalAlpha = 1; if (la) ctx.drawImage(la,0,0);
      if (frac>0 && lb) { ctx.globalAlpha = frac; ctx.drawImage(lb,0,0); ctx.globalAlpha = 1; }

      const m = S.mouse;
      if (m.active && S.bandData[BAND_KEYS[activeBand]]) {
        const src = S.bandData[BAND_KEYS[activeBand]].data;
        const L = Math.min(W,H)*0.17*m.scale, step = 2, pad = L*4.2;
        const x0=clamp((m.x-pad)|0,0,W-1),x1=clamp((m.x+pad)|0,0,W-1),y0=clamp((m.y-pad)|0,0,H-1),y1=clamp((m.y+pad)|0,0,H-1);
        const bw=x1-x0+1,bh=y1-y0+1;
        if (bw>1 && bh>1) {
          const out=ctx.createImageData(bw,bh),od=out.data;
          const sample=(sx,sy)=>{sx=clamp(sx,0,W-1.001);sy=clamp(sy,0,H-1.001);const ix=sx|0,iy=sy|0,fx=sx-ix,fy=sy-iy;const i00=(iy*W+ix)*4,i10=i00+4,i01=i00+W*4,i11=i01+4;return[(src[i00]*(1-fx)+src[i10]*fx)*(1-fy)+(src[i01]*(1-fx)+src[i11]*fx)*fy,(src[i00+1]*(1-fx)+src[i10+1]*fx)*(1-fy)+(src[i01+1]*(1-fx)+src[i11+1]*fx)*fy,(src[i00+2]*(1-fx)+src[i10+2]*fx)*(1-fy)+(src[i01+2]*(1-fx)+src[i11+2]*fx)*fy];};
          const zw = S.zMap, Lr = Math.round(L);
          let LUT = S.lensLUT;
          if (!LUT || LUT.L !== Lr) {
            const cellL=4, half=Math.ceil(pad), nxg=Math.ceil(2*half/cellL)+1, nyg=nxg;
            const DX=new Float32Array(nxg*nyg),DY=new Float32Array(nxg*nyg);
            const thetaE=LENS_STEP*L*90.0, core=LENS_STEP*L*0.40;
            for(let gy=0;gy<nyg;gy++){const ly=-half+gy*cellL;for(let gx=0;gx<nxg;gx++){const lx=-half+gx*cellL;let ax=0,ay=0;for(const c of CURSOR_LENS){const ex=lx-c.x*L,ey=ly-c.y*L;const rr=Math.sqrt(ex*ex+ey*ey)+0.001;const reff=Math.sqrt(rr*rr+core*core);const a=thetaE/reff;ax+=a*ex/rr;ay+=a*ey/rr;}DX[gy*nxg+gx]=ax;DY[gy*nxg+gx]=ay;}}
            const JXX=new Float32Array(nxg*nyg),JXY=new Float32Array(nxg*nyg),JYX=new Float32Array(nxg*nyg),JYY=new Float32Array(nxg*nyg);
            const inv2c=1/(2*cellL);
            for(let gy=1;gy<nyg-1;gy++)for(let gx=1;gx<nxg-1;gx++){const i=gy*nxg+gx;JXX[i]=(DX[i+1]-DX[i-1])*inv2c;JXY[i]=(DX[i+nxg]-DX[i-nxg])*inv2c;JYX[i]=(DY[i+1]-DY[i-1])*inv2c;JYY[i]=(DY[i+nxg]-DY[i-nxg])*inv2c;}
            LUT = S.lensLUT = { L:Lr, cellL, half, nxg, nyg, DX, DY, JXX, JXY, JYX, JYY };
          }
          const {cellL,half,nxg,nyg,DX,DY,JXX,JXY,JYX,JYY}=LUT;
          const fetchD=(lx,ly)=>{const gx=(lx+half)/cellL,gy=(ly+half)/cellL;if(gx<0||gy<0||gx>=nxg-1||gy>=nyg-1)return[0,0,0,0,0,0];const ix=gx|0,iy=gy|0,fx=gx-ix,fy=gy-iy;const i00=iy*nxg+ix,i10=i00+1,i01=i00+nxg,i11=i01+1;const bl=A=>(A[i00]*(1-fx)+A[i10]*fx)*(1-fy)+(A[i01]*(1-fx)+A[i11]*fx)*fy;return[bl(DX),bl(DY),bl(JXX),bl(JXY),bl(JYX),bl(JYY)];};
          for(let py=y0;py<=y1;py+=step)for(let px=x0;px<=x1;px+=step){
            const d=fetchD(px-m.x,py-m.y); const zwt=0.12+0.88*(zw[py*W+px]||0);
            let dax=d[0]*zwt,day=d[1]*zwt; const dlen=Math.sqrt(dax*dax+day*day),dcap=L*3.0; if(dlen>dcap){const f=dcap/dlen;dax*=f;day*=f;}
            const det=(1-zwt*d[2])*(1-zwt*d[5])-(zwt*d[3])*(zwt*d[4]); const mu=clamp(1/Math.max(Math.abs(det),0.001),0.25,6.0);
            const bx=px-dax, by=py-day;
            let c;
            if (mu > 1.6) {                              // soften aliasing where strongly magnified
              const o = 0.55 * (mu - 1);                 // source-space jitter grows with magnification
              const a0=sample(bx,by), a1=sample(bx+o,by), a2=sample(bx-o,by), a3=sample(bx,by+o), a4=sample(bx,by-o);
              c=[(a0[0]*2+a1[0]+a2[0]+a3[0]+a4[0])/6,(a0[1]*2+a1[1]+a2[1]+a3[1]+a4[1])/6,(a0[2]*2+a1[2]+a2[2]+a3[2]+a4[2])/6];
            } else c=sample(bx,by);
            const bi=(py*W+px)*4; const edge=clamp(1-(Math.max(Math.abs(px-m.x),Math.abs(py-m.y))-pad*0.78)/(pad*0.22),0,1);
            const cr=src[bi]*(1-edge)+clamp(c[0]*mu,0,255)*edge, cg=src[bi+1]*(1-edge)+clamp(c[1]*mu,0,255)*edge, cb=src[bi+2]*(1-edge)+clamp(c[2]*mu,0,255)*edge;
            for(let sy=0;sy<step;sy++)for(let sx=0;sx<step;sx++){const ox=px-x0+sx,oy=py-y0+sy;if(ox>=bw||oy>=bh)continue;const oi=(oy*bw+ox)*4;od[oi]=cr;od[oi+1]=cg;od[oi+2]=cb;od[oi+3]=255;}
          }
          ctx.putImageData(out,x0,y0);
        }
      }

      if (S.starLayer) {
        // foreground Milky-Way stars: visible only where stars actually emit
        // (RGB/UV/optical/near-IR); hidden in X-ray, (sub)mm and radio. Blend
        // across the band crossfade so they fade in/out smoothly.
        const starVis = b => (b === "rgb" || b === "uv" || b === "optical" || b === "nir") ? 1 : 0;
        const sa = starVis(BAND_KEYS[idx]) * (1 - frac) + starVis(BAND_KEYS[nextIdx]) * frac;
        if (sa > 0.001) {
          ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = sa;
          ctx.drawImage(S.starLayer, 0, 0);
          ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
        }
      }

      const nm = BAND_LABEL[BAND_KEYS[activeBand]];
      if (label.textContent !== nm) label.textContent = nm;
    }

    // ---------- interaction (coords scaled to canvas pixels via dpr) ----------
    function setMouse(e) {
      const r = canvas.getBoundingClientRect();
      S.mouse.x = (e.clientX - r.left) * S.dpr; S.mouse.y = (e.clientY - r.top) * S.dpr;
      if (!S.mouse.active) { S.mouse.active = true; const ck = S.clock; ck.frozenAt = performance.now()-ck.start; ck.frozen = true; }
    }
    canvas.addEventListener("mousemove", setMouse);
    canvas.addEventListener("mouseleave", () => { S.mouse.active = false; const ck = S.clock; ck.start = performance.now()-ck.frozenAt; ck.frozen = false; });
    canvas.addEventListener("wheel", (e) => { S.mouse.scale = clamp(S.mouse.scale*(e.deltaY>0?0.93:1.07),0.5,2.4); }, { passive: true });

    // pause when offscreen (saves CPU/battery)
    const io = new IntersectionObserver((ents) => { ents.forEach(en => { if (en.isIntersecting) startLoop(); else if (S.raf) { cancelAnimationFrame(S.raf); S.raf = null; } }); });
    io.observe(container);

    return { destroy() { cancelAnimationFrame(S.raf); ro.disconnect(); io.disconnect(); container.removeChild(canvas); container.removeChild(label); } };
  }

  window.DeepField = { mount };
})();
