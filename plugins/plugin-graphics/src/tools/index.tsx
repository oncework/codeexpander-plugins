import React from "react";
import QrCodeGenerator from "./QrCodeGenerator";
import WifiQrGenerator from "./WifiQrGenerator";
import ColorPaletteGenerator from "./ColorPaletteGenerator";
import HtmlColorCodes from "./HtmlColorCodes";
import CameraRecorder from "./CameraRecorder";
import PaintingDrawingTool from "./PaintingDrawingTool";
import ImageFormatConverter from "./ImageFormatConverter";

export interface ToolDef {
  id: string;
  name: string;
  component: React.ComponentType;
}

export const TOOLS: ToolDef[] = [
  { id: "qr-code-generator", name: "QR Code Generator", component: QrCodeGenerator },
  { id: "wifi-qr-generator", name: "WiFi QR Generator", component: WifiQrGenerator },
  { id: "color-palette-generator", name: "Color Palette Generator", component: ColorPaletteGenerator },
  { id: "html-color-codes", name: "HTML Color Codes", component: HtmlColorCodes },
  { id: "camera-recorder", name: "Camera Recorder", component: CameraRecorder },
  { id: "painting-drawing-tool", name: "Painting / Drawing", component: PaintingDrawingTool },
  { id: "image-format-converter", name: "Image Format Converter", component: ImageFormatConverter },
];
