import * as React from "react";
import { Card, CardContent } from "./card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { cn } from "./lib/utils";

type ToolDef = {
  id: string;
  component: React.ComponentType<any>;
};

type RenderLabelProps = {
  id: string;
};

type PluginTabsLayoutProps = {
  tools: ToolDef[];
  activeId: string;
  onChange: (id: string) => void;
  renderLabel: (props: RenderLabelProps) => React.ReactNode;
  contentClassName?: string;
};

export function PluginTabsLayout(props: PluginTabsLayoutProps) {
  const { tools, activeId, onChange, renderLabel, contentClassName } = props;

  if (!tools.length) return null;

  const ActiveTool = tools.find((tool) => tool.id === activeId)?.component ?? tools[0].component;

  return (
    <Card className="w-full">
      <CardContent className="p-4 pt-4">
        {tools.length > 1 ? (
          <Tabs
            value={activeId}
            onValueChange={onChange}
            orientation="vertical"
            className="flex w-full gap-4"
          >
            <TabsList className="mb-0 flex-col items-stretch w-auto">
              {tools.map((tool) => (
                <TabsTrigger
                  key={tool.id}
                  value={tool.id}
                  className="justify-start text-left"
                >
                  {renderLabel({ id: tool.id })}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className={cn("flex-1", contentClassName)}>
              {tools.map((tool) => (
                <TabsContent
                  key={tool.id}
                  value={tool.id}
                  className="mt-0 h-full"
                >
                  {activeId === tool.id && tool.component && <tool.component />}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        ) : (
          ActiveTool && <ActiveTool />
        )}
      </CardContent>
    </Card>
  );
}

