export type FilterFieldType = "text" | "multiselect" | "boolean" | "number" | "date" | "daterange"

export interface FilterFieldOption {
  value: any
  label: string
  disabled?: boolean
}

export interface FilterFieldConfig<T = any> {
  key: string & keyof T
  label: string
  type: FilterFieldType
  options?: FilterFieldOption[]
  placeholder?: string
  tooltip?: string
  disabled?: boolean
  required?: boolean
  validation?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: RegExp
  }
  // For multiselect
  maxSelections?: number
  searchable?: boolean
  // For number fields
  step?: number
  // For date fields
  dateFormat?: string
  // Custom validation function
  customValidator?: (value: any) => boolean | string
}

export interface FilterBarConfig<T = any> {
  fields: FilterFieldConfig<T>[]
  // Global settings
  debounceTime?: number
  showResetButton?: boolean
  resetButtonText?: string
  // Layout settings
  columns?: number
  responsive?: boolean
  // Styling
  appearance?: 'outline' | 'fill' | 'standard'
  density?: 'compact' | 'comfortable' | 'default'
}
