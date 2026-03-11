import React, { useState, useEffect } from "react";
import { Textarea } from "@codeexpander/dev-tools-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@codeexpander/dev-tools-ui";
import { Badge } from "@codeexpander/dev-tools-ui";
import { useI18n } from "../context";

const JwtDecoder = () => {
  const { t } = useI18n();
  const [jwt, setJwt] = useState("");
  const [decoded, setDecoded] = useState<{
    header: Record<string, unknown>;
    payload: Record<string, unknown>;
    signature: string;
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jwt.trim()) {
      setDecoded(null);
      setError("");
      return;
    }

    try {
      const parts = jwt.split(".");
      if (parts.length !== 3) {
        throw new Error(t("jwtDecoder.errorInvalidFormat"));
      }

      const header = JSON.parse(
        atob(parts[0].replace(/-/g, "+").replace(/_/g, "/"))
      );
      const payload = JSON.parse(
        atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      const signature = parts[2];

      setDecoded({ header, payload, signature });
      setError("");
    } catch (err) {
      setError((err as Error).message);
      setDecoded(null);
    }
  }, [jwt]);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const isExpired = (exp: number) => {
    return Date.now() / 1000 > exp;
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <label className="block text-sm font-medium mb-3">{t("jwtDecoder.tokenLabel")}</label>
        <Textarea
          placeholder={t("jwtDecoder.tokenPlaceholder")}
          value={jwt}
          onChange={(e) => setJwt(e.target.value)}
          className="min-h-[120px] font-mono text-sm py-3"
        />
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="p-6">
            <p className="text-red-700 dark:text-red-400 font-medium">{t("jwtDecoder.invalidJwt")}</p>
            <p className="text-red-600 dark:text-red-500 text-sm mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      {decoded && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-3">
                {t("jwtDecoder.header")}
                <Badge variant="secondary">
                  {(decoded.header.alg as string) || t("jwtDecoder.unknown")}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-50 p-4 rounded border text-sm overflow-x-auto">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-3">
                {t("jwtDecoder.payload")}
                {decoded.payload.exp != null && (
                  <Badge
                    variant={
                      isExpired(decoded.payload.exp as number)
                        ? "destructive"
                        : "default"
                    }
                  >
                    {isExpired(decoded.payload.exp as number)
                      ? t("jwtDecoder.expired")
                      : t("jwtDecoder.valid")}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-50 dark:bg-slate-800 p-4 rounded border text-sm overflow-x-auto">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>

              {(decoded.payload.iat != null ||
                decoded.payload.exp != null ||
                decoded.payload.nbf != null) && (
                <div className="mt-6 space-y-3 text-sm">
                  {decoded.payload.iat != null && (
                    <div>
                      <strong>{t("jwtDecoder.issuedAt")}</strong>{" "}
                      {formatTimestamp(decoded.payload.iat as number)}
                    </div>
                  )}
                  {decoded.payload.exp != null && (
                    <div>
                      <strong>{t("jwtDecoder.expiresAt")}</strong>{" "}
                      {formatTimestamp(decoded.payload.exp as number)}
                    </div>
                  )}
                  {decoded.payload.nbf != null && (
                    <div>
                      <strong>{t("jwtDecoder.notBefore")}</strong>{" "}
                      {formatTimestamp(decoded.payload.nbf as number)}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{t("jwtDecoder.signature")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded border font-mono text-sm break-all">
                {decoded.signature}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
                {t("jwtDecoder.signatureNote")}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default JwtDecoder;
