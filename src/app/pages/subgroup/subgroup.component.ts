import { Facility } from '@/models/Facility';
import { ManageDataPoint1 } from '@/models/ManageDataPoint';
import { ManageDataPointCategory } from '@/models/ManageDataPointCategory';
import { UserInfo } from '@/models/UserInfo';
import { LoginInfo } from '@/models/loginInfo';
import { savedDataPoint } from '@/models/savedDataPoint';
import { SavedDataPointCategory } from '@/models/savedDataPointCategory';
import { SavedDataPointSubCategory } from '@/models/savedDataPointSubcategory';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { TrackingService } from '@services/tracking.service';

import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '@services/user.service';
@Component({
  selector: 'app-subgroup',
  templateUrl: './subgroup.component.html',
  styleUrls: ['./subgroup.component.scss']
})
export class SubgroupComponent {
  showDialog() {
    this.visible = true;
}
@ViewChild('addCompForm', { static: false }) addCompForm: NgForm;
public loginInfo: LoginInfo;
public userdetails: UserInfo;
public savedDataPointCat: SavedDataPointCategory;
public savedDataPointSubCat: SavedDataPointSubCategory;
public admininfo: UserInfo;
facilityDetails :any;
Add_Editdisplay = 'none';
deleteDialog = 'none';
AddManageDataPoint = 'none';
FacilityData = 'none';
FacilityFullData = 'none';
NoData = 'none';
visible: boolean;
DP_BoxVisible: boolean;
dp_data_box: 'none';
unlock: number = 0;
Alert: boolean = false;
id_var: any;
isEdit: boolean;
LocData: Facility[] = [];
admininfoList = new Array<any>();
public managerList: UserInfo[] = [];
public staffList: UserInfo[] = [];
dropCountManager = document.getElementsByClassName('dropItemManager');
dropCountStaff = document.getElementsByClassName('dropItemStaff');
facilityrefresh = true;
items: MenuItem[];
active: MenuItem;
selectedValues: string[] = [];
checked: boolean = false;
value_tab = 'Scope 1';
searchData;
searchDataPoint: string;
countryData: any[] = [];
stateData: Location[] = [];
cityData: Location[] = [];
datapointCatagory: ManageDataPointCategory[] = [];
selectedCountry: any;
selectedState: any;
selectedCity: any;
// seedData: ManageDataPoint[] = [];
seedData: any;
scope1Category: any[] = [];
scope2Category: any[] = [];
scope3Category: any[] = [];
savedData: savedDataPoint[] = [];
public manageDataPoint1: ManageDataPoint1[] = [];
public savedDataPoint: savedDataPoint[] = [];
model2Data;
catblank = true;
updatedtheme: string;
getfacilitystring: string;
managerList1: any[] = [];
staffList1: any[] = [];
year: Date;
groupedCities: any[];
selectedCities4: any[];
selectedScope1: any[] = [];
selectedScope2: any[] = [];
selectedScope3: any[] = [];
standardList: any[] = [];

constructor(
    private facilityService: FacilityService,
    private UserService: UserService,
    private notification: NotificationService,
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private themeservice: ThemeService,
    private trackingService: TrackingService,

) {
    this.standardList = [
        {
            name: 'Verra',
            value:1
        },
        {
            name: 'Gold Standard (GS)',
            value:2
        },
        {
            name: 'Clean Development Mechanism (CDM)',
            value:3
        },
        {
            name: 'American Carbon Standard (ACR)',
            value:4
        },
        {
            name: 'Climate Action Reserve (CAR)',
            value:5
        },
        {
            name: 'Others',
            value:6
        }
    ];
    this.selectedCountry = 'Gold Standard (GS)'
    this.facilityDetails = new Facility();
    this.loginInfo = new LoginInfo();
    this.admininfo = new UserInfo();
    this.userdetails = new UserInfo();
    this.savedDataPointCat = new SavedDataPointCategory();
    this.savedDataPointSubCat = new SavedDataPointSubCategory();
    this.year = new Date();
}
ngOnInit() {
    if (localStorage.getItem('LoginInfo') != null) {
        let userInfo = localStorage.getItem('LoginInfo');
        let jsonObj = JSON.parse(userInfo); // string to "any" object first
        this.loginInfo = jsonObj as LoginInfo;
    }
    let tenantID = this.loginInfo.tenantID;
    if(this.loginInfo.role =='Super Admin' || this.loginInfo.role =='Admin'){
    
        this.subGroupGet(tenantID);

    }else{
        this.FacilityData = 'block';
  
        this.NoData = 'none';
    }

    this.items = [
        {
            label: 'Scope 1',
            command: (event) => {
                this.value_tab = event.item.label;
            }
        },
        {
            label: 'Scope 2',
            command: (event) => {
                this.value_tab = event.item.label;
            }
        },
        {
            label: 'Scope 3',
            command: (event) => {
                this.value_tab = event.item.label;
            }
        }
    ];
    this.active = this.items[0];
    this.updatedtheme = this.themeservice.getValue('theme');
    this.AllCountry();
}




//method for update a facility by id
editfacility(id: any, data: NgForm) {
  
    let tenantId = this.loginInfo.tenantID;
    let formdata = new URLSearchParams();
 
    formdata.set('group_id', (this.facilityDetails.id).toString())
    formdata.set('country_id', this.facilityDetails.country_id.toString());
  
    this.facilityService
        .AssignCountrySubGroup(formdata.toString())
        .subscribe({
            next: (response) => {
                this.subGroupGet(tenantId);

                this.visible = false;
                this.facilityrefresh = false;
                this.notification.showSuccess(
                    'Country updated successfully',
                    'Success'
                );
            },
            error: (err) => {
                this.notification.showError(
                    'failed.',
                    'Error'
                );
                console.error(err);
            },
            complete: () => console.info('Facility edited')
        });
}
//Retrieves facility data for the specified tenant ID and updates the UI based on the data availability.
subGroupGet(tenantId) {
    let formdata = new URLSearchParams();

    formdata.set('tenantID', tenantId.toString())
    this.facilityService.getActualSubGroups(formdata).subscribe({
        next: (response: any) => {

            this.LocData = response.categories.reverse();
            this.facilityDetails = this.LocData[0];
            this.managerList1 = [];
            this.staffList1 = [];
           
            this.facilityDetails .userInfoModels.forEach(user => {
                    this.managerList1.push({
                        firstname: user.firstname,
                        lastname: user.lastname
                    });
                });
           
           
            if (this.LocData.length == 0) {

                this.NoData = 'block';
                this.FacilityData = 'none';
                this.FacilityFullData = 'none';
            } else {

                this.FacilityData = 'block';
                this.FacilityFullData = 'flex';
                this.NoData = 'none';
            }
            // if (this.facilityrefresh == true) 
            this.defaultData();
            localStorage.setItem('FacilityCount', String(this.LocData.length));
        }, error: err => {
            console.log(err)
        }
    })
   

};

//retrieves users associated with the facility

tableData(data: any) {
    this.managerList1 = []
    this.id_var = data.id;
    this.getSUbGrupsDetails(data);
}
/* 
The defaultData function sets the default values for the variables id_var, 
tenantId, and facilityDetails based on the first facility
and retrieves users associated with the facility.
*/
defaultData() {
    this.id_var = this.LocData[0].id;
    let tenantId = this.loginInfo.tenantID;
    this.facilityDetails = this.LocData[0];

}

//delete a facility by id
deleteFacility(event: Event, ID: any) {
    let tenantId = this.loginInfo.tenantID;
    this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to delete this facility?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.facilityService.FacilityDelete(ID).subscribe({
                next: (response) => {
                    this.subGroupGet(tenantId);
                    if (
                        localStorage.getItem('FacilityGroupCount') != null
                    ) {
                        let fgcount =
                            localStorage.getItem('FacilityGroupCount');
                        let newcount = Number(fgcount) - 1;
                        localStorage.setItem(
                            'FacilityGroupCount',
                            String(newcount)
                        );
                    }
                    this.notification.showSuccess(
                        'Facility deleted successfully',
                        'success'
                    );
                },
                error: (err) => {
                    this.notification.showError(
                        'Facility deleted failed.',
                        'Error'
                    );
                    console.log(err);
                },
                complete: () => console.info('Facility deleted')
            });
        }
    });
}

//Retrieves the users associated with a specific facility and updates the lists of managers and staff members.
getSUbGrupsDetails(data) {
    this.facilityDetails = data;
   
    this.facilityDetails.userInfoModels.forEach(user => {
            this.managerList1.push({
                firstname: user.firstname,
                lastname: user.lastname
            });
        });
};
//display a dialog for adding a facility
showAddFacilityDialog() {
    this.visible = true;
 
    this.facilityDetails = new Facility();
   
    this.isEdit = false;
    this.resetForm();
}
//display a dialog for editing a facility
showEditFacilityDialog() {
    this.visible = true;
    this.isEdit = true;

    // this.searchState();
    // this.searchCity()
}
//handles the closing of Add facility dialog
closeAddFacilityDialog() {
    this.visible = false;
    this.defaultData();
}
//handles the closing of edit facility dialog
closeEditFacilityDialog() {
    this.visible = false;
}
//display a dialog for manage datapoint
showDP_Dialog() {
    this.DP_BoxVisible = true;
    this.getAllSeedData();
}
//handles the closing of datapoint dialog
closeDp_Dialog() {
    this.DP_BoxVisible = false;
}

sendValue(value: any) {
    this.value_tab = value;
}
//method for retrieve all country name
AllCountry() {
   
    this.facilityService.GetCountry().subscribe({
        next: (response) => {

            this.countryData = response;
           
            // this.facilityDetails.CountryId = 2
           
        },
        error: err => {
            console.log(err)
        }
    });
}
//method for search state
// searchState() {
 
//     this.selectedCountry = this.countryData.find(
//         (country) => country.Name === this.facilityDetails.country_name
//     );
   
//     let formdata = new URLSearchParams();
//     formdata.set('CountryID', this.facilityDetails.CountryId.toString())
//     this.facilityService.newGetState(formdata.toString()).subscribe({
//         next: (response) => {
         
//             this.stateData = response;
//             this.searchCity();
//         }
//     });
// };
//method for search city
// searchCity() {
    
//     let formdata = new URLSearchParams();
//     formdata.set('StateID', this.facilityDetails.StateId.toString())
//     this.facilityService.newGetCity(formdata.toString()).subscribe({
//         next: (response) => {
//             this.cityData = response;
//         }
//     });
// };
//toggles the active state of a manageDataPointSubCategories
updateActiveState(manageDataPointSubCategories: any, event: any) {
    manageDataPointSubCategories.active =
        !manageDataPointSubCategories.active;
};
//method for get all the seed data
getAllSeedData() {
    this.facilityService.getNewSeedData().subscribe({
        next: (response: any) => {


            this.scope1Category = response.scope1;

            // this.scope1Category = [
            //     {
            //         "label": "Stationary Combustion",
            //         "value": 1,
            //         "scopeid": 1,
            //         "items": [
            //             {
            //                 "label": "Liquid Fuels",
            //                 "value":1
            //             },
            //             {
            //                 "label": "Solid Fuels",
            //                 "value": 2
            //             },
            //             {
            //                 "label": "Gaseous Fuels",
            //                 "value": 3
            //             },
            //             {
            //                 "label": "Biofuel",
            //                 "value": 4
            //             },
            //             {
            //                 "label": "Biomass",
            //                 "value": 5
            //             },
            //             {
            //                 "label": "Biogas",
            //                 "value": 6
            //             }
            //         ]
            //     },
            //     {
            //         "label": "Refrigerants",
            //         "value": 2,
            //         "scopeid": 1,
            //         "items": [
            //             {
            //                 "label": "Refrigerants",
            //                 "value": 7
            //             }
            //         ]
            //     },
            //     {
            //         "label": "Fire Extinguisher",
            //         "value": 3,
            //         "scopeid": 1,
            //         "items": [
            //             {
            //                 "label": "Fire Extinguisher (CO2 Type)",
            //                 "value": 8
            //             }
            //         ]
            //     },
            //     {
            //         "label": "Company Owned Vehicles",
            //         "value": 6,
            //         "scopeid": 1,
            //         "items": [
            //             {
            //                 "label": "Passenger Vehicle",
            //                 "value": 10
            //             },
            //             {
            //                 "label": "Delivery Vehicle",
            //                 "value": 11
            //             }
            //         ]
            //     }
            // ],


         
            this.scope2Category = response.scope2;
            this.scope3Category = response.scope3;
         
            this.GetsavedDataPoint(this.facilityDetails.ID);
        }
    });
};

onMultiSelectChange(event: { originalEvent: Event, value: any }) {

  
    this.selectedScope1
    // this.selectedScope1 = event.value.map((item: any) => {

    //   return { groupId: item.scopeid, itemId: item.value };
    // });
}
getAllSeedData2(newfacilityid) {
    this.facilityService.getSeedData().subscribe({
        next: (response) => {
            this.seedData = response;
            this.seedData.forEach((seed) => {
                seed.categorySeedData.forEach((cat) => {
                    cat.subCategorySeedDatas.forEach((subcat) => {
                        subcat.isMandatory = false;
                        subcat.active = false;
                    });
                });
            });
            this.AddDPinfacility(newfacilityid);
        }
    });
}
AddDPinfacility(newfacilityid) {
    this.manageDataPoint1 = []
    this.seedData.forEach(scope => {
        scope.categorySeedData.forEach(cat => {
            cat.subCategorySeedDatas.forEach(subcat => {
                subcat.active = true;
            })
        })
        const mdp = new ManageDataPoint1();
        mdp.scopeID = scope.id;
        mdp.facilityId = newfacilityid;
        mdp.fiscalYear = this.trackingService.getYear(this.year);
        mdp.categorySeedData =
            scope.categorySeedData.map((element) => {
                return {
                    ...element,
                    subCategorySeedDatas:
                        element.subCategorySeedDatas.filter(
                            (subElement) => subElement.active === true
                        )
                };
            });

        this.manageDataPoint1.push(mdp);
    })

    // from here

    this.savedDataPoint = [];
    this.manageDataPoint1.forEach(scopewise => {
        const scopedataforsave = new savedDataPoint();
        scopedataforsave.TenantID = this.loginInfo.tenantID;
        scopedataforsave.facilityId = scopewise.facilityId;
        scopedataforsave.fiscalYear = this.trackingService.getYear(this.year);
        scopedataforsave.scopeID = scopewise.scopeID;
        scopedataforsave.categorySeedData = [];
        scopewise.categorySeedData.forEach((seed) => {
            this.savedDataPointCat = new SavedDataPointCategory();
            this.savedDataPointCat.manageDataPointCategorySeedID = seed.id;
            this.savedDataPointCat.manageDataPointId = seed.manageScopeId;
            this.savedDataPointCat.TenantID = this.loginInfo.tenantID;
            this.savedDataPointCat.subCategorySeedDatas = [];

            scopedataforsave.categorySeedData.push(
                this.savedDataPointCat
            );

            seed.subCategorySeedDatas.forEach((cat) => {
                this.savedDataPointSubCat = new SavedDataPointSubCategory();
                this.savedDataPointSubCat.manageDataPointSubCategorySeedID =
                    cat.id;
                this.savedDataPointSubCat.manageDataPointCategoriesId =
                    cat.categorySeedDataId;
                this.savedDataPointSubCat.isMandatory = cat.isMandatory;
                this.savedDataPointSubCat.active = cat.active;
                this.savedDataPointSubCat.item = cat.item;
                this.savedDataPointSubCat.TenantID =
                    this.loginInfo.tenantID;
                this.savedDataPointCat.subCategorySeedDatas.push(
                    this.savedDataPointSubCat
                );
            });
        });
        this.savedDataPoint.push(scopedataforsave)
    })

    this.facilityService
        .ManageDataPointSave(this.savedDataPoint)
        .subscribe({
            next: (response) => {
                if (response == true) {

                }
            },
            error: (err) => {
                this.notification.showError(
                    'Data Point Added failed.',
                    'Error'
                );
            },
            complete: () => console.info('Data Point Added')
        });

    // to here
}
//method for save manage data points
SaveManageDataPoint() {

    const fomdata = new URLSearchParams();
    fomdata.set('FacilityId', this.id_var);
    fomdata.set('TenantID', this.loginInfo.tenantID.toString());

    const scope1 = [];
    const scope2 = [];
    const scope3 = [];
    if (this.selectedScope1.length > 0) {
        const cat1 = this.selectedScope1.filter((items) => {
            return items < 7
        });
        const obj1 = {};
        const obj2 = {};
        const obj3 = {};
        const obj6 = {};
        if (cat1.length > 0) {
            obj1['category_id'] = 1;
            obj1['subcategory_id'] = cat1
            scope1.push(obj1)
        }

        const cat2 = this.selectedScope1.filter((items) => {
            return items == 7
        });
        if (cat2.length > 0) {
            obj2['category_id'] = 2;
            obj2['subcategory_id'] = cat2
            scope1.push(obj2)
        };

        const cat3 = this.selectedScope1.filter((items) => {
            return items == 8
        });
        if (cat3.length > 0) {
            obj3['category_id'] = 3;
            obj3['subcategory_id'] = cat3
            scope1.push(obj3)
        };
        const cat6 = this.selectedScope1.filter((items) => {
            return items == 10 || items == 11
        });

        if (cat6.length > 0) {
            obj6['category_id'] = 6;
            obj6['subcategory_id'] = cat6
            scope1.push(obj6)
        };
        const scope1Stringy = JSON.stringify(scope1)
        fomdata.set('Scope1', scope1Stringy);
    }

    if (this.selectedScope2.length > 0) {
        const cat1 = this.selectedScope2.filter((items) => {
            return items == 9 || items == 1002
        });
        const obj1 = {};
        const obj2 = {};
        if (cat1.length > 0) {
            obj1['category_id'] = 5;
            obj1['subcategory_id'] = cat1
            scope2.push(obj1)
        }

        const cat2 = this.selectedScope2.filter((items) => {
            return items == 12
        });
        if (cat2.length > 0) {
            obj2['category_id'] = 7;
            obj2['subcategory_id'] = cat2
            scope2.push(obj2);
        };


        const scope2Stringy = JSON.stringify(scope2)

        fomdata.set('Scope2', scope2Stringy);
    }

    if (this.selectedScope3.length > 0) {

        this.selectedScope3.forEach((id) => {
            const Obj = {}
            let scop22 = this.scope3Category.filter((items) => items.value == id)
            Obj['category_id'] = scop22[0].category_id
            Obj['subcategory_id'] = [scop22[0].value]

            scope3.push(Obj);
        })

        const scope3Stringy = JSON.stringify(scope3)
        fomdata.set('Scope3', scope3Stringy);

    }


    // // console.log(this.selectedScope3);

    // this.manageDataPoint1 = []
    // if (
    //     this.savedData.length > 0

    // ) {
    //     if (this.savedData[0].facilityId == this.facilityDetails.ID) {
    //         this.updateDataPoint();

    //     }
    // } else {
    //     this.seedData.forEach(scope => {
    //         const mdp = new ManageDataPoint1();
    //         mdp.scopeID = scope.id;
    //         mdp.facilityId = this.facilityDetails.ID;
    //         mdp.fiscalYear = this.trackingService.getYear(this.year);
    //         mdp.categorySeedData =
    //             scope.categorySeedData.map((element) => {
    //                 return {
    //                     ...element,
    //                     subCategorySeedDatas:
    //                         element.subCategorySeedDatas.filter(
    //                             (subElement) => subElement.active === true
    //                         )
    //                 };
    //             });

    //         this.manageDataPoint1.push(mdp);
    //     })

    //     // from here

    //     this.savedDataPoint = [];
    //     this.manageDataPoint1.forEach(scopewise => {
    //         const scopedataforsave = new savedDataPoint();
    //         scopedataforsave.TenantID = this.loginInfo.tenantID;
    //         scopedataforsave.facilityId = scopewise.facilityId;
    //         scopedataforsave.fiscalYear = this.trackingService.getYear(this.year);
    //         scopedataforsave.scopeID = scopewise.scopeID;
    //         scopedataforsave.categorySeedData = [];
    //         scopewise.categorySeedData.forEach((seed) => {
    //             this.savedDataPointCat = new SavedDataPointCategory();
    //             this.savedDataPointCat.manageDataPointCategorySeedID = seed.id;
    //             this.savedDataPointCat.manageDataPointId = seed.manageScopeId;
    //             this.savedDataPointCat.TenantID = this.loginInfo.tenantID;
    //             this.savedDataPointCat.subCategorySeedDatas = [];

    //             scopedataforsave.categorySeedData.push(
    //                 this.savedDataPointCat
    //             );

    //             seed.subCategorySeedDatas.forEach((cat) => {
    //                 this.savedDataPointSubCat = new SavedDataPointSubCategory();
    //                 this.savedDataPointSubCat.manageDataPointSubCategorySeedID =
    //                     cat.id;
    //                 this.savedDataPointSubCat.manageDataPointCategoriesId =
    //                     cat.categorySeedDataId;
    //                 this.savedDataPointSubCat.isMandatory = cat.isMandatory;
    //                 this.savedDataPointSubCat.active = cat.active;
    //                 this.savedDataPointSubCat.item = cat.item;
    //                 this.savedDataPointSubCat.TenantID =
    //                     this.loginInfo.tenantID;
    //                 this.savedDataPointCat.subCategorySeedDatas.push(
    //                     this.savedDataPointSubCat
    //                 );
    //             });
    //         });
    //         this.savedDataPoint.push(scopedataforsave)
    //     })
    // this.savedDataPoint.id = this.manageDataPoint1.id;
    // this.savedDataPoint.scopeID = this.manageDataPoint1.scopeID;
    // this.savedDataPoint.facilityId = this.manageDataPoint1.facilityId;
    // this.savedDataPoint.fiscalYear = this.manageDataPoint1.fiscalYear;
    // this.savedDataPoint.TenantID = this.loginInfo.tenantID;
    // this.savedDataPoint.categorySeedData = [];

    // this.manageDataPoint1.categorySeedData.forEach((seed) => {
    //     this.savedDataPointCat = new SavedDataPointCategory();
    //     this.savedDataPointCat.manageDataPointCategorySeedID = seed.id;
    //     this.savedDataPointCat.manageDataPointId = seed.manageScopeId;
    //     this.savedDataPointCat.TenantID = this.loginInfo.tenantID;
    //     this.savedDataPointCat.subCategorySeedDatas = [];

    //     this.savedDataPoint.categorySeedData.push(
    //         this.savedDataPointCat
    //     );

    //     seed.subCategorySeedDatas.forEach((cat) => {
    //         this.savedDataPointSubCat = new SavedDataPointSubCategory();
    //         this.savedDataPointSubCat.manageDataPointSubCategorySeedID =
    //             cat.id;
    //         this.savedDataPointSubCat.manageDataPointCategoriesId =
    //             cat.categorySeedDataId;
    //         this.savedDataPointSubCat.isMandatory = cat.isMandatory;
    //         this.savedDataPointSubCat.active = cat.active;
    //         this.savedDataPointSubCat.item = cat.item;
    //         this.savedDataPointSubCat.TenantID =
    //             this.loginInfo.tenantID;
    //         this.savedDataPointCat.subCategorySeedDatas.push(
    //             this.savedDataPointSubCat
    //         );
    //     });
    // });
    // }



    const isSubcategoryEmptyForAllCategories = this.selectedScope1.length == 0 && this.selectedScope2.length == 0 && this.selectedScope3.length == 0
    if (isSubcategoryEmptyForAllCategories == true) {
        this.notification.showInfo(
            'Please select any data point otherwise close this!',
            'Info'
        );
    } else {
        this.facilityService
            .newManageDataPointSave(fomdata.toString())
            .subscribe({
                next: (response) => {
                 
                    if (response.success == true) {
                        this.DP_BoxVisible = false;
                        this.notification.showSuccess(
                            'Data Point Added Successfully',
                            'Success'
                        );
                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data Point Added failed.',
                        'Error'
                    );
                },
                complete: () => console.info('Data Point Added')
            });
    }
    // to here
}
//Retrieves the saved data points for a specific facility
GetsavedDataPoint(facilityID: any) {
    this.facilityService.getSavedDataPoint(facilityID).subscribe({
        next: (response) => {
            this.savedData = response;
            if (this.savedData != null) {
                this.savedData.forEach(saved => {
                    this.seedData.forEach((seed) => {
                        seed.categorySeedData.forEach((cat) => {
                            const saveCatdata =
                                saved.categorySeedData.find(
                                    (saveCat) =>
                                        saveCat.manageDataPointCategorySeedID ===
                                        cat.id
                                );
                            if (saveCatdata) {
                                cat.id = saveCatdata.id;
                                cat.manageDataPointCategorySeedID =
                                    saveCatdata.manageDataPointCategorySeedID;
                                cat.subCategorySeedDatas.forEach((subcat) => {
                                    const subCatdata =
                                        saveCatdata.subCategorySeedDatas.find(
                                            (saveSubCat) =>
                                                saveSubCat.manageDataPointSubCategorySeedID ===
                                                subcat.id
                                        );

                                    if (subCatdata) {
                                        subcat.SubCategorySeedID =
                                            subCatdata.manageDataPointSubCategorySeedID;
                                        subcat.subCatsavedID = subCatdata.id;
                                        subcat.isMandatory =
                                            subCatdata.isMandatory;
                                        subcat.active = subCatdata.active;
                                    } else {
                                        subcat.SubCategorySeedID = null;
                                        subcat.isMandatory = false;
                                        subcat.active = false;
                                    }
                                });
                            }
                        });
                    });
                })

            }
        }
    });
}
//method for reset form
resetForm() {
    this.addCompForm.resetForm();
}
//method for update datapoint
updateDataPoint() {
    this.savedDataPoint = [];
    // this.savedDataPoint.id = this.savedData.id;
    // this.savedDataPoint.scopeID = this.seedData[0].id;
    // this.savedDataPoint.facilityId = this.facilityDetails.id;
    // this.savedDataPoint.fiscalYear = '2023';
    // this.savedDataPoint.TenantID = this.loginInfo.tenantID;
    // this.savedDataPoint.categorySeedData = [];

    // this.savedDataPoint.categorySeedData =
    //     this.seedData[0].categorySeedData.map((saved) => {
    //         const savedDataPointCat = new SavedDataPointCategory();
    //         savedDataPointCat.id = saved.id;
    //         if (saved.manageDataPointCategorySeedID != null) {
    //             savedDataPointCat.manageDataPointCategorySeedID =
    //                 saved.manageDataPointCategorySeedID;
    //         } else {
    //             savedDataPointCat.manageDataPointCategorySeedID = saved.id;
    //         }
    //         savedDataPointCat.manageDataPointId = saved.manageScopeId;
    //         savedDataPointCat.TenantID = this.loginInfo.tenantID;
    //         savedDataPointCat.subCategorySeedDatas =
    //             saved.subCategorySeedDatas
    //                 .filter(
    //                     (cat) =>
    //                         cat.active === true ||
    //                         (cat.active == false &&
    //                             cat.SubCategorySeedID != null)
    //                 )
    //                 .map((cat) => {
    //                     const savedDataPointSubCat =
    //                         new SavedDataPointSubCategory();

    //                     if (cat.SubCategorySeedID != null) {
    //                         savedDataPointSubCat.id = cat.subCatsavedID;
    //                         savedDataPointSubCat.manageDataPointSubCategorySeedID =
    //                             cat.SubCategorySeedID;
    //                     } else {
    //                         savedDataPointSubCat.manageDataPointSubCategorySeedID =
    //                             cat.id;
    //                         savedDataPointSubCat.id = 0;
    //                     }
    //                     savedDataPointSubCat.manageDataPointCategoriesId =
    //                         cat.categorySeedDataId;
    //                     if (cat.active == false) {
    //                         savedDataPointSubCat.isMandatory = false;
    //                     } else {
    //                         savedDataPointSubCat.isMandatory =
    //                             cat.isMandatory;
    //                     }
    //                     savedDataPointSubCat.active = cat.active;
    //                     savedDataPointSubCat.item = cat.item;
    //                     savedDataPointSubCat.TenantID =
    //                         this.loginInfo.tenantID;
    //                     return savedDataPointSubCat;
    //                 });
    //         return savedDataPointCat;
    //     });
    // this.seedData.forEach(scope => {
    //     this.savedData.forEach(saved => {
    //         const savedatawithScope = new savedDataPoint();
    //         savedatawithScope.TenantID = this.loginInfo.tenantID;
    //         savedatawithScope.facilityId = this.facilityDetails.id;
    //         savedatawithScope.fiscalYear = '2023';
    //         savedatawithScope.id = saved.id;
    //         savedatawithScope.scopeID = scope.id;
    //         savedatawithScope.categorySeedData = scope.categorySeedData.map((saved) => {
    //             const savedDataPointCat = new SavedDataPointCategory();
    //             savedDataPointCat.id = saved.id;
    //             if (saved.manageDataPointCategorySeedID != null) {
    //                 savedDataPointCat.manageDataPointCategorySeedID =
    //                     saved.manageDataPointCategorySeedID;
    //             } else {
    //                 savedDataPointCat.manageDataPointCategorySeedID = saved.id;
    //             }
    //             savedDataPointCat.manageDataPointId = saved.manageScopeId;
    //             savedDataPointCat.TenantID = this.loginInfo.tenantID;
    //             savedDataPointCat.subCategorySeedDatas =
    //                 saved.subCategorySeedDatas
    //                     .filter(
    //                         (cat) =>
    //                             cat.active === true ||
    //                             (cat.active == false &&
    //                                 cat.SubCategorySeedID != null)
    //                     )
    //                     .map((cat) => {
    //                         const savedDataPointSubCat =
    //                             new SavedDataPointSubCategory();

    //                         if (cat.SubCategorySeedID != null) {
    //                             savedDataPointSubCat.id = cat.subCatsavedID;
    //                             savedDataPointSubCat.manageDataPointSubCategorySeedID =
    //                                 cat.SubCategorySeedID;
    //                         } else {
    //                             savedDataPointSubCat.manageDataPointSubCategorySeedID =
    //                                 cat.id;
    //                             savedDataPointSubCat.id = 0;
    //                         }
    //                         savedDataPointSubCat.manageDataPointCategoriesId =
    //                             cat.categorySeedDataId;
    //                         if (cat.active == false) {
    //                             savedDataPointSubCat.isMandatory = false;
    //                         } else {
    //                             savedDataPointSubCat.isMandatory =
    //                                 cat.isMandatory;
    //                         }
    //                         savedDataPointSubCat.active = cat.active;
    //                         savedDataPointSubCat.item = cat.item;
    //                         savedDataPointSubCat.TenantID =
    //                             this.loginInfo.tenantID;
    //                         return savedDataPointSubCat;
    //                     });
    //             return savedDataPointCat;
    //         });

    //         this.savedDataPoint.push(savedatawithScope);
    //     })


    // })
    // this.seedData.forEach(scope => {
    //     this.savedData.forEach(saved => {
    //         const savedatawithScope = new savedDataPoint();
    //         savedatawithScope.TenantID = this.loginInfo.tenantID;
    //         savedatawithScope.facilityId = this.facilityDetails.id;
    //         savedatawithScope.fiscalYear = '2023';
    //         savedatawithScope.id = saved.id;
    //         savedatawithScope.scopeID = scope.id;
    //         savedatawithScope.categorySeedData = [];
    //         scope.categorySeedData.forEach(cat => {
    //             const savedDataPointCat = new SavedDataPointCategory();
    //             savedDataPointCat.id = cat.id;
    //             if (cat.manageDataPointCategorySeedID !== null) {
    //                 savedDataPointCat.manageDataPointCategorySeedID = cat.manageDataPointCategorySeedID;
    //             } else {
    //                 savedDataPointCat.manageDataPointCategorySeedID = cat.id;
    //             }
    //             savedDataPointCat.manageDataPointId = cat.manageScopeId;
    //             savedDataPointCat.TenantID = this.loginInfo.tenantID;
    //             savedDataPointCat.subCategorySeedDatas = [];
    //             cat.subCategorySeedDatas
    //                 .filter(subCat => subCat.active === true || (subCat.active === false && subCat.SubCategorySeedID !== null))
    //                 .forEach(subCat => {
    //                     const savedDataPointSubCat = new SavedDataPointSubCategory();
    //                     if (subCat.SubCategorySeedID !== null) {
    //                         savedDataPointSubCat.id = subCat.subCatsavedID;
    //                         savedDataPointSubCat.manageDataPointSubCategorySeedID = subCat.SubCategorySeedID;
    //                     } else {
    //                         savedDataPointSubCat.manageDataPointSubCategorySeedID = subCat.id;
    //                         savedDataPointSubCat.id = 0;
    //                     }
    //                     savedDataPointSubCat.manageDataPointCategoriesId = subCat.id;
    //                     if (subCat.active === false) {
    //                         savedDataPointSubCat.isMandatory = false;
    //                     } else {
    //                         savedDataPointSubCat.isMandatory = subCat.isMandatory;
    //                     }
    //                     savedDataPointSubCat.active = subCat.active;
    //                     savedDataPointSubCat.item = subCat.item;
    //                     savedDataPointSubCat.TenantID = this.loginInfo.tenantID;
    //                     savedDataPointCat.subCategorySeedDatas.push(savedDataPointSubCat);
    //                 });
    //             savedatawithScope.categorySeedData.push(savedDataPointCat);
    //         });
    //         this.savedDataPoint.push(savedatawithScope);
    //     });
    // });

    this.seedData.forEach((scope, index) => {
        const saved = this.savedData[index];

        const savedatawithScope = new savedDataPoint();
        savedatawithScope.TenantID = this.loginInfo.tenantID;
        savedatawithScope.facilityId = this.facilityDetails.ID;
        savedatawithScope.fiscalYear = saved.fiscalYear;
        savedatawithScope.id = saved.id;
        savedatawithScope.scopeID = scope.id;
        savedatawithScope.categorySeedData = [];

        scope.categorySeedData.forEach(cat => {
            const savedDataPointCat = new SavedDataPointCategory();
            savedDataPointCat.id = cat.id;

            if (cat.manageDataPointCategorySeedID !== null) {
                savedDataPointCat.manageDataPointCategorySeedID = cat.manageDataPointCategorySeedID;
            } else {
                savedDataPointCat.manageDataPointCategorySeedID = cat.id;
            }

            savedDataPointCat.manageDataPointId = cat.manageScopeId;
            savedDataPointCat.TenantID = this.loginInfo.tenantID;
            savedDataPointCat.subCategorySeedDatas = [];

            cat.subCategorySeedDatas
                .filter(subCat => subCat.active === true || (subCat.active === false && subCat.SubCategorySeedID !== null))
                .forEach(subCat => {
                    const savedDataPointSubCat = new SavedDataPointSubCategory();

                    if (subCat.SubCategorySeedID !== null) {
                        savedDataPointSubCat.id = subCat.subCatsavedID;
                        savedDataPointSubCat.manageDataPointSubCategorySeedID = subCat.SubCategorySeedID;
                    } else {
                        savedDataPointSubCat.manageDataPointSubCategorySeedID = subCat.id;
                        savedDataPointSubCat.id = 0;
                    }

                    savedDataPointSubCat.manageDataPointCategoriesId = subCat.categorySeedDataId;

                    if (subCat.active === false) {
                        savedDataPointSubCat.isMandatory = false;
                    } else {
                        savedDataPointSubCat.isMandatory = subCat.isMandatory;
                    }

                    savedDataPointSubCat.active = subCat.active;
                    savedDataPointSubCat.item = subCat.item;
                    savedDataPointSubCat.TenantID = this.loginInfo.tenantID;

                    savedDataPointCat.subCategorySeedDatas.push(savedDataPointSubCat);
                });

            savedatawithScope.categorySeedData.push(savedDataPointCat);
        });

        this.savedDataPoint.push(savedatawithScope);
    });


}
//Applies a filter to the seedData array based on the search term.
applyFilter(): void {
    this.seedData = this.seedData
        .map((item) => {
            const matchedCategories = item.categorySeedData
                .map((category) => {
                    const matchedSubCategories =
                        category.subCategorySeedDatas.filter(
                            (subCategory) => {
                                return subCategory.item
                                    .toLowerCase()
                                    .includes(
                                        this.searchData.toLowerCase()
                                    );
                            }
                        );
                    return {
                        ...category,
                        subCategorySeedDatas: matchedSubCategories
                    };
                })
                .filter(
                    (category) => category.subCategorySeedDatas.length > 0
                );
            return { ...item, categorySeedData: matchedCategories };
        })
        .filter((item) => item.categorySeedData.length > 0);
}
}
