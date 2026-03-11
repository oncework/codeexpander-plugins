import React, { useState, useEffect } from "react";
import { Input } from "@codeexpander/dev-tools-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@codeexpander/dev-tools-ui";
import { Badge } from "@codeexpander/dev-tools-ui";
import { useI18n } from "../context";

type TFunc = (key: string) => string;

const CronEditor = () => {
  const { t } = useI18n();
  const [cronExpression, setCronExpression] = useState("0 0 * * *");
  const [description, setDescription] = useState("");
  const [nextRuns, setNextRuns] = useState<string[]>([]);

  const cronExamples = [
    { expression: "0 0 * * *", descKey: "example1Desc" as const },
    { expression: "0 9 * * 1-5", descKey: "example2Desc" as const },
    { expression: "*/15 * * * *", descKey: "example3Desc" as const },
    { expression: "0 0 1 * *", descKey: "example4Desc" as const },
    { expression: "0 0 * * 0", descKey: "example5Desc" as const },
    { expression: "30 14 * * 1", descKey: "example6Desc" as const },
  ];

  const parseCronExpression = (cron: string, tFunc: TFunc): string => {
    const parts = cron.trim().split(/\s+/);
    if (parts.length !== 5) {
      throw new Error("Invalid format");
    }
    const [minute, hour, , , dayOfWeek] = parts;
    let desc = tFunc("cronEditor.runsPrefix");
    if (minute === "0" && hour === "0") {
      desc += tFunc("cronEditor.dailyMidnight");
    } else if (minute === "0") {
      desc += tFunc("cronEditor.dailyAtPrefix") + hour + ":00";
    } else if (minute.startsWith("*/")) {
      const interval = minute.substring(2);
      desc += tFunc("cronEditor.everyPrefix") + interval + tFunc("cronEditor.everySuffix");
    } else {
      desc += tFunc("cronEditor.atPrefix") + hour + ":" + minute.padStart(2, "0");
    }
    if (dayOfWeek !== "*") {
      const dayKeys = ["day0", "day1", "day2", "day3", "day4", "day5", "day6"] as const;
      if (dayOfWeek.includes("-")) {
        desc += tFunc("cronEditor.onWeekdays");
      } else {
        const dayNum = parseInt(dayOfWeek);
        if (!isNaN(dayNum) && dayNum >= 0 && dayNum <= 6) {
          desc += tFunc("cronEditor.onDayPrefix") + tFunc("cronEditor." + dayKeys[dayNum]);
        }
      }
    }
    return desc;
  };

  const generateNextRuns = (_cron: string): string[] => {
    const now = new Date();
    const runs = [];
    for (let i = 0; i < 5; i++) {
      const nextRun = new Date(now.getTime() + (i + 1) * 24 * 60 * 60 * 1000);
      runs.push(nextRun.toLocaleString());
    }
    return runs;
  };

  useEffect(() => {
    try {
      setDescription(parseCronExpression(cronExpression, t));
      setNextRuns(generateNextRuns(cronExpression));
    } catch {
      setDescription(t("cronEditor.invalidCron"));
      setNextRuns([]);
    }
  }, [cronExpression, t]);

  const isInvalid = description === t("cronEditor.invalidCron");

  return (
    <div className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3">{t("cronEditor.expressionLabel")}</label>
        <Input
          placeholder={t("cronEditor.placeholder")}
          value={cronExpression}
          onChange={(e) => setCronExpression(e.target.value)}
          className="font-mono"
        />
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          {t("cronEditor.formatHint")}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {t("cronEditor.descriptionTitle")}
            <Badge variant={isInvalid ? "destructive" : "default"}>
              {isInvalid ? t("cronEditor.invalid") : t("cronEditor.valid")}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{description}</p>
        </CardContent>
      </Card>

      {nextRuns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("cronEditor.nextRunsTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nextRuns.map((run, index) => (
                <div key={index} className="font-mono text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded border">
                  {run}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("cronEditor.commonExamplesTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cronExamples.map((example, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded cursor-pointer"
                onClick={() => setCronExpression(example.expression)}
              >
                <div className="flex-1">
                  <div className="font-mono text-sm">{example.expression}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{t("cronEditor." + example.descKey)}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CronEditor;
