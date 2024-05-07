import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MultiSelectModule } from 'primeng/multiselect';
import { AppRoutingModule } from '@/app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from '@modules/main/main.component';
import { LoginComponent } from '@modules/login/login.component';
import { HeaderComponent } from '@modules/main/header/header.component';
import { FooterComponent } from '@modules/main/footer/footer.component';
import { MenuSidebarComponent } from '@modules/main/menu-sidebar/menu-sidebar.component';
import { BlankComponent } from '@pages/blank/blank.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from '@pages/profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from '@modules/register/register.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { ToastrModule } from 'ngx-toastr';
import { MessagesComponent } from '@modules/main/header/messages/messages.component';
import { NotificationsComponent } from '@modules/main/header/notifications/notifications.component';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import { ForgotPasswordComponent } from '@modules/forgot-password/forgot-password.component';
import { LanguageComponent } from '@modules/main/header/language/language.component';
import { MainMenuComponent } from './pages/main-menu/main-menu.component';
import { SubMenuComponent } from './pages/main-menu/sub-menu/sub-menu.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { ControlSidebarComponent } from './modules/main/control-sidebar/control-sidebar.component';
import { StoreModule } from '@ngrx/store';
import { authReducer } from './store/auth/reducer';
import { uiReducer } from './store/ui/reducer';
import { ProfabricComponentsModule } from '@profabric/angular-components';
import { defineCustomElements } from '@profabric/web-components/loader';
import { SidebarSearchComponent } from './components/sidebar-search/sidebar-search.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ReportingSidebarComponent } from './modules/main/reporting-sidebar/reporting-sidebar.component';
import { EnergySectionComponent } from './pages/refrigerants-section/refrigerants-section.component';
import { EmissionSectionComponent } from './pages/stationary-combustion/stationary-combustion.component';
import { WasteSectionComponent } from './pages/waste-section/waste-section.component';
import { WaterSectionComponent } from './pages/water-section/water-section.component';
import { SocialSectionComponent } from './pages/social-section/social-section.component';
import { GovernanceSectionComponent } from './pages/governance-section/governance-section.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { UserComponent } from '@pages/user/user.component';
import { ResetPasswordComponent } from './modules/reset-password/reset-password.component';
import { ValidateEqualModule } from 'ng-validate-equal';
import { FacilityComponent } from '@pages/facility/facility.component';
import { UserHeaderComponent } from '@modules/main/header/user/user.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AuthInterceptor } from './interceptor/auth-interceptor';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BillingComponent } from './pages/billing/billing.component';
import { CustomerService } from '@pages/admin-dashboard/customerservice';
import { CompanyProfileComponent } from './pages/company-profile/company-profile.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FileUploadModule } from 'primeng/fileupload';
import { TrackingComponent } from '@pages/tracking/tracking.component';
import { TabViewModule } from 'primeng/tabview';
import { TrackingViewRequestsComponent } from './pages/tracking-view-requests/tracking-view-requests.component';
import { ReportComponent } from './pages/reports/report/report.component';
import { CustomReportComponent } from './pages/reports/custom-report/custom-report.component';
import { ReportStatusComponent } from './pages/reports/report-status/report-status.component';
import { EnergyCustomReportComponent } from './pages/reports/energy-custom-report/energy-custom-report.component';
import { TooltipModule } from 'primeng/tooltip';
import { BrsrReportComponent } from './pages/brsr-report/brsr-report.component';
import { CalendarModule } from 'primeng/calendar';
import { ImageModule } from 'primeng/image';
import { GroupComponent } from '@pages/group/group.component';
import { CarouselModule } from 'primeng/carousel';
import { WaterCustomReportComponent } from './pages/reports/water-custom-report/water-custom-report.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MessagesModule } from 'primeng/messages';
import { BrsrQaComponent } from './modules/brsr-qa/brsr-qa.component';
import { ReportDocComponent } from './pages/report-doc/report-doc.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ScrollerModule } from 'primeng/scroller';
import { FireExtinguisherComponent } from './pages/fire-extinguisher/fire-extinguisher.component';
import { VehicleComponent } from './pages/vehicle/vehicle.component';
import { ElectricityComponent } from './pages/electricity/electricity.component';
import { HeatandSteamComponent } from './pages/heatand-steam/heatand-steam.component';
import { Scope3TrackingComponent } from './scope3-tracking/scope3-tracking.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { GhgEmmissionsComponent } from './pages/dashboard/ghg-emmissions/ghg-emmissions.component';
import { EnergyEmmsionsComponent } from './pages/dashboard/energy-emmsions/energy-emmsions.component';
import { BusinessTravelComponent } from './pages/dashboard/business-travel/business-travel.component';
import { NewBillingComponent } from './pages/new-billing/new-billing.component';
import { WaterUsageComponent } from './pages/dashboard/water-usage/water-usage.component';
import { CarbonOffsettingComponent } from './pages/carbon-offsetting/carbon-offsetting.component';
import { WasteComponent } from './pages/dashboard/waste/waste.component';
import { TreeComponent } from './pages/tree/tree.component';
import { TreeListComponent } from './pages/tree/tree-list/tree-list.component';
import { MainTreeComponent } from './pages/tree/main-tree/main-tree.component';
import { GhgTemplateComponent } from './pages/ghg-template/ghg-template.component';
import { FinanceEmissionsComponent } from './pages/finance-emissions/finance-emissions.component';
import { SetEmissionInventoryComponent } from './pages/target_setting/set-emission-inventory/set-emission-inventory.component';
import { TargetSettingComponent } from './pages/target_setting/target-setting/target-setting.component';
import { ActionsComponent } from './pages/target_setting/actions/actions.component';
import { VendorsComponent } from './pages/vendors/vendors.component';

defineCustomElements();
registerLocaleData(localeEn, 'en-EN');

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        LoginComponent,
        
        FooterComponent,
        MenuSidebarComponent,
        BlankComponent,
        ProfileComponent,
        RegisterComponent,
        DashboardComponent,
        MessagesComponent,
        NotificationsComponent,
        ForgotPasswordComponent,
        LanguageComponent,
        MainMenuComponent,
        SubMenuComponent,
        MenuItemComponent,
        ControlSidebarComponent,
        SidebarSearchComponent,
        ReportingSidebarComponent,
        EnergySectionComponent,
        EmissionSectionComponent,
        WasteSectionComponent,
        WaterSectionComponent,
        SocialSectionComponent,
        GovernanceSectionComponent,
        ResetPasswordComponent,
        UserComponent,
        GroupComponent,
        FacilityComponent,
        UserHeaderComponent,
        AdminDashboardComponent,
        BillingComponent,
        CompanyProfileComponent,
        TrackingComponent,
        TrackingViewRequestsComponent,
        ReportComponent,
        CustomReportComponent,
        ReportStatusComponent,
        EnergyCustomReportComponent,
        BrsrReportComponent,
        WaterCustomReportComponent,
        BrsrQaComponent,
        ReportDocComponent,
        FireExtinguisherComponent,
        VehicleComponent,
        ElectricityComponent,
        HeatandSteamComponent,
        Scope3TrackingComponent,
        GhgEmmissionsComponent,
        EnergyEmmsionsComponent,
        BusinessTravelComponent,
        NewBillingComponent,
        WaterUsageComponent,
        CarbonOffsettingComponent,
        WasteComponent,
        TreeComponent,
        TreeListComponent,
        MainTreeComponent,
        GhgTemplateComponent,
        FinanceEmissionsComponent,
        SetEmissionInventoryComponent,
        TargetSettingComponent,
        ActionsComponent,
        VendorsComponent
    ],
    imports: [
        HeaderComponent,
        BrowserModule,
        MultiSelectModule,
        ValidateEqualModule,
        BrowserModule,
        FormsModule,
        MessagesModule,
        NgxChartsModule,
        NgApexchartsModule,
        StoreModule.forRoot({ auth: authReducer, ui: uiReducer }),
        HttpClientModule,
        AppRoutingModule,
        ImageModule,
        NgxCaptchaModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        FileUploadModule,
        DropdownModule,
        InputTextareaModule,
        MessagesModule,
        TooltipModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot({
            timeOut: 3000,
            positionClass: 'toast-top-right',
            preventDuplicates: true
        }),
        ProfabricComponentsModule,
        TableModule,
        CommonModule,
        ToastModule,
        ConfirmDialogModule,
        TabMenuModule,
        MenuModule,
        AccordionModule,
        CheckboxModule,
        ToggleButtonModule,
        RadioButtonModule,
        InputSwitchModule,
        ProgressSpinnerModule,
        TabViewModule,
        CalendarModule,
        CarouselModule,
        OverlayPanelModule,
        NgxExtendedPdfViewerModule,
        NgxDocViewerModule,
        ScrollerModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        ConfirmationService,
        MessageService,
        CustomerService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
