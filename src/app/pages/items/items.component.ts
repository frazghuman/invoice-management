import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BehaviorSubject, Observable, scan, switchMap, tap } from 'rxjs';
import { MenuModule } from 'primeng/menu';

import * as _ from 'lodash';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';
import { ItemsService } from '@common/services/items/items.service';
import { Item, ItemsPaginator } from '@common/interfaces/items.interface';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ItemFormComponent } from './item-form/item-form.component';
import { ShowMoreDirective } from '@common/directives/show-more.directive';
import fadeInOutAnimation from '@common/animations/fade-in-out.animation';
import { serverUrl } from 'src/environment';
import { ConfirmDialogWrapperModule } from '@common/shared/confirm-dialog.module';
import { ToastWrapperModule } from '@common/shared/toast.module';
import { SalePriceAdjustmentFormComponent } from './sale-price-adjustment-form/sale-price-adjustment-form.component';
import { ReceiveStockFormComponent } from './receive-stock-form/receive-stock-form.component';
import { InventoryService } from '@common/services/inventory/inventory.service';
import { CustomCurrencyPipe } from '@common/pipes/custom-currency.pipe';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    InfiniteScrollModule,
    MenuModule,
    ConfirmDialogWrapperModule,
    ToastWrapperModule,
    PageHeaderComponent,
    ConfirmDialogComponent,
    ItemFormComponent,
    SalePriceAdjustmentFormComponent,
    ReceiveStockFormComponent,
    ShowMoreDirective,
    CustomCurrencyPipe
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss',
  animations: [
    fadeInOutAnimation,
  ]
})
export class ItemsComponent {
  private api = inject(ItemsService);
  private inventoryService = inject(InventoryService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);

  public paginator$: Observable<ItemsPaginator>;

  public loading$ = new BehaviorSubject(true);
  private page$ = new BehaviorSubject(1);

  serverBaseUrl = serverUrl;

  actionItems!: MenuItem[];
  sortOptions!: MenuItem[];

  showItemUpdateDialog: boolean = false;
  selectedItem: any;

  expandStockDetail: any = {};

  showItemPriceUpdateDialog: boolean = false;
  showStockReceivingDialog: boolean = false;
  selectedStockLot!: any;
  selectedItemId!: string | null;
  
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
    this.showItemUpdateDialog = flag;
    this.showItemPriceUpdateDialog = flag;
    this.showStockReceivingDialog = flag;
  }

  private loadItems$(): Observable<ItemsPaginator> {
    return this.page$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap((page) => this.api.getItems$(page)),
      scan(this.updatePaginator, {items: [], page: 0, hasMorePages: true} as ItemsPaginator),
      tap(() => this.loading$.next(false)),
    );
  }

  private updatePaginator(accumulator: ItemsPaginator, value: ItemsPaginator): ItemsPaginator {
    if (value.page === 1) {
      return value;
    }

    accumulator.items.push(...value.items);
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
        label: 'Update Price',
        icon: 'pi pi-refresh',
        command: () => this.updateItemPriceAction(event, item, index)
      },
      {
        label: 'Receive Stock',
        icon: 'pi pi-plus',
        command: () => this.receiveStockAction(event, item, index)
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

    this.showItemUpdateDialog = true;
    // Your update logic here
    console.log('Update action triggered'+index, item);
    this.selectedItem = item;
  }

  receiveStockAction(event: MouseEvent, item: any, index: number) {
    event.stopPropagation();
    event.preventDefault();

    this.showStockReceivingDialog = true;
    // Your update logic here
    console.log('Update action triggered'+index, item);
    this.selectedItem = item;
    this.selectedItemId = this.selectedItem._id;

    this.selectedStockLot = null;
  }

  updateItemPriceAction(event: MouseEvent, item: any, index: number) {
    event.stopPropagation();
    event.preventDefault();

    this.showItemPriceUpdateDialog = true;
    // Your update logic here
    console.log('Update action triggered'+index, item);
    this.selectedItem = item;
  }

  deleteAction(event: MouseEvent, item: any, index: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this item?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
          if (item._id) {
            console.log('Accepted');
            this.deleteItem(item._id);
          }
      },
      reject: () => {
          console.log('Rejected');
      },
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'mr-4 mt-3 inline-flex w-full justify-center rounded-md text-white px-3 py-2 text-sm font-semibold bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-900 sm:mt-0 sm:w-auto',
      acceptButtonStyleClass: 'mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-800 hover:text-gray-50 sm:mt-0 sm:w-auto'
    });
  }

  onAddItem(event: any) {
    this.showItemUpdateDialog = true;
    this.selectedItem = null;
  }

  onSearchClick() {}

  onItemSubmit(formData: any) {
    console.log(formData);
    if (this.selectedItem && this.selectedItem._id) {
      this.updateItem(this.selectedItem._id, formData);
    } else {
      this.createItem(formData);
    }
  }
  onItemCancel(event: any) {
    if (event) {
      this.showItemUpdateDialog = false;
      this.selectedItem = null;
    }
  }

  updateItem(itemId: string, data: any) {
    this.api.updateItem$(itemId, data).subscribe({
      next: (response) => {
        this.showItemUpdateDialog = false;
        this.selectedItem = null;
        console.log('Update successful', response);
        this.page$.next(1);
        window.scrollTo(0, 0); 
      },
      error: (error) => {
        console.error('Update failed', error);
        this.handleError(error);
      }
    });
  }

  createItem(data: any) {
    this.api.createItem$(data).subscribe({
      next: (response) => {
        this.showItemUpdateDialog = false;
        this.selectedItem = null;
        console.log('Update successful', response);
        this.page$.next(1);
        window.scrollTo(0, 0); 
      },
      error: (error) => {
        console.error('Update failed', error);
        this.handleError(error);
      }
    });
  }

  deleteItem(itemId: string) {
    this.api.deleteItem$(itemId).subscribe({
      next: (response) => {
        console.log('Deletion successful', response);
        this.page$.next(1);
        window.scrollTo(0, 0); 
      },
      error: (error) => {
        console.error('Deletion failed', error)
        this.handleError(error);
      }
    });
  }

  
  
  onItemPriceSubmit(formData: any) {
    console.log(formData);
    if (this.selectedItem && this.selectedItem._id) {
      this.addItemPrice(this.selectedItem._id, formData);
    }
  }

  addItemPrice(itemId: string, data: any) {
    this.api.addItemPrice$(itemId, data).subscribe({
      next: (response) => {
        this.showItemPriceUpdateDialog = false;
        this.selectedItem = null;
        console.log('Update successful', response);
        this.page$.next(1);
        window.scrollTo(0, 0); 
      },
      error: (error) => {
        console.error('Update failed', error);
        this.handleError(error);
      }
    });
  }

  onItemPriceCancel(event: any) {
    if (event) {
      this.showItemPriceUpdateDialog = false;
      this.selectedItem = null;
    }
  }

  onStockReceiveSubmit(formData: any) {
    console.log(formData);
    if (this.selectedItem && this.selectedItem._id) {
      if (this.selectedStockLot && this.selectedStockLot._id) {
        this.updateStock({...formData}, this.selectedStockLot._id);
      } else {
        this.receiveStock({...formData});
      }
    }
  }

  receiveStock(data: any) {
    this.inventoryService.receiveInventory$(data).subscribe({
      next: (response) => {
        this.showStockReceivingDialog = false;
        this.selectedItem.totalAvailableStock += response.totalStock;
        this.selectedItem.inventoryCount += 1;

        if (this.selectedItem?.inventories?.length) {
          this.selectedItem.inventories.push(response);
        } else {
          this.selectedItem.inventories = [response];
        }

        this.selectedItem = null;
        console.log('Update successful', response);
        // this.page$.next(1);
        // window.scrollTo(0, 0); 
      },
      error: (error) => {
        console.error('Update failed', error);
        this.handleError(error);
      }
    });
  }

  updateReceivedStockAction(event: MouseEvent, item: any, receivedStockLot: any) {
    event.stopPropagation();
    event.preventDefault();

    this.showStockReceivingDialog = true;
    // Your update logic here
    console.log('Update action triggered', item);
    this.selectedItem = item;
    this.selectedStockLot = receivedStockLot;
    this.selectedItemId = null;
  }

  updateStock(data: any, inventoryId: string) {
    this.inventoryService.updateInventory$(data, inventoryId).subscribe({
      next: (response) => {
        this.showStockReceivingDialog = false;
        this.selectedItem.totalAvailableStock += response.totalStock;
        this.selectedItem.totalAvailableStock -= (this.selectedStockLot?.totalStock - this.selectedStockLot?.soldOutStock);

        this.selectedStockLot.createdAt = response.createdAt;
        this.selectedStockLot.deleted = response.deleted;
        this.selectedStockLot.description = '';
        setTimeout(() => {
          this.selectedStockLot.description = response.description;
          this.selectedStockLot = null;
        }, 0)
        this.selectedStockLot.inUse = response.inUse;
        this.selectedStockLot.item = response.item;
        this.selectedStockLot.lotNo = response.lotNo;
        this.selectedStockLot.purchasePrice = response.purchasePrice;
        this.selectedStockLot.soldOutStock = response.soldOutStock;
        this.selectedStockLot.stockReceivedDate = response.stockReceivedDate;
        this.selectedStockLot.totalStock = response.totalStock;
        this.selectedStockLot.updatedAt = response.updatedAt;

        this.selectedItem = null;
        this.selectedItemId = null;
        console.log('Update successful', response);
        // this.page$.next(1);
        // window.scrollTo(0, 0); 
      },
      error: (error) => {
        console.error('Update failed', error);
        this.handleError(error);
      }
    });
  }

  deleteInventoryStockAction(event: MouseEvent, item: any, inventoryItem: any) {
    event.stopPropagation();
    event.preventDefault();
    this.selectedItem = item;

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this inventory stock?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
          if (inventoryItem._id) {
            console.log('Accepted');
            this.deleteInventoryStock(inventoryItem._id);
          }
      },
      reject: () => {
          console.log('Rejected');
      },
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'mr-4 mt-3 inline-flex w-full justify-center rounded-md text-white px-3 py-2 text-sm font-semibold bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-900 sm:mt-0 sm:w-auto',
      acceptButtonStyleClass: 'mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-800 hover:text-gray-50 sm:mt-0 sm:w-auto'
    });
  }

  deleteInventoryStock(inventoryId: string) {
    this.inventoryService.deleteInventory$(inventoryId).subscribe({
      next: (response) => {
        console.log('Deletion successful', response);
        this.selectedItem.totalAvailableStock -= response.totalStock - response.soldOutStock;
        this.selectedItem.inventoryCount -= 1;

        if (this.selectedItem?._id) {
          this.fetchInventoriesByItemId(this.selectedItem._id, this.selectedItem);
        }
      },
      error: (error) => {
        console.error('Deletion failed', error)
        this.handleError(error);
      }
    });
  }

  fetchInventoriesByItemIdOnExpand(itemId: string, item: Item, index: number = -1) {
    if(!this.expandStockDetail[index] && Number(item.inventoryCount) > 0) {
      this.inventoryService.inventoriesByItemId$(itemId).subscribe({
        next: (response) => {
          console.log('Update successful', response);
          this.expandStockDetail[index] = !this.expandStockDetail[index];
          item.inventories = response;
          // item.totalAvailableStock = this.sumAvailableStock(item.inventories ?? [])
          
          // this.page$.next(1);
          // window.scrollTo(0, 0); 
        },
        error: (error) => {
          console.error('Update failed', error);
          this.handleError(error);
        }
      });
    } else {
      this.expandStockDetail[index] = !this.expandStockDetail[index];
    }
  }

  fetchInventoriesByItemId(itemId: string, item: Item) {
    this.inventoryService.inventoriesByItemId$(itemId).subscribe({
      next: (response) => {
        console.log('Update successful', response);
        item.inventories = response;

        this.selectedItem = null;
        // item.totalAvailableStock = this.sumAvailableStock(item.inventories ?? [])
        
        // this.page$.next(1);
        // window.scrollTo(0, 0); 
      },
      error: (error) => {
        console.error('Update failed', error);
        this.handleError(error);
      }
    });
  }

  sumAvailableStock(inventories: any[]): number {
    return inventories.reduce((sum, inventory) => {
      const availableStock = inventory.totalStock - (inventory.soldOutStock ?? 0);
      return sum + availableStock;
    }, 0);
  }

  onStockReceiveCancel(event: any) {
    if (event) {
      this.showStockReceivingDialog = false;
      this.selectedStockLot = null;
    }
  }

  showError(summary:string, detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail
    });
  }

  handleError(errorResp: any) {
    if (errorResp?.error?.message) {
      const { error, message } = errorResp?.error?.message;
      if (error && message) {
        this.showError(error, message);
      }
    }
  }

  completeUrl(imageUrl: string) {
    return !imageUrl ? '' : (imageUrl.indexOf('http') !== -1 ? '' : this.serverBaseUrl) + imageUrl;
  }

}
