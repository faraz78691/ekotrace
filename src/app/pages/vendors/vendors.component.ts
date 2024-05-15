import { Facility } from '@/models/Facility';
import { RoleModel } from '@/models/Roles';
import { UserInfo } from '@/models/UserInfo';
import { Group } from '@/models/group';
import { GroupMapping } from '@/models/group-mapping';
import { LoginInfo } from '@/models/loginInfo';
import { CompanyDetails } from '@/shared/company-details';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ChartOptions } from '@pages/dashboard/ghg-emmissions/ghg-emmissions.component';
import { CompanyService } from '@services/company.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { environment } from 'environments/environment';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexStroke, ApexDataLabels, ApexMarkers, ApexYAxis, ApexGrid, ApexLegend, ApexTitleSubtitle } from 'ng-apexcharts';

import { GroupService } from '@services/group.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '@services/user.service';


interface groupby {
  name: string;
};
@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent {
  // @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @ViewChild('GroupForm', { static: false }) GroupForm: NgForm;
  public companyDetails: CompanyDetails;
  companyData: CompanyDetails = new CompanyDetails();
  public loginInfo: LoginInfo;
  public admininfo: UserInfo;
  public userdetails: UserInfo;
  public groupdetails: any;
  public groupMappingDetails: GroupMapping;
  public admininfoList: UserInfo[] = [];
  facilityList: Facility[] = [];
  RolesList: RoleModel[] = [];
  public groupsList: any[] = [];
  public scope1_data: any[] = [];
  public scope2_data: any[] = [];
  public scope3_data: any[] = [];
  public forecast1_data: any[] = [];
  public forecast2_data: any[] = [];
  public forecast3_data: any[] = [];
  public dashed1_data: any[] = [];
  public dashed2_data: any[] = [];
  public dashed3_data: any[] = [];
  public x_axis_years: any[] = [];
  display = 'none';
  visible: boolean;
  selectedRole = '';
  Alert: boolean = false;
  RoleIcon: string = '';
  FormEdit: boolean = false;
  usernameIsExist: boolean = false;
  emailIstExist: boolean = false;
  Roleaccess = environment.adminRoleId;
  searchData: '';
  isloading: boolean = false;
  maxCharacters: number = 8;
  facilitydata: boolean = false;
  updatedtheme: string;
  groupdata: boolean;
  rootUrl: string;
  uploadedImageUrl: string;
  Groupby: groupby[];
  countryData: Location[] = [];
  stateData: Location[] = [];
  selectedValue: string;
  selectedCountry: any[] = [];
  scopeList: any[] = [];
  emission_activity: any[] = [];
  editBindedCountry: any[] = [];
  target_type: any[] = [];
  targetKPI: any[] = [];
  responseGraph: any[] = [];
  id: any;
  isgroupExist: boolean = false;
  selectedFaciltiy: any;
  selectedState: any;
  GroupByValue: string;
  project_type: string;
  countryUnique: string[];
  stateUnique: string[];
  unlock: string = '';
  ischecked = true;
  selectedRowIndex = 0;
  filledgroup: any;
  project_details = '';
  carbon_offset = '';
  selectedScope: any;
  carbon_credit_value: string;
  type: string;
  date3: string;
  standard: string;
  selectedFile: File
  constructor(
    private companyService: CompanyService,
    private UserService: UserService,
    private GroupService: GroupService,
    private notification: NotificationService,
    private facilityService: FacilityService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private themeservice: ThemeService
  ) {
    this.admininfo = new UserInfo();
    this.userdetails = new UserInfo();
    this.groupdetails = new Array();
    this.groupMappingDetails = new GroupMapping();
    this.loginInfo = new LoginInfo();
    this.companyDetails = new CompanyDetails();
    this.rootUrl = environment.baseUrl + 'uploads/';
    this.selectedValue = '';


   


 
  }
  ngOnInit() {
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;
      // this.facilityGet(this.loginInfo.tenantID);
    }
    this.getTenantsDetailById(Number(this.loginInfo.tenantID));
    // this.GetAllFacility();
    let tenantID = this.loginInfo.tenantID;
    this.GetVendors();
    this.updatedtheme = this.themeservice.getValue('theme');
  }
  //checks upadated theme
  ngDoCheck() {
    this.updatedtheme = this.themeservice.getValue('theme');
  }

  getTenantsDetailById(id: number) { };


  GetVendors() {
    //   let formData = new URLSearchParams();

    //   formData.set('tenant_id', tenantID.toString());

    this.GroupService.getVendors().subscribe({
      next: (response) => {

        if (response.success == true) {
          this.groupsList = response.categories;
          if (this.groupsList.length > 0) {
            this.groupdetails = this.groupsList[0];
            this.groupdata = true;
          } else {
            this.groupdata = false;
          }
   
        }
      },
      error: (err) => {
        console.error('errrrrrr>>>>>>', err);
      },
      complete: () => console.info('Group Added')
    });
  };


  //method to add new group
  saveOffset(data: NgForm) {

    const formData = new URLSearchParams();

    formData.append('name', data.value.vendor_name);
    formData.append('address', data.value.address);
  

    this.GroupService.addVendors(formData.toString()).subscribe({
      next: (response) => {
        if (response.success == true) {
          this.visible = false;
          this.notification.showSuccess(
            ' Vendor Added successfully',
            'Success'
          );
          this.GetVendors();
          this.GroupForm.reset();
        }
        // return
        //   this.getOffset(this.loginInfo.tenantID);
        this.visible = false;
 
      },
      error: (err) => {
        this.notification.showError('Group added failed.', 'Error');
        console.error('errrrrrr>>>>>>', err);
      },
      complete: () => console.info('Group Added')
    });
  };


  ViewGraph(percentage, base_year, target_year, intensity, scope) {
    console.log(intensity);

    const formData = new URLSearchParams();

    formData.append('percentage', percentage);
    formData.append('base_year', base_year);
    formData.append('target_year', target_year);
    if (intensity == 'Emission Reduction') {
      formData.append('intensity', 'A');
    } else {
      formData.append('intensity', 'P');
    }


    this.GroupService.getGraphsTarget(formData.toString()).subscribe({
      next: (response) => {
        if (response.success == true) {
          const Data = response;
       


          this.visible = false;

          this.GroupForm.reset();
        }else{
          this.notification.showInfo('Enter base year and current year emissions','')
        }
      },
      error: (err) => {
        this.notification.showError('Group added failed.', 'Error');
        console.error('errrrrrr>>>>>>', err);
      },
      complete: () => console.info('Group Added')
    });
  }

  



  //method for update group detail by id
  updateGroup(id: any, data: NgForm) {
 
    let tenantID = this.loginInfo.tenantID;
    let formData = new URLSearchParams();
    formData.set('groupId', id);
    formData.set('groupname', this.groupdetails.groupname);
    // formData.set('tenantID',  this.groupdetails.tenantID.toString());
    formData.set('facility', this.selectedFaciltiy);
    this.GroupService.newEditGroup(formData.toString()).subscribe({
      next: (response) => {
        console.log(response);
        this.GetVendors();

        this.visible = false;
        this.notification.showSuccess(
          'Group Edited successfully',
          'Success'
        );
      },
      error: (err) => {
        this.notification.showError('Group edited failed.', 'Error');
        console.error(err);
      },
      complete: () => console.info('Group edited')
    });
  }

  //retrieves all facilities for a given tenant

  //handles the closing of a dialog
  onCloseHandled() {
    this.visible = false;
    this.isloading = false;
    let tenantID = this.loginInfo.tenantID;

    this.GetVendors();
  }
  //display a dialog for editing a group
  showEditGroupDialog(groupdetails) {
    this.visible = true;
    this.FormEdit = true;

    this.filledgroup = groupdetails as GroupMapping;

    if (this.filledgroup.groupBy === 'Country') {
      this.selectedCountry = [];
      this.filledgroup.groupMappings.forEach((element) => {
        this.selectedCountry.push(element.countryId);
      });
    } else if (this.filledgroup.groupBy === 'State') {
      this.selectedState = [];
      this.filledgroup.groupMappings.forEach((element) => {
        this.selectedState.push(element.stateId);
      });
    } else if (this.filledgroup.groupBy === 'Facility') {
      this.selectedFaciltiy = [];
      this.filledgroup.groupMappings.forEach((element) => {
        this.selectedFaciltiy.push(element.facilityId);
      });
    }
  }
  //display a dialog for add a group.
  showAddGroupDialog() {
    this.visible = true;
    this.groupdetails = new Group();
    this.FormEdit = false;
    this.resetForm();
  }
  //sets the selected group details
  selectGroup(group: Group, index: number) {
    this.selectedRowIndex = index;
    this.groupdetails = group;
    console.log(
      '🚀 ~ file: group.component.ts:304 ~ GroupComponent ~ selectGroup ~ this.groupdetails:',
      this.groupdetails
    );
  }
  //The removeCss function is used to remove CSS styles applied to the body element
  removeCss() {
    document.body.style.position = '';
    document.body.style.overflow = '';
  }

  //method for reset form
  resetForm() {
    this.GroupForm.resetForm();
  }
  //sets the value of the unlock variable to the provided groupId
  UnlockComplete(groupId) {
    this.unlock = groupId;
  }
  //method is used to check the existence of a group by its ID
  CheckGroupExist(id) {
    this.GroupService.CheckGroupExist(id).subscribe((result) => {
      this.isgroupExist = result;
    });
  }
  // checks if a country is selected based on its countryId.
  isCountrySelected(countryId: any): boolean {
    return this.selectedCountry.includes(countryId);
  }
  //method for delete a group by id
  deleteGroup(event: Event, id) {
    let tenantID = this.loginInfo.tenantID;
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let formData = new URLSearchParams();
        formData.set('groupId', id);

        this.GroupService.newdeleteGroups(formData.toString()).subscribe((result) => {
          if (localStorage.getItem('FacilityGroupCount') != null) {
            let fgcount =
              localStorage.getItem('FacilityGroupCount');
            let newcount = Number(fgcount) - 1;
            localStorage.setItem(
              'FacilityGroupCount',
              String(newcount)
            );
          }

          this.GetVendors();
        });

        this.messageService.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: 'Group Deleted Succesfully'
        });
      },
      reject: () => {

        this.GetVendors();
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'Group not Deleted'
        });
      }
    });
  };
  //method for get facility by id
  // facilityGet(tenantId) {
  //     this.facilityService.FacilityDataGet(tenantId).subscribe((response) => {
  //         this.facilityList = response;
  //         console.log(
  //             '🚀 ~ file: group.component.ts:370 ~ GroupComponent ~ this.facilityService.FacilityDataGet ~ this.facilityList:',
  //             this.facilityList
  //         );
  //         const uniqueCountries = new Set(
  //             this.facilityList.map((item) => item.countryName)
  //         );
  //         this.countryData = Array.from(uniqueCountries).map((country) => {
  //             return {
  //                 name: country,
  //                 shortName: '', // Provide the appropriate value for shortName
  //                 id: this.facilityList.find(
  //                     (item) => item.countryName === country
  //                 ).countryID
  //             };
  //         });

  //         const uniqueStates = new Set(
  //             this.facilityList.map((item) => item.stateName)
  //         );
  //         this.stateData = Array.from(uniqueStates).map((state) => {
  //             return {
  //                 name: state,
  //                 shortName: '', // Provide the appropriate value for shortName
  //                 id: this.facilityList.find(
  //                     (item) => item.stateName === state
  //                 ).stateID
  //             };
  //         });
  //     });
  // }
}

