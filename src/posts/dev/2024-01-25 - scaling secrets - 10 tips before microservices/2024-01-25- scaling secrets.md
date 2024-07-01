---
title: Scaling Secrets - 10 Tips Every CEO Should Know Before Resorting to Microservices
author: Balázs HIDEGHÉTY
date: 2024-01-25
categories: 
  - [CTO]
  - [CEO]
tags:
  - scaling
  - microservices
  - startups
  - SMEs
  - CEOs
  - founders
  - entrepreneurship
  - softwareengineering
  - management
  - techlead
  - teamlead
  - developers
image: scaling and microservices.jpg
imageClasses: img-thumbnail img-this d-block mx-auto float-md-start me-md-3 mb-md-1
comments: false
pageData:
  liRef: https://www.linkedin.com/feed/update/urn:li:activity:7156296447221514240/
pin: 100
styles: |
  <style>
    h3 {
      /*
      color: inherit !important;
      color: var(--color-highlight) !important;
      */
      font-size: 1.2em;
      padding-top: 1em;
      padding-bottom: .5em;
      padding-left: .25em;
    }
  </style>
---
In the fast-paced world of tech, CEOs, and Founders, please listen up! **Scaling your startup doesn't always demand complex solutions.**

In fact, simplicity is the key. *** Before diving into the microservices abyss, consider these **10 tips for scalable success**—some are indeed **cost-effective**!

---
<div class="clearfix"></div>
<hr/>

{% import "macros/LITags.html" as liTags %}
{% import "macros/LIPost.html" as liPost %}



**Premature scaling is a sin.**

"It must scale well"

"Hiring for a Tech Lead to rebuild our system into microservices"

**Sound familiar?**

These phrases might be leading you down a costly road.



> A well-designed system can handle 10K users without a sledgehammer approach.

**Remember, the key lies in strategic planning and efficient streamlining!**

<!--
> The secret to creativity is knowing how to hide your sources. 
> -- <cite>>— [Albert Einstein]</cite>
-->



Microservices should probably be the last resort to try to scale because **there are at least two or three other reasons that prevent you from scaling**. It's likely that those same reasons will hinder your costly microservices from working correctly as well.

---

*** Before diving into the microservices abyss, **consider these 10 tips for scalable success**—some are indeed cost-effective!

  

<p class="fst-italic">
  The nice thing about these techniques is, that <span class="text-highlight">some of them does not need any change in the code</span>, while others require planning and specific approach at development.
</p>

  

Anyhow, here's my list, in the parenthesis there's a guess on how hard/costly it is to implement the given solution:



## Top 10 Scaling options  


### 1️⃣ Scale Up (1)

Simply throw more hardware at the problem. If you already have a working solution, scaling up (vertically) is the simplest way to address scalability issues, especially in the cloud. You don't need to optimize your application or its queries; you can avoid even rewriting it.

However, **scaling up won't work forever** due to two primary reasons: costs and usually limitations/bottlenecks elsewhere (such as within SQL databases).
  

### 2️⃣ CDN (1)

By offloading the delivery of static content to CDN servers, you can significantly reduce the load on the origin server (MVC, SPA).
  

### 3️⃣ Database Scaling (4)

Similar to scaling up, this method involves a one-time setup and requires some investment. Adding read replicas, utilizing SQL Gateways can **eliminate one of the most common scalability bottlenecks: _the database_.**


### 4️⃣ Optimizing Database (6)

Scaling databases through the optimization of keys, indexes, and queries may require some effort, but it can lead to **significant performance improvements**.

Fun fact: Azure MSSQL and modern database solutions can provide valuable suggestions for enhancements - however, having an expert to properly model data can be even more beneficial.


### 5️⃣ Scale Out (1)

Scaling out (using multiple instances, employing load balancers) is another approach to enhance your app's performance.

However, there's a caveat: **scaling out is not suitable for every scenario** - stateful applications (those that rely heavily on shared state) cannot be easily scaled out.


### 6️⃣ Optimize App (6)

Begin by optimizing the existing application for improved performance. Identify and address performance bottlenecks. In today's context, given the widespread use of object-relational mappers (ORMs), I recommend starting by analyzing the queries sent to the database, with special attention to addressing the common N+1 loading issue, consider optimizing queries and creating views for typical relations, and ensure that a database expert handles the necessary optimizations within the database.


### 7️⃣ Split the App into 2 (8)

Dividing the application into two parts requires careful planning but can be a manageable step towards scalability. A common starting point is to shift recurring jobs, report generation, and any other long-running processes to a separate instance. You can leverage a straightforward tool like [Hangfire.IO](http://hangfire.io/) in .NET for fire-and-forget processing or utilize a message bus framework like MassTransit for standard distributed processing, especially when bidirectional communication is needed.

NOTE: **This doesn't constitute microservices yet; the two application parts can coexist in a single solution and maintain strong cohesion.**


### 8️⃣ Caching (3-7)

Implementing caching strategies can be relatively straightforward and provide immediate performance improvements.

However, **caching can present challenges when scaling out** (distributed caching). But caching itself, if done incorrectly, can lead to excessive memory consumption and can reintroduce a significant load on the database and/or fail to provide sufficient advancements.


### 9️⃣ SPA (4)

Developing a Single-Page Application (SPA) can enhance the user experience and even performance with less effort compared to other architectural changes.
  

### 🔟 PWA (1)

By transitioning your SPA to a Progressive Web App (PWA), you gain additional features, including offline functionality, push notifications, and the ability to install the app on the user's home screen. However, you also reduce the load on your servers (especially if you used frameworks to develop your SPA, which can bloat the solution with excess bytes).



## Summary

As you can see, we explored 10 options before arriving at:
- UI Composition   
- Micro Frontends
- Micro Services

As we've discovered, determining the most suitable scaling approach for your application requires **careful consideration of various factors,** including your **business needs, application state, user growth projections, and budgetary constraints.**

While simpler methods like scale-up and CDNs often provide **initial relief,** more advanced techniques such as database scaling, optimizing queries, and dividing the application into smaller components can offer long-term scalability and resilience.

**Ultimately, the decision lies in carefully evaluating your specific requirements and seeking guidance from experienced technical experts to ensure the most effective and cost-efficient scaling strategy for your application's continued growth and success.**

---  

💬 Any thoughts?

{{ liPost.write(pageData.liRef) }}