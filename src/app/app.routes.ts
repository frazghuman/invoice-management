import { Routes } from '@angular/router';
import { LoginLayoutComponent } from '@common/components/layout/login-layout/login-layout.component';
import { MainLayoutComponent } from '@common/components/layout/main-layout/main-layout.component';
import { AuthGuard } from '@common/guards/auth.guard';
import { BillComponent } from '@pages/bill/bill.component';
import { ContactUsComponent } from '@pages/contact-us/contact-us.component';
import { CustomersComponent } from '@pages/customers/customers.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { InvoiceCreateComponent } from '@pages/invoice/invoice-create/invoice-create.component';
import { InvoiceManagementComponent } from '@pages/invoice/invoice-management/invoice-management.component';
import { InvoiceComponent } from '@pages/invoice/invoice.component';
import { ItemsComponent } from '@pages/items/items.component';
import { LoginComponent } from '@pages/auth/login/login.component';
import { ProposalsComponent } from '@pages/proposals/proposals.component';
import { ReportsComponent } from '@pages/reports/reports.component';
import { SettingsComponent } from '@pages/settings/settings.component';

export const routes: Routes = [
    {
      path: '',
      component: MainLayoutComponent,
      children: [
        { 
          path: '', component: DashboardComponent,
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'invoice', component: InvoiceComponent,
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'invoice/create', component: InvoiceCreateComponent,
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'invoice/:id', component: InvoiceManagementComponent,
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'proposals', component: ProposalsComponent,
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'bill', component: BillComponent,
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'customers', component: CustomersComponent,
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'items', component: ItemsComponent,
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'reports', component: ReportsComponent,
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'settings', component: SettingsComponent,
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'contact-us', component: ContactUsComponent,
          canActivate: [AuthGuard] // Requires authentication
        },
        // { 
        //   path: '', redirectTo: '/dashboard', pathMatch: 'full',
        //   canActivate: [AuthGuard] // Requires authentication
        // },
      ],
    },
    {
      path: 'auth',
      component: LoginLayoutComponent,
      children: [
        { path: 'sign-in', component: LoginComponent },
      ],
    },
    // { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Redirect to `dashboard` as the default route
    // { path: '**', redirectTo: '/dashboard' }, // Wildcard route for a 404 page, redirecting to dashboard
  ];
