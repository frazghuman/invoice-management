import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  @Input() showDialog!:boolean;
  constructor() {
    this.showDialog = false;
  }
  hideDialog() {
    this.showDialog = false;
  }
}
