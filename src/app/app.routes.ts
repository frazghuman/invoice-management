import { Routes } from '@angular/router';
import { LoginLayoutComponent } from '@common/components/layout/login-layout/login-layout.component';
import { MainLayoutComponent } from '@common/components/layout/main-layout/main-layout.component';
import { BillComponent } from '@pages/bill/bill.component';
import { ContactUsComponent } from '@pages/contact-us/contact-us.component';
import { CustomersComponent } from '@pages/customers/customers.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { InvoiceCreateComponent } from '@pages/invoice/invoice-create/invoice-create.component';
import { InvoiceManagementComponent } from '@pages/invoice/invoice-management/invoice-management.component';
import { InvoiceComponent } from '@pages/invoice/invoice.component';
import { ItemsComponent } from '@pages/items/items.component';
import { LoginComponent } from '@pages/login/login.component';
import { ProposalsComponent } from '@pages/proposals/proposals.component';
import { ReportsComponent } from '@pages/reports/reports.component';
import { SettingsComponent } from '@pages/settings/settings.component';

export const routes: Routes = [
    {
      path: '',
      component: MainLayoutComponent,
      children: [
        { path: 'dashboard', component: DashboardComponent },
        { path: 'invoice', component: InvoiceComponent },
        { path: 'invoice/create', component: InvoiceCreateComponent},
        { path: 'invoice/:id', component: InvoiceManagementComponent},
        { path: 'proposals', component: ProposalsComponent },
        { path: 'bill', component: BillComponent },
        { path: 'customers', component: CustomersComponent },
        { path: 'items', component: ItemsComponent },
        { path: 'reports', component: ReportsComponent },
        { path: 'settings', component: SettingsComponent },
        { path: 'contact-us', component: ContactUsComponent },
        { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      ],
    },
    {
      path: '',
      component: LoginLayoutComponent,
      children: [
        { path: 'login', component: LoginComponent },
      ],
    },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Redirect to `dashboard` as the default route
    { path: '**', redirectTo: '/dashboard' }, // Wildcard route for a 404 page, redirecting to dashboard
  ];
