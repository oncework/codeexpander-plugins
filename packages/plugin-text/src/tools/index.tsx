import WordCounter from "./WordCounter";
import TextDiff from "./TextDiff";
import CaseConverter from "./CaseConverter";
import RegexTester from "./RegexTester";
import AddPrefixSuffix from "./AddPrefixSuffix";
import LineBreakManager from "./LineBreakManager";
import FindReplace from "./FindReplace";
import RemoveDuplicateLines from "./RemoveDuplicateLines";
import RemoveEmptyLines from "./RemoveEmptyLines";
import RemoveExtraSpaces from "./RemoveExtraSpaces";
import EmDashReplacer from "./EmDashReplacer";

export interface TextToolDef {
  id: string;
  name: string;
  component: React.ComponentType;
}

export const TEXT_TOOLS: TextToolDef[] = [
  { id: "word-counter", name: "Word/Character Counter", component: WordCounter },
  { id: "text-diff", name: "Text Diff Checker", component: TextDiff },
  { id: "case-converter", name: "Case Converter", component: CaseConverter },
  { id: "regex-tester", name: "Regex Tester", component: RegexTester },
  { id: "add-prefix-suffix", name: "Add Prefix/Suffix to Lines", component: AddPrefixSuffix },
  { id: "line-break-manager", name: "Add/Remove Line Breaks", component: LineBreakManager },
  { id: "find-replace", name: "Find and Replace Text", component: FindReplace },
  { id: "remove-duplicate-lines", name: "Remove Duplicate Lines", component: RemoveDuplicateLines },
  { id: "remove-empty-lines", name: "Remove Empty Lines", component: RemoveEmptyLines },
  { id: "remove-extra-spaces", name: "Remove Extra Spaces", component: RemoveExtraSpaces },
  { id: "em-dash-replacer", name: "Em Dash Replacer", component: EmDashReplacer },
];
