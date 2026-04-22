import React from "react";
import UuidGenerator from "./UuidGenerator";
import LoremGenerator from "./LoremGenerator";
import FakeDataGenerator from "./FakeDataGenerator";
import RandomPhoneGenerator from "./RandomPhoneGenerator";
import RandomEmailGenerator from "./RandomEmailGenerator";
import IsoGenerator from "./IsoGenerator";

export interface ToolDef {
  id: string;
  name: string;
  component: React.ComponentType;
}

export const TOOLS: ToolDef[] = [
  { id: "uuid-generator", name: "UUID Generator", component: UuidGenerator },
  { id: "lorem-generator", name: "Lorem Ipsum", component: LoremGenerator },
  { id: "fake-data-generator", name: "Fake Data", component: FakeDataGenerator },
  { id: "random-phone-generator", name: "Random Phone", component: RandomPhoneGenerator },
  { id: "random-email-generator", name: "Random Email", component: RandomEmailGenerator },
  { id: "iso-generator", name: "ISO 8601", component: IsoGenerator },
];
