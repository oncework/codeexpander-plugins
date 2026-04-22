import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@codeexpander/dev-tools-ui";

export default function DemoTool() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Demo Tool</CardTitle>
        <CardDescription>在此添加你的工具逻辑</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">编辑 src/tools/DemoTool.tsx 开始开发</p>
      </CardContent>
    </Card>
  );
}
