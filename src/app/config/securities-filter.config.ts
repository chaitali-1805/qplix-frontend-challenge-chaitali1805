import { FilterBarConfig } from '../models/filter-field-config';

export const securitiesFilterConfig: FilterBarConfig = {
  fields: [
      {
        key: "name",
        label: "Security Name",
        type: "text",
        placeholder: "Enter security name",
        tooltip: "Filter by security name (partial match)",
        validation: {
          minLength: 2,
          maxLength: 100
        }
      },
      {
        key: "types",
        label: "Asset Types",
        type: "multiselect",
        placeholder: "Select asset types",
        tooltip: "Filter by one or more asset types",
        searchable: true,
        maxSelections: 5,
        options: [],
      },
      {
        key: "currencies",
        label: "Currencies",
        type: "multiselect",
        placeholder: "Select currencies",
        tooltip: "Filter by currency types",
        maxSelections: 3,
        options: [],
      },
      {
        key: "isPrivate",
        label: "Private Securities Only",
        type: "boolean",
        tooltip: "Show only private securities"
      },
    ],
  debounceTime: 300,
  showResetButton: true,
  resetButtonText: "Clear Filters",
  appearance: 'outline'
};