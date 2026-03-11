import React, { useState } from "react";
import { Textarea, Button, Card, CardContent, CardHeader, CardTitle, Badge, Collapsible, CollapsibleContent, CollapsibleTrigger } from "@codeexpander/dev-tools-ui";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useI18n } from "../context";
import { showToast } from "../toast";

interface XmlNode {
  tagName: string;
  attributes: { [key: string]: string };
  children: (XmlNode | string)[];
  isText: boolean;
}

const XmlFormatter = () => {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [formatted, setFormatted] = useState("");
  const [minified, setMinified] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [parsedXml, setParsedXml] = useState<XmlNode | null>(null);
  const [collapsedStates, setCollapsedStates] = useState<{ [key: string]: boolean }>({});

  const formatXml = (xml: string, indentSize = 2): string => {
    let result = "";
    let indent = 0;
    const nodes = xml.replace(/>\s*</g, "><").split(/(?=<)/);
    nodes.forEach((node) => {
      if (!node.trim()) return;
      if (node.match(/^<\/\w/)) indent = Math.max(0, indent - indentSize);
      result += " ".repeat(indent) + node.trim() + "\n";
      if (node.match(/^<\w[^>]*[^/]>/) || node.match(/^<\w[^>]*>$/)) indent += indentSize;
    });
    return result.trim();
  };

  const minifyXml = (xml: string): string => xml.replace(/>\s*</g, "><").trim();

  const validateXml = (xmlString: string): boolean => {
    try {
      const doc = new DOMParser().parseFromString(xmlString, "text/xml");
      return doc.getElementsByTagName("parsererror").length === 0;
    } catch {
      return false;
    }
  };

  const parseXmlToTree = (xmlString: string): XmlNode | null => {
    try {
      const doc = new DOMParser().parseFromString(xmlString, "text/xml");
      if (doc.getElementsByTagName("parsererror").length > 0) return null;
      const convertNodeToTree = (node: Element): XmlNode => {
        const attributes: { [key: string]: string } = {};
        for (let i = 0; i < node.attributes.length; i++) {
          const attr = node.attributes[i];
          attributes[attr.name] = attr.value;
        }
        const children: (XmlNode | string)[] = [];
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes[i];
          if (child.nodeType === Node.ELEMENT_NODE) children.push(convertNodeToTree(child as Element));
          else if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent?.trim();
            if (text) children.push(text);
          }
        }
        return { tagName: node.tagName, attributes, children, isText: false };
      };
      return convertNodeToTree(doc.documentElement);
    } catch {
      return null;
    }
  };

  const copyToClipboard = (text: string) => {
    if (typeof (window as any).__codeexpander?.writeClipboard === "function") {
      (window as any).__codeexpander.writeClipboard(text);
    } else {
      navigator.clipboard.writeText(text);
    }
    showToast(t("common.copied"));
  };

  const processXml = () => {
    if (!input.trim()) return;
    try {
      if (!validateXml(input)) {
        setError(t("xmlFormatter.errorInvalid"));
        setIsValid(false);
        setFormatted("");
        setMinified("");
        setParsedXml(null);
        return;
      }
      setFormatted(formatXml(input));
      setMinified(minifyXml(input));
      setParsedXml(parseXmlToTree(input));
      setIsValid(true);
      setError("");
      setCollapsedStates({});
    } catch (err) {
      setError((err as Error).message);
      setIsValid(false);
      setFormatted("");
      setMinified("");
      setParsedXml(null);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    if (!value.trim()) { setIsValid(null); setError(""); }
  };

  const toggleCollapse = (path: string) => {
    setCollapsedStates((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const renderXmlNode = (node: XmlNode | string, level = 0, path = ""): React.ReactNode => {
    if (typeof node === "string") {
      return <div style={{ marginLeft: level * 20 }} className="text-gray-700">{node}</div>;
    }
    const currentPath = path + "." + node.tagName;
    const isCollapsed = collapsedStates[currentPath];
    const hasChildren = node.children.length > 0;
    const hasAttributes = Object.keys(node.attributes).length > 0;

    if (!hasChildren && !hasAttributes) {
      return (
        <div style={{ marginLeft: level * 20 }} className="flex items-center">
          <span className="text-blue-600">&lt;{node.tagName}/&gt;</span>
        </div>
      );
    }
    if (!hasChildren && hasAttributes) {
      return (
        <div style={{ marginLeft: level * 20 }} className="flex items-center">
          <span className="text-blue-600">&lt;{node.tagName}</span>
          {Object.entries(node.attributes).map(([key, value]) => (
            <span key={key} className="ml-1">
              <span className="text-green-600">{key}</span>
              <span className="text-gray-500">=</span>
              <span className="text-red-600">&quot;{value}&quot;</span>
            </span>
          ))}
          <span className="text-blue-600">/&gt;</span>
        </div>
      );
    }
    return (
      <div style={{ marginLeft: level * 20 }}>
        <Collapsible open={!isCollapsed} onOpenChange={() => toggleCollapse(currentPath)}>
          <CollapsibleTrigger className="flex items-center hover:bg-gray-100 p-1 rounded">
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span className="text-blue-600">&lt;{node.tagName}</span>
            {hasAttributes && Object.entries(node.attributes).map(([key, value]) => (
              <span key={key} className="ml-1">
                <span className="text-green-600">{key}</span>
                <span className="text-gray-500">=</span>
                <span className="text-red-600">&quot;{value}&quot;</span>
              </span>
            ))}
            <span className="text-blue-600">&gt;</span>
            {isCollapsed && <span className="text-gray-500 ml-2">...</span>}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-l-2 border-gray-200 ml-2">
              {node.children.map((child, index) => (
                <div key={index}>{renderXmlNode(child, level + 1, currentPath + `[${index}]`)}</div>
              ))}
            </div>
            <div style={{ marginLeft: level * 20 }} className="text-blue-600">
              &lt;/{node.tagName}&gt;
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  const expandAll = () => setCollapsedStates({});
  const collapseAll = () => {
    const getAllPaths = (node: XmlNode | string, currentPath = ""): string[] => {
      if (typeof node === "string") return [];
      const paths: string[] = [];
      const nodePath = currentPath + "." + node.tagName;
      if (node.children.length > 0) {
        paths.push(nodePath);
        node.children.forEach((child, index) => {
          paths.push(...getAllPaths(child, nodePath + `[${index}]`));
        });
      }
      return paths;
    };
    if (parsedXml) {
      const allPaths = getAllPaths(parsedXml);
      const newCollapsedStates: { [key: string]: boolean } = {};
      allPaths.forEach((p) => { newCollapsedStates[p] = true; });
      setCollapsedStates(newCollapsedStates);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium">{t("xmlFormatter.inputLabel")}</label>
          {isValid !== null && (
            <Badge variant={isValid ? "default" : "destructive"}>
              {isValid ? t("xmlFormatter.valid") : t("xmlFormatter.invalid")}
            </Badge>
          )}
        </div>
        <Textarea
          placeholder={t("xmlFormatter.placeholder")}
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          className="min-h-[120px] font-mono text-sm py-3"
        />
        {error && <div className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</div>}
      </div>

      <Button onClick={processXml} disabled={!input} className="w-full">
        {t("xmlFormatter.formatButton")}
      </Button>

      {parsedXml && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex justify-between items-center">
              {t("xmlFormatter.viewerTitle")}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={expandAll}>{t("xmlFormatter.expandAll")}</Button>
                <Button variant="outline" size="sm" onClick={collapseAll}>{t("xmlFormatter.collapseAll")}</Button>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(formatted)}>{t("common.copy")}</Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded border text-sm font-mono max-h-96 overflow-auto">
              {renderXmlNode(parsedXml)}
            </div>
          </CardContent>
        </Card>
      )}

      {formatted && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex justify-between items-center">
              {t("xmlFormatter.formattedTitle")}
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(formatted)}>{t("common.copy")}</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-50 dark:bg-slate-800 p-4 rounded border text-sm overflow-x-auto max-h-60">{formatted}</pre>
          </CardContent>
        </Card>
      )}

      {minified && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex justify-between items-center">
              {t("xmlFormatter.minifiedTitle")}
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(minified)}>{t("common.copy")}</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded border text-sm font-mono break-all max-h-40 overflow-y-auto">{minified}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default XmlFormatter;
