import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { CustomersService } from '@common/services/customers/customers.service';
import { MessageService } from 'primeng/api';
import { Customer } from '@common/interfaces/customers.interface';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmDialogComponent,
    CustomerFormComponent,
  ],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.scss'
})
export class AddCustomerComponent {
  private customerService = inject(CustomersService);
  private messageService: MessageService = inject(MessageService);

  public showCustomerDialog: boolean = false;

  @Output() customerAdded = new EventEmitter<Customer>();

  onToggleCustomerDialog(flag: boolean) {
    this.showCustomerDialog = flag;
  }

  onSubmit(formData: any) {
    this.createCustomer(formData);
    // this.loadCompanies$().subscribe(() => {})
  }

  createCustomer(data: any) {
    this.customerService.createCustomer$(data).subscribe({
      next: (response) => {
        this.showCustomerDialog = false;
        console.log('Created successful', response);
        this.customerAdded.emit(response);
      },
      error: (error) => {
        console.error('Update failed', error);
        this.handleError(error);
      }
    });
  }

  onCancel(event: boolean) {
    if (event) {
      this.showCustomerDialog = false;
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
}
