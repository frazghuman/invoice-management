import { CommonModule } from '@angular/common';
import { Component, CreateEffectOptions, effect, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { Proposal, ProposalItem } from '@common/interfaces/proposals.interface';
import { CustomCurrencyPipe } from '@common/pipes/custom-currency.pipe';
import { DataSharingService } from '@common/services/data-sharing/data-sharing.service';
import { ProposalsService } from '@common/services/proposals/proposals.service';
import { ToastWrapperModule } from '@common/shared/toast.module';
import { serverUrl } from '@environment';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-proposal-management',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    RouterLink,
    RouterLinkActive,
    ToastWrapperModule,
    CustomCurrencyPipe
  ],
  templateUrl: './proposal-management.component.html',
  styleUrl: './proposal-management.component.scss'
})
export class ProposalManagementComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ProposalsService);
  private dataSharingService = inject(DataSharingService);
  private messageService: MessageService = inject(MessageService);
  private router = inject(Router);

  proposalId: string | null = null;
  private paramsSubscription!: Subscription;
  proposal!: Proposal;
  userSettings: any;

  
  serverBaseUrl: any = serverUrl;

  constructor() {
    const options: CreateEffectOptions = {
      allowSignalWrites: true
    };
    // Use effect to react to signal changes
    effect(() => {
      this.userSettings = this.dataSharingService.userSettings();
    }, options);
  }

  ngOnInit(): void {
    // React to parameter changes
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.proposalId = params['id'];
      if (typeof this.proposalId === 'string') {
        this.getProposalById(this.proposalId);
      }
    });
  }

  getProposalById(proposalObjectId: string) {
    this.api.getProposal$(proposalObjectId).subscribe({
      next: (response) => {
        this.proposal = response;

        this.proposal.subTotal = this.calculateSubtotal(this.proposal.items);
      },
      error: (error) => {
        if (error?.status === 404) {
          this.router.navigate(['not-found'])
        } else {
          console.error('Update failed', error);
          this.handleError(error);
        }
      }
    })
  }

  calculateSubtotal(items: ProposalItem[]): number {
    return items.reduce((subtotal, item) => {
      return subtotal + (item.price * item.quantity);
    }, 0);
  }

  showError(summary:string, detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail
    });
  }

  handleError(errorResp: any) {
    if (errorResp?.error?.message) {
      const { error, message } = errorResp?.error?.message;
      if (error && message) {
        this.showError(error, message);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  get currencyCode() {
    return this.userSettings?.currency ?? 'EUR'; //€
  }

  completeUrl(imageUrl: string) {
    return !imageUrl ? '' : (imageUrl.indexOf('http') !== -1 ? '' : this.serverBaseUrl) + imageUrl;
  }

  printProposal() {
    window.print();
  }

  onAddItem(event: any) {
    this.router.navigate(['proposal/create'])
  }

  navigateToEditProposal(id: string): void {
    if (id) {
      this.router.navigate([`/proposal/${id}/edit`]);
    }
  }
}
