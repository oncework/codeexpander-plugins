import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { PluginTabsLayout } from "@codeexpander/dev-tools-ui";
import { TOOLS } from "./tools";
import { getPluginLocale, useT } from "./locales";
import { I18nProvider } from "./context";
import "./index.css";

function PluginApp() {
  const payload = window.__codeexpander_initial_payload ?? {};
  const locale = getPluginLocale(payload);
  const t = useT(locale);
  const [activeId, setActiveId] = useState<string>(() => TOOLS[0]?.id ?? "");
  const activeTool = useMemo(() => TOOLS.find((tool) => tool.id === activeId), [activeId]);
  const ActiveComponent = activeTool?.component;

  return (
    <I18nProvider locale={locale} t={t}>
      <div className="p-4 min-h-[400px] w-full max-w-full overflow-hidden">
        <PluginTabsLayout
          tools={TOOLS}
          activeId={activeId}
          onChange={setActiveId}
          renderLabel={({ id }) => t(`tools.${id}`)}
        />
      </div>
    </I18nProvider>
  );
}

const root = document.getElementById("root");
if (root) ReactDOM.createRoot(root).render(<React.StrictMode><PluginApp /></React.StrictMode>);
