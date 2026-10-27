---
title: "Teaching"
layout: page
permalink: /teaching/
---

# Teaching and mentoring

I like teaching astronomy as a practical way of asking better questions. A telescope does not hand us an answer; it hands us data, uncertainty, and a reason to think carefully together.

<div class="section-card" markdown="0">
<ul class="teaching-list">
{% for course in site.data.teaching %}<li><strong>{{ course.course }}</strong>{% if course.term %} ({{ course.term }}){% endif %}{% if course.role %}, {{ course.role }}{% endif %}{% if course.description %}<br><span class="text-muted">{{ course.description }}</span>{% endif %}</li>{% endfor %}
</ul>
</div>
