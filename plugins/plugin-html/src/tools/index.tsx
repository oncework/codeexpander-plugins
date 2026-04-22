import HtmlMinifier from "./HtmlMinifier";
import HtmlBeautifier from "./HtmlBeautifier";
import HtmlToMarkdown from "./HtmlToMarkdown";
import HtmlToJsx from "./HtmlToJsx";
import HtmlPreviewer from "./HtmlPreviewer";
import HtmlToPlainText from "./HtmlToPlainText";
import HtmlEntityCoder from "./HtmlEntityCoder";
import HtmlWysiwygEditor from "./HtmlWysiwygEditor";

export interface ToolDef {
  id: string;
  name: string;
  component: React.ComponentType;
}

export const TOOLS: ToolDef[] = [
  { id: "html-minifier", name: "HTML Minifier", component: HtmlMinifier },
  { id: "html-beautifier", name: "HTML Beautifier", component: HtmlBeautifier },
  { id: "html-to-markdown", name: "HTML to Markdown", component: HtmlToMarkdown },
  { id: "html-to-jsx", name: "HTML to JSX", component: HtmlToJsx },
  { id: "html-previewer", name: "HTML Previewer", component: HtmlPreviewer },
  { id: "html-to-plain-text", name: "HTML to Plain Text", component: HtmlToPlainText },
  { id: "html-entity-coder", name: "HTML Entity Encoder/Decoder", component: HtmlEntityCoder },
  { id: "html-wysiwyg-editor", name: "HTML WYSIWYG Editor", component: HtmlWysiwygEditor },
];
