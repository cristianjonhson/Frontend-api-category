import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { PAGINATOR_CONFIG } from '../../../../shared/constants/pagination.constants';

@Component({
  selector: 'app-shared-paginator',
  templateUrl: './shared-paginator.component.html'
})
export class SharedPaginatorComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  @Input() pageSizeOptions: number[] = [...PAGINATOR_CONFIG.PAGE_SIZE_OPTIONS];
  @Input() showFirstLastButtons = PAGINATOR_CONFIG.SHOW_FIRST_LAST_BUTTONS;
  @Input() pageSize = PAGINATOR_CONFIG.DEFAULT_PAGE_SIZE;

  @Output() page = new EventEmitter<PageEvent>();

  onPageChange(event: PageEvent): void {
    this.page.emit(event);
  }
}
