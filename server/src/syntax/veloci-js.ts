type HTMLTag = keyof HTMLElementTagNameMap;
export type Content = string | number | boolean | null | undefined | TreeNode;
type TreeNodeFunction = {
  (props?: TreeNode["props"], ...children: Content[]): TreeNode;
  (...children: Content[]): TreeNode;
};
export type TreeNode = {
  tag: HTMLTag;
  props: Map<string, string>;
  children: Content[];
  $: (attr: string, value: string) => TreeNode;
};

const htmlTags: HTMLTag[] = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "menu",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "slot",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "title",
  "tr",
  "track",
  "u",
  "ul",
  "var",
  "video",
  "wbr",
];

function el(tag: HTMLTag, ...children: Content[]): TreeNode {
  const node: TreeNode = {
    tag,
    props: new Map<string, string>(),
    children,
    $: (attr: string, value: string): TreeNode => {
      node.props.set(attr, value);
      return node;
    },
  };
  return node;
}

const pdf = Object.fromEntries(
  htmlTags.map((tag) => [
    tag,
    ((...args: any[]) => el(tag, ...args)) as TreeNodeFunction,
  ])
) as Record<HTMLTag, TreeNodeFunction>;

const selfClosedTags = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);
function isNode(content: Content): TreeNode | undefined {
  if (
    content &&
    typeof content === "object" &&
    "tag" in content! &&
    "children" in content! &&
    Array.isArray(content!.children)
  ) {
    return content;
  }
  return undefined;
}
function renderToString(head: Content): string {
  if (!isNode(head)) {
    return String(head);
  }
  const { tag, props, children = [] } = head as TreeNode;
  const renderedProps = renderProps(props);

  return selfClosedTags.has(tag)
    ? `<${tag}${renderedProps === "" ? "" : ` ${renderedProps}`}/>`
    : `<${tag}${renderedProps === "" ? "" : ` ${renderedProps}`}>${children
        .map(renderToString)
        .join("")}</${tag}>`;
}

function renderProps(props: TreeNode["props"]): string {
  if (!props) {
    return "";
  }
  return Array.from(props)
    .map(([key, value]) => `${key}=\"${value}\"`)
    .join(" ");
}
export default pdf;
export { renderToString };

