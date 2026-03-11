
import { Card, CardContent, CardHeader, CardTitle } from "@codeexpander/dev-tools-ui";
import { Button } from "@codeexpander/dev-tools-ui";
import { Tool } from "./usePaintingTool";

interface ShapePanelProps {
  onShapeSelect: (shape: Tool) => void;
  currentTool: Tool;
}

export const ShapePanel = ({ onShapeSelect, currentTool }: ShapePanelProps) => {
  const shapes = [
    { tool: 'rectangle' as Tool, name: 'Rectangle', icon: '⬜' },
    { tool: 'circle' as Tool, name: 'Circle', icon: '⭕' },
    { tool: 'line' as Tool, name: 'Line', icon: '📏' },
    { tool: 'polygon' as Tool, name: 'Polygon', icon: '🔷' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Shapes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {shapes.map((shape) => (
          <Button
            key={shape.tool}
            variant={currentTool === shape.tool ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => onShapeSelect(shape.tool)}
          >
            <span className="mr-2">{shape.icon}</span>
            {shape.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
