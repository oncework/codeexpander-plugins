import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@codeexpander/dev-tools-ui';
import { copyWithToast } from '../toast';
import { useI18n } from '../context';

const UuidGenerator = () => {
  const { t } = useI18n();
  const [uuids, setUuids] = useState<string[]>([]);
  const [version, setVersion] = useState('4');
  const [count, setCount] = useState(1);

  const generateUUID = (version: string = '4'): string => {
    if (version === '4') {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    // Simple UUID v1 simulation (not truly compliant)
    if (version === '1') {
      const timestamp = Date.now();
      const random = Math.random().toString(16).substring(2, 15);
      return `${timestamp.toString(16).padStart(8, '0').substring(0, 8)}-${random.substring(0, 4)}-1${random.substring(4, 7)}-a${random.substring(7, 10)}-${random.substring(10, 15)}000000`;
    }

    return generateUUID('4'); // Fallback to v4
  };

  const generateUUIDs = () => {
    const newUuids = Array.from({ length: Math.min(count, 50) }, () => generateUUID(version));
    setUuids(newUuids);
  };

  const copyAllUUIDs = () => {
    const allUuids = uuids.join('\n');
    copyWithToast(allUuids, t('common.copied'));
  };

  useEffect(() => {
    generateUUIDs();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('uuidGenerator.versionLabel')}</label>
          <Select value={version} onValueChange={setVersion}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4">{t('uuidGenerator.v4')}</SelectItem>
              <SelectItem value="1">{t('uuidGenerator.v1')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('uuidGenerator.countLabel')}</label>
          <Input
            type="number"
            min="1"
            max="50"
            value={count}
            onChange={(e) => setCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={generateUUIDs} className="flex-1">
          {t('uuidGenerator.generateBtn')}
        </Button>
        {uuids.length > 1 && (
          <Button variant="outline" onClick={copyAllUUIDs}>
            {t('uuidGenerator.copyAll')}
          </Button>
        )}
      </div>

      {uuids.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('uuidGenerator.generatedTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uuids.map((uuid, index) => (
                <div key={index} className="flex justify-between items-center gap-3 p-2 bg-slate-50 rounded">
                  <div className="font-mono text-sm flex-1">
                    {uuid}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyWithToast(uuid, t('common.copied'))}
                  >
                    {t('common.copy')}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('uuidGenerator.infoTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-600 space-y-2">
            <div>{t('uuidGenerator.infoV4')}</div>
            <div>{t('uuidGenerator.infoV1')}</div>
            <div className="mt-3">{t('uuidGenerator.infoFormat')}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UuidGenerator;
