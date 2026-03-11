import React, { useEffect } from "react";
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@codeexpander/dev-tools-ui";
import { useI18n } from "../context";
import CurrentEpochDisplay from "./epoch-converter/CurrentEpochDisplay";
import TimestampToHuman from "./epoch-converter/TimestampToHuman";
import HumanToTimestamp from "./epoch-converter/HumanToTimestamp";
import StartEndDates from "./epoch-converter/StartEndDates";
import SecondsConverter from "./epoch-converter/SecondsConverter";
import DynamicDates from "./epoch-converter/DynamicDates";

const EpochConverter = () => {
  const { t } = useI18n();
  const clearAllForms = () => {
    window.location.reload();
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "c" && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          clearAllForms();
        }
      }
    };
    document.addEventListener("keypress", handleKeyPress);
    return () => document.removeEventListener("keypress", handleKeyPress);
  }, []);

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <CurrentEpochDisplay />

      <Tabs defaultValue="timestamp-to-human" className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="grid grid-cols-5 min-w-max md:w-full text-xs md:text-sm">
            <TabsTrigger value="timestamp-to-human" className="px-2 md:px-4">
              <span className="hidden sm:inline">{t("epochConverter.tabTimestampToHuman")}</span>
              <span className="sm:hidden">{t("epochConverter.tabTimestampToHumanShort")}</span>
            </TabsTrigger>
            <TabsTrigger value="human-to-timestamp" className="px-2 md:px-4">
              <span className="hidden sm:inline">{t("epochConverter.tabHumanToTimestamp")}</span>
              <span className="sm:hidden">{t("epochConverter.tabHumanToTimestampShort")}</span>
            </TabsTrigger>
            <TabsTrigger value="start-end-dates" className="px-2 md:px-4">
              <span className="hidden sm:inline">{t("epochConverter.tabStartEndDates")}</span>
              <span className="sm:hidden">{t("epochConverter.tabStartEndDatesShort")}</span>
            </TabsTrigger>
            <TabsTrigger value="seconds-converter" className="px-2 md:px-4">
              <span className="hidden sm:inline">{t("epochConverter.tabSecondsConverter")}</span>
              <span className="sm:hidden">{t("epochConverter.tabSecondsConverterShort")}</span>
            </TabsTrigger>
            <TabsTrigger value="dynamic-dates" className="px-2 md:px-4">
              <span className="hidden sm:inline">{t("epochConverter.tabDynamicDates")}</span>
              <span className="sm:hidden">{t("epochConverter.tabDynamicDatesShort")}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="timestamp-to-human" className="space-y-4">
          <TimestampToHuman />
        </TabsContent>
        <TabsContent value="human-to-timestamp" className="space-y-4">
          <HumanToTimestamp />
        </TabsContent>
        <TabsContent value="start-end-dates" className="space-y-4">
          <StartEndDates />
        </TabsContent>
        <TabsContent value="seconds-converter" className="space-y-4">
          <SecondsConverter />
        </TabsContent>
        <TabsContent value="dynamic-dates" className="space-y-4">
          <DynamicDates />
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Button variant="outline" onClick={clearAllForms} className="w-full sm:w-auto">
          {t("epochConverter.clearAll")}
        </Button>
        <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">{t("epochConverter.clearAllHint")}</p>
      </div>
    </div>
  );
};

export default EpochConverter;
