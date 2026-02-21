import { PageEvent } from '@angular/material/paginator';

export function createPageEvent(overrides: Partial<PageEvent> = {}): PageEvent {
  return {
    pageIndex: 0,
    pageSize: 10,
    length: 0,
    previousPageIndex: 0,
    ...overrides
  };
}
