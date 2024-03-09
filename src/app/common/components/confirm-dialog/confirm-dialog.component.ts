import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  @Input() showDialog!:boolean;
  @Input() data!: any;

  @Output() hide = new EventEmitter<boolean>();
  constructor() {
    this.showDialog = false;
  }
  hideDialog() {
    this.showDialog = false;
    this.hide.emit(this.showDialog);
  }
}
