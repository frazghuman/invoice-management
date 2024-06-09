import { Routes } from '@angular/router';
import { AuthGuard } from '@common/guards/auth.guard';

export const routes: Routes = [
    {
      path: '',
      loadComponent: () => 
            import('@common/components/layout/main-layout/main-layout.component')
                .then(m => m.MainLayoutComponent),
      children: [
        { 
          path: '',
          loadComponent: () => 
            import('@pages/dashboard/dashboard.component')
                .then(m => m.DashboardComponent),
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'invoice',
          loadComponent: () => 
            import('@pages/invoice/invoice.component')
                .then(m => m.InvoiceComponent),
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'invoice/create',
          loadComponent: () => 
            import('@pages/invoice/invoice-create/invoice-create.component')
                .then(m => m.InvoiceCreateComponent),
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'invoice/:id',
          loadComponent: () => 
            import('@pages/invoice/invoice-management/invoice-management.component')
                .then(m => m.InvoiceManagementComponent),
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'invoice/:id/edit',
          loadComponent: () => 
            import('@pages/invoice/invoice-edit/invoice-edit.component')
                .then(m => m.InvoiceEditComponent),
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'proposals',
          loadComponent: () => 
            import('@pages/proposals/proposals.component')
                .then(m => m.ProposalsComponent),
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'proposal/create',
          loadComponent: () => 
            import('@pages/proposals/proposal-create/proposal-create.component')
                .then(m => m.ProposalCreateComponent),
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'proposal/:id',
          loadComponent: () => 
            import('@pages/proposals/proposal-management/proposal-management.component')
                .then(m => m.ProposalManagementComponent),
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'proposal/:id/edit',
          loadComponent: () => 
            import('@pages/proposals/proposal-edit/proposal-edit.component')
                .then(m => m.ProposalEditComponent),
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'bill',
          loadComponent: () => 
            import('@pages/bill/bill.component')
                .then(m => m.BillComponent),
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'customers',
          loadComponent: () => 
            import('@pages/customers/customers.component')
                .then(m => m.CustomersComponent),
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'items',
          loadComponent: () => 
            import('@pages/items/items.component')
                .then(m => m.ItemsComponent),
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'reports',
          loadComponent: () => 
            import('@pages/reports/reports.component')
                .then(m => m.ReportsComponent),
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'settings',
          loadComponent: () => 
            import('@pages/settings/settings.component')
                .then(m => m.SettingsComponent),
          canActivate: [AuthGuard] // Requires authentication
        },
        { 
          path: 'contact-us',
          loadComponent: () => 
            import('@pages/contact-us/contact-us.component')
                .then(m => m.ContactUsComponent),
          canActivate: [AuthGuard] // Requires authentication
        }
      ],
    },
    {
      path: '',
      loadComponent: () => 
        import('@common/components/layout/login-layout/login-layout.component')
            .then(m => m.LoginLayoutComponent),
      children: [
        { 
          path: 'auth/sign-in',
          loadComponent: () => 
          import('@pages/auth/login/login.component')
              .then(m => m.LoginComponent),
        },
        { 
          path: 'activate/:activationKey',
          loadComponent: () => 
          import('@pages/auth/activate/activate.component')
              .then(m => m.ActivateComponent),
        },
      ],
    },
    {
      path: '**',
      loadComponent: () => import('@pages/not-found/not-found.component')
        .then(mod => mod.NotFoundComponent)
    }
  ];
