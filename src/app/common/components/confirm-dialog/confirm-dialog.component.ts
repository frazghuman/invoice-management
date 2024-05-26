import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BackdropService } from '@common/services/signals/backdrop.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent implements OnChanges {
  backDropService = inject(BackdropService);
  @Input() showDialog!:boolean;
  @Input() allowHide:boolean = true;
  @Input() data!: any;
  @Input() title!: string;

  @Output() hide = new EventEmitter<boolean>();
  constructor() {
    this.showDialog = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['showDialog'] && !changes?.['showDialog'].firstChange) {
      this.backDropService.set('visible', !!changes?.['showDialog'].currentValue);
    }
  }

  hideDialog() {
    this.showDialog = false;
    this.hide.emit(this.showDialog);
  }
}
