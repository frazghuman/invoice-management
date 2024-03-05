import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './svg-icon.component.html',
  styleUrl: './svg-icon.component.scss'
})
export class SvgIconComponent {
  @Input() icon!: string;
}
