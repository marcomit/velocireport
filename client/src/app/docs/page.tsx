import { allDocs, Doc } from "contentlayer/generated";
import Link from "next/link";

function PostCard(doc: Doc) {
  return (
    <div className="mb-8">
      <h2 className="mb-1 text-xl">
        <Link
          href={doc.url}
          className="text-blue-700 hover:text-blue-900 dark:text-blue-400"
        >
          {doc.title}
        </Link>
      </h2>
      <time dateTime={doc.date} className="mb-2 block text-xs text-gray-600">
        {/* {format(parseISO(doc.date), "LLLL d, yyyy")} */}
      </time>
      <div
        className="text-sm [&>*]:mb-3 [&>*:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: doc.body.html }}
      />
    </div>
  );
}

export default function Home() {

  return (
    <div className="mx-auto max-w-xl py-8">
      <h1 className="mb-8 text-center text-2xl font-black">
        Next.js + Contentlayer Example
      </h1>
      {allDocs.map((post, idx) => (
        <PostCard key={idx} {...post} />
      ))}
    </div>
  );
}
