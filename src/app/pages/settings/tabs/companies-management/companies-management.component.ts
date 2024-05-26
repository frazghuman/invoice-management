import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import fadeInOutAnimation from '@common/animations/fade-in-out.animation';
import { BaseComponent } from '@common/components/base/base.component';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';
import { ShowMoreDirective } from '@common/directives/show-more.directive';
import { CompaniesManagementPaginator } from '@common/interfaces/companies-management.interface';
import { AuthService } from '@common/services/auth/auth.service';
import { CompaniesManagementService } from '@common/services/companies-management/companies-management.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { BehaviorSubject, debounceTime, Observable, scan, Subject, switchMap, tap } from 'rxjs';
import { CompanyFormComponent } from './company-form/company-form.component';
import { ConfirmDialogWrapperModule } from '@common/shared/confirm-dialog.module';
import { serverUrl } from '@environment';
import { parseSortString } from '@common/funtions/parse-sort-string';
import { FormsModule } from '@angular/forms';
import { ToastWrapperModule } from '@common/shared/toast.module';

@Component({
  selector: 'app-companies-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MenuModule,
    InfiniteScrollModule,
    ConfirmDialogWrapperModule,
    ToastWrapperModule,
    ShowMoreDirective,
    BaseComponent, 
    ConfirmDialogComponent,
    CompanyFormComponent
  ],
  templateUrl: './companies-management.component.html',
  styleUrl: './companies-management.component.scss',
  animations: [fadeInOutAnimation]
})
export class CompaniesManagementComponent extends BaseComponent implements OnInit {
  private api = inject(CompaniesManagementService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);

  public paginator$: Observable<CompaniesManagementPaginator>;
  private searchSubject = new Subject<string>();

  public loading$ = new BehaviorSubject(true);
  private page$ = new BehaviorSubject(1);
  private params: any = {};

  actionItems!: MenuItem[];
  sortOptions!: MenuItem[];
  sortOrder: string = 'nameAsc';
  
  selectedSortOrderIcon: string = this.iconOfSelectedSortOrder;
  selectedSortOrderLabel: string = this.labelBySelectedSortOrder;

  showUpdateDialog: boolean = false;
  selectedCompany: any;

  expandCompanyDetail: any = {};

  serverBaseUrl = serverUrl;

  constructor(protected override authService: AuthService) {
    super(authService);

    this.paginator$ = this.loadCompanies$();
  }
  ngOnInit() {
    this.paginator$.subscribe((resp: any) => {
      console.log(resp);
    })

    this.sortOptions = [
      { label: 'Name: A to Z', icon: 'pi pi-sort-alpha-down', command: () => this.sort('nameAsc') },
      { label: 'Name: Z to A', icon: 'pi pi-sort-alpha-up', command: () => this.sort('nameDesc') }
    ];

    this.searchSubject.pipe(
      debounceTime(300)  // Wait for 300ms pause in events
    ).subscribe(searchText => {
      console.log('Search query:', searchText);
      this.params['search'] = searchText;
      this.page$.next(1);
      window.scrollTo(0, 0); 
    });
  }

  onSearch(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchSubject.next(inputElement.value.trim());  // Emit the trimmed value
  }

  sort(criteria: string) {
    // Implement your sorting logic here based on the criteria
    console.log(`Sorting by ${criteria}`);
    this.sortOrder = criteria;
    this.selectedSortOrderIcon = this.iconOfSelectedSortOrder;
    this.selectedSortOrderLabel = this.labelBySelectedSortOrder;

    const sortParams = parseSortString(this.sortOrder);
    this.params['orderBy'] = sortParams.orderBy;
    this.params['sortOrder'] = sortParams.sortOrder;
    this.page$.next(1);
    window.scrollTo(0, 0); 
  }

  get iconOfSelectedSortOrder() {
    let icon = 'sort'
    switch (this.sortOrder) {
      case 'nameAsc':
        icon = 'pi pi-sort-alpha-down';
      break;
      case 'nameDesc':
        icon = 'pi pi-sort-alpha-up';
      break;
    
      default:
        icon = 'pi pi-sort-alpha-down'
        break;
    }

    return icon;
  }

  get labelBySelectedSortOrder() {
    let label = 'Name: A to Z'
    switch (this.sortOrder) {
      case 'nameAsc':
        label = 'Name: A to Z';
      break;
      case 'nameDesc':
        label = 'Name: Z to A';
      break;
    
      default:
        label = 'Name: A to Z'
        break;
    }

    return label;
  }

  

  onHideUpdateDialog(flag: boolean) {
    this.showUpdateDialog = flag;
    this.selectedCompany = null;
  }

  createAction() {
    this.showUpdateDialog = true;
  }

  updateAction(company: any, index: number) {
    this.selectedCompany = company;
    this.showUpdateDialog = true;
    // Your update logic here
    console.log('Update action triggered'+index, company);
  }

  deleteAction(company: any, index: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this company?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
          if (company._id) {
            console.log('Accepted');
            this.deleteCompany(company._id);
          }
      },
      reject: () => {
          console.log('Rejected');
      },
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'mr-4 mt-3 inline-flex w-full justify-center rounded-md text-white px-3 py-2 text-sm font-semibold bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-900 sm:mt-0 sm:w-auto',
      acceptButtonStyleClass: 'mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-800 hover:text-gray-50 sm:mt-0 sm:w-auto'
    });
  }

  onSubmit(formData: any) {
    console.log(formData);
    if (this.selectedCompany && this.selectedCompany._id) {
      this.updateCompany(this.selectedCompany._id, formData);
    } else {
      this.createCompany(formData);
    }
    // this.loadCompanies$().subscribe(() => {})
  }

  onCancel(event: boolean) {
    if (event) {
      this.showUpdateDialog = false;
      this.selectedCompany = null;
    }
  }

  private loadCompanies$(): Observable<CompaniesManagementPaginator> {
    return this.page$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap((page) => this.api.getCompaniesManagement$(this.params, page)),
      scan(this.updatePaginator, {companies: [], page: 0, hasMorePages: true} as CompaniesManagementPaginator),
      tap(() => this.loading$.next(false)),
    );
  }

  private updatePaginator(accumulator: CompaniesManagementPaginator, value: CompaniesManagementPaginator): CompaniesManagementPaginator {
    if (value.page === 1) {
      return value;
    }

    accumulator.companies.push(...value.companies);
    accumulator.page = value.page;
    accumulator.hasMorePages = value.hasMorePages;

    return accumulator;
  }

  public loadMoreCompanies(paginator: CompaniesManagementPaginator) {
    if (!paginator.hasMorePages) {
      return;
    }
    this.page$.next(paginator.page + 1);
  }

  generateMenuItems(event: MouseEvent, company: any, index: number) {
    event.stopPropagation();
    event.preventDefault();
    
    this.actionItems = [
      {
          label: 'Update',
          icon: 'pi pi-refresh',
          command: () => this.updateAction(company, index)
      },
      {
          label: 'Delete',
          icon: 'pi pi-times',
          command: () => this.deleteAction(company, index)
      }
    ]
  }

  onAddCompany(event: any) {
    console.log(event)
    this.showUpdateDialog = true;
  }

  updateCompany(companyId: string, data: any) {
    this.api.updateCompany$(companyId, data).subscribe({
      next: (response) => {
        this.showUpdateDialog = false;
        this.selectedCompany = null;
        console.log('Update successful', response);
        this.page$.next(1);
        window.scrollTo(0, 0); 
      },
      error: (error) => {
        console.error('Update failed', error);
        this.handleError(error);
      }
    });
  }

  createCompany(data: any) {
    this.api.createCompany$(data).subscribe({
      next: (response) => {
        this.showUpdateDialog = false;
        this.selectedCompany = null;
        console.log('Update successful', response);
        this.page$.next(1);
        window.scrollTo(0, 0); 
      },
      error: (error) => {
        console.error('Update failed', error);
        this.handleError(error);
      }
    });
  }

  deleteCompany(companyId: string) {
    this.api.deleteCompany$(companyId).subscribe({
      next: (response) => {
        console.log('Deletion successful', response);
        this.page$.next(1);
        window.scrollTo(0, 0); 
      },
      error: (error) => {
        console.error('Deletion failed', error)
        this.handleError(error);
      }
    });
  }

  completeUrl(imageUrl: string) {
    return !imageUrl ? '' : (imageUrl.indexOf('http') !== -1 ? '' : this.serverBaseUrl) + imageUrl;
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

}
