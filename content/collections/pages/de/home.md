---
id: home
blueprint: pages
title: Home
author: 3f4934a7-72ef-446c-bf12-5336d13e6898
updated_by: c2f8321e-be41-4d83-b9ee-8136dba46b39
updated_at: 1710949618
page_theme: winter
open_graph_title: 'Nightnurse Images'
template: templates/views/home
layout: templates/layout/home
snap_scroll: false
page_elements:
  -
    id: ltwr9dnb
    video_low: video/dummy-video-720.mp4
    video_high: video/dummy-video-1080.mp4
    video_overlay: dim-20
    type: intro
    enabled: true
    anchors:
      portfolio: Portfolio
      expertise: Expertise
      unternehmen: Unternehmen
      services: Services
    section_theme: dark
    title:
      -
        type: paragraph
        attrs:
          class: null
        content:
          -
            type: text
            text: 'Lebensräume '
          -
            type: text
            marks:
              -
                type: bold
            text: gestalten
  -
    id: lty4dhrv
    title:
      -
        type: paragraph
        attrs:
          class: null
        content:
          -
            type: text
            text: Projekte
          -
            type: text
            marks:
              -
                type: bold
            text: realisieren
    items:
      item_top_left: null
      tl_image: projects/nightnurse-images-projekt-3.jpg
      tl_link: 'entry::fd9e0ea4-8426-4c8e-96b2-71ab20481387'
      item_top_right: null
      tr_image: projects/nightnurse-images-projekt-1.jpg
      tr_link: 'entry::36d70c38-f997-478f-9efe-9540a946db03'
      item_bottom_left: null
      bl_image: projects/nightnurse-images-projekt-4.jpg
      bl_link: 'entry::6585e18c-0f59-4d1c-8514-48178b49b41f'
      item_bottom_right: null
      br_image: projects/nightnurse-images-projekt-2.jpg
      br_link: 'entry::ab6dd26e-ce41-4116-89c6-829ce374c019'
    cta_link: 'entry::6dc5a5ba-4450-45c6-9684-53b3a8bb4261'
    cta_button_text: 'Eigenes Projekt starten'
    type: teaser_portfolio
    enabled: true
    anchor: portfolio
    teaser_portfolio_title:
      -
        type: paragraph
        attrs:
          class: null
        content:
          -
            type: text
            text: 'Projekte '
          -
            type: text
            marks:
              -
                type: bold
            text: realisieren
    cta_text:
      -
        type: paragraph
        attrs:
          class: null
        content:
          -
            type: text
            text: 'Ihre Ideen verdienen es, gesehen zu werden – bringen wir Ihr Projekt ins Rollen!'
  -
    id: ltzmersg
    type: horizontal_ruler
    enabled: true
  -
    id: ltyj2rb3
    teaser_items:
      -
        id: ltyj2s6v
        title: Visualisieren
        text:
          -
            type: paragraph
            attrs:
              class: null
            content:
              -
                type: text
                text: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.'
        type: teaser_item
        enabled: true
        visual: icons/visual-visualize.svg
        cta_link: 'entry::d07526ca-ad06-438e-8061-c85b9ee4e56c'
        cta_button_text: 'Zum Visualisieren'
      -
        id: ltyjc5ds
        title: Beraten
        text:
          -
            type: paragraph
            attrs:
              class: null
            content:
              -
                type: text
                text: 'Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.'
        visual: icons/visual-consulting.svg
        cta_link: 'entry::d07526ca-ad06-438e-8061-c85b9ee4e56c'
        cta_button_text: 'Zum Beraten'
        type: teaser_item
        enabled: true
      -
        id: ltyjdgsn
        title: Fördern
        text:
          -
            type: paragraph
            attrs:
              class: null
            content:
              -
                type: text
                text: 'Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.'
        visual: icons/visual-promote.svg
        cta_link: 'entry::d07526ca-ad06-438e-8061-c85b9ee4e56c'
        cta_button_text: 'Zum Beraten'
        type: teaser_item
        enabled: true
    type: teasers_expertise
    enabled: true
    anchor: expertise
  -
    id: ltzjmk1a
    video_low: video/dummy-video-corporate-480.mp4
    video_high: video/dummy-video-corporate-1080.mp4
    video_overlay: dim-30
    teaser_video_title:
      -
        type: paragraph
        attrs:
          class: null
        content:
          -
            type: text
            text: 'Digitale Welten'
          -
            type: hardBreak
          -
            type: text
            marks:
              -
                type: bold
            text: 'lokal verwurzelt'
    cta_link: 'entry::017b73d4-5285-4914-88b4-13d3b72c75a2'
    cta_button_text: 'Zum Unternehmen'
    type: teaser_video
    enabled: true
    anchor: unternehmen
    cta_text:
      -
        type: paragraph
        attrs:
          class: null
        content:
          -
            type: text
            text: 'Lorem ipsum dolor est vlupat consequat autem dolor ipsum.'
  -
    id: ltzmm4tc
    image: teaser-services.jpg
    teaser_image_text_title:
      -
        type: paragraph
        attrs:
          class: null
        content:
          -
            type: text
            text: 'Genau so, wie Sie'
          -
            type: hardBreak
          -
            type: text
            marks:
              -
                type: bold
            text: 'uns brauchen'
    cta_text:
      -
        type: paragraph
        attrs:
          class: null
        content:
          -
            type: text
            text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua lorem ipsum atuem.'
      -
        type: paragraph
        attrs:
          class: null
        content:
          -
            type: text
            text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua lorem ipsum atuem.'
    cta_link: 'entry::b4c71264-9178-4a5b-a41b-40b0de57f577'
    cta_button_text: 'Zu den Services'
    type: teaser_image_text
    enabled: true
    anchor: services
  -
    id: ltznpcl0
    type: horizontal_ruler
    enabled: true
  -
    id: ltzyf1pq
    type: teaser_blog
    enabled: true
section_theme: dark
---
