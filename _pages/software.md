---
title: "Software"
layout: page
permalink: /software/
---

# Software and methods

Good astronomy depends on careful, repeatable analysis. These are projects in progress, so this page describes their aims without implying that their code is already public.

{% for project in site.data.software %}
<div class="section-card" markdown="0"><h2>{{ project.name }}</h2><p>{{ project.description }}</p></div>
{% endfor %}

I also use and adapt established tools for JWST and radio-interferometric data reduction, galaxy spectral-energy-distribution fitting, and large-scale analysis on computing clusters. If a method in one of my papers would be useful for your work, [get in touch](mailto:{{ site.email }}).
