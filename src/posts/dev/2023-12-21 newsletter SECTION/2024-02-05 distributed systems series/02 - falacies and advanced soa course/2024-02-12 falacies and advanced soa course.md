---
title: Distributed System Design and Fallacies
author: Balázs HIDEGHÉTY
date: 2024-02-12
series: distributed-systems
categories: 
  - [Newsletter]
  - [Newsletter, Architecture]
  - [Development, Architecture]
tags:
  - development
  - developers
  - junior-developers
  - management
  - teamlead
  - techlead
  - architecture
  - advanced SOA
image: udi dahan.jpg
imageClasses: img-thumbnail img-this d-block mx-auto float-md-start me-md-3 mb-md-1
comments: false
pageData:
  liRef: 
---
Distributed applications (APIs)? Avoid technical hiccups! <span class="text-highlight">Break free from misconceptions and build truly resilient distributed systems!</span>
---
<div class="clearfix"></div>
<hr/>

{% import "macros/LITags.html" as liTags %}
{% import "macros/LIPost.html" as liPost %}



In our previous post, we introduced that when writing modern (distributed) applications, extra care is needed.

Before we move on to the usual integration patterns (in the next post), let's discuss something important that we often forget when forging modern applications.

> Yes, I'm thinking of the fallacies of distributed systems.

Addressing the fallacies of distributed systems isn't just about avoiding pitfalls; it's about implementing practical solutions. Whether you're a developer aiming for resilient architectures, a CEO concerned about business continuity, or a non-tech founder eager to navigate the tech landscape, understanding and applying proven strategies is crucial.

Who better to enlighten us on this subject than {{ liPost.writeLink('https://www.linkedin.com/in/udidahan/', 'Udi Dahan', true) }}, the author of NServiceBus? Let’s extend a warm welcome to another favorite author of mine.

Watch '[Fallacies of Distributed Systems #1 - #8](https://www.youtube.com/watch?v=8fRzZtJ_SLk&list=PL1DZqeVwRLnD3EjyciYAO82dT9Owiq8I5)' on YouTube.

---

But the fallacies are just the start. <span class="text-highlight">If you are interested in learning more about distributed system design</span>, I strongly advise you to take this course:

[Learn Advanced Distributed Systems Design • Particular Software](https://particular.net/adsd)

---

 <span class="text-highlight">Sneak peek:</span>
 
 **Fallacies of Distributed Systems #2: Latency is Zero** - One of the fallacies of distributed systems is that latency is zero. In reality, it can take much longer for data to travel between two machines than it does to perform a local operation. Crossing geographical boundaries? Expect even more delay. This can be a major problem for applications that need to be fast and responsive.

<img src="{{ page | absoluteImageUrl('code is liability - latency scaled.png') | url }}" class="w-100"></img>

---

📌 Make sure you and your team subscribe (follow me) on {{ liPost.writeLink(globals.me.linkedInUrl, 'LinkedIn', true) }} so you don't miss out on the latest insights!

---
