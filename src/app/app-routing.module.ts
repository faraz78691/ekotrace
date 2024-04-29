import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from '@modules/main/main.component';
import { BlankComponent } from '@pages/blank/blank.component';
import { LoginComponent } from '@modules/login/login.component';
import { ProfileComponent } from '@pages/profile/profile.component';
import { RegisterComponent } from '@modules/register/register.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { AuthGuard } from '@guards/auth.guard';
import { NonAuthGuard } from '@guards/non-auth.guard';
import { ForgotPasswordComponent } from '@modules/forgot-password/forgot-password.component';
import { MainMenuComponent } from '@pages/main-menu/main-menu.component';
import { SubMenuComponent } from '@pages/main-menu/sub-menu/sub-menu.component';
import { EnergySectionComponent } from '@pages/refrigerants-section/refrigerants-section.component';
import { EmissionSectionComponent } from '@pages/stationary-combustion/stationary-combustion.component';
import { WasteSectionComponent } from '@pages/waste-section/waste-section.component';
import { WaterSectionComponent } from '@pages/water-section/water-section.component';
import { SocialSectionComponent } from '@pages/social-section/social-section.component';
import { GovernanceSectionComponent } from '@pages/governance-section/governance-section.component';
import { UserComponent } from '@pages/user/user.component';
import { ResetPasswordComponent } from '@modules/reset-password/reset-password.component';
import { FacilityComponent } from '@pages/facility/facility.component';
import { BillingComponent } from '@pages/billing/billing.component';
import { TrackingComponent } from '@pages/tracking/tracking.component';
import { CompanyProfileComponent } from '@pages/company-profile/company-profile.component';
import { TrackingViewRequestsComponent } from '@pages/tracking-view-requests/tracking-view-requests.component';
import { ReportComponent } from '@pages/reports/report/report.component';
import { CustomReportComponent } from '@pages/reports/custom-report/custom-report.component';
import { ReportStatusComponent } from '@pages/reports/report-status/report-status.component';
import { EnergyCustomReportComponent } from '@pages/reports/energy-custom-report/energy-custom-report.component';
import { BrsrReportComponent } from '@pages/brsr-report/brsr-report.component';
import { RoleGuard } from '@guards/role.guard';
import { AdminDashboardComponent } from '@pages/admin-dashboard/admin-dashboard.component';
import { GroupComponent } from '@pages/group/group.component';
import { NotificationsComponent } from '@modules/main/header/notifications/notifications.component';
import { WaterCustomReportComponent } from '@pages/reports/water-custom-report/water-custom-report.component';
import { BrsrQaComponent } from '@modules/brsr-qa/brsr-qa.component';
import { ReportDocComponent } from '@pages/report-doc/report-doc.component';
import { Scope3TrackingComponent } from './scope3-tracking/scope3-tracking.component';
import { Scope2TrackingComponent } from '@pages/scope2-tracking/scope2-tracking.component';
import { GhgEmmissionsComponent } from '@pages/dashboard/ghg-emmissions/ghg-emmissions.component';
import { EnergyEmmsionsComponent } from '@pages/dashboard/energy-emmsions/energy-emmsions.component';
import { BusinessTravelComponent } from '@pages/dashboard/business-travel/business-travel.component';
import { NewBillingComponent } from '@pages/new-billing/new-billing.component';
import { WaterUsageComponent } from '@pages/dashboard/water-usage/water-usage.component';
import { CarbonOffsettingComponent } from '@pages/carbon-offsetting/carbon-offsetting.component';
import { WasteComponent } from '@pages/dashboard/waste/waste.component';
import { TreeComponent } from '@pages/tree/tree.component';
import { TreeListComponent } from '@pages/tree/tree-list/tree-list.component';
import { MainTreeComponent } from '@pages/tree/main-tree/main-tree.component';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        canActivate: [AuthGuard],
        //canActivateChild: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver',
                        'Platform Admin'
                    ]
                },
                children:[
                    {path:'',redirectTo:'ghgEmision', pathMatch:'full'},
                    {path:'ghgEmision',component: GhgEmmissionsComponent},
                    {path:'energyEmission',component: EnergyEmmsionsComponent},
                    {path:'businessTravel',component: BusinessTravelComponent},
                    {path:'waterUsage',component: WaterUsageComponent},
                    {path:'waste',component: WasteComponent}
                ]
            },
            {
                path: '',
                canActivate: [RoleGuard],
                component: DashboardComponent,
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver',
                        'Platform Admin'
                    ]
                }
            },
            {
                path: 'company-register',
                canActivate: [RoleGuard],
                component: BlankComponent,
                data: { roles: ['Platform Admin'] }
            },
            {
                path: 'company-register',
                canActivate: [RoleGuard],
                component: AdminDashboardComponent,
                data: { roles: ['Platform Admin'] }
            },
            {
                path: 'brsr-qa',
                canActivate: [RoleGuard],
                component: BrsrQaComponent,
                data: { roles: ['Platform Admin'] }
            },
            {
                path: 'main_tree',
                canActivate: [RoleGuard],
                component: MainTreeComponent,
                data: { roles: ['Platform Admin', 'Super Admin','Admin','Manager'] },
                children:[
                    {path:'',redirectTo:'view', pathMatch:'full'},
                    {path:'view', component:TreeComponent},
                    {path:'facility', component:FacilityComponent},
                    {path:'group', component:GroupComponent},
                ]
            },
            {
                path: 'emission-section',
                component: EmissionSectionComponent
            },
            {
                path: 'waste-section',
                component: WasteSectionComponent
            },
            {
                path: 'water-section',
                component: WaterSectionComponent
            },
            {
                path: 'social-section',
                component: SocialSectionComponent
            },
            {
                path: 'governance-section',
                component: GovernanceSectionComponent
            },
            {
                path: 'energy-section',
                component: EnergySectionComponent
            },
            {
                path: 'user',
                component: UserComponent,
                canActivate: [RoleGuard],
                data: { roles: ['Super Admin', 'Admin', 'Manager'] }
            },
            {
                path: 'tree/:id',
                component: TreeComponent,
                canActivate: [RoleGuard],
                data: { roles: ['Super Admin', 'Admin'] }
            },
            {
                path: 'treeList',
                component: TreeListComponent,
                canActivate: [RoleGuard],
                data: { roles: ['Super Admin', 'Admin'] }
            },
            // {
            //     path: 'group',
            //     component: GroupComponent,
            //     canActivate: [RoleGuard],
            //     data: { roles: ['Super Admin', 'Admin', 'Manager'] }
            // },
            // {
            //     path: 'facility',
            //     canActivate: [RoleGuard],
            //     component: FacilityComponent,
            //     data: { roles: ['Super Admin', 'Admin'] }
            // },
            {
                path: 'billing',
                canActivate: [RoleGuard],
                component: BillingComponent,
                data: { roles: ['Super Admin'] }
            },
            {
                path: 'adminBilling',
                canActivate: [RoleGuard],
                component: NewBillingComponent,
                data: { roles: ['Super Admin'] }
            },
            {
                path: 'carbonOffset',
                canActivate: [RoleGuard],
                component: CarbonOffsettingComponent,
                data: { roles: [  'Super Admin',
                'Admin',
                'Manager',
                'Preparer',
                'Approver'] }
            },
            {
                path: 'tracking',
                canActivate: [RoleGuard],
                component: TrackingComponent,
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver'
                    ]
                }
            },
            {
                path: 'scope3tracking',
                canActivate: [RoleGuard],
                component: Scope3TrackingComponent,
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver'
                    ]
                }
            },
            {
                path: 'Ntracking',
                canActivate: [RoleGuard],
                component: Scope2TrackingComponent,
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver'
                    ]
                }
            },
            {
                path: 'notification',
                canActivate: [RoleGuard],
                component: NotificationsComponent,
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver'
                    ]
                }
            },
            {
                path: 'tracking-status',
                component: TrackingComponent
            },
            {
                path: 'company-profile',
                component: CompanyProfileComponent,
                data: { roles: ['Super Admin'] }
            },
            {
                path: 'tracking-view-requests',
                canActivate: [RoleGuard],
                component: TrackingViewRequestsComponent,
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver'
                    ]
                }
            },
            {
                path: 'report',
                component: ReportComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver'
                    ]
                }
            },
            {
                path: 'custom-report',
                component: CustomReportComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver'
                    ]
                }
            },
            {
                path: 'report-status',
                component: ReportStatusComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver'
                    ]
                }
            },
            {
                path: 'energy-custom-report',
                component: EnergyCustomReportComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver'
                    ]
                }
            },
            {
                path: 'water-custom-report',
                component: WaterCustomReportComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver'
                    ]
                }
            },
            {
                path: 'brsrReport',
                component: BrsrReportComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin'
                    ]
                }
            },

            {
                path: 'report-doc',
                component: ReportDocComponent,
                canActivate: [RoleGuard],
                data: {
                    roles: [
                        'Super Admin',
                        'Admin',
                        'Manager',
                        'Preparer',
                        'Approver'
                    ]
                }

            }
        ]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'forgot-password/{userId}',
        component: ForgotPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent,
        canActivate: [NonAuthGuard]
    },

    {
        path: 'reset-password/{email}',
        component: ResetPasswordComponent,
        canActivate: [NonAuthGuard]
    },

    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
