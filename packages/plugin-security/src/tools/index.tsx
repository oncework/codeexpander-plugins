import React from "react";
import HashGenerator from "./HashGenerator";
import HtpasswdGenerator from "./HtpasswdGenerator";
import StrongPasswordGenerator from "./StrongPasswordGenerator";
import CredentialFormatDetector from "./CredentialFormatDetector";

export interface ToolDef {
  id: string;
  name: string;
  component: React.ComponentType;
}

export const TOOLS: ToolDef[] = [
  { id: "hash-generator", name: "Hash Generator", component: HashGenerator },
  { id: "htpasswd-generator", name: "Htpasswd Generator", component: HtpasswdGenerator },
  { id: "strong-password-generator", name: "Strong Password Generator", component: StrongPasswordGenerator },
  { id: "credential-format-detector", name: "Credential Format Detector", component: CredentialFormatDetector },
];
