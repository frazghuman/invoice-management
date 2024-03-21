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
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ItemFormComponent } from './item-form/item-form.component';
import { ShowMoreDirective } from '@common/directives/show-more.directive';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    InfiniteScrollModule,
    MenuModule,
    PageHeaderComponent,
    ConfirmDialogComponent,
    ItemFormComponent,
    ShowMoreDirective
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        height: '0px', // Start from 0 height
        overflowY: 'hidden'
      })),
      state('*', style({
        opacity: 1,
        height: '*', // Allow dynamic height
        overflowY: 'hidden'
      })),
      transition('void <=> *', animate('50ms ease-in-out')),
    ]),
  ]
})
export class ItemsComponent {
  private api = inject(ItemsService);

  public paginator$: Observable<ItemsPaginator>;

  public loading$ = new BehaviorSubject(true);
  private page$ = new BehaviorSubject(1);

  actionItems!: MenuItem[];
  sortOptions!: MenuItem[];

  showUpdateDialog: boolean = false;
  selectedItem: any;

  expandStockDetail: any = {};
  
  constructor() {
    this.paginator$ = this.loadItems$();
  }
  ngOnInit(): void {
    this.sortOptions = [
      { label: 'Name: A to Z', icon: 'pi pi-sort-alpha-down', command: () => this.sort('nameAsc') },
      { label: 'Name: Z to A', icon: 'pi pi-sort-alpha-up', command: () => this.sort('nameDesc') },
      { label: 'Stock: Low to High', icon: 'pi pi-sort-numeric-down', command: () => this.sort('stockAsc') },
      { label: 'Stock: High to Low', icon: 'pi pi-sort-numeric-up', command: () => this.sort('stockDesc') },
      { label: 'Price: Low to High', icon: 'pi pi-sort-amount-down', command: () => this.sort('priceAsc') },
      { label: 'Price: High to Low', icon: 'pi pi-sort-amount-up', command: () => this.sort('priceDesc') }
    ];
  }

  sort(criteria: string) {
    // Implement your sorting logic here based on the criteria
    console.log(`Sorting by ${criteria}`);
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

  generateMenuItems(event: MouseEvent, item: any, index: number) {
    event.preventDefault();
    event.stopPropagation();

    this.actionItems = [
      {
        label: 'Add Lot',
        icon: 'pi pi-plus',
        command: () => this.updateAction(event, item, index)
      },
      {
          label: 'Update',
          icon: 'pi pi-refresh',
          command: () => this.updateAction(event, item, index)
      },
      {
          label: 'Delete',
          icon: 'pi pi-times',
          command: () => this.deleteAction(event, item, index)
      }
    ]
  }

  updateAction(event: MouseEvent, item: any, index: number) {
    event.stopPropagation();
    event.preventDefault();

    this.expandStockDetail[index] = !this.expandStockDetail[index];

    this.showUpdateDialog = true;
    // Your update logic here
    console.log('Update action triggered'+index, item);
    this.selectedItem = item;
  }

  deleteAction(event: MouseEvent, item: any, index: number) {
    event.stopPropagation();
    event.preventDefault();

    this.expandStockDetail[index] = !this.expandStockDetail[index];

      // Your delete logic here
      console.log('Delete action triggered'+index, item);
  }

  onAddItem(event: any) {
    this.showUpdateDialog = true;
    this.selectedItem = null;
  }

  onSearchClick() {}

  dummyText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
}
