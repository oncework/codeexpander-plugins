import { Card, CardContent, CardHeader, CardTitle, Badge } from "@codeexpander/dev-tools-ui";
import { Clock } from "lucide-react";
import { useI18n } from "../../context";
import { TimezoneInfo } from './types';
import { formatTime } from './timezoneUtils';

interface TimezoneInfoDisplayProps {
  timezoneInfo: TimezoneInfo;
}

const TimezoneInfoDisplay = ({ timezoneInfo }: TimezoneInfoDisplayProps) => {
  const { t } = useI18n();
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-green-600 dark:text-green-500" />
        <h3 className="text-lg font-semibold">{t("timezoneLookup.timezoneInfo")}</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("timezoneLookup.locationDetails")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("timezoneLookup.location")}</span>
              <span className="font-medium">{timezoneInfo.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("timezoneLookup.timezone")}</span>
              <Badge variant="outline">{timezoneInfo.timezone}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("timezoneLookup.abbreviation")}</span>
              <Badge>{timezoneInfo.abbreviation}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("timezoneLookup.utcOffset")}</span>
              <Badge variant="secondary">{timezoneInfo.offset}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("timezoneLookup.timeFormats")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("timezoneLookup.hour12")}</span>
              <span className="font-mono font-medium">
                {formatTime(timezoneInfo.timezone, '12hour')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("timezoneLookup.hour24")}</span>
              <span className="font-mono font-medium">
                {formatTime(timezoneInfo.timezone, '24hour')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("timezoneLookup.isoFormat")}</span>
              <span className="font-mono font-medium text-sm">
                {formatTime(timezoneInfo.timezone, 'iso')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Date Time Display */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">
              {t("timezoneLookup.currentDateTime")}{timezoneInfo.location}{t("timezoneLookup.currentDateTimeSuffix")}
            </div>
            <div className="text-2xl font-bold">
              {formatTime(timezoneInfo.timezone, 'full')}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimezoneInfoDisplay;
