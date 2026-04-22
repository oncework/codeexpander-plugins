import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Textarea,
  Button,
  Badge,
} from "@codeexpander/dev-tools-ui";
import { Layers, Hash, Copy } from "lucide-react";
import { useI18n } from "../context";
import { showToast } from "../toast";

interface TokenResult {
  modelKey: string;
  descKey: string;
  tokens: string[];
  tokenCount: number;
}

const Tokenizer = () => {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [results, setResults] = useState<TokenResult[]>([]);

  const tokenizeByModel = (text: string): TokenResult[] => {
    if (!text.trim()) return [];

    const results: TokenResult[] = [];

    const gptTokens = text
      .replace(/\s+/g, " ")
      .split(/(\w+|[^\w\s]|\s+)/)
      .filter((token) => token.length > 0)
      .map((token) => (token === " " ? "·" : token));

    results.push({
      modelKey: "tokenizer.modelGptStyle",
      descKey: "tokenizer.descGptStyle",
      tokens: gptTokens,
      tokenCount: gptTokens.length,
    });

    const wordTokens = text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 0);

    results.push({
      modelKey: "tokenizer.modelWordBased",
      descKey: "tokenizer.descWordBased",
      tokens: wordTokens,
      tokenCount: wordTokens.length,
    });

    const charTokens = text.split("").filter((char) => char !== "");

    results.push({
      modelKey: "tokenizer.modelCharLevel",
      descKey: "tokenizer.descCharLevel",
      tokens: charTokens,
      tokenCount: charTokens.length,
    });

    const subwordTokens = text
      .split(/(\w+)/)
      .filter((token) => token.length > 0)
      .flatMap((token) => {
        if (/^\w+$/.test(token) && token.length > 4) {
          const subwords = [];
          for (let i = 0; i < token.length; i += 3) {
            subwords.push(token.slice(i, i + 3));
          }
          return subwords;
        }
        return [token];
      });

    results.push({
      modelKey: "tokenizer.modelSubword",
      descKey: "tokenizer.descSubword",
      tokens: subwordTokens,
      tokenCount: subwordTokens.length,
    });

    return results;
  };

  const handleTokenize = () => {
    if (!input.trim()) return;
    const tokenResults = tokenizeByModel(input);
    setResults(tokenResults);
  };

  const handleCopyInput = async () => {
    if (!input.trim()) return;
    if (typeof (window as any).__codeexpander?.writeClipboard === "function") {
      await (window as any).__codeexpander.writeClipboard(input);
    } else {
      await navigator.clipboard.writeText(input);
    }
    showToast(t("common.copied"));
  };

  const getTokenColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {t("tokenizer.title")}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {t("tokenizer.subtitle")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            {t("tokenizer.textInputTitle")}
          </CardTitle>
          <CardDescription>
            {t("tokenizer.textInputDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text-input">{t("tokenizer.labelTextToTokenize")}</Label>
            <Textarea
              id="text-input"
              placeholder={t("tokenizer.placeholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleTokenize}
              disabled={!input.trim()}
              className="flex-1"
            >
              <Layers className="h-4 w-4 mr-2" />
              {t("tokenizer.tokenizeButton")}
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyInput}
              disabled={!input.trim()}
              title={t("tokenizer.copyInputTitle")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result, modelIndex) => (
            <Card key={result.modelKey}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Hash className="h-4 w-4" />
                    {t(result.modelKey)}
                  </CardTitle>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    {result.tokenCount}{t("tokenizer.tokensSuffix")}
                  </Badge>
                </div>
                <CardDescription>{t(result.descKey)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {result.tokens.map((token, tokenIndex) => (
                    <Badge
                      key={`${result.modelKey}-${tokenIndex}`}
                      variant="secondary"
                      className={`${getTokenColor(tokenIndex)} text-xs font-mono border`}
                    >
                      {token === "·" ? "␣" : token}
                    </Badge>
                  ))}
                </div>
                {result.tokens.length === 0 && (
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {t("tokenizer.noTokens")}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tokenizer;
