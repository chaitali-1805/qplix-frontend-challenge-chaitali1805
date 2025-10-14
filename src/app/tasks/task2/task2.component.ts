import {Component, signal, TrackByFunction} from '@angular/core';
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';

interface Row {
  id: number;
  title: string;
}

function createRows(): Row[] {
  return Array.from({length: 50000}, (_, i) => i).map(i => ({id: i, title: `Item ${i}`}))
}

@Component({
  selector: 'app-task2',
  imports: [
    CdkVirtualScrollViewport,
    MatCheckbox,
    CdkVirtualForOf,
    CdkFixedSizeVirtualScroll,
    MatButton
  ],
  standalone: true,
  templateUrl: './task2.component.html',
  styleUrls: ['./task2.component.scss'],
})
export class Task2Component {
  rows = signal<Row[]>(createRows())

  trackBy: TrackByFunction<Row> | undefined = (index, item) => item.id

  // select all/deselect all using global flag with exception sets
  private allSelected = false
  private explicitlySelected = new Set<number>()
  private explicitlyDeselected = new Set<number>()

  recreateData() {
    // Recreate the same data set while preserving selection via id-based sets
    const newRows = createRows()
    this.rows.set(newRows)
  }

  selectAll() {
    this.allSelected = true
    this.explicitlySelected.clear()
    this.explicitlyDeselected.clear()
  }

  deselectAll() {
    this.allSelected = false
    this.explicitlySelected.clear()
    this.explicitlyDeselected.clear()
  }

  isRowChecked(id: number): boolean {
    if (this.allSelected) {
      return !this.explicitlyDeselected.has(id)
    }
    return this.explicitlySelected.has(id)
  }

  toggleRow(id: number, checked: boolean) {
    if (this.allSelected) {
      if (checked) {
        this.explicitlyDeselected.delete(id)
      } else {
        this.explicitlyDeselected.add(id)
      }
    } else {
      if (checked) {
        this.explicitlySelected.add(id)
      } else {
        this.explicitlySelected.delete(id)
      }
    }
  }
}
