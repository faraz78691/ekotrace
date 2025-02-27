import { Facility } from '@/models/Facility';
import { GroupMapping } from '@/models/group-mapping';
import { LoginInfo } from '@/models/loginInfo';
import { RoleModel } from '@/models/Roles';

import { CompanyDetails } from '@/shared/company-details';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ChartOptions } from '@pages/finance-dashboard/finance-dashboard.component';
import { CompanyService } from '@services/company.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { environment } from 'environments/environment';

import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-vehicle-fleet',
  templateUrl: './vehicle-fleet.component.html',
  styleUrls: ['./vehicle-fleet.component.scss']
})
export class VehicleFleetComponent {
 // @ViewChild("chart") chart: ChartComponent;
 public chartOptions: Partial<ChartOptions>;
 @ViewChild('GroupForm', { static: false }) GroupForm: NgForm;
 public companyDetails: CompanyDetails;
 companyData: CompanyDetails = new CompanyDetails();
 public loginInfo: LoginInfo;

 public groupdetails: any;
 public groupMappingDetails: GroupMapping;

 facilityList: Facility[] = [];
 RolesList: RoleModel[] = [];
 public groupsList: any[] = [];
 updatedtheme: string;
 superAdminId:any;





 constructor(
   private companyService: CompanyService,
   private notification: NotificationService,
   private facilityService: FacilityService,
   private confirmationService: ConfirmationService,
   private messageService: MessageService,
   private themeservice: ThemeService
 ) {

   this.groupdetails = new Array();
   this.groupMappingDetails = new GroupMapping();
   this.loginInfo = new LoginInfo();
   this.companyDetails = new CompanyDetails();
 };

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
   this.superAdminId = this.loginInfo.super_admin_id;
   this.GetVendors();

   this.updatedtheme = this.themeservice.getValue('theme');
 }
 //checks upadated theme
 ngDoCheck() {
   this.updatedtheme = this.themeservice.getValue('theme');
 }

 getTenantsDetailById(id: number) { };


 GetVendors() {

  
 };



 //method to add new group
 saveVendors(data: any) {

   if(this.loginInfo.role == 'Auditor'){
     this.notification.showInfo('You are not Authorized', '');
     return
 }
   // console.log(data.value);
   
   if (data.invalid) {
     return; // Stop if form is invalid
   }
   const formData = new URLSearchParams();

   formData.append('name', data.value.vendor_name);
   formData.append('country_id', data.value.country);
   formData.append('address', data.value.address);
   formData.append('refer_id', data.value.refer_id);
   formData.append('tenant_id', this.superAdminId);
   formData.append('scorecard', data.value.scorecard);
   formData.append('targetStatus', data.value.targetStatus);


  //  this.GroupService.addVendors(formData.toString()).subscribe({
  //    next: (response) => {
  //      if (response.success == true) {
  //        this.visible = false;
  //        this.notification.showSuccess(
  //          ' Vendor Added successfully',
  //          'Success'
  //        );
  //        this.GetVendors();
  //        this.GroupForm.reset();
  //      }
  //      // return
  //      //   this.getOffset(this.loginInfo.tenantID);
  //      this.visible = false;

  //    },
  //    error: (err) => {
  //      this.notification.showError('Group added failed.', 'Error');
  //      console.error('errrrrrr>>>>>>', err);
  //    },
  //    complete: () => console.info('Group Added')
  //  });
 };

 viewDetails(details: any) {
  

 };








 //handles the closing of a dialog
 onCloseHandled() {
 
   let tenantID = this.loginInfo.tenantID;

   this.GetVendors();
 }

 selectGroup(group: any, index: number) {

   this.groupdetails = group;

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
 
 CheckGroupExist(id) {

 }


 handleDropdownShow(): void {
   window.addEventListener('scroll', this.preventScroll, true);
 }
 
 handleDropdownHide(): void {
   window.removeEventListener('scroll', this.preventScroll, true);
 }
 
 preventScroll(event: Event): void {
   const dropdown = document.querySelector('.p-dropdown-panel');
   if (dropdown) {
     // console.log('Preventing scroll');
     event.stopPropagation();
   }
 }
}
