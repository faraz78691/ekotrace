import { Facility } from '@/models/Facility';
import { FacilityGroupList } from '@/models/FacilityGroupList';
import { facilities } from '@/models/facilities';
import { LoginInfo } from '@/models/loginInfo';
import { CompanyDetails } from '@/shared/company-details';
import { AppState } from '@/store/state';
import { ToggleControlSidebar, ToggleSidebarMenu } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { CommonModule } from '@angular/common';
import { Component, HostBinding, OnInit, ViewChild, computed, signal } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppService } from '@services/app.service';
import { CompanyService } from '@services/company.service';
import { FacilityService } from '@services/facility.service';
import { ThemeService } from '@services/theme.service';
import { environment } from 'environments/environment';
import { MenuItem } from 'primeng/api';
import { Observable, filter } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { BrowserModule } from '@angular/platform-browser';



interface CustomFacility {
    id: any;
    flag: any;
}
const BASE_CLASSES = 'main-header navbar navbar-expand ';
@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, DropdownModule, FormsModule, ImageModule, RouterModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public loginInfo: LoginInfo;
    public companyDetails: CompanyDetails;
    @HostBinding('class') classes: string = BASE_CLASSES;
    public ui: Observable<UiState>;
    public searchForm: UntypedFormGroup;
    rootUrl: string;
    uploadedImageUrl: string;
    logoName: string;
    updatedtheme: string;
    facilityData: Facility[] = [];
    getFacilitystring: string;
    notificationIcon: boolean = false;
    selectedFacilityID: CustomFacility;
    lfgcount: number = 0;
    excludedRole = 'Platform Admin';
    ProfileMenu: MenuItem[] | undefined;
    public facilityGroup: FacilityGroupList;
    facilitygrouplist: any[] = [];
    facilitysubgrouplist: any[] = [];
    @ViewChild('menu', { static: true }) menu: any;
    public href: string = null;
    displayTracker = false;

    isActiveLabel = computed(() => this.facilityService.headerTracking());


    constructor(
        private appService: AppService,
        private companyService: CompanyService,
        private store: Store<AppState>,
        private themeservice: ThemeService,
        private facilityService: FacilityService,
        private router: Router
    ) {
        this.companyDetails = new CompanyDetails();
        this.rootUrl = environment.baseUrl + 'uploads/';
        this.facilityGroup = new FacilityGroupList();
  
    }
    ngOnInit() {

        this.facilityService.headerTracking();
        this.href = this.router.url;
        
        this.loginInfo = new LoginInfo();
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;

            this.loginInfo.companyName =
                this.loginInfo.companyName == ''
                    ? 'System Admin'
                    : this.loginInfo.companyName;
            if (
                this.loginInfo.role !== 'Manager' &&
                this.loginInfo.role !== 'Preparer' &&
                this.loginInfo.role !== 'Approver'
            ) {
                // this.getTenantById(Number(this.loginInfo.tenantID));

                // this.GetFacilityGroupList(Number(this.loginInfo.tenantID));
            }

            this.checkRolesAndLoadData();
            this.router.events.pipe(
                filter(event => event instanceof NavigationEnd)
            ).subscribe(() => {
                console.log("route  changed");
                this.checkRolesAndLoadData();
            })
        

           
        }
        this.ProfileMenu = [
            {
                label: 'Actions',
                items: [
                    {
                        label: 'LogOut',
                        icon: 'pi pi-power-off',
                        command: () => {
                            this.logout();
                        }
                    }
                ]
            }
        ];

        this.ui = this.store.select('ui');
        this.ui.subscribe((state: UiState) => {
            this.classes = `${BASE_CLASSES} ${state.navbarVariant}`;
        });
        this.searchForm = new UntypedFormGroup({
            search: new UntypedFormControl(null)
        });
        this.uploadedImageUrl = localStorage.getItem('uploadedImageUrl');
        this.updatedtheme = localStorage.getItem('theme');
    };

    private checkRolesAndLoadData(): void {
        if (this.loginInfo.role !== 'Manager' &&
            this.loginInfo.role !== 'Preparer' &&
            this.loginInfo.role !== 'Approver') {
          // this.getTenantById(Number(this.loginInfo.tenantID));
          // this.GetFacilityGroupList(Number(this.loginInfo.tenantID));
        }
    
        if (this.router.url === '/finance_emissions') {
            this.facilitygrouplist = [];
       
          this.GetSubGroupList(this.loginInfo.tenantID);
        } else if(this.router.url === '/tracking' ) {
            this.facilitysubgrouplist = []
    
          this.GetFacilityGroupList(this.loginInfo.tenantID);
        }
      }

    checkFacilityID() {
        this.facilityService.facilitySelected(this.selectedFacilityID?.id)
     
        localStorage.setItem('SelectedfacilityID', this.selectedFacilityID?.id);
       
    };

    logout() {
        this.appService.logout();
    };

    onToggleMenuSidebar() {

        this.store.dispatch(new ToggleSidebarMenu());
    }

    onToggleControlSidebar() {
        this.store.dispatch(new ToggleControlSidebar());
    }


    getTenantById(id: number) {
        if (this.loginInfo.role === this.excludedRole) {
            return;
        }
        this.companyService.getTenantsDataById(id).subscribe((response) => {
            this.companyDetails = response;
            this.uploadedImageUrl =
                this.rootUrl +
                (response.logoName === '' || response.logoName === null
                    ? 'defaultimg.png'
                    : response.logoName);
            localStorage.setItem('uploadedImageUrl', this.uploadedImageUrl);
            localStorage.setItem('companyName', response.companyName);
        });

    };

    clicknotificationicon() {
        this.notificationIcon = true;
    }
    toggleMenu(event: Event): void {
        this.menu.toggle(event);
    }


    GetFacilityGroupList(tenantID) {
        this.facilitygrouplist = []
        if (this.loginInfo.role === this.excludedRole) {
            return;
        }
        this.facilityService
            .newGetFacilityByTenant(tenantID)
            .subscribe((res) => {
                if(res.length >0){
                 
                    this.facilitygrouplist = res;
                    this.addFacilitesToSignal(this.facilitygrouplist)
                    const allOption: any = {
                        id: 0,
                        name: 'Select',
                        AssestType: 'Select',
                        flag: ''
                    };
    
                    // Add the "All" option to the beginning of the list
                    this.facilitygrouplist.unshift(allOption);
    
                    this.lfgcount = this.facilitygrouplist.length;
                    localStorage.setItem('FacilityGroupCount', String(this.lfgcount));

                }
            });
    };

    GetSubGroupList(tenantID) {
        this.facilitysubgrouplist = []
        if (this.loginInfo.role === this.excludedRole) {
            return;
        }
        const formData = new URLSearchParams();
        formData.set('tenantID', tenantID)
        this.facilityService
            .getActualSubGroups(formData.toString())
            .subscribe((res) => {
            
                if(res.success == true){
                    this.facilitysubgrouplist = res.categories;
                   console.log();
                    const allOption: any = {
                        id: 0,
                        name: 'Select',
                        flag: ''
                    };
    
                    // Add the "All" option to the beginning of the list
                    this.facilitysubgrouplist.unshift(allOption);
                  
                }
            });
    };

    addFacilitesToSignal(facilites: facilities[]) {
        const editedfacility = facilites.slice(0);
        this.facilityService.AddFacilites(editedfacility)
    }

}
