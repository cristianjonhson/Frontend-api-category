import { Injectable } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {

  createDataSource<T>(initialData: T[] = []): MatTableDataSource<T> {
    return new MatTableDataSource<T>(initialData);
  }

  connect<T>(dataSource: MatTableDataSource<T>, paginator: MatPaginator): void {
    dataSource.paginator = paginator;
  }

  setData<T>(dataSource: MatTableDataSource<T>, data: T[], paginator?: MatPaginator): void {
    dataSource.data = data;

    if (paginator) {
      dataSource.paginator = paginator;
    }
  }

  resetToFirstPage<T>(paginator?: MatPaginator, dataSource?: MatTableDataSource<T>): void {
    if (paginator) {
      paginator.firstPage();
      return;
    }

    dataSource?.paginator?.firstPage();
  }

  applyFilter<T>(
    dataSource: MatTableDataSource<T>,
    filterValue: string,
    paginator?: MatPaginator,
    resetPage: boolean = true
  ): void {
    dataSource.filter = filterValue;

    if (resetPage) {
      if (paginator) {
        paginator.firstPage();
      } else if (dataSource.paginator) {
        dataSource.paginator.firstPage();
      }
    }
  }

  handlePageChange<T>(
    event: PageEvent,
    dataSource: MatTableDataSource<T>,
    paginator?: MatPaginator
  ): void {
    const targetPaginator = paginator ?? dataSource.paginator;

    if (!targetPaginator) {
      return;
    }

    targetPaginator.pageIndex = event.pageIndex;
    targetPaginator.pageSize = event.pageSize;
    dataSource.paginator = targetPaginator;
  }
}
