import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@codeexpander/dev-tools-ui";
import { Separator } from "@codeexpander/dev-tools-ui";
import { Globe } from "lucide-react";
import { useI18n } from "../context";
import { showToast, showErrorToast } from "../toast";
import { TimezoneInfo } from "./timezone-lookup/types";
import { getTimezoneInfo } from "./timezone-lookup/timezoneUtils";
import TimezoneSearchForm from "./timezone-lookup/TimezoneSearchForm";
import PopularLocationsGrid from "./timezone-lookup/PopularLocationsGrid";
import TimezoneInfoDisplay from "./timezone-lookup/TimezoneInfoDisplay";
import EmptyState from "./timezone-lookup/EmptyState";

const TimezoneLookup = () => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [timezoneInfo, setTimezoneInfo] = useState<TimezoneInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetTimezoneInfo = async (location: string) => {
    setIsLoading(true);
    try {
      const info = await getTimezoneInfo(location);
      setTimezoneInfo(info);
      showToast(t("timezoneLookup.toastFound") + info.location);
    } catch (error) {
      showErrorToast(
        t("timezoneLookup.errorTitle"),
        error instanceof Error ? error.message : t("timezoneLookup.errorFailed")
      );
      setTimezoneInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      handleGetTimezoneInfo(searchQuery.trim());
    }
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    handleGetTimezoneInfo(query);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            {t("timezoneLookup.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <TimezoneSearchForm
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onSearch={handleSearch}
              isLoading={isLoading}
            />

            <PopularLocationsGrid
              onQuickSearch={handleQuickSearch}
              isLoading={isLoading}
            />
          </div>

          <Separator />

          {timezoneInfo ? (
            <TimezoneInfoDisplay timezoneInfo={timezoneInfo} />
          ) : (
            <EmptyState />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimezoneLookup;
