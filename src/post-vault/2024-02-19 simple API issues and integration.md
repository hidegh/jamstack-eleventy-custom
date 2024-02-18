---
title: Simple API issues and integration
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
image: udi dahan.jpg
imageClasses: img-thumbnail img-this d-block mx-auto float-md-start me-md-3 mb-md-1
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



We started our distributed systems series by showcasing the dangers that **6 little lines of code** can pose in a fairly simple system. Today, we kick off with **the simplest distributed system that can exist** - integrating against an API.

So make sure to check out Udi Dahan's insightful talk here: [Advanced API and Integration Problems & Patterns - Udi Dahan - NDC Oslo 2022 - YouTube](https://www.youtube.com/watch?v=vNouCMGP1eE)

Here's a quick summary of what you can expect to take away from the given talk...

---

## Handling Failures

With **overloaded APIs**, we have a longer time to get a response, so failures and timeouts become a possibility.

We can automate retries, but if the previous call succeeded (highly possible with timeout exceptions), we could easily end up with duplicates.

"Under load is a fancy way of saying where users care the most." - Udi Dahan

## Duplicates

- How to prevent duplicates?
- Is this a duplicate?
- Is this a legitimate twin?
- Do we need to prevent this duplicate?

### API side

#### Avoiding duplicates (idempotency)

How to detect duplicates?

- comparing data
- de-duplication identifier (has downsides, like how long to store, etc.)
- why not use entity ID (and assign a GUID at the client side) - simpler

#### But what about legitimate duplicates?

**Not all duplicates are errors.** The real world is not ideal. There, we might want to have duplicates! Consider twins! So, comparing data and handling de-duplication just on the API side might not be enough!

### Client side

#### What if we want to create a duplicate

But users might still create duplicates intentionally (and sometimes unintentionally). So we need to solve the duplication on the client side too.

Solution:
- --> Create 'X'
- --> check if 'X' exists
- --> ask the user if s/he wants an 'X' duplicate to be created

But wait...
#### What about cache?

What if we have a cache in place and if **the check returns falsely that no such object exists** (e.g. read lag with replicas) - we then end up with a duplicate.

**NOTE:** IMO it's a rare occasion, if **double-click problem** is solved on the UI.

### Fixing duplicates in complex systems?!

The problem of duplicates escalates when integrating with other systems, where based on one of the data (id) other events and external processes are started. **Deciding which entity is the duplicate, which one to delete isn't straightforward anymore!**

## Tackling integration

**Long chains of API calls** can lead to **latency issues**. Are there other alternatives!?

Now, before considering Microservices, **think about scaling up**. Here's my article on Linked In about [10 scaling-up possibilities before considering microservices](https://www.linkedin.com/feed/update/urn:li:activity:7156296447221514240/).

### Microservices

...bring a couple of issues, such as:

- ...more **complexity** in deployment and versioning (let's say in "one" word: **extra costs**)
- ...potential inconsistency
- ...issues with logical boundaries (see note in the Messaging chapter below)

### Messaging

...might help, but:

- ... ⚠️ it can result in pub-subbing (**duplicating**) business data, indicating that **logical boundaries** aren't right; there's an issue with service responsibilities.
- ...always use the **outbox pattern** to avoid issues with database race conditions and deadlocks, which might lead to publishing an event for a non-existing entity due to a rollback.
- ...also, when it comes to idempotency, the question is: **who handles deduplication** – the event producer or consumer?

## Outro

We hope that now, with this knowledge and these patterns in your arsenal, you'll be well on your way to building robust and efficient enterprise software solutions!

---

📌 Make sure you and your team subscribe (follow me) on {{ liPost.writeLink(globals.me.linkedInUrl, 'LinkedIn', true) }} so you don't miss out on the latest insights!

---
