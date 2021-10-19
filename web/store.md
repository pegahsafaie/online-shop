---
title: Store
layout: home.njk
tags: myStore
sections:
  - type: store_section
    component_file: store_section.html
    section_id: store_section
  - type: featured_products_section
    component_file: featured_products_section.njk
    section_id: featured_products_section
    title: Best sellers
    icon: true
  - type: promotion_section
    component_file: promotion_section.njk
    section_id: promotion_section
    title: A new home interior for summer
    subtitle: from $149.99
    image: /images/promo.jpg
    background_image: /images/leaf.svg
    cta:
      title: Discover
      url: "/store"
      style: secondary
      arrow: true
seo:
  title: Store
  description: This is the store page
  extra:
    - name: og:type
      value: website
      keyName: property
    - name: og:title
      value: Store
      keyName: property
    - name: og:description
      value: This is the store page
      keyName: property
    - name: og:image
      value: /images/header.jpg
      keyName: property
      relativeUrl: true
    - name: twitter:card
      value: summary_large_image
    - name: twitter:title
      value: Store
    - name: twitter:description
      value: This is the store page
    - name: twitter:image
      value: /images/header.jpg
      relativeUrl: true
---
