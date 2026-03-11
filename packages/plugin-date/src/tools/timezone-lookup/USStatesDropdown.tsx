
import { useState } from "react";
import { Button, Label, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Popover, PopoverContent, PopoverTrigger, cn } from "@codeexpander/dev-tools-ui";
import { Check, ChevronDown, MapPin } from "lucide-react";
import { useI18n } from "../../context";

const US_STATES = [
  "Alabama",
  "Alaska", 
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming"
];

interface USStatesDropdownProps {
  onStateSelect: (state: string) => void;
  isLoading: boolean;
}

const USStatesDropdown = ({ onStateSelect, isLoading }: USStatesDropdownProps) => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [selectedState, setSelectedState] = useState("");

  const handleSelect = (state: string) => {
    setSelectedState(state);
    setOpen(false);
    onStateSelect(state);
  };

  return (
    <div>
      <Label>{t("timezoneLookup.quickSelectState")}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between mt-2"
            disabled={isLoading}
          >
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {selectedState ? selectedState : t("timezoneLookup.selectStatePlaceholder")}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={t("timezoneLookup.searchStatesPlaceholder")} />
            <CommandList>
              <CommandEmpty>{t("timezoneLookup.noStateFound")}</CommandEmpty>
              <CommandGroup>
                {US_STATES.map((state) => (
                  <CommandItem
                    key={state}
                    value={state}
                    onSelect={() => handleSelect(state)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedState === state ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {state}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default USStatesDropdown;
