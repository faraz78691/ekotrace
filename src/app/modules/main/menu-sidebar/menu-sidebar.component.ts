import { BRSR_Doc } from '@/models/brsrDOc';
import { LoginInfo } from '@/models/loginInfo';
import { CompanyDetails } from '@/shared/company-details';
import { AppState } from '@/store/state';
import { ToggleSidebarMenu } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, ElementRef, HostBinding, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppService } from '@services/app.service';
import { CompanyService } from '@services/company.service';
import { ReportService } from '@services/report.service';
import { Observable } from 'rxjs';

const BASE_CLASSES = 'main-sidebar elevation-4';
@Component({
    selector: 'app-menu-sidebar',
    templateUrl: './menu-sidebar.component.html',
    styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit {
    public loginInfo: LoginInfo;
    public companyDetails: CompanyDetails;
    companyData: CompanyDetails = new CompanyDetails();
    isExpired: boolean;
    excludedRole = 'Platform Admin';
    @HostBinding('class') classes: string = BASE_CLASSES;
    public ui: Observable<UiState>;
    public user;
    public menu;
    IsPAdmin = true;
    updatedtheme: string;
    multiselectcolor: any;
    selectedTheme: string;
    public brsrdata: BRSR_Doc;
    isBRSRDoc: boolean;


    constructor(
        public appService: AppService,
        public companyService: CompanyService,
        private store: Store<AppState>,
        private elementRef: ElementRef,
        private reportService: ReportService,

    ) {
        this.loginInfo = new LoginInfo();
        this.brsrdata = new BRSR_Doc();
        this.companyDetails = new CompanyDetails();
        this.isBRSRDoc = true;

    }

    ngOnInit() {
        this.loginInfo = new LoginInfo();
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
            if (this.loginInfo.role != 'Platform Admin') {
                this.IsPAdmin = false;
            }
            // this.checkbrsrdata(this.loginInfo.tenantID);

            this.getTenantsById(Number(this.loginInfo.tenantID));
            this.getTenantsById(Number(this.loginInfo.tenantID)).then(() => {
               
              
                if (this.loginInfo.role === 'Super Admin' && this.isExpired) {
                    this.menu =
                        menu.find((item) => item.role === this.loginInfo.role)
                            ?.items || [];
                            console.log("menu", menu);
             
                } else {
                    if (this.brsrdata.docPath != null || this.brsrdata.docPath != undefined) {
                        this.isBRSRDoc = true;
                        this.menu =
                            menu.find((item) => item.role === this.loginInfo.role && item.isBRSRDoc === this.isBRSRDoc)
                                ?.items || [];
                    }
                    else {
                        this.isBRSRDoc = false;
                        this.menu =
                            menu.find((item) => item.role === this.loginInfo.role && item.isBRSRDoc === this.isBRSRDoc)
                                ?.items || [];
                    }

                }

            });

        }

        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.classes = `${BASE_CLASSES} ${state.sidebarSkin}`;
        });
        this.user = this.appService.user;
    }

    handleActiveClass() {
        console.log('active');
    }
    onToggleMenuSidebar() {
        this.store.dispatch(new ToggleSidebarMenu());
    }

    async getTenantsById(id: number) {
        try {
            if (this.loginInfo.role === this.excludedRole) {
                this.theme2();
                return;
            }


            const response = await this.companyService
                .getTenantsDataById(Number(this.loginInfo.tenantID))
                .toPromise();
            this.companyDetails = response;
            const currentDate = new Date();
            const licenseExpiredDate = new Date(
                this.companyDetails.licenseExpired
            );
            this.isExpired = licenseExpiredDate < currentDate;

        } catch (error) {
            // Handle the error appropriately
        }

        this.user = this.appService.user;

        this.updatedtheme = localStorage.getItem('theme');
        if (this.updatedtheme === 'dark') {
            this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor =
                '#5E6065';
            // '#E9EDF2';
        }

        if (this.updatedtheme === 'light') {
            this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor =
                '#E9EDF2';
        }

        if (this.updatedtheme === null) {
            this.theme2();
        }
    };

    checkbrsrdata(tenantID) {
        this.brsrdata = new BRSR_Doc();
        this.brsrdata.brsR_Q_As = [];

        this.reportService.getBRSRdata(tenantID).subscribe((response) => {
            if (response != null) {
                console.log(
                    '🚀 ~ file: brsrReport.component.ts:280 ~ this.reportService.getBRSRdata ~ response:',
                    response
                );
                this.brsrdata = response;

            }
        });
    }

    theme1() {
        localStorage.setItem('theme', 'light');
        this.updatedtheme = localStorage.getItem('theme');
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor =
            '#E9EDF2';
    }
    // theme2() {
    //     localStorage.setItem('theme', 'dark');
    //     this.updatedtheme = localStorage.getItem('theme');
    //     this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor =
    //         '#5E6065';
    // }
    theme2() {
        localStorage.setItem('theme', 'light');
        this.updatedtheme = localStorage.getItem('theme');
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor =
            '#E9EDF2';
    }

    getSelectedValue() {
        if (this.selectedTheme === 'theme1') {
            localStorage.setItem('theme', 'theme1');
        }
        if (this.selectedTheme === 'theme2') {
            localStorage.setItem('theme', 'theme2');
        }
        if (this.selectedTheme === 'theme3') {
            localStorage.setItem('theme', 'theme3');
        }
        if (this.selectedTheme === 'theme4') {
            localStorage.setItem('theme', 'theme4');
        }
    }
}
export const menu = [
    {
        role: 'Super Admin',
        isBRSRDoc: false,
        items: [
            // {
            //     head: 'Organisation Structure',
            //     name: 'Dashboard',
            //     iconClasses: 'fas fa-table',
            //     iconSRC :'assets/img/dashboard.svg',
            //     path: ['dashboard']
            // },
            // {
            //     name: 'Tracking Old',
            //     iconClasses: 'fas fa-star',
            //     iconSRC :'assets/img/tracking_icon.svg',
            //     path: ['scope3tracking']
            // },
            {
                head: 'Organisation Structure',
                name: 'Tree',
                iconClasses: 'fas fa-star',
                iconSRC: 'assets/img/trees.png',
                path: ['main_tree']
            },
            { head: undefined,
                name: 'Add User',
                iconClasses: 'fas fa-user-plus',
                iconSRC: 'assets/img/user_121.png',
                path: ['user']
            },
            {head: undefined,
                name: 'Set GHG Template',
                iconClasses: 'fas fa-star',
                iconSRC :'assets/img/tracking_icon.svg',
                path: ['setGhgTemplate']
            },
            
            {
                head: 'Disclose',
                name: 'Dashboard',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/dashboard.svg',
                path: ['dashboard']
            },
            {
                head: 'GHG Emissions',
                name: 'Corprate Emissions',
                iconClasses: 'fas fa-star',
                iconSRC: 'assets/img/trees.png',
                path: ['tracking']
            }, 
            {
                name: 'Financed Emissions',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/BRSR.svg',
                path: ['finance_emissions']
            },
            {
                name: 'Vendors / Cost Centre',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/BRSR.svg',
                path: ['vendors']
            },

            {
                head: 'Reporting ',
                name: 'Report',
                iconClasses: 'fas fa-folder',
                iconSRC: 'assets/img/report_icon.svg',
                path: ['report']
            },
            {
                name: 'BRSR',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/BRSR.svg',
                path: ['brsrReport']
            },
            {
                head: 'Target Setting',
                name: 'Set Emission Inventory',
                iconClasses: 'fas fa-folder',
                iconSRC: 'assets/img/report_icon.svg',
                path: ['setEmissionInventory']
            },
            {
                name: 'Target Setting',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/BRSR.svg',
                path: ['targetSetting']
            },
            {
                name: 'Actions',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/BRSR.svg',
                path: ['actions']
            },
            // {
            //     name: 'Carbon Offset',
            //     iconClasses: 'fas fa-folder',
            //     iconSRC :'assets/img/co2.svg',
            //     path: ['carbonOffset']
            // },
            // {
            //     head: 'Reporting',
            //     name: 'BRSR',
            //     iconClasses: 'fas fa-table',
            //     iconSRC :'assets/img/BRSR.svg',
            //     path: ['brsrReport'],
            // children: [
            //     {
            //         name: 'Fd set',
            //         iconClasses: 'fas fa-file',
            //         path: ['brsrReport'],
            //         queryParams: { defaultTab: 0 }
            //     },
            //     {
            //         name: 'HR set',
            //         iconClasses: 'fas fa-file',
            //         path: ['brsrReport'],
            //         queryParams: { defaultTab: 1 }
            //     },
            //     {
            //         name: 'CS set',
            //         iconClasses: 'fas fa-file',
            //         path: ['brsrReport'],
            //         queryParams: { defaultTab: 2 }
            //     }
            //     // {
            //     //     name: 'Principle 4',
            //     //     iconClasses: 'fas fa-file',
            //     //     path: ['brsrReport'],
            //     //     queryParams: { defaultTab: 3 }
            //     // }
            // ]
            // },
            {
                head: 'Carbon offsetting',
                name: 'Offset Entry',
                iconClasses: 'fas fa-eye',
                iconSRC: 'assets/img/building.svg',
                path: ['carbonOffset']
            },
            // {
            //     head: 'Admin Setting',
            //     name: 'Company Profile',
            //     iconClasses: 'fas fa-eye',
            //     iconSRC: 'assets/img/building.svg',
            //     path: ['company-profile']
            // },
            // {
            //     name: 'Facility',
            //     iconClasses: 'fas fa-search-location',
            //     iconSRC: 'assets/img/facility_icon.svg',
            //     path: ['facility']
            // },
            // {
            //     name: 'Group',
            //     iconClasses: 'fas fa-users',
            //     iconSRC: 'assets/img/group_121.png',
            //     path: ['group']
            // },
            // {
            //     name: 'User',
            //     iconClasses: 'fas fa-user-plus',
            //     iconSRC: 'assets/img/user_121.png',
            //     path: ['user']
            // },
            {
                head: 'Account Details',
                name: 'Company Profile',
                iconClasses: 'fas fa-eye',
                iconSRC: 'assets/img/building.svg',
                path: ['company-profile']
            },
            {
                name: 'Billing',
                iconClasses: 'fas fa-folder',
                iconSRC: 'assets/img/biling_icon_211.png',
                path: ['billing']
            },
            // {
            //     name: 'Billing',
            //     iconClasses: 'fas fa-folder',
            //     iconSRC: 'assets/img/biling_icon_211.png',
            //     path: ['adminBilling']
            // },
        ]
    },
    {
        role: 'Super Admin',
        isBRSRDoc: true,
        items: [
            {
                head: 'Monitoring',
                name: 'Dashboard',
                iconClasses: 'fas fa-table',
                path: ['dashboard']
            },
            {
                name: 'Tracking',
                iconClasses: 'fas fa-star',
                path: ['Ntracking']
            },
            {
                name: 'Carbon Offset',
                iconClasses: 'fas fa-folder',
                iconSRC: 'assets/img/report_icon.svg',
                path: ['carbonOffset']
            },
            {
                name: 'Report',
                iconClasses: 'fas fa-folder',
                path: ['report']
            },
            {
                head: 'Reporting',
                name: 'BRSR',
                iconClasses: 'fas fa-table',
                path: ['report-doc'],
                children: [
                    {
                        name: 'Report Document',
                        iconClasses: 'fas fa-file-import',
                        path: ['report-doc']
                    },
                    {
                        name: 'Principle 1',
                        iconClasses: 'fas fa-file',
                        path: ['brsrReport'],
                        queryParams: { defaultTab: 0 }
                    },
                    {
                        name: 'Principle 2',
                        iconClasses: 'fas fa-file',
                        path: ['brsrReport'],
                        queryParams: { defaultTab: 1 }
                    },
                    {
                        name: 'Principle 3',
                        iconClasses: 'fas fa-file',
                        path: ['brsrReport'],
                        queryParams: { defaultTab: 2 }
                    },
                    {
                        name: 'Principle 4',
                        iconClasses: 'fas fa-file',
                        path: ['brsrReport'],
                        queryParams: { defaultTab: 3 }
                    }
                ]
            },
            {
                head: 'Admin Setting',
                name: 'Company Profile',
                iconClasses: 'fas fa-eye',
                path: ['company-profile']
            },
            {
                name: 'Facility',
                iconClasses: 'fas fa-search-location',
                path: ['facility']
            },
            {
                name: 'Group',
                iconClasses: 'fas fa-users',
                path: ['group']
            },
            {
                name: 'User',
                iconClasses: 'fas fa-user-plus',
                path: ['user']
            },
            {
                name: 'Billing',
                iconClasses: 'fas fa-folder',

                path: ['billing']
            }
        ]
    },
    {
        role: 'Admin',
        isBRSRDoc: false,
        items: [
            {
                head: 'Monitoring',
                name: 'Dashboard',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/dashboard.svg',
                path: ['dashboard']
            },
            {
                name: 'Tracking',
                iconClasses: 'fas fa-star',
                iconSRC: 'assets/img/tracking_icon.svg',
                path: ['Ntracking']
            },
            {
                name: 'Report',
                iconClasses: 'fas fa-folder',
                iconSRC: 'assets/img/report_icon.svg',
                path: ['report']
            },
            {
                name: 'Carbon Offset',
                iconClasses: 'fas fa-folder',
                iconSRC: 'assets/img/report_icon.svg',
                path: ['carbonOffset']
            },
            {
                head: 'Reporting',
                name: 'BRSR',
                iconClasses: 'fas fa-table',
                path: ['/brsrReport'],
                children: [
                    {
                        name: 'Principle 1',
                        iconClasses: 'fas fa-file',
                        path: ['brsrReport'],
                        queryParams: { defaultTab: 0 }
                    },
                    {
                        name: 'Principle 2',
                        iconClasses: 'fas fa-file',
                        path: ['brsrReport'],
                        queryParams: { defaultTab: 1 }
                    },
                    {
                        name: 'Principle 3',
                        iconClasses: 'fas fa-file',
                        path: ['brsrReport'],
                        queryParams: { defaultTab: 2 }
                    },
                    {
                        name: 'Principle 4',
                        iconClasses: 'fas fa-file',
                        path: ['brsrReport'],
                        queryParams: { defaultTab: 3 }
                    }
                ]
            },
            {
                name: 'Facility',
                iconClasses: 'fas fa-search-location',
                path: ['facility']
            },
            {
                name: 'User',
                iconClasses: 'fas fa-folder',
                path: ['/user']
            }
        ]
    },
    {
        role: 'Admin',
        isBRSRDoc: true,
        items: [
            {
                head: 'Monitoring',
                name: 'Dashboard',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/dashboard.svg',
                path: ['dashboard']
            },
            {
                name: 'Tracking',
                iconClasses: 'fas fa-star',
                iconSRC: 'assets/img/tracking_icon.svg',
                path: ['Ntracking']
            },
            {
                name: 'Carbon Offset',
                iconClasses: 'fas fa-folder',
                iconSRC: 'assets/img/report_icon.svg',
                path: ['carbonOffset']
            },
            {
                name: 'Report',
                iconClasses: 'fas fa-folder',
                path: ['report']
            },
            {
                head: 'Reporting',
                name: 'BRSR',
                iconClasses: 'fas fa-table',
                path: ['report-doc'],
                children: [
                    {
                        name: 'Principle 1',
                        iconClasses: 'fas fa-file',
                        path: ['brsrReport'],
                        queryParams: { defaultTab: 0 }
                    },
                    {
                        name: 'Principle 2',
                        iconClasses: 'fas fa-file',
                        path: ['brsrReport'],
                        queryParams: { defaultTab: 1 }
                    },
                    {
                        name: 'Principle 3',
                        iconClasses: 'fas fa-file',
                        path: ['brsrReport'],
                        queryParams: { defaultTab: 2 }
                    },
                    {
                        name: 'Principle 4',
                        iconClasses: 'fas fa-file',
                        path: ['brsrReport'],
                        queryParams: { defaultTab: 3 }
                    }
                ]
            },
            {
                name: 'Facility',
                iconClasses: 'fas fa-search-location',
                path: ['facility']
            },
            {
                name: 'User',
                iconClasses: 'fas fa-folder',
                path: ['/user']
            }
        ]
    },
    {
        role: 'Manager',
        isBRSRDoc: false,
        items: [
            {
                head: 'Monitoring',
                name: 'Dashboard',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/dashboard.svg',
                path: ['dashboard']
            },
            // {
            //     name: 'Tracking',
            //     iconClasses: 'fas fa-star',
            //     path: ['tracking']
            // },
            {
                name: 'Tracking',
                iconClasses: 'fas fa-star',
                iconSRC: 'assets/img/tracking_icon.svg',
                path: ['Ntracking']
            },
            {
                name: 'Report',
                iconClasses: 'fas fa-folder',
                iconSRC: 'assets/img/report_icon.svg',
                path: ['report']
            },
            {
                name: 'Carbon Offset',
                iconClasses: 'fas fa-folder',
                iconSRC: 'assets/img/report_icon.svg',
                path: ['carbonOffset']
            },

            // {
            //     name: 'User',
            //     iconClasses: 'fas fa-folder',
            //     path: ['/user']
            // }
        ]
    },
    {
        role: 'Approver',
        isBRSRDoc: false,
        items: [
            {
                head: 'Monitoring',
                name: 'Dashboard',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/dashboard.svg',
                path: ['dashboard']
            },
            {
                name: 'Tracking',
                iconClasses: 'fas fa-star',
                iconSRC: 'assets/img/tracking_icon.svg',
                path: ['Ntracking']
            },
            {
                name: 'Carbon Offset',
                iconClasses: 'fas fa-folder',
                iconSRC: 'assets/img/report_icon.svg',
                path: ['carbonOffset']
            },
        ]
    },
    {
        role: 'Preparer',
        isBRSRDoc: false,
        items: [
            {
                head: 'Monitoring',
                name: 'Dashboard',
                iconClasses: 'fas fa-table',
                iconSRC: 'assets/img/dashboard.svg',
                path: ['dashboard']
            },
            {
                name: 'Tracking',
                iconClasses: 'fas fa-star',
                iconSRC: 'assets/img/tracking_icon.svg',
                path: ['Ntracking']
            },
            {
                name: 'Carbon Offset',
                iconClasses: 'fas fa-folder',
                iconSRC: 'assets/img/report_icon.svg',
                path: ['carbonOffset']
            },
        ]
    }
];
