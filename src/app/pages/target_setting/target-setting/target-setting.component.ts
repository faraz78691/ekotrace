import { Facility } from '@/models/Facility';
import { RoleModel } from '@/models/Roles';
import { UserInfo } from '@/models/UserInfo';
import { Group } from '@/models/group';
import { GroupMapping } from '@/models/group-mapping';
import { LoginInfo } from '@/models/loginInfo';
import { CompanyDetails } from '@/shared/company-details';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CompanyService } from '@services/company.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { environment } from 'environments/environment';


import {GroupService} from '@services/group.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import {UserService} from '@services/user.service';

interface groupby {
  name: string;
};


@Component({
  selector: 'app-target-setting',
  templateUrl: './target-setting.component.html',
  styleUrls: ['./target-setting.component.scss']
})
export class TargetSettingComponent {
  @ViewChild('GroupForm', {static: false}) GroupForm: NgForm;
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
  public groupsList: Group[] = [];
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
  selectedScope:any;
  carbon_credit_value:string;
  type:string;
  date3:string;
  standard:string;
  selectedFile:File
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
      
      this.Groupby = [
          {
              name: 'Renewable Energy'
          },
          {
              name: 'Nature Based'
          },
          {
              name: 'Energy Efficiency'
          },
          {
              name: 'Community Project'
          },
          {
              name: 'Carbon Sequestration'
          },
          {
              name: 'Others'
          }
      ];
      this.emission_activity = [
          {
              e_act: 'Scope 1'
          },
          {
            e_act: 'Scope 1 & 2'
          },
          {
            e_act: 'Scope 3'
          },
          {
            e_act: 'Scope 1,2 & 3'
          }
      ];
      this.target_type = [
          {
              e_act: 'Economic Intensity Convergence'
          },
          {
            e_act: 'Physical Intensity Convergence'
          },
          {
            e_act: 'Economic Intensity Convergence'
          }
      ];
      this.targetKPI = [
          {
              e_act: 'Supplier Engagement'
          },
          {
            e_act: 'Renewable energy'
          }
         
      ];
      
 
      this.scopeList = [
          { id: 1,
              name: 'Scope 1'
          },
          { id:2,
              name: 'Scope 2'
          },
          { id:3,
              name: 'Scope 3'
          }
      ];
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
      this.GetTarget();
      this.updatedtheme = this.themeservice.getValue('theme');
  }
  //checks upadated theme
  ngDoCheck() {
      this.updatedtheme = this.themeservice.getValue('theme');
  }

  getTenantsDetailById(id: number) {};


   GetTarget() {
    //   let formData = new URLSearchParams();

    //   formData.set('tenant_id', tenantID.toString());
  
      this.GroupService.getTargetSetting().subscribe({
          next: (response) => {
             
              if(response.success == true)
              {
                  this.groupsList = response.orders;
                  if (this.groupsList.length > 0) {
                      this.groupdetails = this.groupsList[0];
                      this.groupdata = true;
                  } else {
                      this.groupdata = false;
                  }
                  localStorage.setItem('GroupCount', String(this.groupsList.length));
                  this.unlock = this.groupdetails.id.toString();
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
  
      formData.append('target_name',data.value.target_name);
      formData.append('emission_activity',data.value.emission_activity);
      formData.append('target_type',data.value.target_type);
      formData.append('base_year',data.value.base_year);
      formData.append('target_year',data.value.target_year);
      formData.append('target_emission_change',  data.value.target_emission_change);
      formData.append('other_target_kpichange',data.value.other_target_kpichange);
      formData.append('other_target_kpi',data.value.other_target_kpi);
    
      this.GroupService.addTargetSetting(formData).subscribe({
          next: (response) => {
              if(response.success == true)
              {
                  this.visible = false;
                  this.notification.showSuccess(
                      ' Offset Added successfully',
                      'Success'
                  );
                  this.GetTarget();
                  this.GroupForm.reset();
              }
              // return
            //   this.getOffset(this.loginInfo.tenantID);
              this.visible = false;
              if (localStorage.getItem('FacilityGroupCount') != null) {
                  let fgcount = localStorage.getItem('FacilityGroupCount');
                  let newcount = Number(fgcount) + 1;
                  localStorage.setItem(
                      'FacilityGroupCount',
                      String(newcount)
                  );
              }
          },
          error: (err) => {
              this.notification.showError('Group added failed.', 'Error');
              console.error('errrrrrr>>>>>>', err);
          },
          complete: () => console.info('Group Added')
      });
  };


  
  //method for update group detail by id
  updateGroup(id: any, data: NgForm) {
      // this.groupdetails.groupMappings = [];
      // if (this.groupdetails.groupBy === 'Country') {
      //     this.selectedCountry.forEach((val) => {
      //         this.groupMappingDetails = new GroupMapping();
      //         this.groupMappingDetails.stateId = 0;
      //         this.groupMappingDetails.groupId = 0;
      //         this.groupMappingDetails.facilityId = 0;
      //         this.groupMappingDetails.countryId = val;
      //         this.groupdetails.groupMappings.push(this.groupMappingDetails);
      //     });
      // } else if (this.groupdetails.groupBy === 'State') {
      //     this.selectedState.forEach((val) => {
      //         this.groupMappingDetails = new GroupMapping();
      //         this.groupMappingDetails.stateId = val;
      //         this.groupMappingDetails.countryId = 0;
      //         this.groupMappingDetails.groupId = 0;
      //         this.groupMappingDetails.facilityId = 0;
      //         this.groupdetails.groupMappings.push(this.groupMappingDetails);
      //     });
      // } else {
      //     this.selectedFaciltiy.forEach((val) => {
      //         this.groupMappingDetails = new GroupMapping();
      //         this.groupMappingDetails.stateId = 0;
      //         this.groupMappingDetails.countryId = 0;
      //         this.groupMappingDetails.groupId = 0;
      //         this.groupMappingDetails.facilityId = val;
      //         this.groupdetails.groupMappings.push(this.groupMappingDetails);
      //     });
      // }
      let tenantID = this.loginInfo.tenantID;
      let formData = new URLSearchParams();
      formData.set('groupId',id);
      formData.set('groupname',this.groupdetails.groupname);
      // formData.set('tenantID',  this.groupdetails.tenantID.toString());
      formData.set('facility',this.selectedFaciltiy);
      this.GroupService.newEditGroup(formData.toString()).subscribe({
          next: (response) => {
              console.log(response);
              this.GetTarget();

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

      this.GetTarget();
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
  selectGroup(group: Group,index: number) {
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
              formData.set('groupId',id);
             
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

                  this.GetTarget();
              });

              this.messageService.add({
                  severity: 'success',
                  summary: 'Confirmed',
                  detail: 'Group Deleted Succesfully'
              });
          },
          reject: () => {
 
            this.GetTarget();
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