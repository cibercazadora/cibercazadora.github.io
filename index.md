<!-- HERO -->
<section class="hero container">
  <h1>
    I build and scale security programs that hold up under real pressure.
  </h1>

  <p>
    Director-level leadership across cloud, risk, and compliance.
    I turn fragmented controls into systems that scale and pass audits.
  </p>
</section>

<!-- ABOUT -->
<section class="section container">
  <h2>About</h2>
  <p>
    I lead security programs across cloud and compliance environments,
    focusing on practical controls that reduce risk without slowing the business.
  </p>
</section>

<!-- PROJECTS (GRID STYLE — THIS IS WHAT YOU’RE MISSING) -->
<section class="section container">
  <h2>Selected Work</h2>

  <div class="grid">
    <div class="card">
      <h3>Security Program Buildout</h3>
      <p>Built enterprise security program across AWS & Azure.</p>
    </div>

    <div class="card">
      <h3>IAM Modernization</h3>
      <p>Implemented RBAC, MFA, and least privilege.</p>
    </div>

    <div class="card">
      <h3>Vendor Risk Program</h3>
      <p>Designed third-party risk and compliance workflows.</p>
    </div>
  </div>
</section>

<!-- EXPERIENCE -->
<section class="section container">
  <h2>Experience</h2>

  <div class="timeline">
    <div>
      <h3>Director of Information Security</h3>
      <p>Led cloud, risk, and compliance strategy.</p>
    </div>
  </div>
</section>

<!-- BLOG (separate, not dominant) -->
<section class="section container">
  <h2>Writing</h2>

  {% for post in site.posts limit:3 %}
    <div class="post-preview">
      <a href="{{ post.url }}">{{ post.title }}</a>
    </div>
  {% endfor %}
</section>
      Implemented IAM, vulnerability management, and vendor risk.
    </p>
    <p><strong>Impact:</strong> SOC 2 achieved with zero findings.</p>
    <span class="tag">Cloud</span>
    <span class="tag">Compliance</span>
  </div>

  <div class="card">
    <h3>Identity & Access Modernization</h3>
    <p>
      Designed RBAC and least privilege across SaaS and cloud systems.
    </p>
    <p><strong>Impact:</strong> Reduced access risk and improved auditability.</p>
    <span class="tag">IAM</span>
    <span class="tag">Zero Trust</span>
  </div>

  <div class="card">
    <h3>Third-Party Risk Program</h3>
    <p>
      Built vendor risk workflows, BAA tracking, and assessment processes.
    </p>
    <p><strong>Impact:</strong> Closed compliance gaps and improved vendor visibility.</p>
    <span class="tag">Risk</span>
  </div>
</section>

<section class="section container">
  <h2>Writing</h2>

  {% for post in site.posts limit:3 %}
    <div class="card">
      <a href="{{ post.url }}">{{ post.title }}</a>
    </div>
  {% endfor %}
</section>
<section class="section container">
  <h2>Explore</h2>

  <div class="filters">
    <button onclick="filterPosts('all')">All</button>
    <button onclick="filterPosts('cloud')">Cloud</button>
    <button onclick="filterPosts('risk')">Risk</button>
    <button onclick="filterPosts('leadership')">Leadership</button>
  </div>
</section>

<section class="section container">
  <h2>Writing</h2>

  <div id="posts">
    {% for post in site.posts %}
      <div class="card post-item"
           data-category="{{ post.categories | join: ' ' }}">
        
        <a href="{{ post.url }}">{{ post.title }}</a>
        <p>{{ post.excerpt | strip_html | truncate: 120 }}</p>

      </div>
    {% endfor %}
  </div>
</section>

      <a href="{{ post.url }}">{{ post.title }}</a>
    </div>
  {% endfor %}
</section>

**>>  cat aboutme.txt  <<<**

SHORT VERSION: I'm a family and faith oriented cybersecurity enthusiast, Veteran, Military BRAT, and Spanish speaking Cuban-Mexican American sharing my cybersec journey.

LONG VERSION:
I'm currently a Director of Information Security where I built a cybersecurity program that includes GRC, disaster planning, incident response, customer trust, privacy, identity and access management, change management, security awareness, cloud security, DevSecOps, Third Party Risk Management, Security Engineering, Vulnerability and Patch Management, and most recently exploring AI security. 

My past technical roles include IT support, systems administration, network administration, break/fix business owner, contractor, web application penetration tester, web design, university lecturer, and working with youth in coding and robotics. 

Whenever I can spend a free moment alone, I spend time with my family, engage in my addiction to technology, entertain my passionate in cybersecurity, staying healthy, bake, and sometimes paint or draw.

My M.S. in Information Security Assurance was earned through Western Governor's University (2012) and my B.S. in Computer Information and Technology with Minor in Business is from University of Maryland University College (2007). I hold six active computer certifications: CISSP, GFACT, GCPN, CEH, CHFI, CompTIA Network +, and previously CCNA, GIAC ISO Specialist.

My passion started with a Commodore64, which led to helping anyone with tech problems in my community and family, and is now a full career. 

I am continuously working to expand my knowledge, skills, and experience in tech and cybersecurity and enjoy sharing it with anyone who wants to listen. 

My goal is to become a hands-on CISO.
