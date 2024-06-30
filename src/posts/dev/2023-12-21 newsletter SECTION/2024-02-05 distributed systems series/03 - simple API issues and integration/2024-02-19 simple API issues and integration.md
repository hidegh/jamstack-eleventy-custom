---
title: Simple API - Integration Problems and Patterns
author: Balázs HIDEGHÉTY
date: 2024-02-19
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
image: integration.jpg
imageClasses: img-thumbnail img-this d-block mx-auto float-md-start me-md-3 mb-md-1
pin: true
comments: false
pageData:
  liRef: 
---
Even the simplest distributed system – <span class="text-highlight">yes, even integrating against a single API – can pose significant challenges</span> (more than 80% of solutions that SMEs have). **Mind-blowing, right!?**
---
<div class="clearfix"></div>
<hr/>

{% import "macros/LITags.html" as liTags %}
{% import "macros/LIPost.html" as liPost %}



We started our distributed systems series by showcasing the dangers that **6 little lines of code** can pose in a fairly simple system. Today, we kick off with **the simplest distributed system that can exist** - integrating against an API, and <span class="text-highlight">we delve into all the complexities that such a simple scenario can introduce</span>.

So make sure to check out Udi Dahan's insightful talk here:

[Advanced API and Integration Problems & Patterns - Udi Dahan - NDC Oslo 2022 - YouTube](https://www.youtube.com/watch?v=vNouCMGP1eE)

Below is a **quick summary** of what you can expect to take away from the given talk...

---

## Failures and Duplicates

Today's journey starts with **handling failures**. As we see, when the system is under load, longer response times and timeouts become a possibility. Automated retries can easily result in **duplicates** being created.

So, we need to handle **duplicates**. We can de-duplicate on the **API side** (idempotency), but what about **legitimate duplicates**? Not all duplicates are errors, life is not ideal! Also, what about the **client side**? What if the user unintentionally creates a duplicate (double-click and cache issues)? What if the user wants to create a duplicate?

**The problem of duplicates escalates when integrating with other systems**, where, based on one of the data (id), other events and external processes are started. **Deciding which entity is the duplicate and which one to delete isn't straightforward anymore!**

**Detect duplicates (API side):**
- comparing data
- de-duplication identifier (has downsides, like how long to store, etc.)
- why not use entity ID (and assign a GUID at the client side) - simpler
 
**Detect/avoid duplicates (client side):**
- avoid double-click issue
- prevent resubmission via navigating back in the browser (post-redirect-get)
- check existing data and ask client if s/he wants to create a duplicate (cache issue)

## Tackling Integration

**Long chains of API calls** can lead to **latency issues**. Are there other alternatives!?

<div class="p-3">

  :warning: Now, before considering Microservices, **think about scaling up**.
  
  :bulb: Here's my article on Linked In about [10 scaling-up possibilities before considering microservices](https://www.linkedin.com/feed/update/urn:li:activity:7156296447221514240/) - also available [here](/post/scaling-secrets-10-tips-every-ceo-should-know-before-resorting-to-microservices/).

</div>

**Microservices** bring a couple of issues, such as:
- ...more **complexity** in deployment and versioning (let's say in "one" word: **extra costs**)
- ...potential inconsistency
- ...issues with logical boundaries (see note in the Messaging chapter below)

**Messaging** might help, but:
- ... ⚠️ it can result in pub-subbing (**duplicating**) business data, indicating that **logical boundaries** aren't right; there's an issue with service responsibilities.
- ...always use the **outbox pattern** to avoid issues with database race conditions and deadlocks, which might lead to publishing an event for a non-existing entity due to a rollback.
- ...also, when it comes to **idempotency**, the question is: **who handles deduplication** – the event producer or consumer?

## Outro

As it's showcased, building even simple systems can be challenging, and when it comes to integration, extra care is needed.

We hope that now, with this knowledge and these patterns in your arsenal, you'll be well on your way to building robust and efficient enterprise software solutions!

---

📌 Make sure you and your team subscribe (follow me) on {{ liPost.writeLink(globals.me.linkedInUrl, 'LinkedIn', true) }} so you don't miss out on the latest insights!

---
