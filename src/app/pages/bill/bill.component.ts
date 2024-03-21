import { Component } from '@angular/core';
import {ButtonModule} from 'primeng/button';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-bill',
  standalone: true,
  imports: [PageHeaderComponent, ConfirmDialogComponent, ButtonModule, MenuModule],
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.scss'
})
export class BillComponent {
items: MenuItem[] = [
  {
      label: 'Update',
      icon: 'pi pi-refresh',
      command: (event) => this.updateAction()
  },
  {
      label: 'Delete',
      icon: 'pi pi-times',
      command: (event) => this.deleteAction()
  }
];

updateAction() {
  // Your update logic here
  console.log('Update action triggered');
}

deleteAction() {
    // Your delete logic here
    console.log('Delete action triggered');
}
}
