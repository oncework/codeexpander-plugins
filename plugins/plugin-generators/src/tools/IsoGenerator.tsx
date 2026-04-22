import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@codeexpander/dev-tools-ui';
import { copyWithToast } from '../toast';
import { useI18n } from '../context';

const IsoGenerator = () => {
  const { t } = useI18n();
  const [currentIso, setCurrentIso] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [customIso, setCustomIso] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentIso(new Date().toISOString());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (customDate && customTime) {
      const dateTime = new Date(`${customDate}T${customTime}`);
      if (!isNaN(dateTime.getTime())) {
        setCustomIso(dateTime.toISOString());
      } else {
        setCustomIso('');
      }
    } else {
      setCustomIso('');
    }
  }, [customDate, customTime]);

  const generateVariations = (isoString: string) => {
    const date = new Date(isoString);

    if (isNaN(date.getTime())) {
      return null;
    }

    return {
      iso: isoString,
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      timestamp: Math.floor(date.getTime() / 1000),
      date: date.toISOString().split("T")[0],
      time: date.toISOString().split("T")[1].split(".")[0]
    };
  };

  const currentVariations = generateVariations(currentIso);
  const customVariations = customIso ? generateVariations(customIso) : null;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("isoGenerator.currentTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {currentVariations && (
            <div className="space-y-4">
              {Object.entries(currentVariations).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-600 capitalize">
                      {key === "iso" ? "ISO 8601" : key}
                    </div>
                    <div className="font-mono text-sm bg-slate-50 p-3 rounded border">
                      {value}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyWithToast(value.toString(), t("common.copied"))}
                  >
                    {t("common.copy")}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("isoGenerator.customTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-3">{t("isoGenerator.dateLabel")}</label>
              <Input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-3">{t("isoGenerator.timeLabel")}</label>
              <Input
                type="time"
                step="1"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
              />
            </div>
          </div>

          {customVariations && (
            <div className="space-y-4">
              {Object.entries(customVariations).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-600 capitalize">
                      {key === "iso" ? "ISO 8601" : key}
                    </div>
                    <div className="font-mono text-sm bg-slate-50 p-3 rounded border">
                      {value}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyWithToast(value.toString(), t("common.copied"))}
                  >
                    {t("common.copy")}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IsoGenerator;
