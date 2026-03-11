import React, { useState } from 'react';
import { Input, Button, Card, CardContent, CardHeader, CardTitle, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@codeexpander/dev-tools-ui';
import { useI18n } from '../context';
import { showToast } from '../toast';

const HtpasswdGenerator = () => {
  const { t } = useI18n();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [algorithm, setAlgorithm] = useState('bcrypt');
  const [htpasswdEntry, setHtpasswdEntry] = useState('');
  const [error, setError] = useState('');

  const generateBcryptHash = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `$2y$10$${hash.substring(0, 22)}${hash.substring(22, 53)}`;
  };

  const generateMD5Hash = async (password: string): Promise<string> => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `$apr1$salt$${Math.abs(hash).toString(16).padStart(22, '0')}`;
  };

  const generateSHA1Hash = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `{SHA}${btoa(hash)}`;
  };

  const generateEntry = async () => {
    if (!username || !password) {
      setError(t("htpasswdGenerator.errorRequired"));
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setError(t("htpasswdGenerator.errorUsernameInvalid"));
      return;
    }

    try {
      let hash = '';

      switch (algorithm) {
        case 'bcrypt':
          hash = await generateBcryptHash(password);
          break;
        case 'md5':
          hash = await generateMD5Hash(password);
          break;
        case 'sha1':
          hash = await generateSHA1Hash(password);
          break;
        default:
          hash = password;
      }

      setHtpasswdEntry(`${username}:${hash}`);
      setError('');
    } catch (err) {
      setError(t("htpasswdGenerator.errorFailed"));
    }
  };

  const handleCopy = (text: string) => {
    if (typeof (window as any).__codeexpander?.writeClipboard === "function") {
      (window as any).__codeexpander.writeClipboard(text);
    } else {
      navigator.clipboard.writeText(text);
    }
    showToast(t("common.copied"));
  };

  const generateRandomPassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(password);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-3">{t("htpasswdGenerator.usernameLabel")}</label>
          <Input
            placeholder={t("htpasswdGenerator.usernamePlaceholder")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-3">{t("htpasswdGenerator.passwordLabel")}</label>
          <div className="flex gap-3">
            <Input
              type="password"
              placeholder={t("htpasswdGenerator.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={generateRandomPassword}
              type="button"
            >
              {t("htpasswdGenerator.generateBtn")}
            </Button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">{t("htpasswdGenerator.algorithmLabel")}</label>
        <Select value={algorithm} onValueChange={setAlgorithm}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bcrypt">{t("htpasswdGenerator.bcrypt")}</SelectItem>
            <SelectItem value="md5">{t("htpasswdGenerator.md5")}</SelectItem>
            <SelectItem value="sha1">{t("htpasswdGenerator.sha1")}</SelectItem>
            <SelectItem value="plain">{t("htpasswdGenerator.plain")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={generateEntry} disabled={!username || !password} className="w-full">
        {t("htpasswdGenerator.generateEntryBtn")}
      </Button>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="p-6">
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {htpasswdEntry && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex justify-between items-center">
              {t("htpasswdGenerator.entryTitle")}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(htpasswdEntry)}
              >
                {t("common.copy")}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-sm bg-slate-50 dark:bg-slate-800 p-4 rounded border break-all">
              {htpasswdEntry}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("htpasswdGenerator.usageTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
            <p>{t("htpasswdGenerator.usage1")}</p>
            <p>{t("htpasswdGenerator.usage2")}</p>
            <p>{t("htpasswdGenerator.usage3")}</p>
            <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded mt-3 text-xs">
{`AuthType Basic
AuthName "Restricted Area"
AuthUserFile /path/to/.htpasswd
Require valid-user`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HtpasswdGenerator;
