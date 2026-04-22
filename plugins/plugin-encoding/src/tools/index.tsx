import UrlEncoder from "./UrlEncoder";
import Base64Encoder from "./Base64Encoder";
import JwtDecoder from "./JwtDecoder";

export interface EncodingToolDef {
  id: string;
  name: string;
  component: React.ComponentType;
}

export const ENCODING_TOOLS: EncodingToolDef[] = [
  { id: "url-encoder", name: "URL Encoder/Decoder", component: UrlEncoder },
  { id: "base64-encoder", name: "Base64 Encoder/Decoder", component: Base64Encoder },
  { id: "jwt-decoder", name: "JWT Decoder", component: JwtDecoder },
];
