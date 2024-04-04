import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-invoice-management',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './invoice-management.component.html',
  styleUrl: './invoice-management.component.scss'
})
export class InvoiceManagementComponent {
  private route = inject(ActivatedRoute);
  invoiceId: string | null = null;
  private paramsSubscription!: Subscription;

  constructor() {}

  ngOnInit(): void {
    // React to parameter changes
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.invoiceId = params['id'];
    });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }
}
