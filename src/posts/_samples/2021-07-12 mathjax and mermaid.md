---
title: Mathjax (mathematical expressions) and Mermaid (graphs)
author: BaHI
date: 2021-07-12
categories:
  - [Blog, Samples]
tags: samples, 11ty-customized
mathjax: true
mermaid: true
---

Sample on using **Mathjax** and **Mermaid** for mathematical expression and grap rendering.

There's just one thing for an articla author to do, thus including values into **Front Matter** to load the required tool.
```
mathjax: true
mermaid: true
```
---

---

HTML mathjax:
$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$

Mathjax via markdown
```mathjax
x = {-b \pm \sqrt{b^2-4ac} \over 2a}.
```

HTML mermaid:
<div class="mermaid">
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
</div>

Mermaid via MD:
```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```
