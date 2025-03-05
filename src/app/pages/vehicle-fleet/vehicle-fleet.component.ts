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
import { TreeviewItem, TreeviewEventParser, OrderDownlineTreeviewEventParser, TreeviewConfig } from '@treeview/ngx-treeview';
import * as XLSX from 'xlsx';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '@services/app.service';

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
  public jsonData: any[] = [];
  updatedtheme: string;
  superAdminId: any;
  facilityName: any;
  facilityId: any;
  vehicleType: any = '1'


  constructor(
    private companyService: CompanyService,
    private notification: NotificationService,
    private facilityService: FacilityService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private themeservice: ThemeService,
    private activatedRoute: ActivatedRoute,
    private appService: AppService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.facilityName = params['name'];
      this.facilityId = params['id'];
    })
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

    if (this.loginInfo.role == 'Auditor') {
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

  onVehicleTypeChange(event: any) {
    console.log("Selected Vehicle Type:", this.vehicleType);
    // You can perform any other action based on the selected value
  }

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
  };


  onPurchaseGoodsUpload(event: any, fileUpload: any) {
    console.log(event);
    const file = event[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Read first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert to JSON
      this.jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Convert array to key-value pairs
      const jsonReading = this.convertToKeyValue(this.jsonData);
      this.jsonData = jsonReading.filter(items => items['Vehicle Type'] != '' || items['Vehicle Model'] != '');
      
      setTimeout(() => {
        fileUpload.clear();
      }, 1000);


    };
    reader.readAsArrayBuffer(file);
  };

  convertToKeyValue(data: any[]): any[] {
    if (data.length < 2) return []; // Ensure at least headers and one row exist

    const headers = data[0]; // Extract headers
    return data.slice(1).map((row) => {
      let obj: any = {};
      headers.forEach((header: string, index: number) => {
        let value = row[index] || '';

        // Convert Excel date serial number to readable date
        if (header.includes('Date') && typeof value === 'number') {
          value = XLSX.SSF.format('dd-mm-yyyy', value); // Converts to "dd-mm-yyyy"
        }

        obj[header] = value;
      });
      return obj;
    });
  };

  saveVehicleFleet(){
    const payload = this.jsonData.map(row => ({
      vehicle_model: row['Vehicle Model'],
      vehicle_type: row['Vehicle Type'],
      vehicle_subtype: row['Vehicle Sub-Type'],
      type_engine: row['Type of Engine'],
      charging_outside: row['Charging % Outside (If EV / Hybrid)'],
      acquisition_date: row['Acquisition Date']
  }));
  const stringify = JSON.stringify(payload);

  let formData = new URLSearchParams();
  // formData.set('month', monthString);
  formData.set('facility_id', this.facilityId);
  formData.set('category', this.vehicleType);
  formData.set('vehicleJson', stringify);
  // formData.set('vehicle_type', this.facilityID);
  // formData.set('vehicle_subtype', purchaseTableStringfy);
  // formData.set('type_engine', monthString);
  // formData.set('charging_outside', monthString);
  // formData.set('acquisition_date', monthString);


  this.appService.postAPI('/add-vehicle-feet', formData.toString()).subscribe({
      next: (response:any) => {

          if (response.success == true) {
              this.notification.showSuccess(
                  response.message,
                  'Success'
              );
          
          
          

          } else {
              this.notification.showError(
                  response.message,
                  'Error'
              );

          }
      },
      error: (err) => {
          this.notification.showError(
              'Data entry added failed.',
              'Error'
          );
          console.error('errrrrrr>>>>>>', err);
      },
      complete: () => console.info('Data entry Added')
  });
  }
}
