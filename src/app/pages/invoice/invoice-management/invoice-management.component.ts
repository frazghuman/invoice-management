import { CommonModule } from '@angular/common';
import { Component, CreateEffectOptions, effect, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { Invoice, InvoiceItem } from '@common/interfaces/invoices.interface';
import { CustomCurrencyPipe } from '@common/pipes/custom-currency.pipe';
import { DataSharingService } from '@common/services/data-sharing/data-sharing.service';
import { InvoicesService } from '@common/services/invoices/invoices.service';
import { ToastWrapperModule } from '@common/shared/toast.module';
import { serverUrl } from '@environment';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-invoice-management',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    RouterLink,
    RouterLinkActive,
    ToastWrapperModule,
    CustomCurrencyPipe
  ],
  templateUrl: './invoice-management.component.html',
  styleUrl: './invoice-management.component.scss'
})
export class InvoiceManagementComponent {
  private route = inject(ActivatedRoute);
  private api = inject(InvoicesService);
  private dataSharingService = inject(DataSharingService);
  private messageService: MessageService = inject(MessageService);
  private router = inject(Router);

  invoiceId: string | null = null;
  private paramsSubscription!: Subscription;
  invoice!: Invoice;
  userSettings: any;

  
  serverBaseUrl: any = serverUrl;

  constructor() {
    const options: CreateEffectOptions = {
      allowSignalWrites: true
    };
    // Use effect to react to signal changes
    effect(() => {
      this.userSettings = this.dataSharingService.userSettings();
    }, options);
  }

  ngOnInit(): void {
    // React to parameter changes
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.invoiceId = params['id'];
      if (typeof this.invoiceId === 'string') {
        this.getInvoiceById(this.invoiceId);
      }
    });
  }

  getInvoiceById(invoiceObjectId: string) {
    this.api.getInvoice$(invoiceObjectId).subscribe({
      next: (response) => {
        this.invoice = response;

        this.invoice.subTotal = this.calculateSubtotal(this.invoice.items);
      },
      error: (error) => {
        if (error?.status === 404) {
          this.router.navigate(['not-found']);
        } else {
          console.error('Update failed', error);
          this.handleError(error);
        }
      }
    })
  }

  calculateSubtotal(items: InvoiceItem[]): number {
    return items.reduce((subtotal, item) => {
      return subtotal + (item.price * item.quantity);
    }, 0);
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

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  get currencyCode() {
    return this.userSettings?.currency ?? 'EUR'; //€
  }

  completeUrl(imageUrl: string) {
    return !imageUrl ? '' : (imageUrl.indexOf('http') !== -1 ? '' : this.serverBaseUrl) + imageUrl;
  }

  printInvoice() {
    window.print();
  }

  onAddItem(event: any) {
    this.router.navigate(['invoice/create'])
  }

  navigateToEditInvoice(id: string): void {
    if (id) {
      this.router.navigate([`/invoice/${id}/edit`]);
    }
  }
}
