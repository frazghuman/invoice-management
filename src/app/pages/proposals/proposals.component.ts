import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, CreateEffectOptions, effect, inject, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { ProposalsPaginator } from '@common/interfaces/proposals.interface';
import { ProposalsService } from '@common/services/proposals/proposals.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { BehaviorSubject, debounceTime, Observable, scan, Subject, switchMap, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomCurrencyPipe } from '@common/pipes/custom-currency.pipe';
import { InputNumberModule } from 'primeng/inputnumber';
import { DataSharingService } from '@common/services/data-sharing/data-sharing.service';
import { CurrencyService } from '@common/services/currency/currency.service';

@Component({
  selector: 'app-proposal',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    InfiniteScrollModule,
    MenuModule,
    CalendarModule,
    DropdownModule,
    FormsModule,
    PageHeaderComponent,
    CustomCurrencyPipe,
    InputNumberModule
  ],
  templateUrl: './proposals.component.html',
  styleUrl: './proposals.component.scss'
})
export class ProposalsComponent implements OnInit {
  private api = inject(ProposalsService);
  private router = inject(Router);
  private dataSharingService = inject(DataSharingService);
  private currencyService = inject(CurrencyService);
  userSettings!: any;

  public paginator$!: Observable<ProposalsPaginator>;
  private searchSubject = new Subject<string>();

  public loading$ = new BehaviorSubject(true);
  private page$ = new BehaviorSubject(1);

  actionProposals!: MenuItem[];

  showUpdateDialog: boolean = false;
  selectedProposal: any;

  sortOptions!: MenuItem[];
  private params: any = {};

  options = [
    {label: 'Customer', value: 'customer'},
    {label: 'Issued Date', value: 'date'},
    {label: 'Due Date', value: 'dueDate'},
    {label: 'Amount', value: 'amountDue'}
    // Add more options as needed
  ];

  selectedOption: any = {label: 'Customer', value: 'customer'}; // Initially no option is selected

  searchValue: any;

  constructor() {
    this.paginator$ = this.loadProposals$();

    this.params['searchField'] = this.selectedOption.value;

    const options: CreateEffectOptions = {
      allowSignalWrites: true
    };
    // Use effect to react to signal changes
    effect(() => {
      this.userSettings = this.dataSharingService.userSettings();
    }, options);
  }

  ngOnInit() {
    this.sortOptions = [
      { label: 'Customer Name: A to Z', icon: 'pi pi-sort-alpha-down', command: () => this.sort('customerNameAsc') },
      { label: 'Customer Name: Z to A', icon: 'pi pi-sort-alpha-up', command: () => this.sort('customerNameDesc') },
      { label: 'Proposal: Old to New', icon: 'pi pi-sort-numeric-down', command: () => this.sort('ProposalNoAsc') },
      { label: 'Proposal: New to Old', icon: 'pi pi-sort-numeric-up', command: () => this.sort('ProposalNoDesc') },
      { label: 'Issued Date: Old to New', icon: 'pi pi-sort-amount-down', command: () => this.sort('issuedDateAsc') },
      { label: 'Issued Date: New to Old', icon: 'pi pi-sort-amount-up', command: () => this.sort('issuedDateDesc') },
      { label: 'Due Date: Old to New', icon: 'pi pi-sort-amount-down', command: () => this.sort('dueDateAsc') },
      { label: 'Due Date: New to Old', icon: 'pi pi-sort-amount-up', command: () => this.sort('dueDateDesc') },
      { label: 'Amount: Low to High', icon: 'pi pi-sort-amount-down', command: () => this.sort('amountAsc') },
      { label: 'Amount: High to Low', icon: 'pi pi-sort-amount-up', command: () => this.sort('amountDesc') }
    ];

    this.searchSubject.pipe(
      debounceTime(700)  // Wait for 300ms pause in events
    ).subscribe(searchText => {
      console.log('Search query:', searchText);
      this.params['search'] = searchText;

      console.log('searchParams', this.params);
      this.page$.next(1);
      window.scrollTo(0, 0); 
    });
  }

  onSearch(event: KeyboardEvent | null = null): void {
    if (this.selectedOption.value === 'amountDue' && !this.searchValue) {
      this.searchValue = '';
    }
    if (event && this.selectedOption.value === 'customer') {
      const inputElement = event.target as HTMLInputElement;
      this.searchSubject.next(inputElement.value.trim());  // Emit the trimmed value
    } if (event && this.selectedOption.value === 'amountDue') {
      this.searchSubject.next(this.searchValue);  // Emit the trimmed value
    } else {
      this.searchSubject.next(this.searchValue);  // Emit the trimmed value
    }
  }

  sort(criteria: string) {
    // Implement your sorting logic here based on the criteria
    console.log(`Sorting by ${criteria}`);
  }

  private loadProposals$(): Observable<ProposalsPaginator> {
    return this.page$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap((page) => this.api.getProposals$(this.params, page)),
      scan(this.updatePaginator, {proposals: [], page: 0, hasMorePages: true} as ProposalsPaginator),
      tap(() => this.loading$.next(false)),
    );
  }

  private updatePaginator(accumulator: ProposalsPaginator, value: ProposalsPaginator): ProposalsPaginator {
    if (value.page === 1) {
      return value;
    }

    accumulator.proposals.push(...value.proposals);
    accumulator.page = value.page;
    accumulator.hasMorePages = value.hasMorePages;

    return accumulator;
  }

  public loadMoreProposals(paginator: ProposalsPaginator) {
    if (!paginator.hasMorePages) {
      return;
    }
    this.page$.next(paginator.page + 1);
  }

  generateMenuProposals(event: MouseEvent, proposal: any, index: number) {
    event.preventDefault();
    event.stopPropagation();

    this.actionProposals = [
      {
          label: 'Update',
          icon: 'pi pi-refresh',
          command: () => this.updateAction(event, proposal, index)
      },
      {
          label: 'Delete',
          icon: 'pi pi-times',
          command: () => this.deleteAction(event, proposal, index)
      }
    ]
  }

  updateAction(event: MouseEvent, proposal: any, index: number) {
    event.stopPropagation();
    event.preventDefault();


    this.showUpdateDialog = true;
    // Your update logic here
    console.log('Update action triggered'+index, proposal);
    this.selectedProposal = proposal;
    this.navigateToEditProposal(proposal._id);
  }

  deleteAction(event: MouseEvent, proposal: any, index: number) {
    event.stopPropagation();
    event.preventDefault();


      // Your delete logic here
      console.log('Delete action triggered'+index, proposal);
  }

  onAddProposal(event: any) {
    this.showUpdateDialog = true;
    this.selectedProposal = null;
  }

  onSearchClick() {}

  onFilterChange(event: any) {
    this.searchValue = undefined;
    this.params['searchField'] = this.selectedOption.value;
  }

  onAddItem(event: any) {
    this.router.navigate(['proposal/create'])
  }

  navigateToProposal(proposalId: string | number): void {
    // Navigate to the proposal detail route with the given id
    this.router.navigate(['/proposal', proposalId]);
  }

  navigateToEditProposal(id: string): void {
    this.router.navigate([`/proposal/${id}/edit`]);
  }

  get currencySymbol() {
    if (this.userSettings?.currency) {
      return this.currencyService.getCurrencySymbol(this.userSettings.currency)
    }
    return '€';
  }

}
