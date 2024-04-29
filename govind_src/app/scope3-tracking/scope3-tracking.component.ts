import { EmissionFactorTable } from '@/models/EmissionFactorTable';
import { Facility } from '@/models/Facility';
import { TrackingTable } from '@/models/TrackingTable';
import { LoginInfo } from '@/models/loginInfo';
import { Component, ElementRef, ViewChild } from '@angular/core';
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
import { countries } from '@/store/countrieslist';


declare var $: any;
interface units {
    unit: string;
}


@Component({
    selector: 'app-scope3-tracking',
    templateUrl: './scope3-tracking.component.html',
    styleUrls: ['./scope3-tracking.component.scss']
})
export class Scope3TrackingComponent {
    public countriesList: any = countries
    leasefacilitieschecked: boolean = false;
    leasevehcileschecked: boolean = false;
    vehcilestransporationchecked: boolean = false;
    storageTransporationChecked: boolean = false;
    activeCategoryIndex: number | null = 1; // To keep track of the active li index

    @ViewChild('dataEntryForm', { static: false }) dataEntryForm: NgForm;
    @ViewChild('tabView') dataentryTab: TabView;
    @ViewChild('dt1') dt!: Table;
    @ViewChild('fileUpload') fileUpload!: FileUpload;
    @ViewChild('inputFile') inputFile: any;
    filteredStatus: any; // Variable to store the selected status
    public statusFilter: string;
    public yearFilter: number;
    DP_BoxVisible: boolean;
    AddManageDataPoint = '';
    value_tab = 'Scope 1';
    selectedValues: string[] = [];
    selectMonths: any[] = [];
    yearOptions: any[] = [];
    projectPhaseTypes: any[] = [];
    checked: boolean = false;
    items: MenuItem[];
    active: MenuItem;
    notevalue: string;
    status: TrackingTable[];
    formGroup: FormGroup;
    // units: units[];
    setlimit: any[];
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
    mode_name = ''
    SCdataEntry: StationaryCombustionDE = new StationaryCombustionDE();
    RefrigerantDE: RefrigerantsDE = new RefrigerantsDE();
    FireExtinguisherDE: FireExtinguisherDE = new FireExtinguisherDE();
    VehicleDE: VehicleDE = new VehicleDE();
    RenewableElectricity: ElectricityDE = new ElectricityDE();
    commonDE: any;
    statusData: any;
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
    VehicleGrid: any[] = [];
    franchiseGrid: any[] = [];
    carFuel_type: any[] = [];
    franchiseGridWithPlaceholder: any[] = [];
    wasteGrid: any[] = [];
    busineessGrid: any[] = [];
    flightTime: any[] = [];
    mode_type: any[] = [];
    subVehicleCategory: any[] = [];
    subFranchiseCategory: any[] = [];
    storageGrid: any[] = [];
    calculationGrid: any[] = [];
    energyUnitsGrid: any[] = [];
    wasteUnitsGrid: any[] = [];
    CategoryGrid: any[] = [];
    flightsTravelTypes: any[] = [];
    prodductEnergySubTypes: any[] = [];
    productActivitySubTypes: any[] = [];
    wasteSubTypes: any[] = [];
    activitySubTypes: any[] = [];
    fuelEnergyTypes: any[] = [];
    purchaseGoodsTypes: any[] = [];
    ModesTravelGrid: any[] = [];
    calculationUpleaseGrid: any[] = [];
    refrigeratedTypes: any[] = [];
    expectedElectricityUnitsGrid: any[] = [];
    facilityUnits: any[] = [];
    purchaseGoodsUnitsGrid: any[] = [];
    flightClassGrid: any[] = [];
    returnGrid: any[] = [];
    waterSupplyUnitGrid: any[] = [];
    productEnergyTypes: any[] = [];
    waterWasteMethod: any[] = [];
    investmentTypeGrid: any[] = [];
    airportGrid: any[] = [];
    distanceUnits: any[] = [];
    hotelTypeGrid: any[] = [];
    calculationPurchaseGrid: any[] = [];
    selectedflightsTravel: any;
    public EmissionFactor: EmissionFactor[] = [];
    kgCO2e: any;
    selectedFile: File;
    uploadedFileUrl: string;
    rootUrl: string;
    fileSelect: File;
    categoryId: number;
    accordianIndex = 0;
    units: any[] = [];
    monthString: string;
    VehicleType: VehicleType[] = [];
    SubCategoryType: SubCategoryTypes[] = [];
    isInputEdited: boolean;
    typeEV: boolean = false;
    typeBusCoach: boolean = false;
    displayTrackList = 'block';
    displayTrackEntry = 'd-none';
    display1 = 'd-none';
    display2 = 'd-none';
    display3 = 'd-none';
    display4 = 'd-none';
    display5 = 'd-none';
    flightDisplay1 = 'block'
    flightDisplay2 = 'none'
    flightDisplay3 = 'none'
    active1 = ''
    active2 = ''
    active3 = ''
    batchId: any;
    vehicleTypeId: number;
    selectedVehicleType: any = '';
    selectedVehicleIndex: number = 1;
    subVehicleCategoryValue: string = 'Van-Petrol';
    franchiseCategoryValue: string;
    subFranchiseCategoryValue: string = 'Bank Branch';
    franchiseMethodValue: string;
    storagef_typeValue: string = this.storageGrid[0]?.storagef_type;
    franchiseMethod = false;
    averageMethod = false;
    noofemployees_1 = ""
    noofemployees_2 = ""
    noofemployees_3 = ""
    noofdays_1 = ""
    noofdays_2 = ""
    noofdays_3 = ""
    noofmonths_1: string;
    noofmonths_2: string;
    noofmonths_3: string;
    uploadButton = false;
    noOfItems = false;
    subElectricityUnits = "per usage";
    selectedFuelItem: any;
    calculationRow = false;
    investmentTypeValue = '';
    equityInvestmentRow = false;
    debtInvesmentRow = false;
    InvestmentHeading = '';
    carMode = false;
    autoMode = false;
    busMode = false;
    railMode = false;
    ferryMode = false;
    ModeSelected = false;
    waterWasteId = 1;
    waterWasteProduct: string;
    onIndustrySelected = false;
    onActivitySelected = false;
    OthersSecledted = false;
    RevenueRow = false;






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
        { name: 'Jan', value: 'Jan' },
        { name: 'Feb', value: 'Feb' },
        { name: 'Mar', value: 'Mar' },
        { name: 'Apr', value: 'Apr' },
        { name: 'May', value: 'May' },
        { name: 'June', value: 'Jun' },
        { name: 'July', value: 'July' },
        { name: 'Aug', value: 'Aug' },
        { name: 'Sep', value: 'Sep' },
        { name: 'Oct', value: 'Oct' },
        { name: 'Nov', value: 'Nov' },
        { name: 'Dec', value: 'Dec' }
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


        this.flightsTravelTypes =
            [

                {
                    "id": 1,
                    "flightType": "Generic"
                },
                {
                    "id": 2,
                    "flightType": "To/From"
                },
                {
                    "id": 3,
                    "flightType": "Distance"
                }

            ]
        this.projectPhaseTypes =
            [

                {
                    "id": 1,
                    "projectPhase": "In Operational Phase"
                },
                {
                    "id": 2,
                    "projectPhase": "In Construction phase"
                }

            ]


        this.productEnergyTypes =
            [

                {
                    "id": 1,
                    "energyTypes": "Direct use-phase emissions"
                },
                {
                    "id": 2,
                    "energyTypes": "Indirect use-phase emissions"
                }
            ]
        this.facilityUnits =
            [
                {
                    "id": 1,
                    "energyTypes": "sq ft"
                },
                {
                    "id": 2,
                    "energyTypes": "m2"
                }
            ]
        this.distanceUnits =
            [
                {
                    "id": 1,
                    "energyTypes": "km"
                },
                {
                    "id": 2,
                    "energyTypes": "miles"
                }
            ]
        this.calculationGrid =
            [
                {
                    "id": 1,
                    "calculationmethod": "Average data method"
                },
                {
                    "id": 2,
                    "calculationmethod": "Investment Specific method"
                }
            ]
        this.calculationPurchaseGrid =
            [
                {
                    "id": 1,
                    "calculationmethod": "Average data method"
                },
                {
                    "id": 2,
                    "calculationmethod": "Site Specific method"
                }
            ]
        this.calculationUpleaseGrid =
            [
                {
                    "id": 1,
                    "calculationmethod": "Average data method"
                },
                {
                    "id": 2,
                    "calculationmethod": "Facility Specific method"
                }
            ]
        this.energyUnitsGrid =
            [
                {
                    "id": 1,
                    "units": "No. of Item"
                },
                {
                    "id": 2,
                    "units": "Tonnes"
                },
                {
                    "id": 3,
                    "units": "kg"
                },
                {
                    "id": 4,
                    "units": "litres"
                }
            ]
        this.wasteUnitsGrid =
            [
                {
                    "id": 1,
                    "units": "kg"
                },
                {
                    "id": 2,
                    "units": "tonnes"
                },
                {
                    "id": 3,
                    "units": "litres"
                }
            ]
        this.purchaseGoodsUnitsGrid =
            [
                {
                    "id": 1,
                    "units": "INR"
                },
                {
                    "id": 2,
                    "units": "kg"
                },
                {
                    "id": 3,
                    "units": "tonnes"
                },
                {
                    "id": 4,
                    "units": "litres"
                }
            ]
        this.flightClassGrid =
            [
                {
                    "id": 1,
                    "classs": "Economy"
                },
                {
                    "id": 2,
                    "classs": "Business"
                },
                {
                    "id": 3,
                    "classs": "First Class"
                }
            ]
        this.returnGrid =
            [
                {
                    "id": 1,
                    "return": "Yes"
                },
                {
                    "id": 2,
                    "return": "No"
                }

            ]
        this.hotelTypeGrid =
            [
                {
                    "id": 'star_2',
                    "hoteltype": "2 star"
                },
                {
                    "id": 'star_3',
                    "hoteltype": "3 star"
                },
                {
                    "id": 'star_4',
                    "hoteltype": "4 star"
                },
                {
                    "id": 'star_5',
                    "hoteltype": "5 star"
                }

            ]
        this.expectedElectricityUnitsGrid =
            [
                {
                    "id": 1,
                    "unitsExpElec": "No. of times used"
                },
                {
                    "id": 2,
                    "unitsExpElec": "Days"
                },
                {
                    "id": 3,
                    "unitsExpElec": "Months"
                },
                {
                    "id": 4,
                    "unitsExpElec": "Years"
                }
            ]
        this.ModesTravelGrid =
            [
                {
                    "id": 1,
                    "modes": "Car"
                },
                {
                    "id": 2,
                    "modes": "Rail"
                },
                {
                    "id": 3,
                    "modes": "Bus"
                },
                {
                    "id": 4,
                    "modes": "Auto"
                },
                {
                    "id": 4,
                    "modes": "Ferry"
                }
            ]
        this.investmentTypeGrid =
            [
                {
                    "id": 1,
                    "type": "Equity investments"
                },
                {
                    "id": 2,
                    "type": "Debt investments"
                },
                {
                    "id": 3,
                    "type": "Project finance"
                }
            ]
        // Concatenate an empty option to your existing calculationGrid

        this.CategoryGrid =
            [{
                "id": 1,
                "electricityRegionName": "Van - Petrol"
            },
            {
                "id": 2,
                "electricityRegionName": "Van  - Diesel"
            },
            {
                "id": 3,
                "electricityRegionName": "Van - LPG"
            },
            {
                "id": 4,
                "electricityRegionName": "Van - CNG"
            },
            {
                "id": 2,
                "electricityRegionName": "Van - Battery EV"
            }
            ]
        this.storageGrid =
            [{
                "id": 1,
                "storagef_type": "Distribution Centre"
            },
            {
                "id": 2,
                "storagef_type": "Dry Warehouse"
            },
            {
                "id": 3,
                "storagef_type": "Refrigerated Warehouse"
            }

            ]
        this.waterSupplyUnitGrid =
            [{
                "id": 1,
                "unitType": "cubic m"
            },
            {
                "id": 2,
                "unitType": "million litres"
            }
            ]
        this.waterWasteMethod =
            [{
                "id": 'recycling',
                "water_type": "Recycling"
            },
            {
                "id": 'incineration',
                "water_type": "Incineration"
            },
            {
                "id": 'composting',
                "water_type": "Composting"
            },
            {
                "id": 'landfill',
                "water_type": "Landfill"
            },
            {
                "id": 'anaerobic digestion',
                "water_type": "Anaerobic digestion"
            }

            ]

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
                this.GetAssignedDataPoint(this.facilityID);
            } else {
                this.facilityhavedp = 'none';
                this.facilitynothavedp = 'none';
                this.forGroup = 'flex';
            }
        } else {
            this.GetAssignedDataPoint(this.loginInfo.facilityID);
        }

        this.getBatch();


        
    };

    setActive(index: number): void {
        this.flightDisplay1 = 'block'
        this.flightDisplay2 = 'none'
        this.flightDisplay3 = 'none'
        this.noOfItems = false;
        this.subElectricityUnits = "per usage";
        this.averageMethod = false;
        this.franchiseMethod = false;
        this.leasefacilitieschecked = false;
        this.leasevehcileschecked = false;
        this.ModeSelected = false;
        this.calculationRow = false;
        this.equityInvestmentRow = false;
        if (this.activeCategoryIndex === index) {
            this.activeCategoryIndex = index; // Toggle off if clicking on the same item
        } else {
            this.activeCategoryIndex = index; // Set the clicked item as active
        }
        if (this.activeCategoryIndex == 2) {
            this.getVehicleTypes();
            this.getSubVehicleCategory(1)

        }
        if (this.activeCategoryIndex == 4) {
            this.getVehicleTypes();
            this.getSubVehicleCategory(1)
        }
        if (this.activeCategoryIndex == 5) {
            this.getFranchiseType();
            this.getSubFranchiseCategory('Banking Financial Services')
        }
        if (this.activeCategoryIndex == 3) {
            this.getFranchiseType();
            this.getSubFranchiseCategory('Banking Financial Services');
            this.getVehicleTypes();
            this.getSubVehicleCategory(1)
        }
        if (this.activeCategoryIndex == 6) {
            this.getFranchiseType();
            this.getSubFranchiseCategory('Banking Financial Services');
            this.getVehicleTypes();
            this.getSubVehicleCategory(1)
        }
        if (this.activeCategoryIndex == 7) {
            this.getInvestmentCategories();
            this.getInvestmentSubCategory('Coke, Refined Petroleum, and Nuclear Fuel')
        }
        if (this.activeCategoryIndex == 8) {


            this.getFlightType();
            this.getBusineesUnit()
            // this.getSubFranchiseCategory('Banking Financial Services');
            // this.getVehicleTypes();
            // this.getSubVehicleCategory(1)
        }
        if (this.activeCategoryIndex == 12) {
            this.getEndWasteType();
            this.getWasteSubCategory("1")
        }
        if (this.activeCategoryIndex == 15) {
            this.getPurchaseGoodsCategory();
        }
        if (this.activeCategoryIndex == 16) {
            this.getProductsEnergyCategory("1")
        }
        if (this.activeCategoryIndex == 17) {
            this.getEndWasteType();
            this.getWasteSubCategory("1")
        }
        this.getStatusData(this.activeCategoryIndex);
    };

    onCityChange(event: any) {
        // event.value will contain the selected city object
        this.selectedflightsTravel = event.value;
        console.log('Selected City:', this.selectedflightsTravel);
        if (this.selectedflightsTravel == 'Generic') {

            this.flightDisplay1 = 'block'
            this.flightDisplay2 = 'none'
            this.flightDisplay3 = 'none'
            this.getBusineesUnit();
        } else if (this.selectedflightsTravel == 'To/From') {
            this.getAirportCodes()
            this.flightDisplay2 = 'block'
            this.flightDisplay1 = 'none'
            this.flightDisplay3 = 'none'
        } else {
            this.getFlightTimeTypes();
            this.flightDisplay3 = 'block'
            this.flightDisplay1 = 'none'
            this.flightDisplay2 = 'none'
        }
    };

    onModesChange(event: any) {
        const selectedMode = event.value;
        this.carMode = false;
        this.ModeSelected = true;
        if (selectedMode == 'Car') {
            this.carMode = true;
            const optionvalue =
                [{
                    "id": 1,
                    "type": "Small"
                },
                {
                    "id": 2,
                    "type": "Medium"
                },
                {
                    "id": 3,
                    "type": "Large"
                }
                ]
            const optionvalue2 =
                [{
                    "id": 1,
                    "mode_type": "Petrol"
                },
                {
                    "id": 2,
                    "mode_type": "Diesel"
                },
                {
                    "id": 3,
                    "mode_type": "LPG"
                },
                {
                    "id": 4,
                    "mode_type": "CNG"
                },
                {
                    "id": 5,
                    "mode_type": "Hybrid"
                },
                {
                    "id": 6,
                    "mode_type": "Electric"
                }
                ]
            this.mode_name = selectedMode;
            this.mode_type = optionvalue;
            this.carFuel_type = optionvalue2;
        } else if (selectedMode == 'Auto') {
            const optionvalue =
                [{
                    "id": 1,
                    "type": "Petrol"
                },
                {
                    "id": 2,
                    "type": "CNG"
                },
                {
                    "id": 3,
                    "type": "LPG"
                }
                ]
            this.mode_name = selectedMode;
            this.mode_type = optionvalue;
        } else if (selectedMode == 'Bus') {
            const optionvalue =
                [{
                    "id": 1,
                    "type": "Local Bus"
                },
                {
                    "id": 2,
                    "type": "Coach"
                }
                ]
            this.mode_name = selectedMode;
            this.mode_type = optionvalue;
        }
        else if (selectedMode == 'Rail') {
            const optionvalue =
                [{
                    "id": 1,
                    "type": "National Rail"
                },
                {
                    "id": 2,
                    "type": "International Rail"
                },
                {
                    "id": 3,
                    "type": "Rail"
                }
                ]
            this.mode_name = selectedMode;
            this.mode_type = optionvalue;
        }
        else if (selectedMode == 'Ferry') {
            const optionvalue =
                [{
                    "id": 1,
                    "type": "Foot passenger"
                },
                {
                    "id": 2,
                    "type": "Car passenger"
                }
                ]
            this.mode_name = selectedMode;
            this.mode_type = optionvalue;
        }
    };

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
                this.GetAssignedDataPoint(Number(fId));
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
            this.SubCategoryType = response;
        })
    }
    onInputEdit() {
        this.isInputEdited = true;
    }


    //entrysave function to save dataentry
    EntrySave(form: NgForm) {


        // if (form.invalid == true) {
        //     return
        // }
       
        this.dataEntry.month = this.selectMonths
            .map((month) => month.value)
            .join(','); //this.getMonthName();
        this.dataEntry.year = this.year.getFullYear().toString(); //this.getYear();

        console.log(this.dataEntry.month, this.dataEntry.year);
        if (this.activeCategoryIndex == 1) {

            let formData = new URLSearchParams();
            formData.set('batch', this.batchId);
            this.trackingService.submitPurchaseGoods(formData).subscribe({
                next: (response) => {
                    console.log("api response", response);
                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.inputFile.nativeElement.value = '';
                        $(".filename").val('');
                        $(".browse-button-text").html('<i class="fa fa-folder-open"></i> Browse')
                        this.resetForm();
                        // this.dataEntryForm.reset()
                        this.getStatusData(1);
                        this.uploadButton = false;
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.inputFile.nativeElement.value = '';
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
        if (this.activeCategoryIndex == 2) {

            let formData = new URLSearchParams();

            if (this.storageTransporationChecked === true && this.vehcilestransporationchecked === true) {
                formData.set('vehicle_type', this.selectedVehicleType);
                formData.set('sub_category', this.subVehicleCategoryValue);
                formData.set('noOfVehicles', form.value.noOfVehicles);
                formData.set('mass_of_products', form.value.mass_of_products);
                formData.set('distanceInKms', form.value.distanceInKms);
                formData.set('storagef_type', form.value.storage_type);
                formData.set('area_occupied', form.value.area_occupied);
                formData.set('averageNoOfDays', form.value.averageNoOfDays);
            } else if (this.storageTransporationChecked === true) {
                formData.set('storagef_type', form.value.storage_type);
                formData.set('area_occupied', form.value.area_occupied);
                formData.set('averageNoOfDays', form.value.averageNoOfDays);
            } else if (this.vehcilestransporationchecked == true) {
                formData.set('vehicle_type', this.selectedVehicleType);
                formData.set('sub_category', this.subVehicleCategoryValue);
                formData.set('noOfVehicles', form.value.noOfVehicles);
                formData.set('mass_of_products', form.value.mass_of_products);
                formData.set('distanceInKms', form.value.distanceInKms);
            }


            this.trackingService.upStreamTransportation(formData.toString()).subscribe({
                next: (response) => {
                    console.log("api response", response);
                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        this.getSubVehicleCategory(1);
                        this.getVehicleTypes()
                        this.getStatusData(this.activeCategoryIndex)
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();
                        this.getSubVehicleCategory(1)
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
        if (this.activeCategoryIndex == 3) {
            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)
            console.log(monthString);
            if (this.selectMonths.length == 0) {
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            var is_vehicle = 0;
            var is_facility = 0;
            if (this.leasefacilitieschecked === true) {
                is_facility = 1
            }
            if (this.leasevehcileschecked === true) {
                is_vehicle = 1
            }
            let formData = new URLSearchParams();
            if (is_facility == 1 && is_vehicle == 0) {
                if (this.averageMethod == true) {
                    formData.set('months', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('category', form.value.facilityTypeValue);
                    formData.set('sub_category', form.value.subfacilityTypeValue);
                    formData.set('calculation_method', form.value.calculationmethod);
                    formData.set('franchise_space', form.value.upLeasefranchise_space);
                    formData.set('unit', form.value.upfacilityUnits);
                    formData.set('is_vehicle', is_vehicle.toString());
                    formData.set('is_facility', is_facility.toString());
                } else if (this.franchiseMethod == true) {
                    formData.set('months', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('category', form.value.facilityTypeValue);
                    formData.set('sub_category', form.value.subfacilityTypeValue);
                    formData.set('calculation_method', form.value.calculationmethod);
                    formData.set('scope1_emission', form.value.scope1_emission);
                    formData.set('scope2_emission', form.value.scope2_emission);
                    formData.set('is_vehicle', is_vehicle.toString());
                    formData.set('is_facility', is_facility.toString());
                }
            } else if (is_vehicle == 1 && is_facility == 0) {
                formData.set('months', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('vehicle_type', this.selectedVehicleType);
                formData.set('vehicle_subtype', form.value.subvehicle_type);
                formData.set('no_of_vehicles', form.value.noOfVehicles);
                formData.set('distance_travelled', form.value.distanceInKms);
                formData.set('is_vehicle', is_vehicle.toString());
                formData.set('is_facility', is_facility.toString());
            }
            else if (is_vehicle == 1 && is_facility == 1) {
                if (this.averageMethod == true) {
                    formData.set('months', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('category', form.value.facilityTypeValue);
                    formData.set('sub_category', form.value.subfacilityTypeValue);
                    formData.set('calculation_method', form.value.calculationmethod);
                    formData.set('franchise_space', form.value.upLeasefranchise_space);
                    formData.set('unit', form.value.upfacilityUnits);
                    formData.set('vehicle_type', this.selectedVehicleType);
                    formData.set('vehicle_subtype', form.value.subvehicle_type);
                    formData.set('no_of_vehicles', form.value.noOfVehicles);
                    formData.set('distance_travelled', form.value.distanceInKms);
                    formData.set('is_vehicle', is_vehicle.toString());
                    formData.set('is_facility', is_facility.toString());
                } else if (this.franchiseMethod == true) {
                    formData.set('months', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('category', form.value.facilityTypeValue);
                    formData.set('sub_category', form.value.subfacilityTypeValue);
                    formData.set('calculation_method', form.value.calculationmethod);
                    formData.set('scope1_emission', form.value.scope1_emission);
                    formData.set('scope2_emission', form.value.scope2_emission);
                    formData.set('vehicle_type', this.selectedVehicleType);
                    formData.set('vehicle_subtype', form.value.subvehicle_type);
                    formData.set('no_of_vehicles', form.value.noOfVehicles);
                    formData.set('distance_travelled', form.value.distanceInKms);
                    formData.set('is_vehicle', is_vehicle.toString());
                    formData.set('is_facility', is_facility.toString());
                }
            }



            this.trackingService.uploadupLeaseEmissionCalculate(formData.toString()).subscribe({
                next: (response) => {
                    console.log("api response", response);
                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.averageMethod = false;
                        this.franchiseMethod = false;
                        this.dataEntryForm.reset();
                        this.getSubVehicleCategory(1);
                        this.getVehicleTypes();
                        this.getFranchiseType();
                        this.getSubFranchiseCategory('Banking Financial Services');
                        this.getStatusData(this.activeCategoryIndex)
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.averageMethod = false;
                        this.franchiseMethod = false;
                        this.dataEntryForm.reset();
                        this.getSubVehicleCategory(1);
                        this.getVehicleTypes();
                        this.getFranchiseType();
                        this.getSubFranchiseCategory('Banking Financial Services');
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
        if (this.activeCategoryIndex == 4) {

            let formData = new URLSearchParams();
            if (this.storageTransporationChecked === true && this.vehcilestransporationchecked === true) {
                formData.set('vehicle_type', this.selectedVehicleType);
                formData.set('sub_category', this.subVehicleCategoryValue);
                formData.set('noOfVehicles', form.value.noOfVehicles);
                formData.set('mass_of_products', form.value.mass_of_products);
                formData.set('distanceInKms', form.value.distanceInKms);
                formData.set('storagef_type', form.value.storage_type);
                formData.set('area_occupied', form.value.area_occupied);
                formData.set('averageNoOfDays', form.value.averageNoOfDays);
            } else if (this.storageTransporationChecked === true) {
                formData.set('storagef_type', form.value.storage_type);
                formData.set('area_occupied', form.value.area_occupied);
                formData.set('averageNoOfDays', form.value.averageNoOfDays);
            } else if (this.vehcilestransporationchecked == true) {
                formData.set('vehicle_type', this.selectedVehicleType);
                formData.set('sub_category', this.subVehicleCategoryValue);
                formData.set('noOfVehicles', form.value.noOfVehicles);
                formData.set('mass_of_products', form.value.mass_of_products);
                formData.set('distanceInKms', form.value.distanceInKms);
            }


            this.trackingService.downStreamTransportation(formData.toString()).subscribe({
                next: (response) => {
                    console.log("api response", response);
                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        this.getVehicleTypes()
                        this.getSubVehicleCategory(1)
                        this.getStatusData(this.activeCategoryIndex)
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();
                        this.getSubVehicleCategory(1)
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
            })
        }
        if (this.activeCategoryIndex == 5) {

            let formData = new URLSearchParams();
            if (this.franchiseMethodValue == 'Average data method') {
                formData.set('franchise_type', this.franchiseCategoryValue);
                formData.set('sub_category', form.value.sub_categories);
                formData.set('calculation_method', this.franchiseMethodValue);
                formData.set('franchise_space', form.value.franchise_space);
            } if (this.franchiseMethodValue == 'Investment Specific method') {
                formData.set('franchise_type', this.franchiseCategoryValue);
                formData.set('sub_category', form.value.sub_categories);
                formData.set('calculation_method', this.franchiseMethodValue);
                formData.set('scope1_emission', form.value.scope1_emission);
                formData.set('scope2_emission', form.value.scope2_emission);
            }


            this.trackingService.uploadFranchise(formData.toString()).subscribe({
                next: (response) => {
                    console.log("api response", response);
                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        this.getFranchiseType();
                        this.getSubFranchiseCategory('Banking Financial Services');
                        this.averageMethod = false;
                        this.franchiseMethod = false;
                        this.getStatusData(this.activeCategoryIndex)
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();
                        this.getFranchiseType();
                        this.getSubFranchiseCategory('Banking Financial Services');
                        this.averageMethod = false;
                        this.franchiseMethod = false;

                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();
                    this.getFranchiseType();
                    this.getSubFranchiseCategory('Banking Financial Services');
                    this.averageMethod = false;
                    this.franchiseMethod = false;

                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => console.info('Data entry Added')
            })
        }
        if (this.activeCategoryIndex == 6) {
            if(this.selectMonths.length ==0){
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)
            console.log(monthString);
            var is_vehicle = 0;
            var is_facility = 0;
            if (this.leasefacilitieschecked === true) {
                is_facility = 1
            }
            if (this.leasevehcileschecked === true) {
                is_vehicle = 1
            }
            let formData = new URLSearchParams();
            if (is_facility == 1 && is_vehicle == 0) {
                if (this.averageMethod == true) {
                    formData.set('months', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('category', form.value.facilityTypeValue);
                    formData.set('sub_category', form.value.subfacilityTypeValue);
                    formData.set('calculation_method', form.value.calculationmethod);
                    formData.set('franchise_space', form.value.downLeasefranchise_space);
                    formData.set('unit', form.value.upfacilityUnits);
                    formData.set('is_vehicle', is_vehicle.toString());
                    formData.set('is_facility', is_facility.toString());
                } else if (this.franchiseMethod == true) {
                    formData.set('months', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('category', form.value.facilityTypeValue);
                    formData.set('sub_category', form.value.subfacilityTypeValue);
                    formData.set('calculation_method', form.value.calculationmethod);
                    formData.set('scope1_emission', form.value.scope1_emission);
                    formData.set('scope2_emission', form.value.scope2_emission);
                    formData.set('is_vehicle', is_vehicle.toString());
                    formData.set('is_facility', is_facility.toString());
                }
            } else if (is_vehicle == 1 && is_facility == 0) {
                formData.set('months', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('vehicle_type', this.selectedVehicleType);
                formData.set('vehicle_subtype', form.value.subvehicle_type);
                formData.set('no_of_vehicles', form.value.noOfVehicles);
                formData.set('distance_travelled', form.value.distanceInKms);
                formData.set('is_vehicle', is_vehicle.toString());
                formData.set('is_facility', is_facility.toString());
            }
            else if (is_vehicle == 1 && is_facility == 1) {
                if (this.averageMethod == true) {
                    formData.set('months', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('category', form.value.facilityTypeValue);
                    formData.set('sub_category', form.value.subfacilityTypeValue);
                    formData.set('calculation_method', form.value.calculationmethod);
                    formData.set('franchise_space', form.value.downLeasefranchise_space);
                    formData.set('unit', form.value.upfacilityUnits);
                    formData.set('vehicle_type', this.selectedVehicleType);
                    formData.set('vehicle_subtype', form.value.subvehicle_type);
                    formData.set('no_of_vehicles', form.value.noOfVehicles);
                    formData.set('distance_travelled', form.value.distanceInKms);
                    formData.set('is_vehicle', is_vehicle.toString());
                    formData.set('is_facility', is_facility.toString());
                } else if (this.franchiseMethod == true) {
                    formData.set('months', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('category', form.value.facilityTypeValue);
                    formData.set('sub_category', form.value.subfacilityTypeValue);
                    formData.set('calculation_method', form.value.calculationmethod);
                    formData.set('scope1_emission', form.value.scope1_emission);
                    formData.set('scope2_emission', form.value.scope2_emission);
                    formData.set('vehicle_type', this.selectedVehicleType);
                    formData.set('vehicle_subtype', form.value.subvehicle_type);
                    formData.set('no_of_vehicles', form.value.noOfVehicles);
                    formData.set('distance_travelled', form.value.distanceInKms);
                    formData.set('is_vehicle', is_vehicle.toString());
                    formData.set('is_facility', is_facility.toString());
                }
            }


            this.trackingService.downstreamLeaseEmissionCalculate(formData.toString()).subscribe({
                next: (response) => {
                    console.log("api response", response);
                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.averageMethod = false;
                        this.franchiseMethod = false;
                        this.dataEntryForm.reset();
                        this.getSubVehicleCategory(1);
                        this.getVehicleTypes();
                        this.getFranchiseType();
                        this.getSubFranchiseCategory('Banking Financial Services');
                        this.getStatusData(this.activeCategoryIndex)
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.averageMethod = false;
                        this.franchiseMethod = false;
                        this.dataEntryForm.reset();
                        this.getSubVehicleCategory(1);
                        this.getVehicleTypes();
                        this.getFranchiseType();
                        this.getSubFranchiseCategory('Banking Financial Services');
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
        if (this.activeCategoryIndex == 7) {

            let formData = new URLSearchParams();

            if (this.franchiseMethodValue == 'Investment Specific method' && this.investmentTypeValue == 'Equity investments') {
                formData.set('investment_type', form.value.investment_type);
                formData.set('category', form.value.investment_sector);
                formData.set('sub_category_id', form.value.broad_categoriesId);
                formData.set('calculation_method', form.value.calculationmethod);
                formData.set('scope1_emission', form.value.scope1_emission);
                formData.set('scope2_emission', form.value.scope2_emission);
                formData.set('equity_share', form.value.share_Equity);
            } else if (this.investmentTypeValue == 'Equity investments' && this.franchiseMethodValue == 'Average data method') {
                formData.set('investment_type', form.value.investment_type);
                formData.set('category', form.value.investment_sector);
                formData.set('sub_category_id', form.value.broad_categoriesId);
                formData.set('calculation_method', form.value.calculationmethod);
                formData.set('investee_company_total_revenue', form.value.investe_company_revenue);
                formData.set('equity_share', form.value.share_Equity);
            } else if ((this.investmentTypeValue == 'Debt investments' || this.investmentTypeValue == 'Project finance') && this.franchiseMethodValue == 'Average data method') {
                formData.set('investment_type', form.value.investment_type);
                formData.set('category', form.value.investment_sector);
                formData.set('sub_category_id', form.value.broad_categoriesId);
                formData.set('calculation_method', form.value.calculationmethod);
                formData.set('project_phase', form.value.projectPhase);
                formData.set('project_construction_cost', form.value.project_construction_cost);
                formData.set('equity_project_cost', form.value.equity_project_cost);
            } else if ((this.investmentTypeValue == 'Debt investments' || this.investmentTypeValue == 'Project finance') && this.franchiseMethodValue == 'Investment Specific method') {
                console.log(form.value.scope1_emission);
                formData.set('investment_type', form.value.investment_type);
                formData.set('category', form.value.investment_sector);
                formData.set('sub_category_id', form.value.broad_categoriesId);
                formData.set('calculation_method', form.value.calculationmethod);
                formData.set('scope1_emission', form.value.scope1_emission);
                formData.set('scope2_emission', form.value.scope2_emission);
                formData.set('equity_project_cost', form.value.project_cost);

            }


            this.trackingService.calculateInvestmentEmission(formData.toString()).subscribe({
                next: (response) => {
                    console.log("api response", response);
                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        this.equityInvestmentRow = false;
                        this.debtInvesmentRow = false;
                        this.calculationRow = false;
                        this.averageMethod = false
                        this.franchiseMethod = false
                        this.franchiseMethodValue = '';
                        this.investmentTypeValue = ''

                        this.getStatusData(this.activeCategoryIndex)
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();
                        this.equityInvestmentRow = false;
                        this.debtInvesmentRow = false;
                        this.calculationRow = false;
                        this.averageMethod = false
                        this.franchiseMethod = false;
                        this.franchiseMethodValue = '';
                        this.investmentTypeValue = ''
                    }
                },
                error: (err) => {
                    this.equityInvestmentRow = false;
                    this.debtInvesmentRow = false;
                    this.calculationRow = false;
                    this.averageMethod = false
                    this.franchiseMethod = false;
                    this.franchiseMethodValue = '';
                    this.investmentTypeValue = ''
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => console.info('Data entry Added')
            })
        }
        if (this.activeCategoryIndex == 8) {
            if(this.selectMonths.length ==0){
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)
            let formData = new URLSearchParams();
            if (form.value.flightMode == 'Generic') {
                formData.set('flight_calc_mode', form.value.flightMode);
                formData.set('distance', form.value.distance);
                formData.set('flight_type', form.value.flight_type);
                formData.set('flight_class', form.value.classs);
                formData.set('no_of_trips', form.value.no_of_trips);
                formData.set('return_flight', form.value.return);
                formData.set('business_unit', form.value.businessunits);
                formData.set('batch', this.batchId);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facilities', '1018');
            } else if (form.value.flightMode == 'To/From') {
                formData.set('flight_calc_mode', form.value.flightMode);
                formData.set('to', form.value.airport_codeto);
                formData.set('from', form.value.airport_codefrom);
                formData.set('via', form.value.airport_codevia);
                formData.set('flight_class', form.value.classs);
                formData.set('no_of_passengers', form.value.no_of_passengers);
                formData.set('return_flight', form.value.return);
                formData.set('reference_id', form.value.reference_id);
                formData.set('business_unit', form.value.businessunits);
                formData.set('batch', this.batchId);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facilities', '1018');
            } else if (form.value.flightMode == 'Distance') {
                formData.set('flight_calc_mode', form.value.flightMode);
                formData.set('flight_type', form.value.flight_type);
                formData.set('flight_class', form.value.classs);
                formData.set('distance', form.value.distance);
                formData.set('no_of_passengers', form.value.no_of_passengers);
                formData.set('return_flight', form.value.return);
                formData.set('reference_id', form.value.reference_id);
                formData.set('business_unit', form.value.businessunits);
                formData.set('batch', this.batchId);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facilities', '1018');
            }


            this.trackingService.uploadflightTravel(formData.toString()).subscribe({
                next: (response) => {
                    console.log("api response", response);
                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();

                        this.getStatusData(this.activeCategoryIndex);
                        this.flightDisplay1 = 'block';
                        this.flightDisplay2 = 'none';
                        this.flightDisplay3 = 'none';

                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();


                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();


                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => console.info('Data entry Added')
            })
        }
        if (this.activeCategoryIndex == 9) {
            if(this.selectMonths.length ==0){
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)
            let formData = new URLSearchParams();

            formData.set('country_of_stay', form.value.countryname);
            formData.set('type_of_hotel', form.value.hoteltype);
            formData.set('no_of_occupied_rooms', form.value.noOfOccoupied);
            formData.set('no_of_nights_per_room', form.value.noOfNights);
            formData.set('batch', this.batchId);
            formData.set('month', monthString);
            formData.set('year', this.dataEntry.year);
            formData.set('facilities', '1018');


            this.trackingService.uploadHotelStay(formData.toString()).subscribe({
                next: (response) => {
                    console.log("api response", response);
                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();

                        this.getStatusData(this.activeCategoryIndex)
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();


                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();


                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => console.info('Data entry Added')
            })
        }
        if (this.activeCategoryIndex == 10) {
            if(this.selectMonths.length ==0){
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)
            let formData = new URLSearchParams();
            if (this.carMode == true) {
                formData.set('mode_of_trasport', form.value.modes);
                formData.set('type', form.value.cartype);
                formData.set('fuel_type', form.value.fuelCar_type);
                formData.set('distance_travelled', form.value.distance);
                formData.set('no_of_trips', form.value.no_ofTrips);
                formData.set('batch', this.batchId);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facilities', '1018');
            } else {

                formData.set('mode_of_trasport', form.value.modes);
                formData.set('type', form.value.cartype);
                formData.set('no_of_passengers', form.value.no_of_passengers);
                formData.set('distance_travelled', form.value.distance);
                formData.set('no_of_trips', form.value.no_ofTrips);
                formData.set('batch', this.batchId);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facilities', '1018');
            }



            this.trackingService.uploadOtherModes(formData.toString()).subscribe({
                next: (response) => {
                    console.log("api response", response);
                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        this.ModeSelected = false;

                        this.getStatusData(this.activeCategoryIndex)
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();
                        this.ModeSelected = false;


                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();


                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => console.info('Data entry Added')
            })
        }
        if (this.activeCategoryIndex == 11) {
            if(this.selectMonths.length ==0){
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)
            var waterobj1 = { "type": "Surface water", "kilolitres": form.value.surface_water };
            var waterobj2 = { "type": "Groundwater", "kilolitres": form.value.groundwater };
            var waterobj3 = { "type": "Third party water", "kilolitres": form.value.thirdParty };
            var waterobj4 = { "type": "Sea water / desalinated water", "kilolitres": form.value.seaWater };
            var waterobj5 = { "type": "Others", "kilolitres": form.value.others };

            const typoOfOffice = [waterobj1, waterobj2, waterobj3, waterobj4, waterobj5]
            var water_withdrawlStringfy = JSON.stringify(typoOfOffice)


            var waterDischargeobj1 = { "type": "Into Surface water", "notreatment": form.value.surface_no_treatment, "withthtreatment": form.value.surface_withTreatment, "leveloftreatment": form.value.surface_levelTreatment };
            var waterDischargeobj2 = { "type": "Into Ground water", "notreatment": form.value.ground_no_treatment, "withthtreatment": form.value.ground_withTreatment, "leveloftreatment": form.value.ground_levelTreatment };
            var waterDischargeobj3 = { "type": "Into Seawater", "notreatment": form.value.seawater_no_treatment, "withthtreatment": form.value.seawater_withTreatment, "leveloftreatment": form.value.seawater_levelTreatment };
            var waterDischargeobj4 = { "type": "Send to third-parties", "notreatment": form.value.third_no_treatment, "withthtreatment": form.value.third_withTreatment, "leveloftreatment": form.value.third_levelTreatment };
            var waterDischargeobj5 = { "type": "Others", "notreatment": form.value.others_no_treatment, "withthtreatment": form.value.others_withTreatment, "leveloftreatment": form.value.others_levelTreatment };

            const dischargeWater = [waterDischargeobj1, waterDischargeobj2, waterDischargeobj3, waterDischargeobj4, waterDischargeobj5]
            var waterDischargeStringfy = JSON.stringify(dischargeWater)
            let formData = new URLSearchParams();

            formData.set('water_supply', form.value.water_supply);
            formData.set('water_treatment', form.value.water_treatment);
            formData.set('water_supply_unit', form.value.workingdays);
            formData.set('water_treatment_unit', form.value.waterTreatmentUnits);
            formData.set('water_supply_unit', form.value.waterSupplyUnits);
            formData.set('water_withdrawl', water_withdrawlStringfy);
            formData.set('water_discharge', waterDischargeStringfy);
            formData.set('facilities', '1018');
            formData.set('month', monthString);
            formData.set('year', this.dataEntry.year);
            formData.set('batch', this.batchId);


            this.trackingService.AddwatersupplytreatmentCategory(formData.toString()).subscribe({
                next: (response) => {
                    console.log("api response", response);
                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();


                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();

                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();


                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => console.info('Data entry Added')
            })
        }
        if (this.activeCategoryIndex == 12) {
            if(this.selectMonths.length ==0){
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)

            let formData = new URLSearchParams();

            formData.set('product', this.waterWasteProduct);
            formData.set('waste_type', form.value.wasteSubCategory);
            formData.set('total_waste', form.value.waste_quantity);
            formData.set('method', form.value.waterWasteType);
            formData.set('unit', form.value.wasteUnits);
            formData.set('id', form.value.wasteType);
            formData.set('months', monthString);
            formData.set('year', this.dataEntry.year);


            this.trackingService.wasteGeneratedEmission(formData.toString()).subscribe({
                next: (response) => {
                    console.log("api response", response);
                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        this.getWasteSubCategory("1")

                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();
                        this.getWasteSubCategory("1")

                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();


                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => console.info('Data entry Added')
            })
        }

        if (this.activeCategoryIndex == 14) {

            if ((parseInt(this.noofmonths_1) + parseInt(this.noofmonths_2) + parseInt(this.noofmonths_3)) > 12) {
                this.notification.showWarning(
                    'Sum of no of months cant greater than 12',
                    'Error'
                );
                return
            }

            var obj1 = { "type": "1", "noofemployees": this.noofemployees_1, "noofdays": this.noofdays_1, "noofmonths": this.noofmonths_1 };
            var obj2 = { "type": "2", "noofemployees": this.noofemployees_2, "noofdays": this.noofdays_2, "noofmonths": this.noofmonths_2 };
            var obj3 = { "type": "3", "noofemployees": this.noofemployees_3, "noofdays": this.noofdays_3, "noofmonths": this.noofmonths_3 };
            const typoOfOffice = [obj1, obj2, obj3]
            var typeofhomeofficeStringfy = JSON.stringify(typoOfOffice)


            let formData = new URLSearchParams();

            formData.set('batch', this.batchId);
            formData.set('typeofhomeoffice', typeofhomeofficeStringfy);
            formData.set('facilities', '1018');


            this.trackingService.uploadHomeOffice(formData.toString()).subscribe({
                next: (response) => {
                    console.log("api response", response);
                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        this.getFranchiseType();
                        this.getSubFranchiseCategory('Banking Financial Services');
                        this.averageMethod = false;
                        this.franchiseMethod = false;
                        this.getStatusData(this.activeCategoryIndex)
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();
                        this.getFranchiseType();
                        this.getSubFranchiseCategory('Banking Financial Services');
                        this.averageMethod = false;
                        this.franchiseMethod = false;

                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();
                    this.getFranchiseType();
                    this.getSubFranchiseCategory('Banking Financial Services');
                    this.averageMethod = false;
                    this.franchiseMethod = false;

                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => console.info('Data entry Added')
            })
        }
        if (this.activeCategoryIndex == 13) {

            var empobj1 = { "type": "1", "employeescommute": form.value.employeescommute_1, "avgcommute": form.value.avgcommute_1 };
            var empobj2 = { "type": "2", "employeescommute": form.value.employeescommute_2, "avgcommute": form.value.avgcommute_2 };
            var empobj3 = { "type": "3", "employeescommute": form.value.employeescommute_3, "avgcommute": form.value.avgcommute_3 };
            var empobj4 = { "type": "4", "employeescommute": form.value.employeescommute_4, "avgcommute": form.value.avgcommute_4 };
            var empobj5 = { "type": "5", "employeescommute": form.value.employeescommute_5, "avgcommute": form.value.avgcommute_5 };
            var empobj6 = { "type": "6", "employeescommute": form.value.employeescommute_6, "avgcommute": form.value.avgcommute_6 };
            var empobj7 = { "type": "7", "employeescommute": form.value.employeescommute_7, "avgcommute": form.value.avgcommute_7 };
            var empobj8 = { "type": "8", "employeescommute": form.value.employeescommute_8, "avgcommute": form.value.avgcommute_8 };
            var empobj9 = { "type": "9", "employeescommute": form.value.employeescommute_9, "avgcommute": form.value.avgcommute_9 };
            var empobj10 = { "type": "10", "employeescommute": form.value.employeescommute_10, "avgcommute": form.value.avgcommute_10 };
            var empobj11 = { "type": "11", "employeescommute": form.value.employeescommute_11, "avgcommute": form.value.avgcommute_11 };
            var empobj12 = { "type": "12", "employeescommute": form.value.employeescommute_12, "avgcommute": form.value.avgcommute_12 };
            var empobj13 = { "type": "13", "employeescommute": form.value.employeescommute_13, "avgcommute": form.value.avgcommute_13 };
            var empobj14 = { "type": "14", "employeescommute": form.value.employeescommute_14, "avgcommute": form.value.avgcommute_14 };
            var empobj15 = { "type": "15", "employeescommute": form.value.employeescommute_15, "avgcommute": form.value.avgcommute_15 };
            4

            const typoOfOffice = [empobj1, empobj2, empobj3, empobj4, empobj5, empobj6, empobj7, empobj8, empobj9, empobj10, empobj11, empobj12, empobj13, empobj14, empobj15]
            var typeoftransportStringfy = JSON.stringify(typoOfOffice)


            let formData = new URLSearchParams();

            formData.set('batch', this.batchId);
            formData.set('noofemployees', form.value.noofemployees);
            formData.set('workingdays', form.value.workingdays);
            formData.set('typeoftransport', typeoftransportStringfy);
            formData.set('facilities', '1018');


            this.trackingService.uploadEmployeeCommunity(formData.toString()).subscribe({
                next: (response) => {
                    console.log("api response", response);
                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();


                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();

                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();


                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => console.info('Data entry Added')
            })
        }
        if (this.activeCategoryIndex == 15) {
            if(this.selectMonths.length ==0){
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)
            let formData = new URLSearchParams();
            if (form.value.industry == 'Other') {
                if (this.averageMethod == true) {
                    formData.set('month', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('intermediate_category', form.value.industry);
                    formData.set('processing_acitivity', form.value.processing_acitivity);
                    formData.set('sub_activity', form.value.sub_activity);
                    formData.set('other_emission', form.value.emission_factor);
                    formData.set('other', '1');
                    formData.set('valueofsoldintermediate', form.value.valueofsoldintermediate);
                    formData.set('calculation_method', form.value.calculationmethod);
                    // formData.set('franchise_space', form.value.downLeasefranchise_space);
                    formData.set('unit', form.value.goodsUnits);
                    formData.set('batch', this.batchId);
                    formData.set('facilities', '1018');

                } else if (this.franchiseMethod == true) {
                    formData.set('month', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('intermediate_category', form.value.industry);
                    formData.set('processing_acitivity', form.value.processing_acitivity);
                    formData.set('sub_activity', form.value.sub_activity);
                    formData.set('other_emission', form.value.emission_factor);
                    formData.set('other', '1');
                    formData.set('valueofsoldintermediate', form.value.valueofsoldintermediate);
                    formData.set('calculation_method', form.value.calculationmethod);
                    formData.set('scope1emissions', form.value.scope1_emission);
                    formData.set('scope2emissions', form.value.scope2_emission);
                    formData.set('unit', form.value.goodsUnits);
                    formData.set('batch', this.batchId);
                    formData.set('facilities', '1018');
                }

            } else if (form.value.industry != 'Other') {
                if (this.averageMethod == true) {
                    formData.set('month', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('intermediate_category', form.value.industry);
                    formData.set('processing_acitivity', form.value.sector);
                    formData.set('sub_activity', form.value.sub_sector);
                    formData.set('calculation_method', form.value.calculationmethod);
                    formData.set('valueofsoldintermediate', form.value.valueofsoldintermediate);
                    // formData.set('franchise_space', form.value.downLeasefranchise_space);
                    formData.set('unit', form.value.goodsUnits);
                    formData.set('batch', this.batchId);
                    formData.set('facilities', '1018');

                } else if (this.franchiseMethod == true) {
                    formData.set('month', monthString);
                    formData.set('year', this.dataEntry.year);
                    formData.set('intermediate_category', form.value.industry);
                    formData.set('processing_acitivity', form.value.sector);
                    formData.set('sub_activity', form.value.sub_sector);
                    formData.set('calculation_method', form.value.calculationmethod);
                    formData.set('valueofsoldintermediate', form.value.valueofsoldintermediate);
                    formData.set('scope1emissions', form.value.scope1_emission);
                    formData.set('scope2emissions', form.value.scope2_emission);
                    formData.set('unit', form.value.goodsUnits);
                    formData.set('batch', this.batchId);
                    formData.set('facilities', '1018');

                }
            }



            this.trackingService.Addprocessing_of_sold_productsCategory(formData.toString()).subscribe({
                next: (response) => {
                    console.log("api response", response);
                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        this.onIndustrySelected = false;
                        this.OthersSecledted = false;
                        this.averageMethod = false;
                        this.franchiseMethod = false;


                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();
                        this.onIndustrySelected = false;
                        this.OthersSecledted = false;
                        this.averageMethod = false;
                        this.franchiseMethod = false;

                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();


                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => console.info('Data entry Added')
            })
        }
        if (this.activeCategoryIndex == 16) {
            if(this.selectMonths.length ==0){
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)

            let formData = new URLSearchParams();
            if (form.value.units == 1) {
                formData.set('type', form.value.energyTypes);
                formData.set('productcategory', form.value.productCategoryitem);
                formData.set('no_of_Items', form.value.numberofitems);
                formData.set('no_of_Items_unit', form.value.noofunits);
                formData.set('expectedlifetimeproduct', form.value.expectedlifetimeproduct);
                formData.set('expectedlifetime_nooftimesused', form.value.unitsExpElec);
                formData.set('electricity_use', form.value.electricity_use);
                formData.set('electricity_usage', form.value.unitsExpElec);
                formData.set('fuel_type', form.value.fuelItem);
                formData.set('fuel_consumed', form.value.fuel_consumed);
                formData.set('fuel_consumed_usage', form.value.unitsExpElec);
                formData.set('referigentused', form.value.ItemRefrigerant);
                formData.set('referigerantleakage', form.value.refLeakageValue);
                formData.set('referigerant_usage', form.value.unitsExpElec);
                formData.set('batch', this.batchId);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facilities', '1018');

            } else {
                formData.set('type', form.value.energyTypes);
                formData.set('productcategory', form.value.productCategoryitem);
                formData.set('no_of_Items', form.value.numberofitems);
                formData.set('no_of_Items_unit', form.value.noofunits);
                formData.set('batch', this.batchId);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facilities', '1018');
            }



            this.trackingService.AddSoldProductsCategory(formData.toString()).subscribe({
                next: (response) => {
                    console.log("api response", response);
                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        this.getProductsEnergyCategory("1")
                        this.noOfItems = false;



                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();
                        this.noOfItems = false;

                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();


                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => console.info('Data entry Added')
            })
        }
        if (this.activeCategoryIndex == 17) {
            if(this.selectMonths.length ==0){
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)

            let formData = new URLSearchParams();
            formData.set('month', monthString);
            formData.set('year', this.dataEntry.year);
            formData.set('waste_type', form.value.wasteType);
            formData.set('subcategory', form.value.wasteSubCategory);
            formData.set('total_waste', form.value.total_waste);
            formData.set('waste_unit', form.value.wasteUnits);
            formData.set('landfill', form.value.landfill);
            formData.set('combustion', form.value.combustion);
            formData.set('recycling', form.value.recycling);
            formData.set('composing', form.value.composing);
            formData.set('batch', this.batchId);
            formData.set('facilities', '1018');


            this.trackingService.AddendoflifeCategory(formData.toString()).subscribe({
                next: (response) => {
                    console.log("api response", response);
                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        this.getWasteSubCategory("1")

                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();
                        this.getWasteSubCategory("1")

                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Data entry added failed.',
                        'Error'
                    );
                    this.dataEntryForm.reset();


                    console.error('errrrrrr>>>>>>', err);
                },
                complete: () => console.info('Data entry Added')
            })
        }



    }

    //checkEntry function for checking if an entry exists for a specific month, year, and subcategory.
    checkEntry(month, year, subcatID) {
        this.trackingService.checkEntry(month, year, subcatID).subscribe({
            next: (response) => {
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
    onFileSelected(event: any) {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            //   this.uploadFiles(files); previous one 
            this.selectedFile = event.target.files[0];
            $(".browse-button input:file").change(function () {
                $("input[name='attachment']").each(function () {
                    var fileName = $(this).val().split('/').pop().split('\\').pop();
                    $(".filename").val(fileName);
                    $(".browse-button-text").html('<i class="fa fa-refresh"></i> Change');
                });
            });
            this.uploadButton = true
        }
    };

    purchaseGoodsUpload(event: any) {
        event.preventDefault();
        const formData: FormData = new FormData();
        formData.append('file', this.selectedFile, this.selectedFile.name);
        formData.append('batch', this.batchId);
        this.trackingService.UploadTemplate(formData).subscribe({
            next: (response) => {
                console.log("api response", response);
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

                const optionvalue =
                    [{
                        "id": 2,
                        "electricityRegionName": "Generic Template"
                    },
                    {
                        "id": 2,
                        "electricityRegionName": "Real State"
                    },
                    {
                        "id": 2,
                        "electricityRegionName": "Textile"
                    }
                    ]
                // this.ElectricityGrid = response;
                this.ElectricityGrid = optionvalue;
            }
        })
    }
    // setUnit() {
    //     if (this.VehicleDE.modeOfDE == 'Distance Travelled') {
    //         this.units.forEach(un => {
    //             if (un.unitName == "km") {
    //                 this.dataEntry.unit = un.unitName;
    //             }
    //         })
    //         //this.dataEntry.unit = "km";
    //     }
    //     else {
    //         this.units.forEach(un => {
    //             if (un.unitName == "litre" || un.unitName == 'Litre') {
    //                 this.dataEntry.unit = un.unitName;
    //             }
    //         })
    //     }
    // }

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

    backToList() {
        this.displayTrackEntry = 'd-none';
        this.displayTrackList = 'd-block';
    };



    getBatch() {
        this.trackingService.getBatches().subscribe({
            next: (response) => {
                if (response.success == true) {
                    this.batchId = response.batchIds[0].batch_id;
                    this.getStatusData(1)
                    console.log("this is batch", this.batchId);
                } else {

                }

            }
        })
    };

    getAirportCodes() {
        this.trackingService.getAirportCodes().subscribe({
            next: (response) => {
                if (response.success == true) {
                    this.airportGrid = response.categories

                } else {

                }

            }
        })
    };

    getVehicleTypes() {
        this.trackingService.getVehicleType().subscribe({
            next: (response) => {
                console.log(response);
                if (response.success == true) {
                    this.VehicleGrid = response.categories;
                    const selectedIndex = this.selectedVehicleIndex;
                    this.selectedVehicleType = this.VehicleGrid[selectedIndex - 1].vehicle_type
                    console.log("this seelcted type", this.selectedVehicleType);
                }
            }
        })
    };

    onVehicleTypeChange(event: any) {
        const selectedIndex = event.value;
        this.selectedVehicleType = this.VehicleGrid[selectedIndex - 1].vehicle_type
        console.log("cahnged seelcted type", this.selectedVehicleType);
        this.getSubVehicleCategory(selectedIndex)
    };

    getSubVehicleCategory(categoryId: any) {
        this.trackingService.getSubVehicleCat(categoryId).subscribe({
            next: (response) => {
                // console.log(response);
                if (response.success == true) {
                    // this.VehicleGrid = response.categories;
                    this.subVehicleCategory = response.categories;
                    this.subVehicleCategoryValue = this.subVehicleCategory[0].vehicle_type


                }
            }
        })
    };




    onSubCategoryVehicleChange(event: any) {
        this.subVehicleCategoryValue = event.value;
    };

    onStorageFacilityChange(event: any) {
        this.storagef_typeValue = event.value;
    };

    getFranchiseType() {
        this.trackingService.getFranchiseType().subscribe({
            next: (response) => {
                console.log(response, "sdgs");
                if (response.success == true) {
                    this.franchiseGrid = response.categories;
                    this.franchiseCategoryValue = this.franchiseGrid[0].categories
                }
            }
        })
    };


    onFranchiseChange(event: any) {
        const frachiseTypevalue = event.value;
        console.log(frachiseTypevalue);
        this.franchiseCategoryValue = frachiseTypevalue
        this.getSubFranchiseCategory(frachiseTypevalue)
    };

    getSubFranchiseCategory(category: any) {
        this.trackingService.getSubFranchiseCat(category).subscribe({
            next: (response) => {
                // console.log(response);
                if (response.success == true) {
                    this.subFranchiseCategory = response.categories;

                }
            }
        })
    };


    getProductsEnergyCategory(typeId: any) {
        let formData = new URLSearchParams();

        formData.set('type', typeId);
        this.trackingService.getProductsEnergy(formData).subscribe({
            next: (response) => {
                // console.log(response);
                if (response.success == true) {
                    this.prodductEnergySubTypes = response.categories;

                }
            }
        })
    };


    onSubCategoryFranchiseChange(event: any) {
        this.subFranchiseCategoryValue = event.value;

    };


    onCalculationMethodChange(event: any) {
        const calMethod = event.value;
        this.franchiseMethodValue = calMethod;
        if (calMethod == 'Facility Specific method') {
            this.franchiseMethod = true;
            this.averageMethod = false
        } else {
            this.franchiseMethod = false;
            this.averageMethod = true
        }
    };
    onCalculationInvestmentMethodChange(event: any) {
        const calMethod = event.value;
        this.franchiseMethodValue = calMethod;
        if (calMethod == 'Investment Specific method') {
            this.franchiseMethod = true;
            this.averageMethod = false
        } else {
            this.franchiseMethod = false;
            this.averageMethod = true
        }
    };
    onCalculationPurchaseMethodChange(event: any) {
        const calMethod = event.value;
        this.franchiseMethodValue = calMethod;
        if (calMethod == 'Site Specific method') {
            this.franchiseMethod = true;
            this.averageMethod = false
        } else {
            this.franchiseMethod = false;
            this.averageMethod = true
        }
    };



    onProductEnergyTypeChange(event: any) {
        const energyMethod = event.value;
        this.getProductsEnergyCategory(energyMethod);
    };

    onpurchaseGoodsCategoryChange(event: any) {
        const energyMethod = event.value;
        console.log(energyMethod);
        this.onActivitySelected = false;
        if (energyMethod == 'Other') {
            this.onIndustrySelected = false;
            this.OthersSecledted = true;
            return;
        }
        console.log("its coming here also");
        this.onIndustrySelected = true;
        this.getProcessingActivityCategory(energyMethod);
    };


    getProcessingActivityCategory(industry: any) {
        let formData = new URLSearchParams();

        formData.set('industry', industry);
        this.trackingService.getPurchaseGoodsActivity(formData).subscribe({
            next: (response) => {
                // console.log(response);
                if (response.success == true) {
                    this.productActivitySubTypes = response.categories;

                }
            }
        })
    };



    onpurchaseActivityChange(event: any) {
        const energyMethod = event.value;
        this.onActivitySelected = true
        this.getActivitySubCategory(energyMethod);

    };

    getActivitySubCategory(sector: any) {
        let formData = new URLSearchParams();

        formData.set('sector', sector);
        this.trackingService.getsubsectorCategory(formData).subscribe({
            next: (response) => {
                console.log(response);
                if (response.success == true) {
                    this.activitySubTypes = response.categories;

                }
            }
        })
    };
    onWasteTypeChange(event: any) {
        const energyMethod = event.value;
        this.waterWasteProduct = this.wasteGrid[energyMethod - 1].type
        console.log("cahnged seelcted type", this.waterWasteProduct);
        this.getWasteSubCategory(energyMethod);

    };

    onQuantitySoldUnitChange(event: any) {
        const energyMethod = event.value;
        console.log(energyMethod);
        if (energyMethod == 1) {
            this.noOfItems = true;
            this.getFuelEnergyCategory();
            this.getRefrigerants();
        } else {
            this.subElectricityUnits = "per usage"
            this.noOfItems = false;
        }
        // this.getProductsEnergyCategory(energyMethod);

    };

    onExpectedLifetimeUnitChange(event: any) {
        const energyMethod = event.value;
        console.log(energyMethod);
        if (energyMethod == 1) {
            this.subElectricityUnits = "Per usage"
        } else if (energyMethod == 2) {
            this.subElectricityUnits = "Days"
        }
        else if (energyMethod == 3) {
            this.subElectricityUnits = "Months"

        } else if (energyMethod == 4) {
            this.subElectricityUnits = "Years"
        }
        // this.getProductsEnergyCategory(energyMethod);

    };

    getStatusData(categoryIndex: number) {
        let url = ''
        if (categoryIndex == 1) {
            let formData = new URLSearchParams();
            formData.set('batch', this.batchId);
            url = 'getPurchaseGoodEmissions';
            this.trackingService.getPurchaseGoodEmissions(formData).subscribe({
                next: (response) => {
                    console.log(response);
                    if (response.success == true) {
                        this.statusData = response.categories;
                    }
                }
            })
            return
        }
        if (categoryIndex == 2) {
            url = 'getUpstreamEmissions'
        }
        if (categoryIndex == 3) {
            url = 'getUpstreamLeaseEmission'
        }
        if (categoryIndex == 4) {
            url = 'getDownstreamEmissions'
        }
        if (categoryIndex == 5) {
            url = 'getFranchiseEmission'
        }
        if (categoryIndex == 6) {
            url = 'getDownstreamLeaseEmission'
        }
        if (categoryIndex == 7) {
            url = 'getInvestmentEmission'
        }
        if (categoryIndex == 8) {
            url = 'getflight_travel'
        }
        if (categoryIndex == 9) {
            url = 'gethotel_stay'
        }
        if (categoryIndex == 10) {
            url = 'getothermodesofTransport'
        }
        if (categoryIndex == 11) {
            url = 'getwatersupplytreatmentCategory'
        }
        if (categoryIndex == 12) {
            url = 'getwasteGeneratedEmission'
        }
        if (categoryIndex == 13) {
            url = 'getemployeecommutingCategory'
        }
        if (categoryIndex == 14) {
            url = 'gethomeofficeCategory'
        }
        if (categoryIndex == 15) {
            url = 'getprocessing_of_sold_productsCategory'
        }
        if (categoryIndex == 17) {
            url = 'getendof_lifetreatment_category'
        }
        this.trackingService.getStatus(url).subscribe({
            next: (response) => {
                console.log(response);
                if (response.success == true) {
                    this.statusData = response.categories;
                } else {
                    this.statusData = []
                }
            }
        })
    };


    getFuelEnergyCategory() {
        this.trackingService.getEnergyFuelType().subscribe({
            next: (response) => {
                // console.log(response);
                if (response.success == true) {
                    this.fuelEnergyTypes = response.categories;

                }
            }
        })
    };

    getPurchaseGoodsCategory() {
        this.trackingService.getPurchaseGoodsType().subscribe({
            next: (response) => {
                // console.log(response);
                if (response.success == true) {
                    this.purchaseGoodsTypes = response.categories;
                }
            }
        })
    };

    getRefrigerants() {
        this.trackingService.getrefrigents().subscribe({
            next: (response) => {
                // console.log(response);
                if (response.success == true) {
                    this.refrigeratedTypes = response.categories;

                }
            }
        })
    };

    getEndWasteType() {
        this.trackingService.getWasteType().subscribe({
            next: (response) => {
                console.log(response, "sdgs");
                if (response.success == true) {
                    this.wasteGrid = response.categories;
                    this.waterWasteProduct = this.wasteGrid[0].type
                    // this.franchiseCategoryValue = this.franchiseGrid[0].categories
                }
            }
        })
    };

    getWasteSubCategory(typeId: any) {
        let formData = new URLSearchParams();

        formData.set('type', typeId);
        this.trackingService.getWasteSubCategory(formData).subscribe({
            next: (response) => {
                console.log(response);
                if (response.success == true) {
                    this.wasteSubTypes = response.categories;

                }
            }
        })
    };

    getFlightType() {
        this.trackingService.getflight_types().subscribe({
            next: (response) => {
                console.log(response, "sdgs");
                if (response.success == true) {
                    this.wasteGrid = response.batchIds;
                    // this.franchiseCategoryValue = this.franchiseGrid[0].categories
                }
            }
        })
    };

    getInvestmentCategories() {
        this.trackingService.getInvestmentCategories().subscribe({
            next: (response) => {
                console.log(response, "sdgs");
                if (response.success == true) {
                    this.wasteGrid = response.categories;
                    // this.franchiseCategoryValue = this.franchiseGrid[0].categories
                }
            }
        })
    };

    onInvestmentSectorChange(event: any) {
        const energyMethod = event.value;
        this.getInvestmentSubCategory(energyMethod);
    };
    onInvestmentTypeChange(event: any) {
        const energyMethod = event.value;
        this.calculationRow = true;
        this.investmentTypeValue = energyMethod;

        if (this.franchiseMethodValue == 'Investment Specific method' && this.investmentTypeValue == 'Equity investments' && this.equityInvestmentRow == true) {
            this.equityInvestmentRow = true;
            this.franchiseMethod = true;
            this.averageMethod = false;
            this.debtInvesmentRow = false;
        } else if (this.investmentTypeValue == 'Equity investments' && this.franchiseMethodValue == 'Average data method' && this.equityInvestmentRow == true) {
            this.equityInvestmentRow = true;
            this.franchiseMethod = false;
            this.averageMethod = true;
            this.debtInvesmentRow = false;
        } else if ((this.investmentTypeValue == 'Debt investments' || this.investmentTypeValue == 'Project finance') && this.franchiseMethodValue == 'Average data method') {
            this.debtInvesmentRow = true;
            this.franchiseMethod = false;
            this.averageMethod = true;
            this.InvestmentHeading = this.investmentTypeValue;
            this.equityInvestmentRow = false;
        } else if ((this.investmentTypeValue == 'Debt investments' || this.investmentTypeValue == 'Project finance') && this.franchiseMethodValue == 'Investment Specific method') {
            this.debtInvesmentRow = true;
            this.franchiseMethod = true;
            this.averageMethod = false;
            this.InvestmentHeading = this.investmentTypeValue;
            this.equityInvestmentRow = false;
        }
    };
    getInvestmentSubCategory(category: any) {
        this.trackingService.getInvestmentSubCategory(category).subscribe({
            next: (response) => {
                console.log(response);
                if (response.success == true) {
                    this.subFranchiseCategory = response.sub_categories;

                }
            }
        })
    };

    onInvestmentCalculationMethodChange(event: any) {
        const calMethod = event.value;
        this.franchiseMethodValue = calMethod;
        if (calMethod == 'Investment Specific method' && this.investmentTypeValue == 'Equity investments') {
            this.equityInvestmentRow = true;
            this.franchiseMethod = true;
            this.averageMethod = false
        } else if (this.investmentTypeValue == 'Equity investments' && calMethod == 'Average data method') {
            this.equityInvestmentRow = true;
            this.franchiseMethod = false;
            this.averageMethod = true;
        } else if ((this.investmentTypeValue == 'Debt investments' || this.investmentTypeValue == 'Project finance') && calMethod == 'Average data method') {
            this.debtInvesmentRow = true;
            this.franchiseMethod = false;
            this.averageMethod = true;
            this.InvestmentHeading = this.investmentTypeValue;
        } else if ((this.investmentTypeValue == 'Debt investments' || this.investmentTypeValue == 'Project finance') && calMethod == 'Investment Specific method') {
            this.debtInvesmentRow = true;
            this.franchiseMethod = true;
            this.averageMethod = false;
            this.InvestmentHeading = this.investmentTypeValue;
        }
    };
    onProjectPhaseChnage(event: any) {
        const calMethod = event.value;
        if (calMethod == 'In Construction phase') {
            this.RevenueRow = true;
        } else {
            this.RevenueRow = false;
        }
    };
    getBusineesUnit() {
        this.trackingService.getBusinessUnit().subscribe({
            next: (response) => {
                console.log(response, "sdgs");
                if (response.success == true) {
                    this.busineessGrid = response.categories;
                    // this.franchiseCategoryValue = this.franchiseGrid[0].categories
                }
            }
        })
    };
    getFlightTimeTypes() {
        this.trackingService.getFlightTimes().subscribe({
            next: (response) => {
                console.log(response, "sdgs");
                if (response.success == true) {
                    this.flightTime = response.batchIds;
                    // this.franchiseCategoryValue = this.franchiseGrid[0].categories
                }
            }
        })
    };


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
    };

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

}
