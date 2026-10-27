---
title: "Home"
layout: homelay
permalink: /
---

<h1 class="home-hero">{{ site.name }}</h1>
<p class="home-hero-sub">{{ site.title }} · {{ site.institution }}</p>

<div class="chip-container" markdown="0">
<a href="{{ '/research/' | relative_url }}" class="chip">Galaxy evolution</a>
<a href="{{ '/research/' | relative_url }}" class="chip">Hidden star formation</a>
<a href="{{ '/research/' | relative_url }}" class="chip">Cold cosmic gas</a>
<a href="{{ '/research/' | relative_url }}" class="chip">JWST + radio telescopes</a>
<a href="{{ '/outreach/' | relative_url }}" class="chip">Science for everyone</a>
</div>

Some of the Universe's busiest stellar nurseries are also its best hiding places. Dust catches the light from newborn stars, so a galaxy can be building stars at a furious pace while appearing surprisingly faint in visible light. I use telescopes that see different kinds of light to find what one instrument alone might miss.

I am an astronomy PhD researcher and Mary Brück Scholar at the University of Edinburgh. My main question is simple to ask and hard to answer: **how did galaxies grow across cosmic time, including the parts hidden by dust?** My work brings together the James Webb Space Telescope (JWST), ALMA, NOEMA, the VLA, and other observatories. I also follow a delightful astronomical plot twist: some extremely distant-looking objects turn out to be cold neighbours in our own Galaxy.

<div class="banner-frame" markdown="0">
<img src="{{ '/images/DSC04562.jpg' | relative_url }}" alt="Northern lights glowing over Edinburgh" loading="lazy">
<div class="banner-caption">Northern lights over Edinburgh. Photo from my earlier website.</div>
</div>

## Start exploring

- **[Research]({{ '/research/' | relative_url }})** — why I pair infrared images with radio and millimetre observations.
- **[Publications]({{ '/publications/' | relative_url }})** — papers, preprints, and a link to my complete NASA ADS record.
- **[Outreach]({{ '/outreach/' | relative_url }})** — astronomy beyond journal pages, in classrooms, books, talks, and photographs.

{% capture selected %}{% bibliography --query @*[selected=true] %}{% endcapture %}
{% if selected contains "pub-entry" %}
## Selected publications
<div class="section-card selected-pubs" markdown="0">
{{ selected }}
<p style="margin: var(--space-4) 0 0;"><a href="{{ '/publications/' | relative_url }}">All publications &rarr;</a></p>
</div>
{% endif %}

## A little about me

My Chinese given name, 丰源, means **"abundant sources"**. It is a fortunate name for an observational astronomer! I grew up and studied astronomy in China; now I work at the Royal Observatory Edinburgh and usually go by **Frey**. Outside research, I write and translate science, take photographs, and look for excuses to visit a telescope or a good walking trail. [More about me &rarr;]({{ '/about/' | relative_url }})
