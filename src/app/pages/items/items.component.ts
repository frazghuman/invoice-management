import { Component } from '@angular/core';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent {

}
