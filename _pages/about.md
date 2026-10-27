---
title: "About"
layout: page
permalink: /about/
---

# About

<div class="section-card">
<div class="pi-card">
<img src="{{ site.photo | prepend: '/images/' | relative_url }}" class="pi-photo" alt="Portrait of Frey Liu" width="160" height="160">
<div>
<h2 class="pi-name">{{ site.name }}</h2>
<p style="font-style: italic; color: var(--text-secondary);">{{ site.title }}<br>{{ site.institution }}</p>
<div class="pi-links">
<a href="mailto:{{ site.email }}" class="icon-link" title="Email" aria-label="Email">{% include icon.html name="envelope" %}</a>
<a href="{{ site.links.cv | prepend: '/' | relative_url }}" class="icon-link" title="Download CV" aria-label="Download CV">{% include icon.html name="cv" %}</a>
<a href="{{ site.links.github }}" class="icon-link" title="GitHub" aria-label="GitHub">{% include icon.html name="github" %}</a>
<a href="{{ site.links.orcid }}" class="icon-link" title="ORCID" aria-label="ORCID">{% include icon.html name="orcid" %}</a>
</div>
</div>
</div>
</div>

I study galaxies in the early Universe, especially the stars they formed behind veils of dust. Think of it as reconstructing a story from several imperfect witnesses: JWST reveals faint starlight, while radio and millimetre telescopes trace cold gas and dust. Put those views together and a more complete picture emerges.

I am a PhD student at the Institute for Astronomy, University of Edinburgh, supervised by James Dunlop, Ross McLure, and Derek McLeod. Before Edinburgh, I studied astrophysics at the National Astronomical Observatories of the Chinese Academy of Sciences and astronomy at Nanjing University. My path has taken me from theoretical questions about gravitational lensing to hands-on work with some of the largest observing facilities in the world.

My name is Feng-Yuan Liu (刘丰源). I use **Frey** in everyday life. 丰源 roughly means "abundant sources" — a pleasing coincidence when your work involves finding faint sources in deep-sky images.

## Education

- **PhD in Astronomy**, University of Edinburgh, 2023–present (expected 2027). Thesis: *Galaxy Evolution Across Cosmic Time Through Multi-Wavelength Observations*.
- **MSc in Astrophysics**, National Astronomical Observatories, Chinese Academy of Sciences, 2023. Thesis on the cold gas and dust of infrared-luminous quasars.
- **BSc in Astronomy**, Nanjing University, 2020. Thesis on gravitational lensing by a regular non-minimal Einstein–Yang–Mills black hole.

## How I work

I move between proposal writing, observing, data reduction, and interpretation. My projects combine ultraviolet to radio observations, including JWST, ALMA, NOEMA, and the VLA. I also enjoy the less glamorous but essential work of making analysis pipelines reliable and helping students learn how to use real telescope data.

<div class="banner-frame" markdown="0">
<img src="{{ '/images/lamost.jpg' | relative_url }}" alt="Frey at the LAMOST telescope under a starry sky" loading="lazy">
<div class="banner-caption">A visit to LAMOST in winter 2020. Photo from my earlier website.</div>
</div>

## Selected recognition

<ul>
{% for award in site.data.awards %}<li>{{ award.name }}</li>{% endfor %}
</ul>

For a detailed record of appointments, observing programs, presentations, and service, see my [CV]({{ '/papers/Frey_Liu_CV_2026.pdf' | relative_url }}).
