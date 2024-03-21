import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  @Input() heading!: string;
  @Input() heading2!: string;
  @Input() buttonLabel!: string;
  @Input() showActionButton: boolean = true;

  @Output() searchClick = new EventEmitter<void>();
  @Output() addClick = new EventEmitter<void>();

  onSearchClick() {
    this.searchClick.emit();
  }

  onAddClick() {
    this.addClick.emit();
  }
}
