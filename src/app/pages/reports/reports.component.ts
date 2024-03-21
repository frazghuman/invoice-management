import { Component } from '@angular/core';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {

}
