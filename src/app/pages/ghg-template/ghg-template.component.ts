import { Facility } from '@/models/Facility';
import { FacilityGroupList } from '@/models/FacilityGroupList';
import { ManageDataPoint1 } from '@/models/ManageDataPoint';
import { ManageDataPointCategory } from '@/models/ManageDataPointCategory';
import { UserInfo } from '@/models/UserInfo';
import { facilities } from '@/models/facilities';
import { LoginInfo } from '@/models/loginInfo';
import { savedDataPoint } from '@/models/savedDataPoint';
import { SavedDataPointCategory } from '@/models/savedDataPointCategory';
import { SavedDataPointSubCategory } from '@/models/savedDataPointSubcategory';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { TrackingService } from '@services/tracking.service';

import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { filter } from 'rxjs';

@Component({
    selector: 'app-ghg-template',
    templateUrl: './ghg-template.component.html',
    styleUrls: ['./ghg-template.component.scss'],
})
export class GhgTemplateComponent {
    @ViewChild('addCompForm', { static: false }) addCompForm: NgForm;
    public loginInfo: LoginInfo;
    public userdetails: UserInfo;
    public savedDataPointCat: SavedDataPointCategory;
    public savedDataPointSubCat: SavedDataPointSubCategory;
    public admininfo: UserInfo;
    facilityDetails: Facility = new Facility();
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
    selectedValues: any;
    checked: boolean = false;
    value_tab = 'Scope 1';
    searchData;
    searchDataPoint: string;
    countryData: any[] = [];
    stateData: any[] = [];
    cityData: any[] = [];
    datapointCatagory: ManageDataPointCategory[] = [];
    selectedCountry: any;
    selectedState: any;
    selectedCity: any;
    // seedData: ManageDataPoint[] = [];
    seedData: any;
    scope1Category: any[] = [];
    scope2Category: any[] = [];
    scope3Category: any[] = [];
    savedData: any[] = [];
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
    selectedScope4: any[] = [];

    constructor(
        private facilityService: FacilityService,
        // private UserService: UserService,
        private notification: NotificationService,
        private http: HttpClient,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private themeservice: ThemeService,
        private trackingService: TrackingService,
        private router: Router, private cd: ChangeDetectorRef

    ) {

        this.facilityDetails = new Facility();
        this.loginInfo = new LoginInfo();
        this.admininfo = new UserInfo();
        this.userdetails = new UserInfo();
        this.savedDataPointCat = new SavedDataPointCategory();
        this.savedDataPointSubCat = new SavedDataPointSubCategory();
        this.year = new Date();
    };

    ngOnInit() {
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
        }
        let tenantID = this.loginInfo.tenantID;
        this.facilityGet(tenantID);

        this.getAllSeedData()

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
        this.GetFacilityGroupList(tenantID);
       
    }

    ngDoCheck() {
        this.updatedtheme = this.themeservice.getValue('theme');
    }


    //method for add new facility
    saveFacility(data: NgForm) {


        this.selectedCountry = this.countryData.find(
            (country) => country.
                Name === this.facilityDetails.country_name
        );
        this.facilityDetails.CountryId = this.selectedCountry.Id;
        this.selectedState = this.stateData.find(
            (state) => state.Name === this.facilityDetails.state_name
        );
        this.facilityDetails.StateId = this.selectedState.Id;
        this.selectedCity = this.cityData.find(
            (city) => city.Name === this.facilityDetails.city_name
        );
        this.facilityDetails.CityId = this.selectedCity.Id;
        this.facilityDetails.tenantID = this.loginInfo.tenantID;
        if (this.facilityDetails.IsWaterStreenArea == null) {
            this.facilityDetails.IsWaterStreenArea = false;
        };

        let formdata = new URLSearchParams();
        formdata.set('AssestName', this.facilityDetails.AssestName)
        formdata.set('tenantID', this.facilityDetails.tenantID.toString())
        formdata.set('AssestType', this.facilityDetails.AssestType)
        formdata.set('EquityPercentage', (this.facilityDetails.EquityPercentage).toString());
        formdata.set('Address', this.facilityDetails.Address);
        formdata.set('IsWaterStreenArea', (this.facilityDetails.IsWaterStreenArea).toString());
        formdata.set('CityId', (this.selectedCity.ID).toString());
        formdata.set('CountryId', this.selectedCountry.ID);
        formdata.set('StateId', (this.selectedState.ID).toString());


        this.facilityService.newFacilityDataPost(formdata.toString()).subscribe({
            next: (response) => {

                this.facilityGet(this.facilityDetails.tenantID);
                this.visible = false;
                if (localStorage.getItem('FacilityGroupCount') != null) {
                    let fgcount = localStorage.getItem('FacilityGroupCount');
                    let newcount = Number(fgcount) + 1;
                    localStorage.setItem(
                        'FacilityGroupCount',
                        String(newcount)
                    );
                }
                this.notification.showSuccess(
                    'Facility Added successfully',
                    'Success'
                );
                this.getAllSeedData2(response.id);
            },
            error: (err) => {
                this.notification.showError('Facility added failed.', 'Error');
                console.error('errrrrrr>>>>>>', err);
            },
            complete: () => console.info('Facility Added')
        });
    }
    //method for update a facility by id
    editfacility(id: any, data: NgForm) {
        if (this.loginInfo.role  == 'Preparer' || this.loginInfo.role  == 'Manager' ) {
            this.notification.showInfo('You are not authrised to submit form', '')
            return
        }
        this.selectedCountry = this.countryData.find(
            (country) => country.Name === this.facilityDetails.country_name
        );
        this.facilityDetails.CountryId = this.selectedCountry.ID;
        this.selectedState = this.stateData.find(
            (state) => state.Name === this.facilityDetails.state_name
        );
        this.facilityDetails.StateId = this.selectedState.ID;
        this.selectedCity = this.cityData.find(

            (city) =>
                city.Name === this.facilityDetails.city_name

        );
        // this.facilityDetails.CityId = this.selectedCity.ID;
        let tenantId = this.loginInfo.tenantID;
        let formdata = new URLSearchParams();
        formdata.set('AssestName', this.facilityDetails.AssestName)
        formdata.set('tenantID', (tenantId).toString())
        formdata.set('AssestType', this.facilityDetails.AssestType)
        formdata.set('EquityPercentage', (this.facilityDetails.EquityPercentage).toString());
        formdata.set('Address', this.facilityDetails.Address);
        formdata.set('IsWaterStreenArea', (this.facilityDetails.IsWaterStreenArea).toString());
        // formdata.set('CityId', (this.selectedCity.ID).toString());
        formdata.set('CountryId', this.selectedCountry.ID);
        formdata.set('StateId', (this.selectedState.ID).toString());
        formdata.set('ID', this.id_var);
        this.facilityService
            .FacilityDataUpdate(formdata.toString())
            .subscribe({
                next: (response) => {
                    this.facilityGet(tenantId);

                    this.visible = false;
                    this.facilityrefresh = false;
                    this.notification.showSuccess(
                        'Facility Edited successfully',
                        'Success'
                    );
                },
                error: (err) => {
                    this.notification.showError(
                        'Facility edited failed.',
                        'Error'
                    );
                    console.error(err);
                },
                complete: () => console.info('Facility edited')
            });
    }
    //Retrieves facility data for the specified tenant ID and updates the UI based on the data availability.
    facilityGet(tenantId) {
        this.facilityService.nFacilityDataGet(tenantId).subscribe({
            next: (response: any) => {

                this.LocData = response.categories;
                if (this.LocData.length == 0) {
                    this.NoData = 'block';
                    this.FacilityData = 'none';
                    this.FacilityFullData = 'none';
                } else {
                    this.FacilityData = 'block';
                    this.FacilityFullData = 'flex';
                    this.NoData = 'none';
                }
                if (this.facilityrefresh == true)
                 this.defaultData();
                localStorage.setItem('FacilityCount', String(this.LocData.length));
            }, error: err => {
                console.log(err)
            }
        })
       

    };

    //retrieves users associated with the facility

    tableData(data: any) {
    
        this.id_var = data.ID;
        this.selectedValues = data.ID;
        this.GetsavedDataPoint(data.ID)
        // this.getUserofFacility(id);
    }
    /* 
    The defaultData function sets the default values for the variables id_var, 
    tenantId, and facilityDetails based on the first facility
    and retrieves users associated with the facility.
    */
    defaultData() {
        this.id_var = this.LocData[0].ID;
        let tenantId = this.loginInfo.tenantID;
        this.facilityDetails = this.LocData[0];
        this.selectedValues = this.facilityDetails.ID;
        this.GetsavedDataPoint(this.facilityDetails.ID);
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
                        this.facilityGet(tenantId);
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

    facilitygrouplist: facilities[] = [];

    GetFacilityGroupList(tenantID) {
        this.facilityService
            .newGetFacilityByTenant(tenantID)
            .subscribe((res) => {

                this.facilitygrouplist = res;

            });
    };

    logSelectedFacilityIds() {
        const selectedFacilityIds = this.selectedScope4.map(facility => facility.id).join(',');
      
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
            },
            error: err => {
                console.log(err)
            }
        });
    }


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
                this.scope2Category = response.scope2;
                this.scope3Category = response.scope3;
            }
        });
    };

  

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
    };

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

        if (this.loginInfo.role != 'Super Admin') {
            this.notification.showWarning('You are not allowed to set the tempalte', '');
            return
        }
        
        if (this.selectedValues.length == 0 || this.selectedValues == '') {
           
            return
        }
        const fomdata = new URLSearchParams();
        fomdata.set('FacilityId', this.selectedValues.toString());
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
        this.selectedScope1 = []
        this.selectedScope2 = []
        this.selectedScope3 = []
        this.facilityService.getSavedDataPoint(facilityID).subscribe({
            next: (response: any) => {
                this.savedData = response.categories;

                if (this.savedData != null) {
                    this.savedData.forEach(items => {

                        if (items.ScopeID == 1) {
                            const newScope1 = [];
                            items.manageDataPointCategories.forEach((categories: any) => {
                                categories.manageDataPointSubCategories.forEach((subcategory: any) => {
                                    newScope1.push(subcategory.ManageDataPointSubCategorySeedID)
                                })
                            })
                           
                            this.selectedScope1 = [...newScope1];
                        } else if (items.ScopeID == 2) {
                            const newScope2 = [];
                            items.manageDataPointCategories.forEach((categories: any) => {
                                categories.manageDataPointSubCategories.forEach((subcategory: any) => {
                                    newScope2.push(subcategory.ManageDataPointSubCategorySeedID)
                                })
                            })
                            this.selectedScope2 = [...newScope2];
                        } else if (items.ScopeID == 3) {
                            const newScope3 = [];
                            items.manageDataPointCategories.forEach((categories: any) => {
                                categories.manageDataPointSubCategories.forEach((subcategory: any) => {
                                    newScope3.push(subcategory.ManageDataPointSubCategorySeedID)
                                })
                            })
                            this.selectedScope3 = [...newScope3];
                        }
                    })
                    this.cd.detectChanges();
                }
            }
        });
    }
    //method for reset form
    resetForm() {
        this.addCompForm.resetForm();
    }

    scope1Cick() {
       
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
