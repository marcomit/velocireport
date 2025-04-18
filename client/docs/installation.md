---
global_id: cddd76b7
title: Getting Started
excerpt: Get comfortable with the basics of Contentlayer by showing how we can quickly build a blog site using Next.js.
---

This tutorial will get you comfortable with the basics of Contentlayer by walking through how to build a simple blog site using Next.js.

The blog will include a list of posts with a title, body, and date, rendered with the most recent on top. And each post will have its own page.

<div className="mt-8 grid gap-6 md:grid-cols-2">
  <Card title="Try it Now" icon="gitpod" link={{url: 'http://gitpod.io/#https://github.com/contentlayerdev/next-contentlayer-example', label: 'Try in Gitpod'}}>
    If you'd like to dive right in and start playing with Contentlayer, you can open the project in Gitpod.

  </Card>
  <Card title="Example Project" icon="github" link={{url: 'https://github.com/contentlayerdev/next-contentlayer-example', label: 'See example'}}>
    You can find a working version of this tutorial in [this state](https://github.com/contentlayerdev/next-contentlayer-example/tree/bca4b7884f5cad8963e631a2f24a19200c106495) of the example project.

    See [the examples page](/examples) for a full list of examples.

  </Card>
</div>

## 1. Setup Project

Just to demonstrate how quickly we can start working, let's start with a new blank Next.js project.

```txt
npx create-next-app@latest --typescript --tailwind --experimental-app --eslint contentlayer-example
```

Answer any prompts that appear, then change into the new `contentlayer-example` directory.

```txt
cd contentlayer-example
```

### Install Dependencies

Install Contentlayer and the Next.js plugin, along with a helper package for dates.

```txt
npm install contentlayer next-contentlayer date-fns
```

### Next.js Configuration

To hook Contentlayer into the `next dev` and `next build` processes, you'll want to wrap the Next.js configuration using the `withContentlayer` method.

```js
// next.config.js
const { withContentlayer } = require("next-contentlayer");

/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true, swcMinify: true };

module.exports = withContentlayer(nextConfig);
```

### TypeScript Configuration

Then add the following lines to your `tsconfig.json` or `jsconfig.json` file:

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    //  ^^^^^^^^^^^
    "paths": {
      "contentlayer/generated": ["./.contentlayer/generated"]
      // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".contentlayer/generated"
    // ^^^^^^^^^^^^^^^^^^^^^^
  ]
}
```

This configures the Next.js build process and your editor to know where to look for generated files, and to make it easier to import them into your code.

### Ignore Build Output

Add the `.contentlayer` directory into your `.gitignore` file to ensure each build of your app will have the latest generated data and you do not run into issues with Git.

```bash
# .gitignore

# ...

# contentlayer
.contentlayer
```

## 2. Define Content Schema

Let's get our content schema defined and add some content to our site.

### Add Contentlayer Config

Because we're building a simple blog site, let's define a single document type called `Post`. Create a file `contentlayer.config.ts` in the root of your project, and add the following content.

```js
// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.md`,
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/posts/${post._raw.flattenedPath}`,
    },
  },
}));

export default makeSource({ contentDirPath: "posts", documentTypes: [Post] });
```

This configuration specifies a single document type called `Post`. These documents are expected to be Markdown files that live within a `posts` directory in your project.

Any data objects generated from these files will contain the fields specified above, along with a `body` field that contains the raw and HTML content of the file. The `url` field is a special computed field that gets automatically added to all post documents, based on meta properties from the source file.

### Add Post Content

Create a few markdown files in a `posts` directory and add some content to those files.

Here's an example of what a post file at `posts/post-01.md` might look like:

```txt
---
title: My First Post
date: 2021-12-24
---

Ullamco et nostrud magna commodo nostrud ...
```

The examples to follow will have three posts in this structure:

```txt
posts/
├── post-01.md
├── post-02.md
└── post-03.md
```

## 3. Add Site Code

Now we can tie it all together by bringing the data into our pages.

### Replace Home Page

Replace the default home page (`app/page.tsx`) with a listing of all the posts and links to the individual post pages. Notice that you'll get an error when trying to import from `contentlayer/generated`, it's normal but we're going to fix it later by running the development server.

```jsx
// app/page.tsx
import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { allPosts, Post } from "contentlayer/generated";

function PostCard(post: Post) {
  return (
    <div className="mb-8">
      <h2 className="mb-1 text-xl">
        <Link
          href={post.url}
          className="text-blue-700 hover:text-blue-900 dark:text-blue-400"
        >
          {post.title}
        </Link>
      </h2>
      <time dateTime={post.date} className="mb-2 block text-xs text-gray-600">
        {format(parseISO(post.date), "LLLL d, yyyy")}
      </time>
      <div
        className="text-sm [&>*]:mb-3 [&>*:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: post.body.html }}
      />
    </div>
  );
}

export default function Home() {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  );

  return (
    <div className="mx-auto max-w-xl py-8">
      <h1 className="mb-8 text-center text-2xl font-black">
        Next.js + Contentlayer Example
      </h1>
      {posts.map((post, idx) => (
        <PostCard key={idx} {...post} />
      ))}
    </div>
  );
}
```

Notice that we imported the process post data directly into the page component. We then sorted `allPosts` to sort the post in reverse chronological order, and rendered a series of card components.

### Run the App

Run the Next.js development server.

```txt
npm run dev
```

And visit localhost:3000 to see the post feed on the home page.

### Add Post Layout

Right now, clicking on a post leads to a 404 error. Let's fix that!

Create the page at `app/posts/[slug]/page.tsx` and add the following code.

```jsx
// app/posts/[slug]/page.tsx
import { format, parseISO } from "date-fns";
import { allPosts } from "contentlayer/generated";

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }));

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);
  return { title: post.title };
};

const PostLayout = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);

  return (
    <article className="mx-auto max-w-xl py-8">
      <div className="mb-8 text-center">
        <time dateTime={post.date} className="mb-1 text-xs text-gray-600">
          {format(parseISO(post.date), "LLLL d, yyyy")}
        </time>
        <h1 className="text-3xl font-bold">{post.title}</h1>
      </div>
      <div
        className="[&>*]:mb-3 [&>*:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: post.body.html }}
      />
    </article>
  );
};

export default PostLayout;
```

Notice again that we're importing data from `contentlayer/generated`. This is the beauty of Contentlayer. Now clicking on a post link from the home page should lead you to a working post page.

## Next Steps

You now have a simple blog site with Next.js and Contentlayer!

This is just the beginning. Now you can dig in and add all the bells and whistles necessary to build a site with great content using Contentlayer. Here are a few suggestions:

- Jump into [the conceptual guides](/docs/concepts) to learn more about [how Contentlayer works](/docs/concepts/how-contentlayer-works).
- [Join our Discord community](https://discord.gg/rytFErsARm) to ask questions, stay up to date, and share your work.
- Check out [the examples](/examples) for inspiration on what you can do with Contentlayer.
- Explore [local file source guides](/docs/sources/files) for learning about specific techniques.
