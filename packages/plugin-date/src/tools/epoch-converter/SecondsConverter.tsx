import React, { useState } from 'react';
import { Input, Button, Card, CardContent, CardHeader, CardTitle } from "@codeexpander/dev-tools-ui";
import { useI18n } from "../../context";
import { convertSecondsToTime } from './utils';

const SecondsConverter = () => {
  const { t } = useI18n();
  const [secondsToConvert, setSecondsToConvert] = useState('90061');
  const [timeConversionResult, setTimeConversionResult] = useState<any>(null);

  const handleConvertSecondsToTime = () => {
    const totalSeconds = parseInt(secondsToConvert);
    if (isNaN(totalSeconds)) return;
    
    const result = convertSecondsToTime(totalSeconds);
    setTimeConversionResult(result);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{t("epochConverter.secondsConverterTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder={t("epochConverter.placeholderSeconds")}
            value={secondsToConvert}
            onChange={(e) => setSecondsToConvert(e.target.value)}
            className="flex-1 text-sm"
          />
          <Button onClick={handleConvertSecondsToTime} className="w-full sm:w-auto" size="sm">
            {t("epochConverter.convert")}
          </Button>
        </div>

        {timeConversionResult && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-lg md:text-2xl font-bold break-words">
                  {timeConversionResult.days} {t("epochConverter.daysUnit")}, {timeConversionResult.hours} {t("epochConverter.hoursUnit")}, {timeConversionResult.minutes} {t("epochConverter.minutesUnit")}, {timeConversionResult.seconds} {t("epochConverter.secondsUnit")}
                </div>
                <div className="text-sm text-gray-600 dark:text-slate-400">
                  {t("epochConverter.totalPrefix")}{timeConversionResult.total.toLocaleString()}{t("epochConverter.totalSuffix")}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default SecondsConverter;
