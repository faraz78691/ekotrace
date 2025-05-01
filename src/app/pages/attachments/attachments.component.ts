import { Facility } from '@/models/Facility';
import { GroupMapping } from '@/models/group-mapping';
import { LoginInfo } from '@/models/loginInfo';
import { RoleModel } from '@/models/Roles';
import { UserInfo } from '@/models/UserInfo';
import { CompanyDetails } from '@/shared/company-details';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppService } from '@services/app.service';
import { CompanyService } from '@services/company.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { environment } from 'environments/environment';

import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent {
  isHowtoUse = false;
  @ViewChild('GroupForm', { static: false }) GroupForm: NgForm;
  @ViewChild('projectionForm', { static: false }) projectionForm: NgForm;
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
  facilityData: Facility[] = [];
  selectedFacility: any;
  public updatedtheme: string;
  public rootUrl: string;
  public superAdminTenentID: any;


  constructor(
    private companyService: CompanyService,

    private notification: NotificationService,
    private facilityService: FacilityService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private themeservice: ThemeService,
    private appService: AppService
  ) {
    this.admininfo = new UserInfo();
    this.userdetails = new UserInfo();
    this.groupdetails = new Array();
    this.groupMappingDetails = new GroupMapping();
    this.loginInfo = new LoginInfo();
    this.companyDetails = new CompanyDetails();
    this.rootUrl = environment.baseUrl + 'uploads/';

  }
  ngOnInit() {
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;
      // this.facilityGet(this.loginInfo.tenantID);
    }

    // this.GetAllFacility();
    let tenantID = this.loginInfo.tenantID;
    this.superAdminTenentID = this.loginInfo.super_admin_id;

    this.updatedtheme = this.themeservice.getValue('theme');

    this.GetFacilityList(tenantID);
  };




  GetFacilityList(tenantID: any) {
    this.facilityService
      .newGetFacilityByTenant(tenantID)
      .subscribe((res) => {
        if (res.length > 0) {

          this.facilityData = res;
          this.selectedFacility = this.facilityData[0].id;


        }
      });
  };












}
