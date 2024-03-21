import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AddLotComponent } from '../add-lot/add-lot.component';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, AddLotComponent],
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.scss'
})
export class ItemFormComponent {
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
