import { EmissionFactorTable } from '@/models/EmissionFactorTable';
import { Facility } from '@/models/Facility';
import { TrackingTable } from '@/models/TrackingTable';
import { LoginInfo } from '@/models/loginInfo';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { ThemeService } from '@services/theme.service';
import { FacilityService } from '@services/facility.service';
import { ConfirmEventType, ConfirmationService, MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { TrackingService } from '@services/tracking.service';
import { NotificationService } from '@services/notification.service';
import { TrackingDataPoint } from '@/models/TrackingDataPoint';
import { ManageDataPointSubCategories } from '@/models/TrackingDataPointSubCategories';
import { DataEntrySetting } from '@/models/DataEntrySettings';
import { TabView } from 'primeng/tabview';
import { DataEntry } from '@/models/DataEntry';
import { DatePipe } from '@angular/common';
import { environment } from 'environments/environment';
import { EmissionFactor } from '@/models/EmissionFactorALL';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { FileUpload } from 'primeng/fileupload';
import { BlendType } from '@/models/BlendType';
import { StationaryCombustionDE } from '@/models/StationaryCombustionDE';
import { RefrigerantsDE } from '@/models/RefrigerantsDE';
import { FireExtinguisherDE } from '@/models/FireExtinguisherDE';
import { VehicleDEmode } from '@/models/VehicleDEmode';
import { VehicleDE } from '@/models/VehicleDE';
import { ElectricitySource } from '@/models/ElectricitySource';
import { ElectricityDE } from '@/models/ElectricityDE';
import { HeatandSteamDE } from '@/models/HeatandSteamDE';
import { Units } from '@/models/Units';
import { VehicleType } from '@/models/VehicleType';
import { SubCategoryTypes } from '@/models/SubCategoryType';
import { ElectricityGrid } from '@/models/ElectricityGrid';

interface units {
    unit: string;
}
interface setlimit {
    limitpercent: string;
}

@Component({
    selector: 'app-tracking',
    templateUrl: './tracking.component.html',
    styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent {
    @ViewChild('dataEntryForm', { static: false }) dataEntryForm: NgForm;
    @ViewChild('tabView') dataentryTab: TabView;
    @ViewChild('dt1') dt!: Table;
    @ViewChild('fileUpload') fileUpload!: FileUpload;

    filteredStatus: any; // Variable to store the selected status
    public statusFilter: string;
    public yearFilter: number;
    DP_BoxVisible: boolean;
    AddManageDataPoint = '';
    value_tab = 'Scope 1';
    selectedValues: string[] = [];
    selectMonths: any[] = [];
    yearOptions: any[] = [];
    checked: boolean = false;
    items: MenuItem[];
    active: MenuItem;
    notevalue: string;
    status: TrackingTable[];
    formGroup: FormGroup;
    //units: units[];
    setlimit: setlimit[];
    emissiontable: EmissionFactorTable[];
    visible: boolean;
    maxCharacters: number = 9;
    defaulttab: string;
    updatedtheme: string;
    facilityData: Facility[] = [];
    public loginInfo: LoginInfo;
    AssignedDataPoint: TrackingDataPoint[] = [];
    trackingData: Facility = new Facility();
    facility;
    todayDate;
    SubCatAllData: ManageDataPointSubCategories;
    id_var: any;
    dataEntrySetting: DataEntrySetting = new DataEntrySetting();
    dataEntry: DataEntry = new DataEntry();


    SCdataEntry: StationaryCombustionDE = new StationaryCombustionDE();
    RefrigerantDE: RefrigerantsDE = new RefrigerantsDE();
    FireExtinguisherDE: FireExtinguisherDE = new FireExtinguisherDE();
    VehicleDE: VehicleDE = new VehicleDE();
    RenewableElectricity: ElectricityDE = new ElectricityDE();
    commonDE: any[] = [];
    SCDE: StationaryCombustionDE[] = [];
    refDE: RefrigerantsDE[] = [];
    fireDE: FireExtinguisherDE[] = [];
    vehicleDE: VehicleDE[] = [];
    electricDE: ElectricityDE[] = [];
    HeatandSteamDE: HeatandSteamDE = new HeatandSteamDE();
    savedAndEdited: false;
    activeindex: number = 0;
    month: Date;
    year: Date;
    facilityhavedp = 'none';
    facilityID;
    subCatID;
    flag;
    facilitynothavedp = 'flex';
    forGroup = 'none';
    entryExist: boolean = false;
    getFacilitystring: string;
    Pending = environment.pending;
    Rejected = environment.rejected;
    Approved = environment.approved;
    blendType: BlendType[] = [];
    ModeType: VehicleDEmode[] = [];
    ElectricitySource: ElectricitySource[] = [];
    ElectricityGrid: ElectricityGrid[] = [];
    public EmissionFactor: EmissionFactor[] = [];
    kgCO2e: any;
    selectedFile: File;
    uploadedFileUrl: string;
    rootUrl: string;
    fileSelect: File;
    categoryId: number;
    accordianIndex = 0;
    units: Units[] = [];
    monthString: string;
    VehicleType: VehicleType[] = [];
    SubCategoryType: SubCategoryTypes[] = [];
    isInputEdited: boolean;
    typeEV: boolean = false;
    typeBusCoach: boolean = false;
    openDatapointDialog() {
        this.AddManageDataPoint = 'block';
    }
    closeDp_Dialog() {
        this.DP_BoxVisible = false;
    }
    statusOptions: any[] = [
        { label: 'All', value: null },
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Rejected', value: 'rejected' }
    ];

    months: any[] = [
        { name: 'January', value: 'January' },
        { name: 'February', value: 'February' },
        { name: 'March', value: 'March' },
        { name: 'April', value: 'April' },
        { name: 'May', value: 'May' },
        { name: 'June', value: 'June' },
        { name: 'July', value: 'July' },
        { name: 'August', value: 'August' },
        { name: 'September', value: 'September' },
        { name: 'October', value: 'October' },
        { name: 'November', value: 'November' },
        { name: 'December', value: 'December' }
    ];

    constructor(
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
        private facilityService: FacilityService,
        private trackingService: TrackingService,
        private themeservice: ThemeService,
        private notification: NotificationService,
        private toastr: ToastrService,
        private confirmationService: ConfirmationService
    ) {
        this.SubCatAllData = new ManageDataPointSubCategories();
        this.AssignedDataPoint = [];
        this.defaulttab = router.url;
        this.loginInfo = new LoginInfo();
        this.trackingData = new Facility();
        this.dataEntrySetting = new DataEntrySetting();
        this.dataEntry = new DataEntry();
        this.SCdataEntry = new StationaryCombustionDE();
        this.RefrigerantDE = new RefrigerantsDE();
        this.FireExtinguisherDE = new FireExtinguisherDE();
        this.RenewableElectricity = new ElectricityDE();
        this.VehicleDE = new VehicleDE();
        this.month = new Date();
        this.year = new Date();
        this.rootUrl = environment.baseUrl + 'uploads/TrackingDocs/';
        this.kgCO2e = '';
        this.EmissionFactor = [];
        this.blendType = [];
        this.ModeType = [];
        this.ElectricitySource = [];
        this.ElectricityGrid = [];
        this.units = [];
        this.HeatandSteamDE = new HeatandSteamDE();
        this.VehicleType = [];
        this.dataEntry.unit = "";
        this.SubCategoryType = [];
        this.isInputEdited;
        this.dataEntry.typeID;
        console.log("AAaa",this.dataEntry);

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
        this.SCdataEntry.blendPercent = 20;
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 20;
        this.isInputEdited = false;


        this.yearOptions.push({ label: 'All', value: null });

        for (let year = startYear; year <= currentYear; year++) {
            this.yearOptions.push({ label: year.toString(), value: year });
        }
    }

    confirm1() {
        this.confirmationService.confirm({
            target: event.target,

            accept: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Confirmed',
                    detail: 'User Deleted Succesfully'
                });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Rejected',
                    detail: 'User not Deleted'
                });
            }
        });
    }
    //runs when component intialize
    ngOnInit() {
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
        }
        let tenantID = this.loginInfo.tenantID;
        this.facilityID = localStorage.getItem('SelectedfacilityID');
        this.flag = localStorage.getItem('Flag');
        const dataEntry = this.trackingService.dataEntry;
        if (
            this.loginInfo.role === environment.SuperAdmin ||
            this.loginInfo.role === environment.Admin
        ) {
            if (this.flag === 'F') {
                // this.GetAssignedDataPoint(this.facilityID);
            } else {
                this.facilityhavedp = 'none';
                this.facilitynothavedp = 'none';
                this.forGroup = 'flex';
            }
        } else {
            // this.GetAssignedDataPoint(this.loginInfo.facilityID);
        }
        // if (this.defaulttab === '/tracking-status') {
        //     this.activeindex = 1;
        // }


        // this.getBlendType();
        // this.getVehicleDEMode();
        // this.getElectricitySource();
        // this.setDefaultMonth();
        // this.getElectricityGrid();
    }

    onUpload(event) {
        this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: 'File Uploaded with Basic Mode'
        });
    }
    // triggered whenever a change detection cycle runs
    ngDoCheck() {
        this.updatedtheme = this.themeservice.getValue('theme');

        let fId = localStorage.getItem('SelectedfacilityID');
        this.flag = localStorage.getItem('Flag');
        if (this.flag == 'F') {
            if (this.facilityID != fId) {
                // this.GetAssignedDataPoint(Number(fId));
                this.facilityID = fId;
            }

        }
        else if (this.flag === undefined || this.flag === null || this.flag == "") {
            this.facilityID = fId;
        }
        else {
            this.forGroup = environment.flex;
            this.facilityhavedp = environment.none;
            this.facilitynothavedp = environment.none;
        }
    }
    //method for apply a filter to the data table (dt)
    filter(value: any, field: string, matchMode: string) {
        this.dt.filter(value, field, matchMode);
        this.filteredStatus = value; // Store the selected status in a variable
    }
    //display a dialog
    showDialog() {
        this.visible = true;
    }
    //retrieves assigned data points for a facility and handles the response to update the UI accordingly.
    GetAssignedDataPoint(facilityID: number) {
        this.AssignedDataPoint = [];
        this.SubCatAllData = new ManageDataPointSubCategories();
        this.trackingService
            .getSavedDataPointforTracking(facilityID)
            .subscribe({
                next: (response) => {
                    if (response === environment.NoData) {
                        this.facilityhavedp = environment.none;
                        this.facilitynothavedp = environment.flex;
                        this.forGroup = environment.none;
                    } else {
                        console.log("scopees", response)
                        console.log("data", this.dataEntry)
                        this.AssignedDataPoint = response;
                        this.AssignedDataPoint.forEach(scope => {
                            scope.manageDataPointCategories.forEach(
                                (cat) => {
                                    cat.manageDataPointSubCategories.forEach(
                                        (subcat) => {
                                            var count = 0;
                                            subcat.dataEntries.forEach(
                                                (dataentry) => {
                                                    if (
                                                        dataentry.status ===
                                                        'approved'
                                                    ) {
                                                        count++;
                                                    }
                                                    subcat.approvedEntries = count;
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        })

                        const isSubcategoryEmptyForAllCategories =
                            response.every((scope) => {
                                scope.manageDataPointCategories.every(
                                    (category) =>
                                        category.manageDataPointSubCategories
                                            .length === 0
                                );
                            })

                        if (isSubcategoryEmptyForAllCategories === true) {
                            this.facilityhavedp = environment.none;
                            this.facilitynothavedp = environment.flex;
                            this.forGroup = environment.none;
                        } else {
                            this.facilityhavedp = environment.block;
                            this.facilitynothavedp = environment.none;
                            this.forGroup = environment.none;
                        }
                        let found = false;
                        for (let i = 0; i < response.length; i++) { // Use < instead of <=
                            for (let j = 0; j < response[i].manageDataPointCategories.length; j++) { // Use < instead of <=
                                if (response[i].manageDataPointCategories[j].manageDataPointSubCategories.length > 0) {

                                    const subCatID = response[i].manageDataPointCategories[j].manageDataPointSubCategories[0].id;
                                    this.SubCatAllData = response[i].manageDataPointCategories[j].manageDataPointSubCategories[0];
                                    this.id_var = subCatID;
                                    if (response[i].manageDataPointCategories[j].manageDataPointCategorySeedID == 1) {
                                        this.trackingService.getSCdataentry(subCatID, this.loginInfo.tenantID).subscribe({
                                            next: (response) => {
                                                this.commonDE = response;
                                                this.categoryId = 1;
                                                this.getEmissionfactor(
                                                    this.SubCatAllData
                                                        .manageDataPointSubCategorySeedID,
                                                    this.categoryId
                                                );
                                                this.getsubCategoryType(this.SubCatAllData
                                                    .manageDataPointSubCategorySeedID);
                                            }
                                        });
                                        found = true; // Set the flag to true
                                        break;
                                    }

                                    if (response[i].manageDataPointCategories[j].manageDataPointCategorySeedID == 2) {
                                        this.trackingService.getrefdataentry(subCatID, this.loginInfo.tenantID).subscribe({
                                            next: (response) => {
                                                this.commonDE = response;
                                                this.categoryId = 2;
                                                this.getEmissionfactor(
                                                    this.SubCatAllData
                                                        .manageDataPointSubCategorySeedID,
                                                    this.categoryId
                                                );
                                                this.getsubCategoryType(this.SubCatAllData
                                                    .manageDataPointSubCategorySeedID);

                                            }
                                        });
                                        found = true; // Set the flag to true
                                        break;
                                    }

                                    if (response[i].manageDataPointCategories[j].manageDataPointCategorySeedID == 3) {
                                        this.trackingService.getfiredataentry(subCatID, this.loginInfo.tenantID).subscribe({
                                            next: (response) => {
                                                this.commonDE = response;
                                                this.categoryId = 3;
                                                this.getEmissionfactor(
                                                    this.SubCatAllData
                                                        .manageDataPointSubCategorySeedID,
                                                    this.categoryId
                                                );
                                                this.getsubCategoryType(this.SubCatAllData
                                                    .manageDataPointSubCategorySeedID);

                                            }
                                        });
                                        found = true; // Set the flag to true
                                        break;
                                    }

                                    if (response[i].manageDataPointCategories[j].manageDataPointCategorySeedID == 5) {
                                        this.trackingService.getElectricdataentry(subCatID, this.loginInfo.tenantID).subscribe({
                                            next: (response) => {
                                                this.commonDE = response;
                                                this.categoryId = 5;
                                                this.getEmissionfactor(
                                                    this.SubCatAllData
                                                        .manageDataPointSubCategorySeedID,
                                                    this.categoryId
                                                );
                                                this.getsubCategoryType(this.SubCatAllData
                                                    .manageDataPointSubCategorySeedID);

                                            }
                                        });
                                        found = true; // Set the flag to true
                                        break;
                                    }

                                    if (response[i].manageDataPointCategories[j].manageDataPointCategorySeedID == 6) {
                                        this.trackingService.getvehicledataentry(subCatID, this.loginInfo.tenantID).subscribe({
                                            next: (response) => {
                                                this.commonDE = response;
                                                this.categoryId = 6;
                                                this.getEmissionfactor(
                                                    this.SubCatAllData
                                                        .manageDataPointSubCategorySeedID,
                                                    this.categoryId
                                                );
                                                this.getsubCategoryType(this.SubCatAllData
                                                    .manageDataPointSubCategorySeedID);

                                            }
                                        });
                                        found = true; // Set the flag to true
                                        break;
                                    }
                                    if (response[i].manageDataPointCategories[j].manageDataPointCategorySeedID == 7) {
                                        this.trackingService.getHeatandSteamdataentry(subCatID, this.loginInfo.tenantID).subscribe({
                                            next: (response) => {
                                                this.commonDE = response;
                                                this.categoryId = 7;
                                                this.getEmissionfactor(
                                                    this.SubCatAllData
                                                        .manageDataPointSubCategorySeedID,
                                                    this.categoryId
                                                );
                                                this.getsubCategoryType(this.SubCatAllData
                                                    .manageDataPointSubCategorySeedID);
                                            }
                                        });
                                        found = true; // Set the flag to true
                                        break;
                                    }
                                    else {
                                        this.commonDE = [];
                                        this.categoryId =
                                            response[i].manageDataPointCategories[j].manageDataPointCategorySeedID;
                                        this.units = [];
                                        break;
                                    }
                                }

                                if (found) { // Check the flag here
                                    break; // Break out of the inner loop if the flag is true
                                }
                            }

                            if (found) { // Check the flag here
                                break; // Break out of the outer loop if the flag is true
                            }
                        }
                        this.route.queryParams.subscribe(params => {
                            if (params['data'] != undefined) {
                                debugger
                                this.subCatID = params['data'];
                                this.activeindex = 1;
                                this.id_var = this.subCatID;
                            }

                        })
                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Get data Point failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                }
            });
    }
    //Sets the default data point and category for the facility.
    defaultData() {
        for (let cat of this.AssignedDataPoint[0].manageDataPointCategories) {
            this.categoryId = cat.manageDataPointCategorySeedID;
            this.SubCatAllData = cat.manageDataPointSubCategories[0];
            this.id_var = this.SubCatAllData.id;
            break; // Exit the outer loop after storing the zero index
        }
        //retrieves the emission factor for the selected subcategory
        this.getEmissionfactor(
            this.SubCatAllData.manageDataPointSubCategorySeedID,
            this.categoryId
        );
    }

    //Updates selected data point and category, fetches emission factor, checks for existing entries, and resets the form.
    SubCatData(data: any, catID:any) {
        console.log("id", catID);
        this.id_var = data.id;
        this.categoryId = catID;
        this.SubCatAllData = data;
        console.log("forrrrrrrm",this.dataEntry);
   

        if (catID == 1) {
            this.trackingService.getSCdataentry(data.id, this.loginInfo.tenantID).subscribe({
                next: (response) => {
                    console.log("response", response);
                    this.commonDE = response;
                }
            });
            this.getEmissionfactor(
                this.SubCatAllData.manageDataPointSubCategorySeedID,
                this.categoryId
            );
            this.getsubCategoryType(this.SubCatAllData
                .manageDataPointSubCategorySeedID)
        }

        if (catID == 2) {
            this.trackingService.getrefdataentry(data.id, this.loginInfo.tenantID).subscribe({
                next: (response) => {
                    this.commonDE = response;
                }
            });
            this.getEmissionfactor(
                this.SubCatAllData.manageDataPointSubCategorySeedID,
                this.categoryId
            );
            this.getsubCategoryType(this.SubCatAllData
                .manageDataPointSubCategorySeedID)
        }

        if (catID == 3) {
            this.trackingService.getfiredataentry(data.id, this.loginInfo.tenantID).subscribe({
                next: (response) => {
                    this.commonDE = response;
                }
            });
            this.getEmissionfactor(
                this.SubCatAllData.manageDataPointSubCategorySeedID,
                this.categoryId
            );
            this.getsubCategoryType(this.SubCatAllData
                .manageDataPointSubCategorySeedID)
        }

        if (catID == 5) {
            this.trackingService.getElectricdataentry(data.id, this.loginInfo.tenantID).subscribe({
                next: (response) => {
                    this.commonDE = response;
                }
            });
            this.getEmissionfactor(
                this.SubCatAllData.manageDataPointSubCategorySeedID,
                this.categoryId
            );
            this.getsubCategoryType(this.SubCatAllData
                .manageDataPointSubCategorySeedID)
        }

        if (catID == 6) {
            this.trackingService.getvehicledataentry(data.id, this.loginInfo.tenantID).subscribe({
                next: (response) => {
                    this.commonDE = response;
                    if (data.manageDataPointSubCategorySeedID == 10) {
                        this.getPassengerVehicleType();
                    }
                    else {
                        this.getDeliveryVehicleType();
                    }
                }
            });
            this.getEmissionfactor(
                this.SubCatAllData.manageDataPointSubCategorySeedID,
                this.categoryId
            );
            this.getsubCategoryType(this.SubCatAllData
                .manageDataPointSubCategorySeedID)
        }
        if (catID == 7) {
            this.trackingService.getHeatandSteamdataentry(data.id, this.loginInfo.tenantID).subscribe({
                next: (response) => {
                    this.commonDE = response;
                }
            });
            this.getEmissionfactor(
                this.SubCatAllData.manageDataPointSubCategorySeedID,
                this.categoryId
            );
            this.getsubCategoryType(this.SubCatAllData
                .manageDataPointSubCategorySeedID)
        }

        this.typeEV = false;
        this.typeBusCoach = false;
        this.checkEntryexist();
        this.resetForm();
    }
    //The saveSetting function handles the saving or editing of data entry settings.
    saveSetting(data: NgForm) {
        if (this.dataEntrySetting.id === undefined) {
            this.dataEntrySetting.manageDataPointSubCategoriesID =
                this.SubCatAllData.id;
            this.trackingService
                .postDataEntrySetting(this.dataEntrySetting)
                .subscribe({
                    next: (response) => {
                        if (response === true) {
                            this.activeindex = 0;
                            this.notification.showSuccess(
                                'Setting Added successfully',
                                'Success'
                            );
                        } else {
                            this.notification.showWarning(
                                'Setting Added failed',
                                'Warning'
                            );
                        }
                    },
                    error: (err) => {
                        this.notification.showError(
                            'Setting added failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    },
                    complete: () => console.info('Setting Added')
                });
        } else {
            this.dataEntrySetting.manageDataPointSubCategoriesID =
                this.SubCatAllData.id;
            this.trackingService
                .putDataEntrySetting(
                    this.dataEntrySetting.id,
                    this.dataEntrySetting
                )
                .subscribe({
                    next: (response) => {
                        if (response == true) {
                            this.activeindex = 0;
                            this.notification.showSuccess(
                                'Setting edited successfully',
                                'Success'
                            );
                        }
                    },
                    error: (err) => {
                        this.notification.showError(
                            'Setting editing failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    },
                    complete: () => console.info('Setting Edited')
                });
        }
    }

    // retrieves the data entry setting for a given subcategory ID.
    getSetting(subCatId: any) {
        this.trackingService
            .getdataEntrySetting(subCatId)
            .subscribe((response) => {
                if (response != null) {
                    this.dataEntrySetting = response;
                } else {
                    this.dataEntrySetting = new DataEntrySetting();
                }
            });
    }

    //retrieves the emission factor for a given subcategory seed ID and category ID.
    getEmissionfactor(subcatseedID: any, catID) {
        if (catID === 1) {
            this.trackingService
                .GetEmissionFactorStationarybyID(subcatseedID)
                .subscribe({
                    next: (response) => {
                        console.log("emssion", response);
                        if (response) {
                            this.EmissionFactor = response;
                            this.getUnit(subcatseedID);
                            console.log("dddd", this.dataEntry);
                        }
                        else {
                            this.EmissionFactor = [];
                        }
                    },
                    error: (err) => {
                        this.EmissionFactor = [];
                        console.log(
                            '🚀 ~ file: tracking.component.ts:512 ~ TrackingComponent ~ getEmissionfactor ~ err:',
                            err
                        );
                    }
                });
        }
        if (catID === 2) {
            this.trackingService
                .GetEmissionFactorRefrigerantsbyID(subcatseedID)
                .subscribe({
                    next: (response) => {
                        if (response) {
                            this.EmissionFactor = response;
                            this.getUnit(subcatseedID);
                        }
                        else {
                            this.EmissionFactor = [];
                        }
                    },
                    error: (err) => {
                        this.EmissionFactor = [];
                        this.notification.showError(
                            'Emission Factor failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (catID === 3) {
            this.trackingService
                .GetEmissionFactorFirebyID(subcatseedID)
                .subscribe({
                    next: (response) => {
                        if (response) {
                            this.EmissionFactor = response;
                            this.getUnit(subcatseedID);
                        }
                        else {
                            this.EmissionFactor = [];
                        }
                    },
                    error: (err) => {
                        this.EmissionFactor = [];
                        this.notification.showError(
                            'Emission Factor failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (catID === 5) {
            this.trackingService
                .GetEmissionFactorElectricitybyID(subcatseedID)
                .subscribe({
                    next: (response) => {
                        if (response) {
                            this.EmissionFactor = response;
                            this.getUnit(subcatseedID);
                        }
                        else {
                            this.EmissionFactor = [];
                        }
                    },
                    error: (err) => {
                        this.EmissionFactor = [];
                        this.notification.showError(
                            'Emission Factor failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (catID === 6) {
            this.trackingService
                .GetEmissionFactorVehiclebyID(subcatseedID)
                .subscribe({
                    next: (response) => {
                        if (response) {
                            this.EmissionFactor = response;
                            this.getUnit(subcatseedID);
                        }
                        else {
                            this.EmissionFactor = [];
                        }
                    },
                    error: (err) => {
                        this.EmissionFactor = [];
                        this.notification.showError(
                            'Emission Factor failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (catID === 7) {
            this.trackingService
                .GetEmissionFactorHeatandSteambyID(subcatseedID)
                .subscribe({
                    next: (response) => {
                        if (response) {
                            this.EmissionFactor = response;
                            this.getUnit(subcatseedID);
                        }
                        else {
                            this.EmissionFactor = [];
                        }
                    },
                    error: (err) => {
                        this.EmissionFactor = [];
                        this.notification.showError(
                            'Emission Factor failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
    }
    getsubCategoryType(subCatID: number) {
        this.trackingService.getsubCatType(subCatID).subscribe((response) => {
            console.log("rrrrr",response)
            this.SubCategoryType = response;
        })
    }
    onInputEdit() {
        this.isInputEdited = true;
    }
    //entrysave function to save dataentry
    EntrySave(values: NgForm) {
        this.dataEntry.month = this.selectMonths
            .map((month) => month.value)
            .join(', '); //this.getMonthName();
        this.dataEntry.year = this.year.getFullYear().toString(); //this.getYear();
        if (this.categoryId == 1) {
            if (
                this.dataEntry.readingValue <= 0 ||
                this.dataEntry.readingValue === null ||
                this.dataEntry.readingValue === undefined
            ) {
                return;
            }
            if (this.SubCatAllData.subCatName == 'Liquid Fuels' || this.EmissionFactor[0].subCategorySeedID == 1) {

                if (this.dataEntry.typeID == 1) {
                    if (this.SCdataEntry.blendType == 'No Blend') {
                        this.SCdataEntry.blendID = 1;
                        this.EmissionFactor.forEach(ef => {
                            if (ef.item == 'Petrol' && ef.itemType == '100% Mineral') {
                                if (this.SCdataEntry.calorificValue != null) {
                                    this.SCdataEntry.gHGEmission = ef.kgCO2e_kwh;
                                    return;
                                }
                                if (this.dataEntry.unit == 'tonnes' || this.dataEntry.unit == 'Tonnes') {
                                    this.SCdataEntry.gHGEmission = ef.kgCO2e_tonnes;
                                    return;
                                }

                                else {
                                    this.SCdataEntry.gHGEmission = ef.kgCO2e_litre;
                                    return;
                                }
                            }

                        })

                    }
                    if (this.SCdataEntry.blendType == 'Average Blend') {
                        this.SCdataEntry.blendID = 2;
                        this.EmissionFactor.forEach(ef => {
                            if (ef.item == 'Petrol' && ef.itemType == 'Average Biofuel Blend') {
                                if (this.SCdataEntry.calorificValue != null) {
                                    this.SCdataEntry.gHGEmission = ef.kgCO2e_kwh;
                                    return;
                                }
                                if (this.dataEntry.unit == 'tonnes') {
                                    this.SCdataEntry.gHGEmission = ef.kgCO2e_tonnes;
                                    return;
                                }
                                else {
                                    this.SCdataEntry.gHGEmission = ef.kgCO2e_litre;
                                    return;
                                }
                            }

                        })
                    }
                    if (this.SCdataEntry.blendType == 'Perc. Blend') {
                        this.SCdataEntry.blendID = 3;
                        this.EmissionFactor.forEach(ef => {
                            if (ef.item == 'Petrol' && ef.itemType == '100% Mineral') {
                                if (this.SCdataEntry.calorificValue != null) {
                                    this.SCdataEntry.gHGEmission = ef.kgCO2e_kwh;
                                    return;
                                }
                                if (this.dataEntry.unit == 'tonnes') {
                                    this.SCdataEntry.gHGEmission = ef.kgCO2e_tonnes;
                                    return;
                                }
                                else {
                                    this.SCdataEntry.gHGEmission = ef.kgCO2e_litre;
                                    return;
                                }
                            }

                        })
                    }
                }
                else if (this.dataEntry.typeID == 2) {
                    if (this.SCdataEntry.blendType == 'No Blend') {
                        this.SCdataEntry.blendID = 1;
                        this.EmissionFactor.forEach(ef => {
                            if (ef.item == 'Diesel' && ef.itemType == '100% Mineral') {
                                if (this.SCdataEntry.calorificValue != null) {
                                    this.SCdataEntry.gHGEmission = ef.kgCO2e_kwh;
                                    return;
                                }
                                if (this.dataEntry.unit == 'tonnes' || this.dataEntry.unit == 'Tonnes') {
                                    this.SCdataEntry.gHGEmission = ef.kgCO2e_tonnes;
                                    return;
                                }
                                else {
                                    this.SCdataEntry.gHGEmission = ef.kgCO2e_litre;
                                    return;
                                }
                            }

                        })

                    }
                    if (this.SCdataEntry.blendType == 'Average Blend') {
                        this.SCdataEntry.blendID = 2;
                        this.EmissionFactor.forEach(ef => {
                            if (ef.item == 'Diesel' && ef.itemType == 'Average Biofuel Blend') {
                                if (this.SCdataEntry.calorificValue != null) {
                                    this.SCdataEntry.gHGEmission = ef.kgCO2e_kwh;
                                    return;
                                }
                                if (this.dataEntry.unit == 'tonnes' || this.dataEntry.unit == 'Tonnes') {
                                    this.SCdataEntry.gHGEmission = ef.kgCO2e_tonnes;
                                    return;
                                }
                                else {
                                    this.SCdataEntry.gHGEmission = ef.kgCO2e_litre;
                                    return;
                                }
                            }

                        })
                    }
                    if (this.SCdataEntry.blendType == 'Perc. Blend') {
                        this.SCdataEntry.blendID = 3;
                        this.EmissionFactor.forEach(ef => {
                            if (ef.item == 'Diesel' && ef.itemType == '100% Mineral') {
                                if (this.SCdataEntry.calorificValue != null) {
                                    this.SCdataEntry.gHGEmission = ef.kgCO2e_kwh;
                                    return;
                                }
                                if (this.dataEntry.unit == 'tonnes' || this.dataEntry.unit == 'Tonnes') {
                                    this.SCdataEntry.gHGEmission = ef.kgCO2e_tonnes;
                                    return;
                                }
                                else {
                                    this.SCdataEntry.gHGEmission = ef.kgCO2e_litre;
                                    return;
                                }
                            }

                        })
                    }
                }
                else {
                    this.EmissionFactor.forEach(ef => {
                        if (ef.subCatTypeID == this.dataEntry.typeID) {
                            if (this.SCdataEntry.calorificValue != null) {
                                this.SCdataEntry.gHGEmission = ef.kgCO2e_kwh;
                                return;
                            }
                            if (this.dataEntry.unit == 'tonnes' || this.dataEntry.unit == 'Tonnes') {
                                this.SCdataEntry.gHGEmission = ef.kgCO2e_tonnes;
                                return;
                            }
                            else {
                                this.SCdataEntry.gHGEmission = ef.kgCO2e_litre;
                                return;
                            }
                        }

                    })

                }

            }
            else if (this.SubCatAllData.subCatName == 'Solid Fuels') {
                this.EmissionFactor.forEach(ef => {
                    if (ef.subCatTypeID == this.dataEntry.typeID) {
                        if (this.SCdataEntry.calorificValue != null) {
                            this.SCdataEntry.gHGEmission = ef.kgCO2e_kwh;
                            return;
                        }
                        if (this.dataEntry.unit == 'tonnes' || this.dataEntry.unit == 'Tonnes') {
                            this.SCdataEntry.gHGEmission = ef.kgCO2e_tonnes;
                            return;
                        }
                        else {
                            this.SCdataEntry.gHGEmission = ef.kgCO2e_tonnes;
                            return;
                        }
                    }

                })
            }
            else if (this.SubCatAllData.subCatName == 'Gaseous Fuels' || this.EmissionFactor[0].subCategorySeedID == 3) {
                this.EmissionFactor.forEach(ef => {
                    if (ef.subCatTypeID == this.dataEntry.typeID) {
                        if (this.dataEntry.unit == 'kwh') {
                            this.SCdataEntry.gHGEmission = ef.kgCO2e_kwh;
                            return;
                        }
                        if (this.dataEntry.unit == 'tonnes' || this.dataEntry.unit == 'Tonnes') {
                            this.SCdataEntry.gHGEmission = ef.kgCO2e_tonnes;
                            return;
                        }
                        else {
                            this.SCdataEntry.gHGEmission = ef.kgCO2e_litre;
                            return;
                        }
                    }

                })

            }
            else {
                this.SCdataEntry.calorificValue = null;
                this.EmissionFactor.forEach(ef => {
                    if (ef.subCatTypeID == this.dataEntry.typeID) {
                        if (this.dataEntry.unit == 'kg' || this.dataEntry.unit == 'KG' || this.dataEntry.unit == 'Kg') {
                            this.SCdataEntry.gHGEmission = ef.kgCO2e_kg;
                            return;
                        }
                        if (this.dataEntry.unit == 'GJ' || this.dataEntry.unit == 'Gj') {
                            this.SCdataEntry.gHGEmission = ef.kgCO2e_Gj;
                            return;
                        }
                        if (this.dataEntry.unit == 'tonnes' || this.dataEntry.unit == 'Tonnes') {
                            this.SCdataEntry.gHGEmission = ef.kgCO2e_tonnes;
                            return;

                        }
                        else {
                            this.SCdataEntry.gHGEmission = ef.kgCO2e_litre;
                            return;
                        }
                    }

                })
            }

            this.SCdataEntry.typeID = this.dataEntry.typeID;
            this.SCdataEntry.readingValue = this.dataEntry.readingValue;
            this.SCdataEntry.unit = this.dataEntry.unit;
            this.SCdataEntry.note = this.dataEntry.note;
            this.SCdataEntry.fileName = this.dataEntry.fileName;
            this.SCdataEntry.filePath = this.dataEntry.filePath;
            this.SCdataEntry.month = this.dataEntry.month;
            this.SCdataEntry.year = this.dataEntry.year;
            this.SCdataEntry.status = environment.pending;
            this.SCdataEntry.manageDataPointSubCategoriesID =
                this.SubCatAllData.id;

            this.SCdataEntry.tenantID = this.loginInfo.tenantID;
            this.SCdataEntry.submissionDate = new Date();

            this.trackingService.PostSCDataEntry(this.SCdataEntry).subscribe({
                next: (response) => {
                    if (response == environment.DataEntrySaved) {
                        //this.GetAssignedDataPoint(this.facilityID);
                        this.trackingService.getSCdataentry(this.SubCatAllData.id, this.loginInfo.tenantID).subscribe({
                            next: (response) => {
                                this.commonDE = response;
                            }
                        });
                        this.activeindex = 0;
                        this.notification.showSuccess(
                            'Data entry added successfully',
                            'Success'
                        );
                        this.resetForm();
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
        if (this.categoryId == 2) {
            this.RefrigerantDE.typeID = this.dataEntry.typeID;
            this.EmissionFactor.forEach(ef => {
                if (ef.subCatTypeID == this.dataEntry.typeID) {
                    this.RefrigerantDE.gHGEmission = ef.kgCO2e_kg;
                }

            })
            this.RefrigerantDE.unit = this.dataEntry.unit;
            this.RefrigerantDE.note = this.dataEntry.note;
            this.RefrigerantDE.fileName = this.dataEntry.fileName;
            this.RefrigerantDE.filePath = this.dataEntry.filePath;
            this.RefrigerantDE.month = this.dataEntry.month;
            this.RefrigerantDE.year = this.dataEntry.year;
            this.RefrigerantDE.status = environment.pending;
            this.RefrigerantDE.manageDataPointSubCategoriesID =
                this.SubCatAllData.id;
            this.RefrigerantDE.tenantID = this.loginInfo.tenantID;
            this.RefrigerantDE.submissionDate = new Date();

            this.trackingService.PostRegrigerantDataEntry(this.RefrigerantDE).subscribe({
                next: (response) => {
                    if (response == environment.DataEntrySaved) {
                        //this.GetAssignedDataPoint(this.facilityID);
                        this.trackingService.getrefdataentry(this.SubCatAllData.id, this.loginInfo.tenantID).subscribe({
                            next: (response) => {
                                this.commonDE = response;
                            }
                        });

                        this.activeindex = 0;
                        this.notification.showSuccess(
                            'Data entry added successfully',
                            'Success'
                        );
                        this.resetForm();
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
        if (this.categoryId == 3) {
            this.FireExtinguisherDE.gHGEmission = this.EmissionFactor[0].kgCO2e_kg;
            this.FireExtinguisherDE.unit = this.dataEntry.unit;
            this.FireExtinguisherDE.note = this.dataEntry.note;
            this.FireExtinguisherDE.fileName = this.dataEntry.fileName;
            this.FireExtinguisherDE.filePath = this.dataEntry.filePath;
            this.FireExtinguisherDE.month = this.dataEntry.month;
            this.FireExtinguisherDE.year = this.dataEntry.year;
            this.FireExtinguisherDE.status = environment.pending;
            this.FireExtinguisherDE.manageDataPointSubCategoriesID =
                this.SubCatAllData.id;
            this.FireExtinguisherDE.tenantID = this.loginInfo.tenantID;
            this.FireExtinguisherDE.submissionDate = new Date();

            this.trackingService.PostFireExtinguisherDataEntry(this.FireExtinguisherDE).subscribe({
                next: (response) => {
                    if (response == environment.DataEntrySaved) {
                        //this.GetAssignedDataPoint(this.facilityID);
                        this.trackingService.getfiredataentry(this.SubCatAllData.id, this.loginInfo.tenantID).subscribe({
                            next: (response) => {
                                this.commonDE = response;
                            }
                        });
                        this.activeindex = 0;
                        this.notification.showSuccess(
                            'Data entry added successfully',
                            'Success'
                        );
                        this.resetForm();
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
        if (this.categoryId == 6) {
            if (this.VehicleDE.modeOfDE == 'Distance Travelled') {
                this.VehicleDE.modeofDEID = 1;
                this.EmissionFactor.forEach(ef => {
                    if (ef.vehicleTypeID == this.VehicleDE.vehicleTypeID) {
                        this.VehicleDE.gHGEmission = ef.kgCO2e_km;
                    }
                })
            }
            else {
                this.VehicleDE.modeofDEID = 2;

                this.EmissionFactor.forEach(ef => {
                    if (ef.vehicleTypeID == this.VehicleDE.vehicleTypeID) {
                        if (ef.kgCO2e_litre != null) {
                            this.VehicleDE.gHGEmission = ef.kgCO2e_litre;
                        }
                        else {
                            this.VehicleDE.gHGEmission = ef.kgCO2e_kg;
                        }
                    }
                })
            }
            this.VehicleDE.unit = this.dataEntry.unit;
            this.VehicleDE.note = this.dataEntry.note;
            this.VehicleDE.fileName = this.dataEntry.fileName;
            this.VehicleDE.filePath = this.dataEntry.filePath;
            this.VehicleDE.month = this.dataEntry.month;
            this.VehicleDE.year = this.dataEntry.year;
            this.VehicleDE.status = environment.pending;
            this.VehicleDE.manageDataPointSubCategoriesID =
                this.SubCatAllData.id;
            this.VehicleDE.tenantID = this.loginInfo.tenantID;
            this.VehicleDE.submissionDate = new Date();

            this.trackingService.PostVehicleDataEntry(this.VehicleDE).subscribe({
                next: (response) => {
                    if (response == environment.DataEntrySaved) {
                        //this.GetAssignedDataPoint(this.facilityID);
                        this.trackingService.getvehicledataentry(this.SubCatAllData.id, this.loginInfo.tenantID).subscribe({
                            next: (response) => {
                                this.commonDE = response;
                                if (this.SubCatAllData.manageDataPointSubCategorySeedID == 10) {
                                    this.getPassengerVehicleType();
                                }
                                else {
                                    this.getDeliveryVehicleType();
                                }
                            }
                        });
                        this.activeindex = 0;
                        this.notification.showSuccess(
                            'Data entry added successfully',
                            'Success'
                        );
                        this.resetForm();
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
        if (this.categoryId == 5) {
            if (this.SubCatAllData.manageDataPointSubCategorySeedID == 9) {
                this.EmissionFactor.forEach(ef => {
                    if (ef.regionID == this.RenewableElectricity.electricityRegionID) {
                        this.RenewableElectricity.gHGEmission = ef.kgCO2e_kwh;
                    }

                })
            }
            else {
                this.RenewableElectricity.gHGEmission = this.EmissionFactor[0].kgCO2e_kwh;
            }

            this.RenewableElectricity.typeID = this.dataEntry.typeID;
            this.RenewableElectricity.readingValue = this.dataEntry.readingValue;
            this.RenewableElectricity.unit = this.dataEntry.unit;
            this.RenewableElectricity.note = this.dataEntry.note;
            this.RenewableElectricity.fileName = this.dataEntry.fileName;
            this.RenewableElectricity.filePath = this.dataEntry.filePath;
            this.RenewableElectricity.month = this.dataEntry.month;
            this.RenewableElectricity.year = this.dataEntry.year;
            this.RenewableElectricity.status = environment.pending;
            this.RenewableElectricity.manageDataPointSubCategoriesID =
                this.SubCatAllData.id;
            this.RenewableElectricity.tenantID = this.loginInfo.tenantID;
            this.RenewableElectricity.submissionDate = new Date();

            this.trackingService.PostElectricityDataEntry(this.RenewableElectricity).subscribe({
                next: (response) => {
                    if (response == environment.DataEntrySaved) {
                        //this.GetAssignedDataPoint(this.facilityID);
                        this.trackingService.getElectricdataentry(this.SubCatAllData.id, this.loginInfo.tenantID).subscribe({
                            next: (response) => {
                                this.commonDE = response;
                            }
                        });
                        this.activeindex = 0;
                        this.notification.showSuccess(
                            'Data entry added successfully',
                            'Success'
                        );
                        this.resetForm();
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
        if (this.categoryId == 7) {
            this.HeatandSteamDE.typeID = this.dataEntry.typeID;
            this.HeatandSteamDE.gHGEmission = this.EmissionFactor[0].kgCO2e_kwh;
            this.HeatandSteamDE.unit = this.EmissionFactor[0].unit;
            this.HeatandSteamDE.readingValue = this.dataEntry.readingValue;
            this.RenewableElectricity.unit = this.dataEntry.unit;
            this.HeatandSteamDE.note = this.dataEntry.note;
            this.HeatandSteamDE.fileName = this.dataEntry.fileName;
            this.HeatandSteamDE.filePath = this.dataEntry.filePath;
            this.HeatandSteamDE.month = this.dataEntry.month;
            this.HeatandSteamDE.year = this.dataEntry.year;
            this.HeatandSteamDE.status = environment.pending;
            this.HeatandSteamDE.manageDataPointSubCategoriesID =
                this.SubCatAllData.id;
            this.HeatandSteamDE.tenantID = this.loginInfo.tenantID;
            this.HeatandSteamDE.submissionDate = new Date();

            this.trackingService.PostHeatandSteamDataEntry(this.HeatandSteamDE).subscribe({
                next: (response) => {
                    if (response == environment.DataEntrySaved) {
                        //this.GetAssignedDataPoint(this.facilityID);'
                        this.trackingService.getHeatandSteamdataentry(this.SubCatAllData.id, this.loginInfo.tenantID).subscribe({
                            next: (response) => {
                                this.commonDE = response;
                            }
                        });
                        this.activeindex = 0;
                        this.notification.showSuccess(
                            'Data entry added successfully',
                            'Success'
                        );
                        this.resetForm();
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

    //checkEntry function for checking if an entry exists for a specific month, year, and subcategory.
    checkEntry(month, year, subcatID) {
        this.trackingService.checkEntry(month, year, subcatID).subscribe({
            next: (response) => {
                console.log("mil gyeee yeee ", new DataEntry());
                console.log("mil gyeee ======= ", this.dataEntry);
                if (response == environment.NoEntry) {
                    this.entryExist = false;
                    this.dataEntry = new DataEntry();
                } else {
                    this.entryExist = true;
                    this.dataEntry = response;
                    this.dataEntry = new DataEntry();
                }
            }
        });
    }
    //checkEntryexist method for checking if an entry exists for the current month, year, and selected subcategory.
    checkEntryexist() {
        this.dataEntry.month = this.trackingService.getMonthName(this.month);
        this.dataEntry.year = this.trackingService.getYear(this.year);
        this.checkEntry(
            this.dataEntry.month,
            this.dataEntry.year,
            this.SubCatAllData.id
        );
    }

    //---method for file upload---
    uploadFiles(files: FileList | null) {
        if (files && files.length > 0) {
            this.selectedFile = files[0];

            const formData: FormData = new FormData();
            formData.append('file', this.selectedFile, this.selectedFile.name);
            if (formData.has('file')) {
                // File is available in the FormData
                console.log('File exists in the FormData.');
            } else {
                // File is not available in the FormData
                console.log('File does not exist in the FormData.');
            }
            this.trackingService.UploadFile(formData).subscribe({
                next: (response) => {
                    if (response) {
                        this.toastr.success('Doc uploaded successfully');
                        this.uploadedFileUrl =
                            this.rootUrl + this.selectedFile.name;
                        this.dataEntry.fileName = this.selectedFile.name;
                        this.dataEntry.filePath = this.uploadedFileUrl;
                    } else {
                        // Handle the case when the file upload was not successful
                        this.toastr.error('Doc uploaded failed');
                    }
                },
                error: (err) => {
                    if (
                        err.error.message ===
                        'File size exceeds the allowed limit'
                    ) {
                        this.notification.showError(
                            'File is too large to upload',
                            ''
                        );
                    } else if (
                        err.error.message ===
                        'Only PNG, JPG and PDF files are allowed'
                    ) {
                        this.notification.showError(
                            'Only PNG and JPG files are allowed',
                            ''
                        );
                    } else {
                        // Handle other errors
                        console.error('errrrr', err);
                        this.toastr.error('Doc upload failed');
                    }
                    // Handle the error
                    console.log('Error-->>: ', JSON.stringify(err));
                }
            });
        }
    }

    //triggered when a file is selected from the file input
    onFileSelected(files: FileList) {
        const file = files.item(0);
        if (file) {
            this.uploadFiles(files);
        }
    }

    //method for download a file
    DownloadFile(filePath: string) {
        this.trackingService.downloadFile(filePath).subscribe(
            () => {
                const link = document.createElement('a');
                link.href = this.getFileUrl(filePath);
                link.download = this.getFileNameFromPath(filePath);
                link.target = '_blank';

                //Trigger the download by programmatically clicking the anchor element
                link.click();

                // Clean up the anchor element
                link.remove();

                this.toastr.success('Doc downloaded successfully');
            },
            (error) => {
                if (
                    error.error.message ===
                    'File size exceeds the allowed limit'
                ) {
                    this.notification.showError(
                        'File is too large to download',
                        ''
                    );
                } else if (
                    error.error.message ===
                    'Only PNG, JPG and PDF files are allowed'
                ) {
                    this.notification.showError(
                        'Only PNG, JPG, and PDF files are allowed',
                        ''
                    );
                } else {
                    console.error('Error:', error);
                    this.toastr.error('Doc download failed');
                }
            }
        );
    }

    //The getFileUrl function is used to generate the URL for downloading a file based on the provided filePath.
    private getFileUrl(filePath: string): string {
        const baseUrl = window.location.origin;
        return `${baseUrl}/api/DownloadFile/${encodeURIComponent(filePath)}`;
    }

    //getFileNameFromPath function is used to extract the file name from a given filePath
    private getFileNameFromPath(filePath: string): string {
        const startIndex = filePath.lastIndexOf('/') + 1;
        const endIndex = filePath.length;
        return filePath.substring(startIndex, endIndex);
    }

    //resetForm method for resetting the form and clearing any selected values or input fields.
    resetForm() {
        this.dataEntryForm.resetForm();
        this.fileUpload.clear();
    }

    EditDataEntry(dataEntry: any) {
        this.activeindex = 0;
    }
    getBlendType() {
        this.trackingService.getBlend().subscribe({
            next: (response) => {
                this.blendType = response;
            }
        })
    }
    getVehicleDEMode() {
        this.trackingService.getVehicleDEMode().subscribe({
            next: (response) => {
                this.ModeType = response;
            }
        })
    }
    getElectricitySource() {
        this.trackingService.getElectricitySource().subscribe({
            next: (response) => {
                this.ElectricitySource = response;
            }
        })
    }
    getElectricityGrid() {
        this.trackingService.getElectricityGrid().subscribe({
            next: (response) => {
                this.ElectricityGrid = response;
            }
        })
    }
    setUnit() {
        if (this.VehicleDE.modeOfDE == 'Distance Travelled') {
            this.units.forEach(un => {
                if (un.unitName == "km") {
                    this.dataEntry.unit = un.unitName;
                }
            })
            //this.dataEntry.unit = "km";
        }
        else {
            this.units.forEach(un => {
                console.log("unn===", un);
                if (un.unitName == "litre" || un.unitName == 'Litre') {
                    this.dataEntry.unit = un.unitName;
                }
            })
        }
    }
    enableCharging(subcatName: any) {
        if (subcatName == "Passenger Vehicle") {
            if (this.VehicleDE.vehicleTypeID == 7 || this.VehicleDE.vehicleTypeID == 8 || this.VehicleDE.vehicleTypeID == 9 || this.VehicleDE.vehicleTypeID == 12 || this.VehicleDE.vehicleTypeID == 17) {

                this.typeEV = true;
                this.typeBusCoach = false;
                return;

            }
            if (this.VehicleDE.vehicleTypeID == 21 || this.VehicleDE.vehicleTypeID == 22) {
                this.typeEV = false;
                this.typeBusCoach = true;
                return;

            }
            else {
                this.typeEV = false;
                this.typeBusCoach = false;
                return;

            }

        }
        else {
            if (this.VehicleDE.vehicleTypeID == 5) {

                this.typeEV = true;

            }
            else {
                this.typeEV = false;
                this.typeBusCoach = false;

            }
        }
        // if (this.VehicleDE.vehicleTypeID == ) {

        // }
    }
    getUnit(subcatId) {
        this.trackingService.getUnits(subcatId).subscribe({
            next: (Response) => {
                if (Response) {
                    this.units = Response;
                }
                else {
                    this.units = [];
                }
            }
        })
    }
    getPassengerVehicleType() {
        try {
            this.trackingService.getPassengerVehicleType().subscribe({
                next: (response) => {
                    if (response) {
                        this.VehicleType = response;
                    }
                    else {
                        this.VehicleType = [];
                    }
                }
            })
        }
        catch (ex) {
            console.log("error", ex);
        }

    }
    getDeliveryVehicleType() {
        try {
            this.trackingService.getDeliveryVehicleType().subscribe({
                next: (response) => {
                    if (response) {
                        this.VehicleType = response;
                    }
                    else {
                        this.VehicleType = [];
                    }
                }
            })
        }
        catch (ex) {
            console.log("error", ex);
        }

    }
    setDefaultMonth() {
        this.monthString = this.trackingService.getMonthName(this.month);
        this.months.forEach(m => {
            if (m.name == this.monthString) {
                this.selectMonths[0] = m;
            }

        })
    }
    downloadFireExtTemplate() {
        var fileName = 'FireExtinguisherTemplate.xlsx'
        if (fileName) {
            this.trackingService.downloadFile(fileName).subscribe(
                (response: Blob) => {
                    const url = window.URL.createObjectURL(response);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName; // Specify the desired file name
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    this.toastr.success('Doc downloaded successfully');
                },
                (error) => {
                    console.error('Error downloading the file.', error);
                    this.toastr.error('Error downloading the file.');
                }
            );
        } else {
            this.toastr.warning('File not found!');
        }
    }
}
