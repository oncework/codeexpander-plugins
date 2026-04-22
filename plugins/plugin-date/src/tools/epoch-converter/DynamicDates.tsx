import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@codeexpander/dev-tools-ui";
import { useI18n } from "../../context";
import { getDynamicDates } from './utils';

const DynamicDates = () => {
  const { t } = useI18n();
  const dynamicDates = getDynamicDates();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{t("epochConverter.dynamicDatesTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">{t("epochConverter.description")}</TableHead>
                <TableHead className="min-w-[100px]">{t("epochConverter.unixTimestamp")}</TableHead>
                <TableHead className="min-w-[150px]">{t("epochConverter.date")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dynamicDates.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium text-xs md:text-sm">{t("epochConverter.dynamic" + item.id)}</TableCell>
                  <TableCell className="font-mono text-xs md:text-sm">{item.epoch}</TableCell>
                  <TableCell className="text-xs md:text-sm break-all">{item.date.toUTCString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicDates;
