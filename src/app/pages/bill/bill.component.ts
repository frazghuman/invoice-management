import { Component } from '@angular/core';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';

@Component({
  selector: 'app-bill',
  standalone: true,
  imports: [PageHeaderComponent, ConfirmDialogComponent],
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.scss'
})
export class BillComponent {

}
