import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
} from '@angular/material/table';
import { SecurityService } from '../../services/security.service';
import { FilterableTableComponent } from '../filterable-table/filterable-table.component';
import type { FilterBarConfig } from '../../models/filter-field-config';
import type { SecuritiesFilter } from '../../models/securities-filter';
import { Security } from '../../models/security';
import { MatPaginatorModule, type PageEvent } from '@angular/material/paginator';
import { securitiesFilterConfig } from '../../config/securities-filter.config';

@Component({
  selector: 'securities-list',
  standalone: true,
  imports: [
    FilterableTableComponent,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatNoDataRow,
    MatRowDef,
    MatRow,
    MatPaginatorModule
  ],
  templateUrl: './securities-list.component.html',
  styleUrl: './securities-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecuritiesListComponent {
  protected displayedColumns: string[] = ['name', 'type', 'currency'];
  private _securityService = inject(SecurityService);
  
  protected loading = signal(false);
  protected securities = signal<Security[]>([]);
  protected totalItems = signal(0);
  protected currentFilter = signal<Partial<SecuritiesFilter>>({
    isPrivate: false
  });
  protected pageSize = signal(10);
  protected pageIndex = signal(0);
  protected filterConfig = signal<FilterBarConfig<SecuritiesFilter>>(securitiesFilterConfig);
  
  protected displayedSecurities = computed(() => this.securities());

  constructor() {
    // Initialize the component
    this.initializeComponent();
  }

  private initializeComponent(): void {
    // Load initial data
    this.loadData();
    
    // Initialize filter options
    this._securityService.getSecurities().subscribe(securities => {
      const types = [...new Set(securities.map(s => s.type))].sort();
      const currencies = [...new Set(securities.map(s => s.currency))].sort();

      const config = this.filterConfig();
      this.filterConfig.set({
        ...config,
        fields: config.fields.map(field => {
          if (field.key === 'types') {
            return { ...field, options: types.map(t => ({ value: t, label: t })) };
          }
          if (field.key === 'currencies') {
            return { ...field, options: currencies.map(c => ({ value: c, label: c })) };
          }
          return field;
        })
      });
    });
  }

  private loadData(): void {
    this.loading.set(true);

    const filter = this.currentFilter();
    const skip = this.pageIndex() * this.pageSize();
    const limit = this.pageSize();

    // First get filtered data for pagination
    this._securityService.getSecurities({
      ...filter,
      skip: undefined,
      limit: undefined
    }).subscribe({
      next: (allSecurities) => {
        this.totalItems.set(allSecurities.length);
        
        // Then get the current page data
        this._securityService.getSecurities({
          ...filter,
          skip,
          limit: skip + limit // Use absolute end position
        }).subscribe({
          next: (securities) => {
            this.securities.set(securities);
            this.loading.set(false);
          },
          error: () => this.loading.set(false)
        });
      },
      error: () => this.loading.set(false)
    });
  }

  onFilterChange(filter: Partial<SecuritiesFilter>): void {
    this.pageIndex.set(0);
    
    const cleanFilter: Partial<SecuritiesFilter> = {
      ...filter,
      types: filter.types?.length ? filter.types : undefined,
      currencies: filter.currencies?.length ? filter.currencies : undefined,
      name: filter.name || undefined,
      isPrivate: filter.isPrivate ?? false
    };
    
    this.currentFilter.set(cleanFilter);
    this.loadData();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
    this.loadData();
  }
}
