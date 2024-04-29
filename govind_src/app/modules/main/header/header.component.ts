import { Facility } from '@/models/Facility';
import { FacilityGroupList } from '@/models/FacilityGroupList';
import { facilities } from '@/models/facilities';
import { LoginInfo } from '@/models/loginInfo';
import { CompanyDetails } from '@/shared/company-details';
import { AppState } from '@/store/state';
import { ToggleControlSidebar, ToggleSidebarMenu } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppService } from '@services/app.service';
import { CompanyService } from '@services/company.service';
import { FacilityService } from '@services/facility.service';
import { ThemeService } from '@services/theme.service';
import { environment } from 'environments/environment';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';

interface CustomFacility {
    id: any;
    flag: any;
}
const BASE_CLASSES = 'main-header navbar navbar-expand ';
@Component({
    selector: 'app-header',
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
    facilitygrouplist: facilities[] = [];
    @ViewChild('menu', { static: true }) menu: any;
    constructor(
        private appService: AppService,
        private companyService: CompanyService,
        private store: Store<AppState>,
        private themeservice: ThemeService,
        private facilityService: FacilityService
    ) {
        this.companyDetails = new CompanyDetails();
        this.rootUrl = environment.baseUrl + 'uploads/';
        this.facilityGroup = new FacilityGroupList();
    }
    ngOnInit() {
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
                  this.GetFacilityGroupList(this.loginInfo.tenantID);
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
    ngDoCheck() {
        // this.GetFacilityGroupList(this.loginInfo.tenantID);
        // this.updatedtheme = this.themeservice.getValue('theme');
        // this.uploadedImageUrl = localStorage.getItem('uploadedImageUrl');
        // if (localStorage.getItem('companyName') != null) {
        //     this.loginInfo.companyName = localStorage.getItem('companyName');
        // }
        // if (localStorage.getItem('FacilityGroupCount') != null) {
        //     let fgcount = localStorage.getItem('FacilityGroupCount');
        //     if (this.lfgcount != Number(fgcount)) {
        //     }
        // }
    }

    checkFacilityID() {
    
        localStorage.setItem('SelectedfacilityID', this.selectedFacilityID.id);
        localStorage.setItem('Flag', this.selectedFacilityID.flag);
    };

    logout() {
        this.appService.logout();
    }

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


    }

    clicknotificationicon() {
        this.notificationIcon = true;
    }
    toggleMenu(event: Event): void {
        this.menu.toggle(event);
    }

//     GetFacilityGroupList(tenantID) {
// console.log(tenantID);
//         if (this.loginInfo.role === this.excludedRole) {
//             return;
//         }
//         this.facilityService
//             .newGetFacilityGroupList(tenantID)
//             .subscribe((res) => {
//                 console.log("response iidd",res);
//                 this.facilitygrouplist = res.categories[0].facilities;
//                 const allOption: FacilityGroupList = {
//                     id: 0,
//                     name: 'All',
//                     flag: ''
//                 };

//                 // Add the "All" option to the beginning of the list
//                 this.facilitygrouplist.unshift(allOption);

//                 this.lfgcount = this.facilitygrouplist.length;
//                 localStorage.setItem('FacilityGroupCount', String(this.lfgcount));
//             });


//     }
    GetFacilityGroupList(tenantID) {

        if (this.loginInfo.role === this.excludedRole) {
            return;
        }
        this.facilityService
            .newGetFacilityByTenant(tenantID)
            .subscribe((res) => {

                this.facilitygrouplist = res;
                this.addFacilitesToSignal(this.facilitygrouplist)
                const allOption: FacilityGroupList = {
                    id: 0,
                    name: 'Select',
                    flag: ''
                };

                // Add the "All" option to the beginning of the list
                this.facilitygrouplist.unshift(allOption);

                this.lfgcount = this.facilitygrouplist.length;
                localStorage.setItem('FacilityGroupCount', String(this.lfgcount));
            });


    };

    addFacilitesToSignal(facilites:facilities[]){
        
        const editedfacility = facilites.slice(0);
        this.facilityService.AddFacilites(editedfacility)
    }

}
