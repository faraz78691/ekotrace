import { Group } from '@/models/group';
import { GroupMapping } from '@/models/group-mapping';
import { LoginInfo } from '@/models/loginInfo';
import { UserInfo } from '@/models/UserInfo';
import { CompanyDetails } from '@/shared/company-details';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CompanyService } from '@services/company.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { environment } from 'environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-data-progress',
  templateUrl: './data-progress.component.html',
  styleUrls: ['./data-progress.component.scss']
})
export class DataProgressComponent {
 // @ViewChild("chart") chart: ChartComponent;

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
 superAdminId: any;
 vendorId: any;
 carbon_credit_value: string;
 type: string;
 date3: string;
 standard: string;
 selectedFile: File;
 dataProgress: any[] = []
 facilityData: any[] = []
 facilities:any;
 merrgeProgress:any[]= [];
 dataPreparer:any;



 transformedData: any[] = [];

 public loginInfo: LoginInfo;
 constructor(
   private companyService: CompanyService,
   private notification: NotificationService,
   private facilityService: FacilityService,
   private confirmationService: ConfirmationService,
   private messageService: MessageService,
   private themeservice: ThemeService
 ) {




 }
 ngOnInit() {
   if (localStorage.getItem('LoginInfo') != null) {
     let userInfo = localStorage.getItem('LoginInfo');
     let jsonObj = JSON.parse(userInfo); // string to "any" object first
     this.loginInfo = jsonObj as LoginInfo;
     // this.facilityGet(this.loginInfo.tenantID);
   }
   this.getTenantsDetailById(Number(this.loginInfo.tenantID));
   let tenantID = this.loginInfo.tenantID;
   this.superAdminId = this.loginInfo.super_admin_id;
   this.GetFacilityList(tenantID);
 

 }
 //checks upadated theme


 getTenantsDetailById(id: number) { };


 getDataProgress() {
     let formData = new URLSearchParams();

     formData.set('facilities', this.facilities.toString());

   this.facilityService.getDataProgress(formData).subscribe({
     next: (response) => {

       if (response.success == true) {
         this.dataProgress = response.FinalProgress;
         this.transformedData = this.mergeData(
          this.transformData(this.dataProgress),
          this.facilityData
        );
        console.log(   this.transformedData );
   const tt = this.transformedData[0]['1'];
   console.log(tt);
   const yy = [tt];
const uu = yy;
     this.dataPreparer =uu
        console.log("sfd" ,  this.dataPreparer );
       }
     },
     error: (err) => {
       console.error('errrrrrr>>>>>>', err);
     },
     complete: () => console.info('Group Added')
   });
 };

 transformData(data: any[]) {
  return data.map((facility, index) => {
    const facilityId = index + 1; // Assuming IDs are sequential
    const facilityKey = `${facilityId}`;
    const facilityScopes = facility[facilityKey].reduce((scopes: any, item: any) => {
      const scopeKey = item.scope;
      if (!scopes[scopeKey]) {
        scopes[scopeKey] = [];
      }
      scopes[scopeKey].push(item);
      return scopes;
    }, {});

    return {
      facilityId: facilityId,
      [facilityKey]: facilityScopes,
      scope1: facility.scope1,
      scope2: facility.scope2,
      scope3: facility.scope3
    };
  });
}

mergeData(facilityData: any[], assetTypeData: any[]) {
  return facilityData.map((facility) => {
    const asset = assetTypeData.find((a) => a.id === facility.facilityId);
    return {
      ...facility,
      facilityName: asset ? asset.AssestType : `Facility ${facility.facilityId}`,
      assetName: asset ? asset.name : null
    };
  });
};


onFacilityClick(id:any){

}


 //method to add new group


 viewDetails(details: any) {
  //  this.vendorId = details.id;
  //  console.log(details);
  //  this.visible = true;
  //  this.FormEdit = true;
  //  const countryId = this.countryData.filter(items => items.Name == details.country_name);

  //  let obj = {
  //    vendor_name: details.name,
  //    refer_id: details.refer_id,
  //    address: details.address,
  //    country: countryId[0].ID
  //  };

  //  this.GroupForm.control.patchValue(obj);

 };




 //method to add new group




 //method for update group detail by id


 //retrieves all facilities for a given tenant

 //handles the closing of a dialog

 //display a dialog for editing a group

 //display a dialog for add a group.
//  showAddGroupDialog(id: any) {
//    if (id == 2) {
//      this.visible = false;
//      this.visible2 = true;
//      this.groupdetails = new Group();
//      this.FormEdit = false;
//      this.resetForm();
//    } else {
//      this.visible2 = false;
//      this.visible = true;
//      this.groupdetails = new Group();
//      this.FormEdit = false;
//      this.resetForm();
//    }
//  }



 //method for delete a group by id

 
 GetFacilityList(tenantID:any) {
 

  this.facilityService
      .newGetFacilityByTenant(tenantID)
      .subscribe((res) => {
          if(res.length >0){
            const facility = res.map(items=>items.id)
            const facilityName = res.map(items=>items.AssestType)
              this.facilities = facility;
              this.facilityData = res;
              this.getDataProgress()
              // this.facilities = facility;
              
        
          }
      });
};
}
