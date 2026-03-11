import { Button, Input, Label } from "@codeexpander/dev-tools-ui";
import { Search } from "lucide-react";
import { useState } from 'react';
import { useI18n } from "../../context";
import USStatesDropdown from './USStatesDropdown';
import CitiesDropdown from './CitiesDropdown';

interface TimezoneSearchFormProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const TimezoneSearchForm = ({
  searchQuery,
  onSearchQueryChange,
  onSearch,
  isLoading
}: TimezoneSearchFormProps) => {
  const { t } = useI18n();
  const [selectedState, setSelectedState] = useState("");

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    onSearchQueryChange(state);
  };

  const handleCitySelect = (cityWithState: string) => {
    onSearchQueryChange(cityWithState);
  };

  return (
    <div className="space-y-4">
      <USStatesDropdown onStateSelect={handleStateSelect} isLoading={isLoading} />
      
      <CitiesDropdown 
        selectedState={selectedState}
        onCitySelect={handleCitySelect}
        isLoading={isLoading}
      />
      
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="location">{t("timezoneLookup.searchLabel")}</Label>
          <Input
            id="location"
            placeholder={t("timezoneLookup.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
        </div>
        <Button 
          onClick={onSearch} 
          disabled={!searchQuery.trim() || isLoading}
          className="mt-6"
        >
          <Search className="w-4 h-4 mr-2" />
          {isLoading ? t("timezoneLookup.searching") : t("timezoneLookup.search")}
        </Button>
      </div>
    </div>
  );
};

export default TimezoneSearchForm;
