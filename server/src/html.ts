type HTMLTag = keyof HTMLElementTagNameMap;
type Content = string | number | boolean | null | undefined | TreeNode;
type ElementAttributes<T extends HTMLTag> = Partial<
  HTMLElementTagNameMap[T]
>;
type ElementEvents = Partial<DocumentEventMap>;
type ElementProps<T extends HTMLTag> = ElementAttributes<T> & ElementEvents;
type TreeNodeFunction = {
  (props?: TreeNode["props"], ...children: Content[]): TreeNode;
  (...children: Content[]): TreeNode;
};
type TreeNode = {
  tag: HTMLTag;
  props: ElementProps<HTMLTag>;
  children: Content[];
  $: <K extends keyof ElementProps<HTMLTag>>(
    attr: K,
    value: ElementProps<HTMLTag>[K]
  ) => TreeNode;
};

const htmlTags: (HTMLTag)[] = [
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

function el(
  tag: HTMLTag,
  props: TreeNode["props"],
  ...children: Content[]
): TreeNode {
  // console.log(tag, currentId);
  const node: TreeNode = {
    tag,
    props,
    children: children,
    $: <K extends keyof ElementProps<HTMLTag>>(
      attr: K,
      value: ElementProps<HTMLTag>[K]
    ): TreeNode => {
      if (typeof props === "object" && props) {
        props[attr] = value;
      }
      return node;
    },
  };
  return node;
}

const functions = Object.fromEntries(
  htmlTags.map((tag) => [
    tag,
    ((...args: any[]) => {
      if (
        typeof args[0] === "object" &&
        !Array.isArray(args[0]) &&
        !("tag" in args[0]) &&
        !("props" in args[0])
      ) {
        const [props = {}, ...children] = args;
        return el(tag, { ...props }, ...children);
      } else {
        return el(tag, new Map<string, any>(), ...args);
      }
    }) as TreeNodeFunction,
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
    "tag" in content!
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
    ? `<${tag}${renderedProps === '' ? "" : ` ${renderedProps}`}/>`
    : `<${tag}${renderedProps === '' ? "" : ` ${renderedProps}>`}>${children.map((child) => renderToString(child)).join("")}</${tag}>`;
}

function renderProps(props: TreeNode["props"]): string {
  if (!props) {
    return "";
  }
  return Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
}

export const {
  a,
  abbr,
  address,
  area,
  article,
  aside,
  audio,
  b,
  base,
  bdi,
  bdo,
  blockquote,
  body,
  br,
  button,
  canvas,
  caption,
  cite,
  code,
  col,
  colgroup,
  data,
  datalist,
  dd,
  del,
  details,
  dfn,
  dialog,
  div,
  dl,
  dt,
  em,
  embed,
  fieldset,
  figcaption,
  figure,
  footer,
  form,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  head,
  header,
  hgroup,
  hr,
  html,
  i,
  iframe,
  img,
  input,
  ins,
  kbd,
  label,
  legend,
  li,
  link,
  main,
  map,
  mark,
  menu,
  meta,
  meter,
  nav,
  noscript,
  object,
  ol,
  optgroup,
  option,
  output,
  p,
  picture,
  pre,
  progress,
  q,
  rp,
  rt,
  ruby,
  s,
  samp,
  script,
  section,
  select,
  slot,
  small,
  source,
  span,
  strong,
  style,
  sub,
  summary,
  sup,
  table,
  tbody,
  td,
  template,
  textarea,
  tfoot,
  th,
  thead,
  time,
  title,
  tr,
  track,
  u,
  ul,
  video,
  wbr,
} = functions;
export { renderToString };

