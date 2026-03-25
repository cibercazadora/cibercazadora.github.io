---
layout: default
title: Projects
---

<section class="section">
  <div class="container">
    <h1>Projects</h1>

    <div class="grid">
      {% for project in site.projects %}
        <a href="{{ project.url }}" class="card">
          <h3>{{ project.title }}</h3>
          <p>{{ project.content | strip_html | truncate: 120 }}</p>
        </a>
      {% endfor %}
    </div>
  </div>
</section>
 
