import { Component } from '@angular/core';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';

@Component({
  selector: 'app-proposals',
  standalone: true,
  imports: [PageHeaderComponent],
  templateUrl: './proposals.component.html',
  styleUrl: './proposals.component.scss'
})
export class ProposalsComponent {

}
