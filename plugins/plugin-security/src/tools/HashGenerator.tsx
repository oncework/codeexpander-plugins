import React, { useState, useEffect } from 'react';
import { Input, Card, CardContent, CardHeader, CardTitle, Button } from '@codeexpander/dev-tools-ui';
import { useI18n } from '../context';
import { showToast } from '../toast';

const HashGenerator = () => {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: ''
  });

  const generateMD5 = async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('MD5', data).catch(() => null);

    if (!hashBuffer) {
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(16).padStart(8, '0').substring(0, 32);
    }

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateSHA1 = async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateSHA256 = async (text: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  useEffect(() => {
    if (!input) {
      setHashes({ md5: '', sha1: '', sha256: '' });
      return;
    }

    const generateHashes = async () => {
      const [md5, sha1, sha256] = await Promise.all([
        generateMD5(input),
        generateSHA1(input),
        generateSHA256(input)
      ]);

      setHashes({ md5, sha1, sha256 });
    };

    generateHashes();
  }, [input]);

  const handleCopy = (text: string) => {
    if (typeof (window as any).__codeexpander?.writeClipboard === "function") {
      (window as any).__codeexpander.writeClipboard(text);
    } else {
      navigator.clipboard.writeText(text);
    }
    showToast(t("common.copied"));
  };

  const hashTypes: { name: string; key: keyof typeof hashes; descKey: string }[] = [
    { name: 'MD5', key: 'md5', descKey: 'hashGenerator.md5Desc' },
    { name: 'SHA-1', key: 'sha1', descKey: 'hashGenerator.sha1Desc' },
    { name: 'SHA-256', key: 'sha256', descKey: 'hashGenerator.sha256Desc' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium mb-3">{t("hashGenerator.inputLabel")}</label>
        <Input
          placeholder={t("hashGenerator.placeholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {hashTypes.map((hashType) => (
          <Card key={hashType.key}>
            <CardHeader>
              <CardTitle className="text-lg flex justify-between items-center">
                <div>
                  <span>{hashType.name}</span>
                  <div className="text-sm font-normal text-slate-600 dark:text-slate-400">
                    {t(hashType.descKey)}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(hashes[hashType.key])}
                  disabled={!hashes[hashType.key]}
                >
                  {t("common.copy")}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-sm bg-slate-50 dark:bg-slate-800 p-4 rounded border break-all">
                {hashes[hashType.key] || t("hashGenerator.hashPlaceholder")}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <p><strong>{t("hashGenerator.securityNote")}</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>{t("hashGenerator.securityMd5")}</li>
              <li>{t("hashGenerator.securitySha1")}</li>
              <li>{t("hashGenerator.securitySha256")}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HashGenerator;
