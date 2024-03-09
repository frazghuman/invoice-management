import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject, Observable, scan, switchMap, tap } from 'rxjs';
import { MenuModule } from 'primeng/menu';

import * as _ from 'lodash';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';
import { ItemsService } from '@common/services/items/items.service';
import { ItemsPaginator } from '@common/interfaces/items.interface';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    InfiniteScrollModule,
    MenuModule,
    PageHeaderComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent {
  private api = inject(ItemsService);

  public paginator$: Observable<ItemsPaginator>;

  public loading$ = new BehaviorSubject(true);
  private page$ = new BehaviorSubject(1);

  actionItems!: MenuItem[];

  showUpdateDialog: boolean = false;
  selectedItem: any;
  
  constructor() {
    this.paginator$ = this.loadItems$();
  }
  ngOnInit(): void {
  }

  onHideUpdateDialog(flag: boolean) {
    this.showUpdateDialog = flag;
  }

  private loadItems$(): Observable<ItemsPaginator> {
    return this.page$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap((page) => this.api.getItems$(page)),
      scan(this.updatePaginator, {products: [], page: 0, hasMorePages: true} as ItemsPaginator),
      tap(() => this.loading$.next(false)),
    );
  }

  private updatePaginator(accumulator: ItemsPaginator, value: ItemsPaginator): ItemsPaginator {
    if (value.page === 1) {
      return value;
    }

    accumulator.products.push(...value.products);
    accumulator.page = value.page;
    accumulator.hasMorePages = value.hasMorePages;

    return accumulator;
  }

  public loadMoreItems(paginator: ItemsPaginator) {
    if (!paginator.hasMorePages) {
      return;
    }
    this.page$.next(paginator.page + 1);
  }

  generateMenuItems(item: any, index: number) {
    this.actionItems = [
      {
          label: 'Update',
          icon: 'pi pi-refresh',
          command: () => this.updateAction(item, index)
      },
      {
          label: 'Delete',
          icon: 'pi pi-times',
          command: () => this.deleteAction(item, index)
      }
    ]
  }

  updateAction(item: any, index: number) {
    this.showUpdateDialog = true;
    // Your update logic here
    console.log('Update action triggered'+index, item);
    this.selectedItem = item;
  }

  deleteAction(item: any, index: number) {
      // Your delete logic here
      console.log('Delete action triggered'+index, item);
  }

}
