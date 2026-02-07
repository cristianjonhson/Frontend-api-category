import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
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

  resetToFirstPage(paginator?: MatPaginator, dataSource?: MatTableDataSource<unknown>): void {
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
}
