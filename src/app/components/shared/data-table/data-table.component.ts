import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  template?: TemplateRef<any>;
}

export interface PaginationConfig {
  currentPage: number;
  totalPages?: number;
  showPages?: number[];
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {
  @Input() title: string = '';
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() loading: boolean = false;
  @Input() isReloading: boolean = false;
  @Input() pagination?: PaginationConfig;
  @Input() showReloadButton: boolean = true;
  @Input() emptyMessage: string = 'No data found.';

  @Output() reload = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();

  onReload() {
    this.reload.emit();
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }
}
