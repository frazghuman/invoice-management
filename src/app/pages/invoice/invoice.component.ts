import { Component } from '@angular/core';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent {

}
