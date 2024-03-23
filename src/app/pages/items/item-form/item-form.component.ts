import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AddLotComponent } from '../add-lot/add-lot.component';
import { BackdropService, BackdropState } from '@common/services/signals/backdrop.service';

@Component({
  selector: 'app-item-form',
  standalone: true,
  imports: [CommonModule, AddLotComponent],
  templateUrl: './item-form.component.html',
  styleUrl: './item-form.component.scss'
})
export class ItemFormComponent {
  backDropService = inject(BackdropService);
  // backdropVisible = this.backDropService.select('visible');
  @Input() showDialog!:boolean;
  @Input() data!: any;

  @Output() hide = new EventEmitter<boolean>();
  constructor() {
    this.showDialog = false;
    // 👇 Updating partial or whole state
    this.backDropService.setState({ visible: this.showDialog  } as BackdropState);
  }
  hideDialog() {
    this.showDialog = false;
    // 👇 Updating a slice of the state
    this.backDropService.set('visible', this.showDialog);
    this.hide.emit(this.showDialog);
  }
}
