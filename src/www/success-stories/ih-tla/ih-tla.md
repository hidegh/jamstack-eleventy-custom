---
title: The Impact Health Success Story
layout: page
aside: 3
permalink: /success-stories/ih-tla/
scripts: |
  <script>
    InitLightbox();
  </script>
---

SimplyPut Consulting transformed this $5 Million biometric testing company into **$150 Million Covid Testing and Vaccination company** in two months​!

To manage the new workload, **the company changed its internal processes**. It required custom tools for its team leaders to enable them to administer dispatched staff at off-site testing locations more effectively.

**They needed a specific and focused view of the data** on their subordinates, including timecards, absenteeism, ratings and a way to manipulate these effectively. These data were from a **3rd party system** and originally synced <a target="_blank" href="https://www.shiftboard.com/">Shiftboard</a> via **Azure App Logic**.


---
# {{ title }}



## <i class="fa-solid fa-chart-line fa-fw pe-3 text-primary"></i> Metrics

<div class="no-container">
    <div class="row gap-3">
        <div class="col p-3 text-center bg-dark text-light">
            <i class="fa-solid fa-calendar-days fa-2x"></i>
            <br/>
            ~2500 monthly events
        </div>
        <div class="col p-3 px-lg-5 text-center bg-dark text-light">
            <i class="fa-solid fa-user-doctor fa-2x"></i>
            <br/>
            5K-10K placed staff monthly
        </div>
        <div class="col p-3 px-lg-5 text-center bg-dark text-light">
            <i class="fa-solid fa-user-tie fa-2x"></i>
            <br/>
            ~400 active team-leads   
        </div>
    </div>
</div>



## <i class="fa-solid fa-camera fa-fw pe-3 text-info"></i> Screenshots

<!--
<figure class="figure">
    <a href="{{ page | absoluteImageUrl('./ih-tla.jpg') | url }}" class="glightbox" data-gallery="gallery-A">
        <img class="img-thumbnail" src="{{ page | absoluteImageUrl('./ih-tla.jpg') | url }}" alt="image" />
    </a>
    <a href="{{ page | absoluteImageUrl('./10 TLA - 01 - Staff Confirmation MOBILE.jpg') | url }}" class="d-none glightbox" data-gallery="gallery-A"></a>
    <a href="{{ page | absoluteImageUrl('./10 TLA - 02 - Sign In MOBILE.jpg') | url }}" class="d-none glightbox" data-gallery="gallery-A"></a>
    <a href="{{ page | absoluteImageUrl('./10 TLA - 03 - Timecards MOBILE.jpg') | url }}" class="d-none glightbox" data-gallery="gallery-A"></a>
    <figcaption class="figure-caption text-center">Image gallery - Application screenshots</figcaption>
</figure>
-->
<figure class="figure w-100">
    <div class="image-grid image-grid-4" style="grid-auto-rows: 20vh;">
        <div class="rs-2 cs-3">
           <img class="img-thumbnail" style="object-position: center;" src="{{ page | absoluteImageUrl('./ih-tla.jpg') | url }}" alt="image" />            
           <a class="stretched-link glightbox" href="{{ page | absoluteImageUrl('./ih-tla.jpg') | url }}" data-gallery="gallery-A"></a>
        </div>
        <div>
            <img class="img-thumbnail" style="object-fit: contain;" src="{{ page | absoluteImageUrl('./10 TLA - 01 - Staff Confirmation MOBILE.jpg') | url }}" alt="image" />
            <a class="stretched-link glightbox" href="{{ page | absoluteImageUrl('./10 TLA - 01 - Staff Confirmation MOBILE.jpg') | url }}" data-gallery="gallery-A"></a>
        </div>
        <div>
            <img class="img-thumbnail" style="object-fit: contain;" src="{{ page | absoluteImageUrl('./10 TLA - 02 - Sign In MOBILE.jpg') | url }}" alt="image" />
            <div class="img-overlay">
                More images...
            </div>
            <a class="stretched-link glightbox" href="{{ page | absoluteImageUrl('./10 TLA - 02 - Sign In MOBILE.jpg') | url }}" data-gallery="gallery-A"></a>
        </div>
        <a class="d-none glightbox" href="{{ page | absoluteImageUrl('./10 TLA - 03 - Timecards MOBILE.jpg') | url }}" data-gallery="gallery-A"></a>
    </div>
    <figcaption class="figure-caption text-center">Image gallery - Application screenshots</figcaption>
</figure>

## <i class="fa-solid fa-triangle-exclamation fa-fw pe-3 text-danger"></i> Initial problems

**The initial solution was developed for approx. 4 months was failing, the reasons:**

1. **Wrong hire** (non lead and non mature enough senior developers) resulted in **quality issues** in the developed product. Missing software related processes made it hard to track progress or to track deployed changes also lead to **faulty deployments** too (both on .NET and Angular side).

2. **Non-ideal tool selection for synchronization logic** - showed as a problem just later on, the functions in Azure Logic App were repetitive, hard to adjust, ignored some architectural characteristics of the platform (rate limiting), and the ineffective (non-batched) coding approach resulted in long synchronization times and sometimes even failing without a trace.



## <i class="fa-solid fa-shoe-prints fa-fw pe-3 text-secondary"></i> First steps we took

1. **Stabilized deployment** and traceability of work by introducing git-flow, creating CI/CD pipeline in Azure DevOps.

2. We **fixed architecture**, and introduced environment settings in the applications, and defined some routing rules for UI.

3. Started to **replace the UI screens step-by step**. This included changes inside the API (back-end) code.

<span class="fw-bold text-success">At the end of the 2nd month: the entire application was replaced with a new one (redesigned screens, stable functions)</span>

From this moment on we could focus on new enhancements and continuous improvements.



## <i class="fa-regular fa-lightbulb fa-fw pe-3 text-info"></i> New possibilities

Having **less support tickets** (bugs) enabled us to **focus** on getting the **sync process** right - we moved from Azure App Logic to a custom but generic .NET function, which we executed **periodically** via integrating Hangfire.IO to the back-end.

We were **able to react to new business requirements instantly** as time spent on upkeep was reduced considerably. This enabled us new projects and further possibilities.

## <i class="fa-regular fa-circle-check fa-fw pe-3 text-success"></i> Final state

The project is **still in use**. It **requires minimal technical attention** and has worked **without intervention for over months** in a strike.
