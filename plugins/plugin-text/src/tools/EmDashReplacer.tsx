import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Textarea,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@codeexpander/dev-tools-ui";
import { Copy, RotateCcw } from "lucide-react";
import { useI18n } from "../context";
import { showToast, showErrorToast } from "../toast";

const EmDashReplacer = () => {
  const { t } = useI18n();
  const [inputHtml, setInputHtml] = useState("");
  const [outputHtml, setOutputHtml] = useState("");
  const [replaceWith, setReplaceWith] = useState("comma");
  const inputRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const replacementOptions: Record<string, string> = {
    comma: ",",
    space: " ",
    dash: "-",
    colon: ":",
  };

  useEffect(() => {
    if (inputRef.current && inputRef.current.innerHTML !== inputHtml) {
      inputRef.current.innerHTML = inputHtml;
    }
  }, [inputHtml]);

  useEffect(() => {
    if (outputRef.current && outputRef.current.innerHTML !== outputHtml) {
      outputRef.current.innerHTML = outputHtml;
    }
  }, [outputHtml]);

  const updateInputFromEditor = () => {
    if (inputRef.current) {
      setInputHtml(inputRef.current.innerHTML);
    }
  };

  const handleReplace = () => {
    if (
      !inputHtml.trim() &&
      (!inputRef.current || !inputRef.current.textContent?.trim())
    ) {
      showErrorToast(t("emDashReplacer.errorInputRequired"), t("emDashReplacer.errorEnterText"));
      return;
    }

    const replacement =
      replacementOptions[replaceWith] ?? replacementOptions.comma;
    const result = inputHtml.replace(/—/g, replacement);
    setOutputHtml(result);
    showToast(t("emDashReplacer.toastSuccess"));
  };

  const copyToClipboard = async () => {
    const textContent = outputRef.current?.textContent || "";
    if (!textContent.trim()) {
      showErrorToast(t("emDashReplacer.errorNothingToCopy"), t("emDashReplacer.errorNoOutput"));
      return;
    }

    if (window.__codeexpander?.writeClipboard) {
      window.__codeexpander.writeClipboard(textContent);
      showToast(t("emDashReplacer.toastCopied"));
    } else {
      try {
        await navigator.clipboard.writeText(textContent);
        showToast(t("emDashReplacer.toastCopied"));
      } catch {
        showErrorToast(t("emDashReplacer.errorCopyFailed"), t("emDashReplacer.errorCopyFailedDesc"));
      }
    }
  };

  const handleClear = () => {
    setInputHtml("");
    setOutputHtml("");
    if (inputRef.current) {
      inputRef.current.innerHTML = "";
    }
    if (outputRef.current) {
      outputRef.current.innerHTML = "";
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t("emDashReplacer.title")}</h2>
        <p className="text-muted-foreground text-sm">
          {t("emDashReplacer.subtitle")}
        </p>
      </div>

      <Tabs defaultValue="simple" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visual">{t("emDashReplacer.tabRich")}</TabsTrigger>
          <TabsTrigger value="simple">{t("emDashReplacer.tabSimple")}</TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("emDashReplacer.inputTitle")}</CardTitle>
                <CardDescription>
                  {t("emDashReplacer.inputDescRich")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  ref={inputRef}
                  contentEditable
                  className="min-h-[200px] max-h-[200px] overflow-y-auto p-4 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background whitespace-pre-wrap"
                  onInput={updateInputFromEditor}
                  onPaste={() => setTimeout(updateInputFromEditor, 0)}
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    lineHeight: "1.6",
                  }}
                  dangerouslySetInnerHTML={{ __html: inputHtml }}
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("emDashReplacer.replaceWithLabel")}
                  </label>
                  <Select value={replaceWith} onValueChange={setReplaceWith}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comma">{t("emDashReplacer.optionComma")}</SelectItem>
                      <SelectItem value="space">{t("emDashReplacer.optionSpace")}</SelectItem>
                      <SelectItem value="dash">{t("emDashReplacer.optionDash")}</SelectItem>
                      <SelectItem value="colon">{t("emDashReplacer.optionColon")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleReplace} className="flex-1">
                    {t("emDashReplacer.replaceBtn")}
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleClear}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("emDashReplacer.outputTitle")}</CardTitle>
                <CardDescription>
                  {t("emDashReplacer.outputDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  ref={outputRef}
                  className="min-h-[200px] max-h-[200px] overflow-y-auto p-4 border border-input rounded-md bg-muted whitespace-pre-wrap"
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    lineHeight: "1.6",
                  }}
                  dangerouslySetInnerHTML={{ __html: outputHtml }}
                />
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  disabled={!outputHtml}
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {t("emDashReplacer.copyText")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="simple" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("emDashReplacer.inputTitle")}</CardTitle>
                <CardDescription>
                  {t("emDashReplacer.inputDescSimple")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={t("emDashReplacer.inputPlaceholder")}
                  value={inputHtml.replace(/<[^>]*>/g, "")}
                  onChange={(e) => setInputHtml(e.target.value)}
                  className="min-h-[200px] resize-none whitespace-pre-wrap font-mono"
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("emDashReplacer.replaceWithLabel")}
                  </label>
                  <Select value={replaceWith} onValueChange={setReplaceWith}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comma">{t("emDashReplacer.optionComma")}</SelectItem>
                      <SelectItem value="space">{t("emDashReplacer.optionSpace")}</SelectItem>
                      <SelectItem value="dash">{t("emDashReplacer.optionDash")}</SelectItem>
                      <SelectItem value="colon">{t("emDashReplacer.optionColon")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleReplace} className="flex-1">
                    {t("emDashReplacer.replaceBtn")}
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleClear}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("emDashReplacer.outputTitle")}</CardTitle>
                <CardDescription>
                  {t("emDashReplacer.outputDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={t("emDashReplacer.outputPlaceholder")}
                  value={outputHtml.replace(/<[^>]*>/g, "")}
                  readOnly
                  className="min-h-[200px] resize-none bg-muted whitespace-pre-wrap font-mono"
                />
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  disabled={!outputHtml}
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {t("emDashReplacer.copyShort")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>{t("emDashReplacer.aboutTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              {t("emDashReplacer.aboutEmDash")}
            </p>
            <p>
              {t("emDashReplacer.aboutUses")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmDashReplacer;
