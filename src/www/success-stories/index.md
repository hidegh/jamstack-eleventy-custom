---
title: Success stories
searchable: false
styles: |
  <style>

    .wide-button {
      /* stretched link req. */
      position: relative;
      /* vertical align */
      display: flex;
      align-items: center;
    }

    .logo {
      height: 3em;      
    }

  </style>
scripts: |
  <script>
    console.log('Redirecting...');
    window.location.href = "/www/success-stories/ih-tla";
  </script>
---

# Success stories!

<div class="wide-button p-3 px-lg-5 mb-3 bg-light text-dark border shadow rounded">    
  <img src="{{ page | absoluteImageUrl('/www/projects/IH/Logo ImpactHealth.png') | url }}" class="logo" />
  <div class="px-5">
    <blockquote class="blockquote quote">
      One of my favorite success stories is that of Impact Health, as it provides <strong>a compelling example of how a software project can fail due to the lack of a hands-on CTO, even when the conventional managerial aspects are executed excellently</strong>.
    </blockquote>
    <figcaption class="mb-0 blockquote-footer">
      <cite>Balázs HIDEGHÉTY</cite>
    </figcaption>
  </div>
  <a href="{{ '/www/success-stories/ih-tla' | url | versionedWwwUrl }}" class="not-stretched-link btn btn-sm btn-primary text-nowrap">Explore more...</a>
</div>
