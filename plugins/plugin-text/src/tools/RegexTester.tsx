import React, { useState, useEffect } from "react";
import {
  Input,
  Textarea,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "@codeexpander/dev-tools-ui";
import { useI18n } from "../context";

const RegexTester = () => {
  const { t } = useI18n();
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!pattern || !testString) {
      setMatches([]);
      setError("");
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const foundMatches = [];
      let match;

      if (flags.includes("g")) {
        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push(match);
          if (match.index === regex.lastIndex) break;
        }
      } else {
        match = regex.exec(testString);
        if (match) foundMatches.push(match);
      }

      setMatches(foundMatches);
      setError("");
    } catch (err) {
      setError((err as Error).message);
      setMatches([]);
    }
  }, [pattern, flags, testString]);

  const highlightMatches = (text: string) => {
    if (!matches.length) return text;

    let result = text;
    let offset = 0;

    matches.forEach((match) => {
      if (match.index !== undefined) {
        const start = match.index + offset;
        const end = start + match[0].length;
        const before = result.slice(0, start);
        const matched = result.slice(start, end);
        const after = result.slice(end);

        result =
          before +
          `<mark class="bg-yellow-200 px-1 rounded">${matched}</mark>` +
          after;
        offset += 47;
      }
    });

    return result;
  };

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <label className="block text-sm font-medium mb-3">
            {t("regexTester.patternLabel")}
          </label>
          <Input
            placeholder={t("regexTester.patternPlaceholder")}
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="text-base py-3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-3">{t("regexTester.flagsLabel")}</label>
          <Input
            placeholder={t("regexTester.flagsPlaceholder")}
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="text-base py-3"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">{t("regexTester.testStringLabel")}</label>
        <Textarea
          placeholder={t("regexTester.testStringPlaceholder")}
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          className="min-h-[120px] text-base py-3"
        />
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950">
          <CardContent className="p-4">
            <p className="text-red-700 dark:text-red-400 font-medium">
              {t("regexTester.regexError")}
            </p>
            <p className="text-red-600 dark:text-red-500 text-sm mt-1">
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {testString && !error && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              {t("regexTester.testResult")}
              <Badge variant={matches.length > 0 ? "default" : "secondary"}>
                {matches.length} {matches.length === 1 ? t("regexTester.match") : t("regexTester.matches")}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="font-mono text-sm bg-slate-50 dark:bg-slate-800 p-4 rounded border whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: highlightMatches(testString),
              }}
            />
          </CardContent>
        </Card>
      )}

      {matches.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>{t("regexTester.matchesTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {matches.map((match, index) => (
                <div
                  key={index}
                  className="bg-slate-50 dark:bg-slate-800 p-4 rounded border font-mono text-sm"
                >
                  <div className="mb-2">
                    <strong>{t("regexTester.matchLabel")} {index + 1}:</strong> &quot;{match[0]}&quot;
                  </div>
                  <div className="mb-2">
                    <strong>{t("regexTester.indexLabel")}</strong> {match.index}
                  </div>
                  {match.length > 1 && (
                    <div>
                      <strong>{t("regexTester.groupsLabel")}</strong> {match.slice(1).join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RegexTester;
