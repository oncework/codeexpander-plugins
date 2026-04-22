import React, { useState } from 'react';
import { Input, Button, Card, CardContent, CardHeader, CardTitle, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@codeexpander/dev-tools-ui";
import { useI18n } from "../../context";
import { parseTimestamp, getCurrentTimestampInFormat } from './utils';

const TimestampToHuman = () => {
  const { t } = useI18n();
  const [singleTimestamp, setSingleTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
  const [batchTimestamps, setBatchTimestamps] = useState('');
  const [timestampFormat, setTimestampFormat] = useState('seconds');
  const [convertedResults, setConvertedResults] = useState<any[]>([]);

  const setCurrentTimestamp = () => {
    const timestamp = getCurrentTimestampInFormat(timestampFormat);
    setSingleTimestamp(timestamp);
  };

  const convertSingleTimestamp = () => {
    const ms = parseTimestamp(singleTimestamp, timestampFormat);
    if (!ms) return;
    
    const date = new Date(ms);
    const result = {
      original: singleTimestamp,
      date: date,
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toLocaleString(),
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds()
    };
    setConvertedResults([result]);
  };

  const convertBatchTimestamps = () => {
    const timestamps = batchTimestamps.split('\n').filter(t => t.trim());
    const results = timestamps.map(timestamp => {
      const ms = parseTimestamp(timestamp.trim(), timestampFormat);
      if (!ms) return null;
      
      const date = new Date(ms);
      return {
        original: timestamp.trim(),
        date: date,
        iso: date.toISOString(),
        utc: date.toUTCString(),
        local: date.toLocaleString()
      };
    }).filter(Boolean);
    
    setConvertedResults(results);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("epochConverter.timestampToHumanTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder={t("epochConverter.placeholderTimestamp")}
              value={singleTimestamp}
              onChange={(e) => setSingleTimestamp(e.target.value)}
            />
          </div>
          <Select value={timestampFormat} onValueChange={setTimestampFormat}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seconds">{t("epochConverter.seconds")}</SelectItem>
              <SelectItem value="milliseconds">{t("epochConverter.milliseconds")}</SelectItem>
              <SelectItem value="microseconds">{t("epochConverter.microseconds")}</SelectItem>
              <SelectItem value="nanoseconds">{t("epochConverter.nanoseconds")}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={setCurrentTimestamp} variant="outline">
            {t("epochConverter.now")}
          </Button>
          <Button onClick={convertSingleTimestamp}>{t("epochConverter.convert")}</Button>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">{t("epochConverter.batchLabel")}</label>
          <Textarea
            placeholder={t("epochConverter.batchPlaceholderTs")}
            value={batchTimestamps}
            onChange={(e) => setBatchTimestamps(e.target.value)}
            rows={4}
          />
          <Button onClick={convertBatchTimestamps} className="mt-2">
            {t("epochConverter.batchConvert")}
          </Button>
        </div>

        {convertedResults.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">{t("epochConverter.results")}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("epochConverter.original")}</TableHead>
                  <TableHead>{t("epochConverter.utcDate")}</TableHead>
                  <TableHead>{t("epochConverter.localDate")}</TableHead>
                  <TableHead>{t("epochConverter.isoFormat")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {convertedResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">{result.original}</TableCell>
                    <TableCell>{result.utc}</TableCell>
                    <TableCell>{result.local}</TableCell>
                    <TableCell className="font-mono text-sm">{result.iso}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TimestampToHuman;
