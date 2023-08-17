---
title: The Impact Health Success Story
layout: page
aside: 3
styles: |
  <style>
    strong {
        color: var(--color-highlight);
    }
  </style>
scripts: |
  <script>
    InitLightbox();
  </script>
---

# {{ title }}

<blockquote class="blockquote quote">
    One of my favorite success stories is that of Impact Health, as it provides <strong>a compelling example of how a software project can fail due to the lack of a hands-on CTO, even when the conventional managerial aspects are executed excellently</strong>.
</blockquote>
<figcaption class="mb-0 blockquote-footer">
    <cite>Balázs HIDEGHÉTY</cite>
</figcaption>

***



## <i class="fa-solid fa-chart-line text-secondary-emphasis"></i> Unlocking Business Growth

**A $5 Million to $150 Million Transformation in Two (2) Months**

Witness the remarkable journey of a biometric testing company as it evolved into a $150 million Covid Testing and Vaccination enterprise, all within a mere two months, under the guidance of SimplyPut Consulting.

***

<p class="lead text-center text-secondary-emphasis">Software Development Related Metrics</p>

<div class="no-container">
    <div class="row gx-3 gy-1">
        <div class="col-6 col-lg-4 p-3 px-lg-3 text-center bg-dark text-light">
            <i class="text-success-emphasis fa-solid fa-piggy-bank fa-2x"></i>
            <br/>
            Yearly Savings
            <br/>
            <span class="no-wrap">$300K - $500K</span>
        </div>        
        <div class="col-6 col-lg-4 p-3 px-lg-3 text-center bg-dark text-light">
            <i class="text-danger fa-solid fa-bug fa-2x"></i>
            <br/>
            80% Drop in Maintenance Costs
            <span class="d-block small text-body-secondary">After The Rewrite / After 1.5 Months</span>
        </div>        
        <div class="col-6 col-lg-4 p-3 px-lg-3 text-center bg-dark text-light">
            <i class="text-warning fa-solid fa-code fa-2x"></i>
            <br/>
            40% Development Speed Increase
            <span class="d-block small text-body-secondary">From the 2nd Week Onward</span>
        </div>             
        <div class="col-6 col-lg-4 p-3 px-lg-3 text-center bg-dark text-light">
            <i class="text-secondary fa-solid fa-calendar-days fa-2x"></i>
            <br/>
            ~2500 Monthly Events
        </div>
        <div class="col-6 col-lg-4 p-3 px-lg-3 text-center bg-dark text-light">
            <i class="text-primary-emphasis fa-solid fa-user-doctor fa-2x"></i>
            <br/>
            5K-10K Placed Staff Monthly
        </div>
        <div class="col-6 col-lg-4 p-3 px-lg-3 text-center bg-dark text-light">
            <i class="text-primary fa-solid fa-user-tie fa-2x"></i>
            <br/>
            ~400 Active Team-Leads   
        </div>
    </div>
</div>

***

This transformation necessitated a fundamental shift in internal processes to manage the burgeoning workload effectively. Specifically, the company sought tailored tools for its team leaders, empowering them to oversee off-site testing locations with precision.

The key challenge lay in consolidating data from a third-party system, which encompassed critical information such as timecards, absenteeism, and ratings. These insights were pivotal for informed decision-making.

Enter Impact Health, the embodiment of a success story that showcases resilience and innovation in the face of adversity.



## <i class="fa-solid fa-camera fa-fw pe-3 text-success-emphasis"></i> Screenshots

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



## <i class="fa-solid fa-triangle-exclamation fa-fw pe-3 text-danger-emphasis"></i> Initial Challenges

**The initial solution, developed over approximately four (4) months, encountered roadblocks rooted in the hiring of inadequately experienced developers. This inadvertently led to quality issues in the product.**

Moreover, the absence of streamlined software-related processes hindered progress tracking and contributed to erroneous deployments, both on the .NET and Angular fronts. An initially chosen synchronization approach, facilitated through Azure Logic App, later revealed itself to be non-ideal due to repetitiveness, inadequate adaptability, and inefficiency.



## <i class="fa-solid fa-trophy fa-fw pe-3 text-secondary-emphasis"></i> Milestones Achieved

The road to transformation was paved with meticulous strategic steps:

1. **Deployment and Traceability:** The introduction of git-flow and creation of a CI/CD pipeline in Azure DevOps brought stability and enhanced tracking capabilities. This integration allowed us to track changes efficiently, ensuring a smoother flow of updates and enabling us to catch issues early.
    
2. **Architectural Refinement:** We revamped the architecture with a focus on efficiency, making transitions smoother and boosting adaptability. Additionally, we established essential routing rules for the user interface, enhancing user navigation.
    
3. **Incremental UI Replacement:** Our approach to transforming the user interface was gradual but impactful. We systematically replaced UI screens, extending this transformation to the API (back-end) as well. This ensured a cohesive user experience backed by a robust technical foundation.
    
4. **Complete Application Redesign:**  In just two (2) months, we executed a comprehensive application redesign. This encompassed not only revamped screens but also fortified functionalities. The end result was a technologically revitalized application that aligned seamlessly with evolving goals and industry standards.
    
With the foundation solidified, attention turned to new improvements and innovative enhancements.



## <i class="fa-solid fa-lightbulb fa-fw pe-3 text-warning-emphasis"></i> Unleashing New Opportunities

The reduction in support tickets paved the way for a renewed focus on synchronization processes. Azure App Logic was transitioned to a custom .NET function, executed periodically through seamless integration with Hangfire.IO.

**The dividends were immediate – quicker adaptation to evolving business needs and a substantial reduction in upkeep time.** This unleashed a cascade of new projects and opportunities for Impact Health.



## <i class="fa-solid fa-monument fa-fw pe-3 text-success-emphasis"></i> An Enduring Legacy

Presently, the project thrives in a state of self-sufficiency. Requiring **minimal technical intervention**, it has continued to operate seamlessly for months on end, a testament to its resiliency and enduring impact.

The story of Impact Health epitomizes how strategic partnership, technical expertise, and adaptability can swiftly elevate a company from modest beginnings to unparalleled heights of success.
