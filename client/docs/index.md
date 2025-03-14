---
global_id: '' # Index page doesn't use a global ID
title: Contentlayer Documentation
nav_title: Documentation
excerpt: Contentlayer is a content preprocessor that validates and transforms your content into type-safe JSON you can easily import into your application.
---

Contentlayer is a content preprocessor that validates and transforms your content into type-safe JSON you can easily import into your application.

<div className="mt-8 grid gap-6 md:grid-cols-2">
  <Card
    title="Getting Started"
    icon="rocket"
    link={{ url: '/docs/getting-started', label: 'Jump into it' }}
    subtitle="Get comfortable with the basics of Contentlayer by showing how we can quickly build a blog site using Next.js."
  />
  <Card
    title="Concepts"
    icon="info"
    link={{ url: '/docs/concepts', label: 'Learn more' }}
    subtitle="Learn about why you should use Contentlayer and get familiar with how it works under the hood."
  />
</div>

---

## Sources

<div className="grid gap-6 md:grid-cols-2 -mt-4">
  <div>
    Contentlayer lets you choose the source for your content. Currently only local file source is officially supported.
    <ChevronLink label="See all guides" url="/docs/sources" />
  </div>
  <div>
    Sources that are supported, planned, or being considered:

    - <ChevronLink label="Local Files" url="/docs/sources/files" />
    - <ChevronLink label="Contentful" url="/docs/sources/contentful" />
    - <ChevronLink label="Sanity" url="/docs/sources/sanity" />
    - <ChevronLink label="Notion" url="/docs/sources/notion" />

  </div>
</div>

---

## Environments

<div className="grid gap-6 md:grid-cols-2 -mt-4">
  <div>
    Contentlayer supports a tight integration with Next.js. Other environment support is coming soon.
    <ChevronLink label="See all guides" url="/docs/environments" />

  </div>
  <div>
    Frameworks that are supported, planned, or being considered:

    - <ChevronLink label="Local Files" url="/docs/environments/nextjs" />
    - <ChevronLink label="Contentful" url="/docs/environments/remix" />
    - <ChevronLink label="Sanity" url="/docs/environments/svelte" />
    - <ChevronLink label="Notion" url="/docs/environments/astro" />

  </div>
</div>

---

## Reference

<div className="grid gap-6 md:grid-cols-2 -mt-4">
  <div>
    Technical API reference for Contentlayer, the CLI, and associated plugins.
    <ChevronLink label="See reference" url="/docs/reference" />

  </div>
  <div>
    - <ChevronLink label="Contentlayer CLI" url="/docs/reference/cli" />
    - <ChevronLink label="@contentlayer/source-files" url="/docs/reference/source-files" />
    - <ChevronLink label="next-contentlayer" url="/docs/reference/next-contentlayer" />
  </div>
</div>