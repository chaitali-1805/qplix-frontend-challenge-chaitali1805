import { ChangeDetectionStrategy, Component, EventEmitter, Input, type OnInit, Output, OnDestroy, ChangeDetectorRef } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { debounceTime, distinctUntilChanged, takeUntil, Subject, startWith } from 'rxjs'
import type { FilterBarConfig } from '../../models/filter-field-config'

@Component({
  selector: 'filter-bar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent<T = any> implements OnInit, OnDestroy {
  @Input() config!: FilterBarConfig<T>
  @Input() initialValues?: Partial<T>
  @Input() debounceTime: number = 300
  @Output() filterChange = new EventEmitter<Partial<T>>()

  filterForm!: FormGroup
  private destroy$ = new Subject<void>()
  private hasInitialized = false

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeForm()
    this.subscribeToFormChanges()
    this.hasInitialized = true
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private initializeForm(): void {
    const formControls: { [key: string]: any } = {}

    this.config.fields.forEach((field) => {
      let initialValue: any
      
      // Use provided initial values if available
      if (this.initialValues && this.initialValues.hasOwnProperty(field.key)) {
        initialValue = (this.initialValues as any)[field.key]
      } else {
        // Set default values based on field type
        switch (field.type) {
          case "multiselect":
            initialValue = []
            break
          case "boolean":
            initialValue = false
            break
          case "text":
          default:
            initialValue = ""
            break
        }
      }
      
      formControls[field.key as string] = [initialValue]
    })

    this.filterForm = this.fb.group(formControls)
  }

  private subscribeToFormChanges(): void {
    this.filterForm.valueChanges
      .pipe(
        startWith(this.filterForm.value),
        debounceTime(this.debounceTime),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        takeUntil(this.destroy$)
      )
      .subscribe((values) => {
        const filter = this.buildFilter(values)
        this.filterChange.emit(filter)
        this.cdr.markForCheck()
      })
  }

  private buildFilter(values: any): Partial<T> {
    const filter: any = {}
    
    Object.keys(values).forEach((key) => {
      const value = values[key]

      // Skip empty values
      if (value === null || value === undefined || value === "") {
        return
      }

      if (Array.isArray(value)) {
        if (value.length > 0) {
          filter[key] = value
        }
      } else {
        filter[key] = value
      }
    })

    return filter
  }

  resetFilters(): void {
    if (!this.filterForm) return

    this.config.fields.forEach((field) => {
      let resetValue: any
      
      // Use initial values if available, otherwise use defaults
      if (this.initialValues && this.initialValues.hasOwnProperty(field.key)) {
        resetValue = (this.initialValues as any)[field.key]
      } else {
        switch (field.type) {
          case "multiselect":
            resetValue = []
            break
          case "boolean":
            resetValue = false
            break
          case "text":
          default:
            resetValue = ""
            break
        }
      }
      
      this.filterForm.get(field.key as string)?.setValue(resetValue)
    })
  }

  // Public method to update filter values programmatically
  updateFilterValues(values: Partial<T>): void {
    if (!this.filterForm || !this.hasInitialized) return

    Object.keys(values).forEach((key) => {
      const val: any = (values as any)[key]
      // Allow setting daterange via composite object or via suffixed keys
      const field = this.config.fields.find(f => f.key === key)
      if (field?.type === 'daterange' && val && typeof val === 'object') {
        this.filterForm.get(`${key}_from`)?.setValue(val.from ?? null, { emitEvent: false })
        this.filterForm.get(`${key}_to`)?.setValue(val.to ?? null, { emitEvent: false })
        return
      }
      const control = this.filterForm.get(key)
      if (control) {
        control.setValue(val, { emitEvent: false })
      }
    })
    this.cdr.markForCheck()
  }

  // Get current filter values
  getCurrentFilter(): Partial<T> {
    if (!this.filterForm) return {}
    return this.buildFilter(this.filterForm.value)
  }

  // Check if any filters are active
  hasActiveFilters(): boolean {
    const currentFilter = this.getCurrentFilter()
    return Object.keys(currentFilter).length > 0
  }

  // Clear a specific field
  clearField(key: string): void {
    const control = this.filterForm.get(key)
    if (control) {
      const field = this.config.fields.find(f => f.key === key)
      const defaultValue = field?.type === 'multiselect' ? [] : field?.type === 'boolean' ? false : ''
      control.setValue(defaultValue)
    }
  }
}
