import { BlendType } from '@/models/BlendType';
import { DataEntry } from '@/models/DataEntry';
import { DataEntrySetting } from '@/models/DataEntrySettings';
import { ElectricityDE } from '@/models/ElectricityDE';
import { ElectricityGrid } from '@/models/ElectricityGrid';
import { ElectricitySource } from '@/models/ElectricitySource';
import { EmissionFactor } from '@/models/EmissionFactorALL';
import { EmissionFactorTable } from '@/models/EmissionFactorTable';
import { Facility } from '@/models/Facility';
import { FireExtinguisherDE } from '@/models/FireExtinguisherDE';
import { HeatandSteamDE } from '@/models/HeatandSteamDE';
import { RefrigerantsDE } from '@/models/RefrigerantsDE';
import { StationaryCombustionDE } from '@/models/StationaryCombustionDE';
import { SubCategoryTypes } from '@/models/SubCategoryType';
import { TrackingDataPoint } from '@/models/TrackingDataPoint';
import { ManageDataPointSubCategories } from '@/models/TrackingDataPointSubCategories';
import { TrackingTable } from '@/models/TrackingTable';
import { Units } from '@/models/Units';
import { VehicleDE } from '@/models/VehicleDE';
import { VehicleDEmode } from '@/models/VehicleDEmode';
import { VehicleType } from '@/models/VehicleType';
import { LoginInfo } from '@/models/loginInfo';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { TrackingService } from '@services/tracking.service';
import { environment } from 'environments/environment';
import { Table } from 'jspdf-autotable';
import { ToastrService } from 'ngx-toastr';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { TabView } from 'primeng/tabview';
import { countries } from '@/store/countrieslist';
import { GroupService } from '@services/group.service';
declare var $: any;

@Component({
    selector: 'app-tracking',
    templateUrl: './tracking.component.html',
    styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent {
    public countriesList: any = countries
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
    statusData: any;
    hotelTypeGrid: any[] = [];
    yearOptions: any[] = [];
    checked: boolean = false;
    items: MenuItem[];
    active: MenuItem;
    notevalue: string;
    selectedAirport: string;
    selectedAirport2: string;
    selectedAirport3: string;
    status: TrackingTable[];
    formGroup: FormGroup;
    //units: units[];
    // setlimit: setlimit[];
    emissiontable: EmissionFactorTable[];
    visible: boolean;
    maxCharacters: number = 9;
    defaulttab: string;
    categoryName: string;
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
    isHowtoUse = false;
    supplierSelected = false;
    ModeType: VehicleDEmode[] = [];
    ElectricitySource: ElectricitySource[] = [];
    ElectricityGrid: ElectricityGrid[] = [];
    public EmissionFactor: EmissionFactor[] = [];
    flightsTravelTypes: any[] = [];
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
    dataEntriesPending: any[] = [];
    SubCategoryType: SubCategoryTypes[] = [];
    isInputEdited: boolean;
    typeEV: boolean = false;
    renewableSelected: boolean = false;
    typeBusCoach: boolean = false;
    // scope 3 variables starts 
    subVehicleCategoryValue: string = 'Van-Petrol';
    leasefacilitieschecked: boolean = false;
    leasevehcileschecked: boolean = false;
    vehcilestransporationchecked: boolean = false;
    storageTransporationChecked: boolean = false;
    VehicleGrid: any[] = [];
    selectedVehicleIndex: number = 1;
    franchiseCategoryValue: string;
    subFranchiseCategoryValue: string = 'Bank Branch';
    selectedVehicleType: any = '';
    subVehicleCategory: any[] = [];
    facilityUnits: any[] = [];
    selectedflightsTravel: any;
    storageGrid: any[] = [];
    waterSupplyUnitGrid: any[] = [];
    wasteGrid: any[] = [];
    regionType: any[] = [];
    goodsTemplates: any[] = [];
    waterWasteProduct: string;
    wasteSubTypes: any[] = [];
    waterWasteId = 1;
    waterWasteMethod: any[] = [];
    recycleMethod: any[] = [];
    wasteUnitsGrid: any[] = [];
    noofemployees_1 = ""
    noofemployees_2 = ""
    noofemployees_3 = ""
    noofdays_1 = ""
    noofdays_2 = ""
    flightClassGrid: any[] = [];
    noofdays_3 = ""
    noofmonths_1: string;
    noofmonths_2: string;
    noofmonths_3: string;
    franchiseGrid: any[] = [];
    busineessGrid: any[] = [];
    franchiseGridWithPlaceholder: any[] = [];
    subFranchiseCategory: any[] = [];
    calculationUpleaseGrid: any[] = [];
    franchiseMethodValue: string;
    franchiseMethod = false;
    averageMethod = false;
    purchaseGoodsTypes: any[] = [];
    onIndustrySelected = false;
    onActivitySelected = false;
    OthersSecledted = false;
    productActivitySubTypes: any[] = [];
    prodductEnergySubTypes: any[] = [];
    activitySubTypes: any[] = [];
    purchaseGoodsUnitsGrid: any[] = [];
    calculationPurchaseGrid: any[] = [];
    productEnergyTypes: any[] = [];
    energyUnitsGrid: any[] = [];
    noOfItems = false;
    subElectricityUnits = "per usage";
    expectedElectricityUnitsGrid: any[] = [];
    selectedFuelItem: any;
    fuelEnergyTypes: any[] = [];
    ModesTravelGrid: any[] = [];
    refrigeratedTypes: any[] = [];
    calculationGrid: any[] = [];
    investmentTypeGrid: any[] = [];
    calculationRow = false;
    investmentTypeValue = '';
    equityInvestmentRow = false;
    convertedYear: string;
    debtInvesmentRow = false;
    InvestmentHeading = '';
    RevenueRow = false;
    returnGrid: any[] = [];
    projectPhaseTypes: any[] = [];
    batchId: any;
    flightTime: any[] = [];
    upstreamMassUnitsGrid: any[] = [];
    uploadButton = false;
    airportGrid: any[] = [];
    public isVisited = false;
    flightDisplay1 = 'block'
    flightDisplay2 = 'none'
    flightDisplay3 = 'none'
    carMode = false;
    autoMode = false;
    busMode = false;
    railMode = false;
    ferryMode = false;
    ModeSelected = false;
    mode_name = '';
    selectedtemplate = '';
    mode_type: any[] = [];
    marketTypes: any[] = [];
    marketEElecID: any;
    templateLinks: string;
    processingUnit: string;
    haveBasicPackage: number = 0;


    carFuel_type: any[] = [];
    distanceTravelled: any[] = [];
    wasteMethod: string;
    recycle = false;
    recycleSelectedMethod = ''

    storagef_typeValue: string = this.storageGrid[0]?.storagef_type;
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
        private GroupService: GroupService,
        private notification: NotificationService,
        private toastr: ToastrService,
        private confirmationService: ConfirmationService
    ) {

        this.facilityService.headerTracking.set(true);
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

            ];
        this.projectPhaseTypes =
            [
                {
                    "id": 1,
                    "projectPhase": "In Construction phase"
                },
                {
                    "id": 2,
                    "projectPhase": "In Operational Phase"
                }
            ];
        this.marketTypes =
            [
                {
                    "id": 1,
                    "Type": "Renewable Energy Cert (REC)"
                },
                {
                    "id": 2,
                    "Type": "Supplier Specific"
                }

            ];
        this.goodsTemplates =
            [

                {
                    "id": 1,
                    "template": "Template 1"
                },
                {
                    "id": 2,
                    "template": "Template 2"
                },
                {
                    "id": 3,
                    "template": "Template 3"
                }

            ];
        this.recycleMethod =
            [

                {
                    "id": 1,
                    "template": "Open Loop"
                },
                {
                    "id": 2,
                    "template": "Close Loop"
                }

            ];
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
        this.ModeType =
            [
                {
                    "id": 1,
                    "modeName": "Average distance per trip"
                },
                {
                    "id": 2,
                    "modeName": "Average qty of fuel per trip"
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
        this.blendType =
            [
                {
                    "id": 1,
                    "typeName": "No Blend"
                },
                {
                    "id": 2,
                    "typeName": "Average Blend"
                },
                {
                    "id": 3,
                    "typeName": "Perc. Blend"
                },

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
            ];
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
        this.distanceTravelled =
            [{
                "id": 1,
                "unit": "km"
            },
            {
                "id": 2,
                "unit": "miles"
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
        this.upstreamMassUnitsGrid =
            [
                {
                    "id": 1,
                    "units": "kg"
                },
                {
                    "id": 2,
                    "units": "tonnes"
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
            ];
        this.ElectricitySource =
            [{
                "id": 1,
                "sourceName": "Solar"
            },
            {
                "id": 2,
                "sourceName": "Wind"
            },
            {
                "id": 2,
                "sourceName": "Hydro"
            }
            ];
        this.waterWasteMethod =
            [
                {
                    "id": 'reuse',
                    "water_type": "Reuse"
                },
                {
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
            ];
        this.expectedElectricityUnitsGrid =
            [
                {
                    "id": 1,
                    "unitsExpElec": "No. of times used"
                },
                {
                    "id": 2,
                    "unitsExpElec": " Days"
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


    //runs when component intialize
    ngOnInit() {
        $(document).ready(function () {
            $('.ct_custom_dropdown').click(function () {

                $('.ct_custom_dropdown').toggleClass('ct_open_modal')
            })

            // $(".browse-button input:file").change(function () {
            //     $("input[name='attachment']").each(function () {
            //         var fileName = $(this).val().split('/').pop().split('\\').pop();
            //         $(".filename").val(fileName);
            //         $(".browse-button-text").html('<i class="fa fa-refresh"></i> Change');
            //     });
            // });
        })
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
            this.haveBasicPackage = this.loginInfo.package_id

            console.log(this.haveBasicPackage);
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

                // this.GetAssignedDataPoint(this.loginInfo.facilityID);
                // this.GetAssignedDataPoint(this.facilityID);
                if (this.facilityID == 0 || this.facilityID == '') {
                    this.facilityhavedp = 'none';
                    this.facilitynothavedp = 'none';
                    this.forGroup = 'flex';
                } else {
                    this.GetAssignedDataPoint(this.facilityID);
                }

            }
        } else {

            //   this.GetAssignedDataPoint(this.loginInfo.facilityID);
            // this.GetAssignedDataPoint(this.facilityID);
        }
        // if (this.defaulttab === '/tracking-status') {
        //     this.activeindex = 1;
        // }

        this.getBatch();

        // this.getBlendType();
        // this.getVehicleDEMode();
        // this.getElectricitySource();
        this.setDefaultMonth();
        this.getElectricityGrid();

    };

    onUpload(event) {
        this.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: 'File Uploaded with Basic Mode'
        });
    };
    // triggered whenever a change detection cycle runs
    ngDoCheck() {
        this.updatedtheme = this.themeservice.getValue('theme');
        let fId = localStorage.getItem('SelectedfacilityID');
        this.flag = localStorage.getItem('Flag');
        if (this.facilityID != fId) {
            console.log("checkssss");
            this.GetAssignedDataPoint(Number(fId));
            this.facilityID = fId;

        }
        else if (this.flag === undefined || this.flag === null || this.flag == "") {
            this.facilityID = fId;
        }
        else {
            // console.log("flkexxxx");
            // this.forGroup = environment.flex;
            // this.facilityhavedp = environment.none;
            // this.facilitynothavedp = environment.none;
        }
    };


    //display a dialog
    showDialog() {
        this.visible = true;
    };


    onSubCategoryVehicleChange(event: any) {
        this.subVehicleCategoryValue = event.value;
    };
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
    };

    // getting status, units, subCategory types where ever required
    SubCatData(data: any, catID: any, categoryName) {
        console.log("called", catID);
        this.categoryName = categoryName;
        this.recycle = false;
        this.isVisited = false;
        this.renewableSelected = false;
        this.supplierSelected = false;

        this.id_var = data.manageDataPointSubCategorySeedID;

        this.categoryId = catID;


        this.SubCatAllData = data;
        this.ALLEntries()
        if (catID == 1) {

            this.getsubCategoryType(this.SubCatAllData
                .manageDataPointSubCategorySeedID);
            this.getUnit(this.SubCatAllData
                .manageDataPointSubCategorySeedID);
        }

        if (catID == 2) {
            this.templateLinks = 'assets/Refrigerant_Template.xlsx'
            this.getsubCategoryType(this.SubCatAllData
                .manageDataPointSubCategorySeedID);
            this.getUnit(this.SubCatAllData
                .manageDataPointSubCategorySeedID);
        }

        if (catID == 3) {
            this.templateLinks = 'assets/FireExtinguisher_Template.xlsx'
            // this.getsubCategoryType(this.SubCatAllData
            //     .manageDataPointSubCategorySeedID);
            this.getUnit(this.SubCatAllData
                .manageDataPointSubCategorySeedID);
        }

        if (catID == 5) {

            this.getRegionName(9);
            this.getUnit(this.SubCatAllData
                .manageDataPointSubCategorySeedID);
        }

        if (catID == 6) {

            if (data.manageDataPointSubCategorySeedID == 10) {
                this.getPassengerVehicleType();
            }
            else {
                this.getDeliveryVehicleType();
            }

            this.getUnit(this.SubCatAllData
                .manageDataPointSubCategorySeedID);


        }
        if (catID == 7) {

            this.getsubCategoryType(this.SubCatAllData
                .manageDataPointSubCategorySeedID);
            this.getUnit(this.SubCatAllData
                .manageDataPointSubCategorySeedID);
        }
        if (catID == 10) {
            this.getVehicleTypes();
            this.getSubVehicleCategory(1)
        }
        if (catID == 12) {
            this.getEndWasteType();
            this.getWasteSubCategory("1")
        }
        if (catID == 13) {
            this.isVisited = true;

        }
        if (catID == 18) {
            this.getPurchaseGoodsCategory();
        }
        if (catID == 16) {
            this.getFranchiseType();
            this.getSubFranchiseCategory('Banking Financial Services');
            this.getVehicleTypes();
            this.getSubVehicleCategory(1)
        }
        if (catID == 19) {
            this.getProductsEnergyCategory("1")
        }
        if (catID == 20) {
            this.getEndWasteType();
            this.getWasteSubCategory("1")
        }
        if (catID == 21) {
            this.getFranchiseType();
            this.getSubFranchiseCategory('Banking Financial Services');
            this.getVehicleTypes();
            this.getSubVehicleCategory(1)
        }
        if (catID == 22) {
            this.getFranchiseType();
            this.getSubFranchiseCategory('Banking Financial Services')
        }
        if (catID == 23) {
            this.getInvestmentCategories();
            this.getInvestmentSubCategory('Coke, Refined Petroleum, and Nuclear Fuel')
        }

        this.typeEV = false;
        this.typeBusCoach = false;
        //   this.checkEntryexist();
        this.resetForm();
    };


    // getting subcategory types
    getsubCategoryType(subCatID: number) {
        this.dataEntry.typeID = null;
        this.trackingService.newgetsubCatType(subCatID).subscribe({
            next: (response) => {
                this.SubCategoryType = response.categories;
                this.dataEntry.typeID = this.SubCategoryType[0]?.subCatTypeID;

            },
            error: (err) => {
                console.error('errrrrrr>>>>>>', err);
            }
        })
    };

    getRegionName(subCatID: number) {
        this.dataEntry.typeID = null;
        this.RenewableElectricity.electricityRegionID = null;
        this.trackingService.newgetsubCatType(subCatID).subscribe({
            next: (response) => {
                this.regionType = response.categories;
                this.RenewableElectricity.electricityRegionID = this.regionType[0].RegionID;

            },
            error: (err) => {
                console.error('errrrrrr>>>>>>', err);
            }
        })
    };

    // to get the status of subcategories in status tab
    ALLEntries() {
        if (this.categoryId == 25 || this.categoryId == 26 || this.categoryId == 24) {
            const categoryID = 13
            const formData = new URLSearchParams();
            this.convertedYear = this.trackingService.getYear(this.year);
            formData.set('year', this.convertedYear.toString())
            formData.set('facilities', this.facilityID.toString())
            formData.set('categoryID', categoryID.toString())


            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            if (this.categoryId == 24) {
                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'flight_travel');
                            } else if (this.categoryId == 25) {
                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'hotel_stay');
                            } else if (this.categoryId == 26) {

                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'other_modes_of_transport');
                            } else {
                                this.dataEntriesPending = response.categories;
                            }
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
            return
        }
        console.log(this.categoryId);
        if (this.facilityID == 0) {
            this.notification.showInfo(
                'Select Facility',
                ''
            );
            return
        }
        if (this.categoryId == 9) {
            const formData = new URLSearchParams();
            this.convertedYear = this.trackingService.getYear(this.year);
            formData.set('year', this.convertedYear.toString())
            formData.set('facilities', this.facilityID.toString())
            formData.set('categoryID', this.categoryId.toString())
            this.trackingService
                .newgetSCpendingDataEntriesForFuels(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
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
            return
        }


        const formData = new URLSearchParams();
        this.convertedYear = this.trackingService.getYear(this.year);
        formData.set('year', this.convertedYear.toString())
        formData.set('facilities', this.facilityID.toString())
        formData.set('categoryID', this.categoryId.toString())


        this.trackingService
            .newgetSCpendingDataEntries(formData)
            .subscribe({
                next: (response) => {
                    if (response.success === false) {
                        this.dataEntriesPending = null;
                    } else {
                        if (this.categoryId == 24) {
                            this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'flight_travel');
                        } else if (this.categoryId == 25) {
                            this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'hotel_stay');
                        } else if (this.categoryId == 26) {

                            this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'other_modes_of_transport');
                        } else {
                            this.dataEntriesPending = response.categories;
                        }
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



    };

    //entrysave function to save dataentry
    EntrySave(form: NgForm) {
        console.log(form.value);
        this.dataEntry.month = this.selectMonths
            .map((month) => month.value)
            .join(', '); //this.getMonthName();
        this.dataEntry.year = this.year.getFullYear().toString(); //this.getYear();
        var spliteedMonth = this.dataEntry.month.split(",");
        var monthString = JSON.stringify(spliteedMonth);
        let fId = localStorage.getItem('SelectedfacilityID');
        if (fId == '0') {
            this.notification.showInfo(
                'Select Facility',
                ''
            );
            return
        }
        if (this.selectMonths.length == 0 && this.categoryId != 8) {
            this.notification.showInfo(
                'Select month',
                ''
            );
            return
        }
        if (this.categoryId == 1) {
            if (
                this.dataEntry.readingValue <= 0 ||
                this.dataEntry.readingValue === null ||
                this.dataEntry.readingValue === undefined
            ) {
                return;
            }
            if (this.selectMonths.length == 0) {
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            let formData = new URLSearchParams();
            if (this.dataEntryForm.value.calorificValue != '') {
                formData.set('calorificValue', this.dataEntryForm.value.calorificValue);
            }
            if (this.SubCatAllData.subCatName == 'Liquid Fuels') {

                if (this.dataEntry.typeID == 1) {
                    if (this.SCdataEntry.blendType == 'No Blend') {
                        this.SCdataEntry.blendID = 1;


                    }
                    if (this.SCdataEntry.blendType == 'Average Blend') {
                        this.SCdataEntry.blendID = 2;

                    }
                    if (this.SCdataEntry.blendType == 'Perc. Blend') {
                        formData.set('blendPercent', this.SCdataEntry.blendPercent.toString());

                    }
                }
                else if (this.dataEntry.typeID == 2) {
                    if (this.SCdataEntry.blendType == 'No Blend') {
                        this.SCdataEntry.blendID = 1;


                    }
                    if (this.SCdataEntry.blendType == 'Average Blend') {
                        this.SCdataEntry.blendID = 2;

                    }
                    if (this.SCdataEntry.blendType == 'Perc. Blend') {
                        formData.set('blendPercent', this.SCdataEntry.blendPercent.toString());

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
            else if (this.SubCatAllData.subCatName == 'Gaseous Fuels') {
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

            formData.set('subCategoryTypeId', (this.dataEntry.typeID).toString());
            formData.set('SubCategorySeedID', (this.SubCatAllData
                .manageDataPointSubCategorySeedID).toString());
            formData.set('blendType', this.SCdataEntry.blendType);

            formData.set('unit', this.dataEntry.unit);
            formData.set('readingValue', this.dataEntry.readingValue.toString());

            formData.set('months', monthString);
            formData.set('year', this.dataEntry.year);
            formData.set('facility_id', this.facilityID);


            this.trackingService.newPostSCDataEntry(formData).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            'Data entry added successfully',
                            'Success'
                        );
                        this.resetForm();
                        this.getsubCategoryType(this.SubCatAllData
                            .manageDataPointSubCategorySeedID);
                        this.ALLEntries();
                        this.getUnit(this.SubCatAllData
                            .manageDataPointSubCategorySeedID);
                        //this.GetAssignedDataPoint(this.facilityID);
                        // this.trackingService.getrefdataentry(this.SubCatAllData.id, this.loginInfo.tenantID).subscribe({
                        //     next: (response) => {
                        //         this.commonDE = response;
                        //     }
                        // });

                        this.activeindex = 0;
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
            if (this.selectMonths.length == 0) {
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            let formData = new URLSearchParams();
            this.RefrigerantDE.typeID = this.dataEntry.typeID;

            formData.set('subCategoryTypeId', (this.dataEntry.typeID).toString());
            formData.set('SubCategorySeedID', this.SubCatAllData
                .manageDataPointSubCategorySeedID.toString());
            formData.set('refAmount', this.RefrigerantDE.refAmount.toString());

            formData.set('unit', this.dataEntry.unit);
            formData.set('facilities', this.facilityID);

            formData.set('months', monthString);
            formData.set('year', this.dataEntry.year);

            this.trackingService.newPostRegrigerantDataEntry(formData.toString()).subscribe({
                next: (response) => {
                    if (response.success == true) {
                        this.notification.showSuccess(
                            'Data entry added successfully',
                            'Success'
                        );
                        this.resetForm();
                        this.getsubCategoryType(this.SubCatAllData
                            .manageDataPointSubCategorySeedID);
                        this.ALLEntries();
                        this.getUnit(this.SubCatAllData
                            .manageDataPointSubCategorySeedID);
                        //this.GetAssignedDataPoint(this.facilityID);
                        // this.trackingService.getrefdataentry(this.SubCatAllData.id, this.loginInfo.tenantID).subscribe({
                        //     next: (response) => {
                        //         this.commonDE = response;
                        //     }
                        // });

                        this.activeindex = 0;
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
            if (this.selectMonths.length == 0) {
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            let formData = new URLSearchParams();
            formData.set('NumberOfExtinguisher', this.FireExtinguisherDE.numberOfExtinguisher.toString());
            formData.set('unit', this.dataEntry.unit);
            formData.set('quantityOfCO2makeup', this.FireExtinguisherDE.quantityOfCO2makeup.toString());
            formData.set('fireExtinguisherID', this.FireExtinguisherDE.fireExtinguisherID?.toString());
            formData.set('facilities', this.facilityID);
            formData.set('months', monthString);
            formData.set('year', this.dataEntry.year);
            formData.set('SubCategorySeedID', this.SubCatAllData
                .manageDataPointSubCategorySeedID.toString());

            this.trackingService.newPostFireExtinguisherDataEntry(formData.toString()).subscribe({
                next: (response) => {
                    if (response.success == true) {
                        this.notification.showSuccess(
                            'Data entry added successfully',
                            'Success'
                        );
                        this.resetForm();
                        this.ALLEntries();
                        this.getUnit(this.SubCatAllData
                            .manageDataPointSubCategorySeedID);
                        //this.GetAssignedDataPoint(this.facilityID);
                        // this.trackingService.getrefdataentry(this.SubCatAllData.id, this.loginInfo.tenantID).subscribe({
                        //     next: (response) => {
                        //         this.commonDE = response;
                        //     }
                        // });

                        this.activeindex = 0;
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
            console.log("this.VehicleDE.vehicleTypeID", this.VehicleDE.vehicleTypeID);

            if (this.selectMonths.length == 0) {
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            if (this.VehicleDE.modeOfDE == 'Distance Travelled') {
                this.VehicleDE.modeofDEID = 1;

            }
            else {
                this.VehicleDE.modeofDEID = 2;
            }
            console.log(this.VehicleDE.modeOfDE);
            let formData = new URLSearchParams();
            formData.set('NoOfVehicles', this.VehicleDE.noOfVehicles.toString());
            formData.set('TotalnoOftripsPerVehicle', this.VehicleDE.totalnoOftripsPerVehicle.toString());
            formData.set('ModeofDEID', form.value.modeName);
            formData.set('Value', this.VehicleDE.value.toString());
            formData.set('vehicleTypeID', this.VehicleDE.vehicleTypeID.toString());
            formData.set('unit', this.dataEntry.unit);
            formData.set('charging_outside', this.VehicleDE.chargingPerc);
            formData.set('facilities', this.facilityID);
            formData.set('months', monthString);
            formData.set('year', this.dataEntry.year);
            formData.set('SubCategorySeedID', this.SubCatAllData
                .manageDataPointSubCategorySeedID.toString());

            this.trackingService.newPostVehicleDataEntry(formData.toString()).subscribe({
                next: (response) => {
                    if (response.success == true) {
                        this.ALLEntries();
                        this.notification.showSuccess(
                            'Data entry added successfully',
                            'Success'
                        );
                        this.resetForm();
                        this.getUnit(this.SubCatAllData
                            .manageDataPointSubCategorySeedID);
                        this.VehicleDE.modeOfDE = this.ModeType[0].modeName;
                        console.log("this.VehicleDE.modeOfDE", this.VehicleDE.modeOfDE);
                        if (this.SubCatAllData.manageDataPointSubCategorySeedID == 10) {

                            this.getPassengerVehicleType();
                        }
                        else {

                            this.getDeliveryVehicleType();
                        }
                        this.activeindex = 0;
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
            if (this.selectMonths.length == 0) {
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            if (this.SubCatAllData.manageDataPointSubCategorySeedID == 9) {
                var formData = new URLSearchParams();
                formData.set('RegionID', this.RenewableElectricity.electricityRegionID.toString());
                formData.set('readingValue', this.dataEntry.readingValue.toString());
                formData.set('unit', this.dataEntry.unit);
                formData.set('facilities', this.facilityID);
                formData.set('months', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('SubCategorySeedID', this.SubCatAllData
                    .manageDataPointSubCategorySeedID.toString());

                this.trackingService.newPostElectricityDataEntry(formData.toString()).subscribe({
                    next: (response) => {
                        if (response.success == true) {
                            this.resetForm();
                            //this.GetAssignedDataPoint(this.facilityID);
                            this.getUnit(this.SubCatAllData
                                .manageDataPointSubCategorySeedID);
                            this.RenewableElectricity.sourceName = this.ElectricitySource[0].sourceName;
                            this.activeindex = 0;
                            this.getRegionName(9);
                            this.ALLEntries();
                            this.renewableSelected = false;
                            this.supplierSelected = false;
                            this.notification.showSuccess(
                                'Data entry added successfully',
                                'Success'
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
            else {
                var formData = new URLSearchParams();
                formData.set('typeID', form.value.Type);
                formData.set('readingValue', this.dataEntry.readingValue.toString());
                formData.set('sourceName', this.RenewableElectricity.sourceName);
                formData.set('unit', this.dataEntry.unit);
                formData.set('facilities', this.facilityID);
                formData.set('months', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('emission_factor', form.value.emission_factorS);
                formData.set('SubCategorySeedID', this.SubCatAllData
                    .manageDataPointSubCategorySeedID.toString());

                this.trackingService.newPostElectricityMarket(formData.toString()).subscribe({
                    next: (response) => {
                        console.log(response);
                        if (response.success == true) {
                            this.resetForm();
                            //this.GetAssignedDataPoint(this.facilityID);
                            this.getUnit(this.SubCatAllData
                                .manageDataPointSubCategorySeedID);

                            this.activeindex = 0;
                            this.getRegionName(9);
                            this.ALLEntries();
                            this.renewableSelected = false;
                            this.supplierSelected = false;
                            this.notification.showSuccess(
                                'Data entry added successfully',
                                'Success'
                            );


                        }
                        // this.marketEElecID = this.marketTypes[0].id;


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
        if (this.categoryId == 7) {
            var formData = new URLSearchParams();
            formData.set('typeID', this.dataEntry.typeID.toString());
            formData.set('readingValue', this.dataEntry.readingValue.toString());
            formData.set('unit', this.dataEntry.unit);
            formData.set('facilities', this.facilityID);
            formData.set('months', monthString);
            formData.set('year', this.dataEntry.year);
            formData.set('SubCategorySeedID', this.SubCatAllData
                .manageDataPointSubCategorySeedID.toString());

            this.trackingService.newPostHeatandSteamDataEntry(formData.toString()).subscribe({
                next: (response) => {
                    if (response.success == true) {
                        this.resetForm();
                        this.getsubCategoryType(this.SubCatAllData
                            .manageDataPointSubCategorySeedID);
                        this.ALLEntries();
                        this.getUnit(this.SubCatAllData
                            .manageDataPointSubCategorySeedID);
                        //this.GetAssignedDataPoint(this.facilityID);'
                        // this.trackingService.getHeatandSteamdataentry(this.SubCatAllData.id, this.loginInfo.tenantID).subscribe({
                        //     next: (response) => {
                        //         this.commonDE = response;
                        //     }
                        // });
                        this.activeindex = 0;
                        this.notification.showSuccess(
                            'Data entry added successfully',
                            'Success'
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
        if (this.categoryId == 8) {

            let formData = new URLSearchParams();
            formData.set('batch', this.batchId);

            this.trackingService.submitPurchaseGoods(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.inputFile.nativeElement.value = '';
                        $(".filename").val('');
                        $(".browse-button-text").html('<i class="fa fa-folder-open"></i> Browse')
                        this.resetForm();
                        this.ALLEntries();
                        // this.dataEntryForm.reset()
                        // this.getStatusData(1);
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
        if (this.categoryId == 10) {
            let formData = new URLSearchParams();

            if (this.storageTransporationChecked === true && this.vehcilestransporationchecked === true) {
                formData.set('vehicle_type', this.selectedVehicleType);
                formData.set('sub_category', this.subVehicleCategoryValue);
                formData.set('noOfVehicles', form.value.noOfVehicles);
                formData.set('mass_of_products', form.value.mass_of_products);
                formData.set('mass_unit', form.value.mass_unit);
                formData.set('distance_unit', form.value.distance_unit);
                formData.set('area_occupied_unit', form.value.area_unit);
                formData.set('distanceInKms', form.value.distanceInKms);
                formData.set('storagef_type', form.value.storage_type);
                formData.set('area_occupied', form.value.area_occupied);
                formData.set('averageNoOfDays', form.value.averageNoOfDays);
                formData.set('facility_id', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
            } else if (this.storageTransporationChecked === true) {
                formData.set('storagef_type', form.value.storage_type);
                formData.set('area_occupied', form.value.area_occupied);
                formData.set('averageNoOfDays', form.value.averageNoOfDays);
                formData.set('area_occupied_unit', form.value.area_unit);
                formData.set('facility_id', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
            } else if (this.vehcilestransporationchecked == true) {
                formData.set('vehicle_type', this.selectedVehicleType);
                formData.set('sub_category', this.subVehicleCategoryValue);
                formData.set('mass_unit', form.value.mass_unit);
                formData.set('distance_unit', form.value.distance_unit);
                formData.set('noOfVehicles', form.value.noOfVehicles);
                formData.set('mass_of_products', form.value.mass_of_products);
                formData.set('distanceInKms', form.value.distanceInKms);
                formData.set('facility_id', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
            }


            this.trackingService.upStreamTransportation(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        this.getSubVehicleCategory(1);
                        this.getVehicleTypes()
                        // this.getStatusData(this.activeCategoryIndex)
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();
                        this.getSubVehicleCategory(1)
                    }
                    this.ALLEntries();
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
        if (this.categoryId == 11) {
            if (this.selectMonths.length == 0) {
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
            formData.set('facilities', this.facilityID);
            formData.set('month', monthString);
            formData.set('year', this.dataEntry.year);
            formData.set('batch', this.batchId);


            this.trackingService.AddwatersupplytreatmentCategory(formData.toString()).subscribe({
                next: (response) => {

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
                    this.ALLEntries();
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
        if (this.categoryId == 12) {
            if (this.selectMonths.length == 0) {
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)

            let formData = new URLSearchParams();
            if (this.wasteMethod == 'recycling') {
                formData.set('product', this.waterWasteProduct);
                formData.set('waste_type', form.value.wasteSubCategory);
                formData.set('total_waste', form.value.waste_quantity);
                formData.set('method', this.wasteMethod);
                formData.set('unit', form.value.wasteUnits);
                formData.set('waste_loop', this.recycleSelectedMethod);
                formData.set('id', form.value.wasteType);
                formData.set('months', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facility_id', this.facilityID);
            } else {
                formData.set('product', this.waterWasteProduct);
                formData.set('waste_type', form.value.wasteSubCategory);
                formData.set('total_waste', form.value.waste_quantity);
                formData.set('method', this.wasteMethod);
                formData.set('unit', form.value.wasteUnits);
                formData.set('id', form.value.wasteType);
                formData.set('months', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facility_id', this.facilityID);
            }


            this.trackingService.wasteGeneratedEmission(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        this.wasteMethod = this.waterWasteMethod[0].water_type
                        this.getWasteSubCategory("1")

                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();
                        this.wasteMethod = this.waterWasteMethod[0].water_type

                    }
                    this.ALLEntries();
                    this.recycle = false;
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
        if (this.categoryId == 14) {
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


            const typoOfOffice = [empobj1, empobj2, empobj3, empobj4, empobj5, empobj6, empobj7, empobj8, empobj9, empobj10, empobj11, empobj12, empobj13, empobj14, empobj15]
            var typeoftransportStringfy = JSON.stringify(typoOfOffice)


            let formData = new URLSearchParams();

            formData.set('batch', this.batchId);
            formData.set('noofemployees', form.value.noofemployees);
            formData.set('workingdays', form.value.workingdays);
            formData.set('typeoftransport', typeoftransportStringfy);
            formData.set('facilities', this.facilityID);
            formData.set('month', monthString);
            formData.set('year', this.dataEntry.year);

            this.trackingService.uploadEmployeeCommunity(formData.toString()).subscribe({
                next: (response) => {
                    this.ALLEntries();
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
        if (this.categoryId == 15) {
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
            formData.set('facilities', this.facilityID);
            formData.set('month', monthString);
            formData.set('year', this.dataEntry.year);
            this.trackingService.uploadHomeOffice(formData.toString()).subscribe({
                next: (response) => {

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
                        // this.getStatusData(this.activeCategoryIndex)
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
                    this.ALLEntries();
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
        if (this.categoryId == 16) {
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
                    formData.set('facility_id', this.facilityID);
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
                    formData.set('facility_id', this.facilityID);
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
                formData.set('facility_id', this.facilityID);
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
                    formData.set('facility_id', this.facilityID);
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
                    formData.set('facility_id', this.facilityID);
                }
            }



            this.trackingService.uploadupLeaseEmissionCalculate(formData.toString()).subscribe({
                next: (response) => {

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
                        // this.getStatusData(this.activeCategoryIndex)
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
                    this.ALLEntries();
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
        if (this.categoryId == 17) {
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
                formData.set('facility_id', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
            } else if (this.storageTransporationChecked === true) {
                formData.set('storagef_type', form.value.storage_type);
                formData.set('area_occupied', form.value.area_occupied);
                formData.set('averageNoOfDays', form.value.averageNoOfDays);
                formData.set('facility_id', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
            } else if (this.vehcilestransporationchecked == true) {
                formData.set('vehicle_type', this.selectedVehicleType);
                formData.set('sub_category', this.subVehicleCategoryValue);
                formData.set('noOfVehicles', form.value.noOfVehicles);
                formData.set('mass_of_products', form.value.mass_of_products);
                formData.set('distanceInKms', form.value.distanceInKms);
                formData.set('facility_id', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
            }


            this.trackingService.downStreamTransportation(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        this.getVehicleTypes()
                        this.getSubVehicleCategory(1)
                        // this.getStatusData(this.activeCategoryIndex)
                    } else {
                        this.notification.showError(
                            response.message,
                            'Error'
                        );
                        this.dataEntryForm.reset();
                        this.getSubVehicleCategory(1)
                    }
                    this.ALLEntries();
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
        if (this.categoryId == 18) {
            if (this.selectMonths.length == 0) {
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
                    formData.set('facilities', this.facilityID);

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
                    formData.set('facilities', this.facilityID);
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
                    formData.set('facilities', this.facilityID);

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
                    formData.set('facilities', this.facilityID);

                }
            }



            this.trackingService.Addprocessing_of_sold_productsCategory(formData.toString()).subscribe({
                next: (response) => {

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
                    this.ALLEntries();
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
        if (this.categoryId == 19) {
            if (this.selectMonths.length == 0) {
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
                formData.set('facilities', this.facilityID);

            } else {
                formData.set('type', form.value.energyTypes);
                formData.set('productcategory', form.value.productCategoryitem);
                formData.set('no_of_Items', form.value.numberofitems);
                formData.set('no_of_Items_unit', form.value.noofunits);
                formData.set('batch', this.batchId);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facilities', this.facilityID);
            }



            this.trackingService.AddSoldProductsCategory(formData.toString()).subscribe({
                next: (response) => {

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
                    this.ALLEntries();
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
        if (this.categoryId == 20) {
            if (this.selectMonths.length == 0) {
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
            formData.set('facilities', this.facilityID);


            this.trackingService.AddendoflifeCategory(formData.toString()).subscribe({
                next: (response) => {

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
                    this.ALLEntries();
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
        if (this.categoryId == 21) {
            if (this.selectMonths.length == 0) {
                this.notification.showInfo(
                    'Select month',
                    ''
                );
                return
            }
            var spliteedMonth = this.dataEntry.month.split(",");
            var monthString = JSON.stringify(spliteedMonth)

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
                    formData.set('facility_id', this.facilityID);
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
                    formData.set('facility_id', this.facilityID);
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
                formData.set('facility_id', this.facilityID);
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
                    formData.set('facility_id', this.facilityID);
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
                    formData.set('facility_id', this.facilityID);
                }
            }


            this.trackingService.downstreamLeaseEmissionCalculate(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.ALLEntries();
                        this.averageMethod = false;
                        this.franchiseMethod = false;
                        this.dataEntryForm.reset();
                        this.getSubVehicleCategory(1);
                        this.getVehicleTypes();
                        this.getFranchiseType();
                        this.getSubFranchiseCategory('Banking Financial Services');
                        // this.getStatusData(this.activeCategoryIndex)
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
        if (this.categoryId == 22) {
            let formData = new URLSearchParams();
            if (this.franchiseMethodValue == 'Average data method') {
                formData.set('franchise_type', this.franchiseCategoryValue);
                formData.set('sub_category', form.value.sub_categories);
                formData.set('calculation_method', this.franchiseMethodValue);
                formData.set('franchise_space', form.value.franchise_space);
                formData.set('facility_id', this.facilityID);
                formData.set('unit', form.value.upfacilityUnits);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);

            } if (this.franchiseMethodValue == 'Investment Specific method') {
                formData.set('franchise_type', this.franchiseCategoryValue);
                formData.set('sub_category', form.value.sub_categories);
                formData.set('calculation_method', this.franchiseMethodValue);
                formData.set('scope1_emission', form.value.scope1_emission);
                formData.set('scope2_emission', form.value.scope2_emission);
                formData.set('facility_id', this.facilityID);
                formData.set('unit', form.value.upfacilityUnits);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
            }


            this.trackingService.uploadFranchise(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.ALLEntries();
                        this.dataEntryForm.reset();
                        this.getFranchiseType();
                        this.getSubFranchiseCategory('Banking Financial Services');
                        this.averageMethod = false;
                        this.franchiseMethod = false;
                        // this.getStatusData(this.activeCategoryIndex)
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
        if (this.categoryId == 23) {
            let formData = new URLSearchParams();

            if (this.franchiseMethodValue == 'Investment Specific method' && this.investmentTypeValue == 'Equity investments') {
                formData.set('investment_type', form.value.investment_type);
                formData.set('category', form.value.investment_sector);
                formData.set('sub_category_id', form.value.broad_categoriesId);
                formData.set('calculation_method', form.value.calculationmethod);
                formData.set('scope1_emission', form.value.scope1_emission);
                formData.set('scope2_emission', form.value.scope2_emission);
                formData.set('equity_share', form.value.share_Equity);
                formData.set('facilities', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
            } else if (this.investmentTypeValue == 'Equity investments' && this.franchiseMethodValue == 'Average data method') {
                formData.set('investment_type', form.value.investment_type);
                formData.set('category', form.value.investment_sector);
                formData.set('sub_category_id', form.value.broad_categoriesId);
                formData.set('calculation_method', form.value.calculationmethod);
                formData.set('investee_company_total_revenue', form.value.investe_company_revenue);
                formData.set('equity_share', form.value.share_Equity);
                formData.set('facilities', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
            } else if ((this.investmentTypeValue == 'Debt investments' || this.investmentTypeValue == 'Project finance') && this.franchiseMethodValue == 'Average data method') {
                formData.set('investment_type', form.value.investment_type);
                formData.set('category', form.value.investment_sector);
                formData.set('sub_category_id', form.value.broad_categoriesId);
                formData.set('calculation_method', form.value.calculationmethod);
                formData.set('project_phase', form.value.projectPhase);
                formData.set('project_construction_cost', form.value.project_construction_cost);
                formData.set('equity_project_cost', form.value.equity_project_cost);
                formData.set('facilities', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
            } else if ((this.investmentTypeValue == 'Debt investments' || this.investmentTypeValue == 'Project finance') && this.franchiseMethodValue == 'Investment Specific method') {

                formData.set('investment_type', form.value.investment_type);
                formData.set('category', form.value.investment_sector);
                formData.set('sub_category_id', form.value.broad_categoriesId);
                formData.set('calculation_method', form.value.calculationmethod);
                formData.set('scope1_emission', form.value.scope1_emission);
                formData.set('scope2_emission', form.value.scope2_emission);
                formData.set('equity_project_cost', form.value.project_cost);
                formData.set('facilities', this.facilityID);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);

            }


            this.trackingService.calculateInvestmentEmission(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.ALLEntries();
                        this.dataEntryForm.reset();
                        this.equityInvestmentRow = false;
                        this.debtInvesmentRow = false;
                        this.calculationRow = false;
                        this.averageMethod = false
                        this.franchiseMethod = false
                        this.franchiseMethodValue = '';
                        this.investmentTypeValue = ''

                        // this.getStatusData(this.activeCategoryIndex)
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
        if (this.categoryId == 24) {
            if (this.selectMonths.length == 0) {
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
                formData.set('cost_centre', form.value.businessunits);
                formData.set('batch', this.batchId);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facilities', this.facilityID);
            } else if (form.value.flightMode == 'To/From') {
                formData.set('flight_calc_mode', form.value.flightMode);
                formData.set('to', form.value.airport_codeto);
                formData.set('from', form.value.airport_codefrom);
                formData.set('via', form.value.airport_codevia);
                formData.set('flight_class', form.value.classs);
                formData.set('no_of_passengers', form.value.no_of_passengers);
                formData.set('return_flight', form.value.return);
                formData.set('reference_id', form.value.reference_id);
                formData.set('cost_centre', form.value.businessunits);
                formData.set('batch', this.batchId);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facilities', this.facilityID);
            } else if (form.value.flightMode == 'Distance') {
                formData.set('flight_calc_mode', form.value.flightMode);
                formData.set('flight_type', form.value.flight_type);
                formData.set('flight_class', form.value.classs);
                formData.set('distance', form.value.distance);
                formData.set('no_of_passengers', form.value.no_of_passengers);
                formData.set('return_flight', form.value.return);
                formData.set('reference_id', form.value.reference_id);
                formData.set('cost_centre', form.value.businessunits);
                formData.set('batch', this.batchId);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facilities', this.facilityID);
            }


            this.trackingService.uploadflightTravel(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        this.ALLEntries();
                        // this.getStatusData(this.activeCategoryIndex);
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
        if (this.categoryId == 25) {
            if (this.selectMonths.length == 0) {
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
            formData.set('facilities', this.facilityID);


            this.trackingService.uploadHotelStay(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        this.ALLEntries();

                        // this.getStatusData(this.activeCategoryIndex)
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
        if (this.categoryId == 26) {
            if (this.selectMonths.length == 0) {
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
                formData.set('facilities', this.facilityID);
            } else {

                formData.set('mode_of_trasport', form.value.modes);
                formData.set('type', form.value.cartype);
                formData.set('no_of_passengers', form.value.no_of_passengers);
                formData.set('distance_travelled', form.value.distance);
                formData.set('no_of_trips', form.value.no_ofTrips);
                formData.set('batch', this.batchId);
                formData.set('month', monthString);
                formData.set('year', this.dataEntry.year);
                formData.set('facilities', this.facilityID);
            }



            this.trackingService.uploadOtherModes(formData.toString()).subscribe({
                next: (response) => {

                    if (response.success == true) {
                        this.notification.showSuccess(
                            response.message,
                            'Success'
                        );
                        this.dataEntryForm.reset();
                        this.ModeSelected = false;
                        this.ALLEntries();

                        // this.getStatusData(this.activeCategoryIndex)
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

    };
    // getting units for category 1 and 2
    getUnit(subcatId) {
        this.trackingService.newgetUnits(subcatId).subscribe({
            next: (Response) => {
                if (Response) {
                    this.units = Response['categories'];
                    this.dataEntry.unit = this.units[0].UnitName;

                }
                else {
                    this.units = [];
                }
            }
        })
    };


    CostCentre() {
        //   let formData = new URLSearchParams();
    
        //   formData.set('tenant_id', tenantID.toString());
    
        this.GroupService.getCostCentre().subscribe({
          next: (response) => {
    
            if (response.success == true) {
              this.busineessGrid = response.categories;
              if (this.busineessGrid.length > 0) {
      
             
              } else {
             
              }
       
            }
          },
          error: (err) => {
            console.error('errrrrrr>>>>>>', err);
          },
          complete: () => console.info('Group Added')
        });
      };

    //retrieves assigned data points for a facility and handles the response to update the UI accordingly.
    GetAssignedDataPoint(facilityID: number) {
        this.recycle = false;

        if (facilityID == 0) {
            return
        } else {

            this.AssignedDataPoint = [];
            this.SubCatAllData = new ManageDataPointSubCategories();
            this.trackingService
                .newgetSavedDataPointforTracking(facilityID)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.facilityhavedp = environment.none;
                            this.facilitynothavedp = environment.flex;
                            this.forGroup = environment.none;
                        } else {
                            // console.log("scopees", response)
                            this.AssignedDataPoint = response.categories;
                            this.AssignedDataPoint.forEach(scope => {
                                scope.manageDataPointCategories.forEach(
                                    (cat) => {
                                        cat.manageDataPointSubCategories.forEach(
                                            (subcat) => {
                                                //   var count = 0;
                                                //   subcat.dataEntries.forEach(
                                                //       (dataentry) => {
                                                //           if (
                                                //               dataentry.status ===
                                                //               'approved'
                                                //           ) {
                                                //               count++;
                                                //           }
                                                //           subcat.approvedEntries = count;
                                                //       }
                                                //   );
                                            }
                                        );
                                    }
                                );
                            })

                            const isSubcategoryEmptyForAllCategories =

                                (response.categories).every((scope) => {
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

                                this.facilitynothavedp = environment.none;
                                this.forGroup = environment.none;
                                this.facilityhavedp = environment.block;
                                // this.facilityhavedp = environment.block;
                                // this.facilitynothavedp = environment.none;
                                // this.forGroup = environment.none;
                            }
                            let found = false;
                            for (let i = 0; i < (response.categories).length; i++) { // Use < instead of <=
                                for (let j = 0; j < (response.categories)[i].manageDataPointCategories.length; j++) { // Use < instead of <=
                                    if ((response.categories)[i].manageDataPointCategories[j].manageDataPointSubCategories.length > 0) {

                                        const subCatID = response.categories[i].manageDataPointCategories[j].manageDataPointSubCategories[0].manageDataPointSubCategorySeedID;
                                        this.SubCatAllData = response.categories[i].manageDataPointCategories[j].manageDataPointSubCategories[0];
                                        console.log(this.SubCatAllData);
                                        this.id_var = subCatID;
                                        if ((response.categories)[i].manageDataPointCategories[j].manageDataPointCategorySeedID == 1) {

                                            this.categoryId = 1;
                                            this.ALLEntries()
                                            this.getsubCategoryType(this.SubCatAllData
                                                .manageDataPointSubCategorySeedID);
                                            this.getUnit(this.SubCatAllData
                                                .manageDataPointSubCategorySeedID);
                                            // this.trackingService.getSCdataentry(subCatID, this.loginInfo.tenantID).subscribe({
                                            //     next: (response) => {
                                            //         this.commonDE = response;
                                            //         this.categoryId = 1;

                                            //         this.getEmissionfactor(
                                            //             this.SubCatAllData
                                            //                 .manageDataPointSubCategorySeedID,
                                            //             this.categoryId
                                            //         );
                                            //         this.getsubCategoryType(this.SubCatAllData
                                            //             .manageDataPointSubCategorySeedID);
                                            //     }
                                            // });
                                            found = true; // Set the flag to true
                                            break;
                                        }

                                        if ((response.categories)[i].manageDataPointCategories[j].manageDataPointCategorySeedID == 2) {


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

                                        if ((response.categories)[i].manageDataPointCategories[j].manageDataPointCategorySeedID == 3) {
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

                                        if ((response.categories)[i].manageDataPointCategories[j].manageDataPointCategorySeedID == 5) {
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

                                        if ((response.categories)[i].manageDataPointCategories[j].manageDataPointCategorySeedID == 6) {

                                            return
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
                                        if ((response.categories)[i].manageDataPointCategories[j].manageDataPointCategorySeedID == 7) {
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
                                                (response.categories)[i].manageDataPointCategories[j].manageDataPointCategorySeedID;
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
    };


    wastemethodChange(event: any) {
        console.log(event.value);
        if (event.value == 'recycling') {
            this.recycle = true
        } else {
            this.recycle = false;
        }
    }

    setActive(index: number): void {

        this.categoryId = 13;
        this.ALLEntries();
        this.categoryId = index;
        // this.flightDisplay1 = 'block'
        // this.flightDisplay2 = 'none'
        // this.flightDisplay3 = 'none'
        this.noOfItems = false;

        // this.ModeSelected = false;
        this.calculationRow = false;
        this.equityInvestmentRow = false;

        if (this.categoryId == 24) {

            this.ModeSelected = false;
            this.categoryName = 'Flight'
            this.SubCatAllData.subCatName = 'Flight'
            this.getFlightType();
            this.CostCentre();

            // this.getSubFranchiseCategory('Banking Financial Services');
            // this.getVehicleTypes();
            // this.getSubVehicleCategory(1)
        } else if (this.categoryId == 25) {
            this.ModeSelected = false;
            this.categoryName = 'Hotel Stay';
            this.SubCatAllData.subCatName = 'Hotel Stay'
        } else if (this.categoryId == 26) {

            this.categoryName = 'Other Modes of Transport';
            this.SubCatAllData.subCatName = 'Other Modes of Transport'
        }

        // this.getStatusData(this.activeCategoryIndex);
    };


    getBusineesUnit() {
        this.trackingService.getBusinessUnit().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.busineessGrid = response.categories;
                    // this.franchiseCategoryValue = this.franchiseGrid[0].categories
                }
            }
        })
    };
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
    };

    getFlightType() {
        this.trackingService.getflight_types().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.wasteGrid = response.batchIds;
                    // this.franchiseCategoryValue = this.franchiseGrid[0].categories
                }
            }
        })
    };
    getAirportCodes() {
        this.trackingService.getAirportCodes().subscribe({
            next: (response) => {
                if (response.success == true) {

                    this.airportGrid = response.categories
                    console.log(this.airportGrid);
                } else {

                }

            }
        })
    };
    getFlightTimeTypes() {
        this.trackingService.getFlightTimes().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.flightTime = response.batchIds;
                    // this.franchiseCategoryValue = this.franchiseGrid[0].categories
                }
            }
        })
    };

    ToggleClick() {
        this.isVisited = true;
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




    getRefrigerantsubCategoryType(subCatID: number) {
        this.trackingService.newgetsubCatType(subCatID).subscribe({
            next: (response) => {
                this.SubCategoryType = response.categories;
            },
            error: (err) => {
                console.error('errrrrrr>>>>>>', err);
            }
        })
    };

    onInputEdit() {
        this.isInputEdited = true;
    };


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
    };


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
    // onFileSelected(files: FileList) {
    //     const file = files.item(0);
    //     if (file) {
    //         this.uploadFiles(files);
    //     }
    // }

    checkVisited() {
        // reverse the value of property
        this.isHowtoUse = !this.isHowtoUse;
    }

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

    marktetTypeChange(event: any) {
        if (event.value == 1) {
            this.renewableSelected = true
            this.supplierSelected = false;
        } else if (event.value == 2) {

            this.renewableSelected = false
            this.supplierSelected = true;
        }
    }

    purchaseGoodsUpload(event: any) {
        event.preventDefault();
        this.dataEntry.month = this.selectMonths
            .map((month) => month.value)
            .join(', '); //this.getMonthName();
        this.dataEntry.year = this.year.getFullYear().toString(); //this.getYear();
        var spliteedMonth = this.dataEntry.month.split(",");
        var monthString = JSON.stringify(spliteedMonth);
        const formData: FormData = new FormData();
        formData.append('file', this.selectedFile, this.selectedFile.name);
        formData.append('batch', this.batchId);
        formData.append('facilities', this.facilityID);
        formData.append('year', this.dataEntry.year);
        formData.append('month', monthString);
        this.trackingService.UploadTemplate(formData).subscribe({
            next: (response) => {

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
    };

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
        // this.fileUpload.clear();
    }

    EditDataEntry(dataEntry: any) {
        this.activeindex = 0;
    }
    // getBlendType() {
    //     this.trackingService.getBlend().subscribe({
    //         next: (response) => {
    //             this.blendType = response;
    //         }
    //     })
    // }
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



    //     console.log("seelcted", subCategory.manageDataPointSubCategorySeedID);
    //     // this.months = new months();
    //     // this.convertedYear = this.trackingService.getYear(this.year);
    //     // const formData = new URLSearchParams();
    //     // formData.set('year', this.convertedYear)
    //     // formData.set('facilities', facilityID.toString())
    //     // formData.set('categoryID', this.selectedCategory);

    //     let url = ''
    //     switch (subCategory.manageDataPointSubCategorySeedID) {
    //         case 1:
    //             url = 'reportStationaryCombustion'
    //             break;
    //         case 2:
    //             url = 'reportRegfriegrant'
    //             break;
    //         case 3:
    //             url = 'Getfireextinguisher'
    //             break;
    //         case 6:
    //             url = 'reportStationaryCombustion'
    //             break;
    //         case 5:
    //             url = 'reportRenewableElectricity'
    //             break;
    //         case 7:
    //             url = 'Allrefrigerant'
    //             break;
    //         case 8:
    //             url = 'Getfireextinguisher'
    //             break;
    //         case 10:
    //             url = 'getAllcompanyownedvehicles'
    //             break;
    //         case 11:
    //             url = 'getAllcompanyownedvehicles'
    //             break;
    //         case 12:
    //             url = 'getAllheatandsteam'
    //             break;
    //         case 1005:
    //             url = 'getPurchaseGoodEmissions'
    //             let formData = new URLSearchParams();
    //             formData.set('batch', this.batchId);
    //             url = 'getPurchaseGoodEmissions';
    //             this.trackingService.getPurchaseGoodEmissions(formData).subscribe({
    //                 next: (response) => {
    //                     console.log(response);
    //                     if (response.success == true) {
    //                         this.dataEntriesPending = response.categories;
    //                     }
    //                 }
    //             })
    //             return
    //             break;
    //         case 9:
    //             url = 'reportStationaryCombustion'
    //             break;
    //         case 1007:
    //             url = 'getUpstreamEmissions'
    //             break;
    //         case 1008:
    //             url = 'getwatersupplytreatmentCategory'
    //             break;
    //         case 1009:
    //             url = 'reportWasteGeneratedEmission'
    //             break;
    //         case 13:
    //             // switch (this.selectMode) {
    //             //     case 1:
    //             //         url = 'reportFlightTravel'
    //             //         break;
    //             //     case 2:
    //             //         url = 'reportStationaryCombustion'
    //             //         break;
    //             //     case 3:
    //             //         url = 'reportOtherTransport'
    //             //         break;
    //             // }
    //             break;
    //         case 1011:
    //             // case 'Employee Commuting':
    //             url = 'getemployeecommutingCategory'
    //             break;
    //         case 1012:
    //             url = 'gethomeofficeCategory'
    //             break;
    //         case 1013:
    //             url = 'getUpstreamLeaseEmission'
    //             break;
    //         case 1014:
    //             // case 'Downstream Transportation and Distribution':
    //             url = 'getDownstreamEmissions'
    //             break;
    //         case 1015:
    //             url = 'getprocessing_of_sold_productsCategory'
    //             break;
    //         case 1016:
    //             // case 'Use of Sold Products':
    //             url = 'reportStationaryCombustion'
    //             break;
    //         case 1017:
    //             url = 'getendof_lifetreatment_category'
    //             break;
    //         case 1018:
    //             url = 'getDownstreamLeaseEmission'
    //             break;
    //         case 1019:
    //             url = 'getFranchiseEmission'
    //             break;
    //         case 1020:
    //             url = 'getInvestmentEmission'
    //             break;
    //         default:
    //             // Handle unknown month value
    //             break;
    //     }


    //     this.trackingService
    //         .getStatus(url)
    //         .subscribe({
    //             next: (response) => {
    //                 if (response.success === false) {
    //                     // this.dataEntriesPending = null;
    //                 } else {
    //                     console.log(response);
    //                     this.dataEntriesPending = response.categories;
    //                     // console.log("data>", this.dataEntriesPending)
    //                 }

    //             },
    //             error: (err) => {
    //                 this.notification.showError(
    //                     'Get data Point failed.',
    //                     'Error'
    //                 );
    //                 console.error('errrrrrr>>>>>>', err);
    //             }
    //         });








    // };


    getPassengerVehicleType() {
        try {
            this.VehicleDE.vehicleTypeID = null;
            this.trackingService.newGetPassengerVehicleType().subscribe({
                next: (response) => {
                    if (response) {
                        this.VehicleType = response.categories;
                        this.VehicleDE.vehicleTypeID = this.VehicleType[0].ID
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

    };
    getDeliveryVehicleType() {
        try {
            this.VehicleDE.vehicleTypeID = null;
            this.trackingService.newGetDeliveryVehicleType().subscribe({
                next: (response) => {
                    if (response) {
                        this.VehicleType = response.categories;
                        this.VehicleDE.vehicleTypeID = this.VehicleType[0].ID
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
    };

    onModesChange(event: any) {
        const selectedMode = event.value;
        this.carMode = true;
        this.autoMode = false;
        this.ModeSelected = true;
        if (selectedMode == 'Car') {
            this.carMode = true;
            this.autoMode = false;
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
            this.autoMode = true;
            this.carMode = true;
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
            this.carMode = false;
            this.autoMode = true;
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
            this.carMode = false;
            const optionvalue =
                [{
                    "id": 1,
                    "type": "National"
                },
                {
                    "id": 2,
                    "type": "International"
                }

                ]
            this.mode_name = selectedMode;
            this.mode_type = optionvalue;
        }
        else if (selectedMode == 'Ferry') {
            this.carMode = false;
            this.autoMode = true;
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

    getVehicleTypes() {
        this.trackingService.getVehicleType().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.VehicleGrid = response.categories;
                    const selectedIndex = this.selectedVehicleIndex;
                    this.selectedVehicleType = this.VehicleGrid[selectedIndex - 1]?.vehicle_type

                }
            }
        })
    };

    onVehicleTypeChange(event: any) {
        const selectedIndex = event.value;
        this.selectedVehicleType = this.VehicleGrid[selectedIndex - 1].vehicle_type

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

    onWasteTypeChange(event: any) {
        const energyMethod = event.value;
        console.log("energy method,", energyMethod);
        this.waterWasteProduct = this.wasteGrid[energyMethod - 1].type

        this.getWasteSubCategory(energyMethod);

    };

    getWasteSubCategory(typeId: any) {
        let formData = new URLSearchParams();

        formData.set('type', typeId);
        this.trackingService.getWasteSubCategory(formData).subscribe({
            next: (response) => {

                if (response.success == true) {
                    console.log(response);
                    this.wasteSubTypes = response.categories;

                }
            }
        })
    };
    onCityChange(event: any) {
        // event.value will contain the selected city object
        this.selectedflightsTravel = event.value;

        if (this.selectedflightsTravel == 'Generic') {

            this.flightDisplay1 = 'block'
            this.flightDisplay2 = 'none'
            this.flightDisplay3 = 'none'
            this.CostCentre();
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

    getFranchiseType() {
        this.trackingService.getFranchiseType().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.franchiseGrid = response.categories;
                    this.franchiseCategoryValue = this.franchiseGrid[0].categories
                }
            }
        })
    };

    onFranchiseChange(event: any) {
        const frachiseTypevalue = event.value;

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

    onProductEnergyTypeChange(event: any) {
        const energyMethod = event.value;
        this.getProductsEnergyCategory(energyMethod);
    };

    onpurchaseGoodsCategoryChange(event: any) {
        const energyMethod = event.value;

        this.onActivitySelected = false;
        if (energyMethod == 'Other') {
            this.onIndustrySelected = false;
            this.OthersSecledted = true;
            return;
        }

        this.onIndustrySelected = true;
        this.getProcessingActivityCategory(energyMethod);
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

                if (response.success == true) {
                    this.activitySubTypes = response.categories;

                }
            }
        })
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

    getProcessingActivityCategory(industry: any) {
        let formData = new URLSearchParams();

        formData.set('industry', industry);
        this.trackingService.getPurchaseGoodsActivity(formData).subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.productActivitySubTypes = response.categories;

                }
            }
        })
    };

    onQuantitySoldUnitChange(event: any) {
        const energyMethod = event.value;

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

        if (energyMethod == 1) {
            this.subElectricityUnits = "per usage"
        } else if (energyMethod == 2) {
            this.subElectricityUnits = "per day"
        }
        else if (energyMethod == 3) {
            this.subElectricityUnits = "per months"

        } else if (energyMethod == 4) {
            this.subElectricityUnits = "per year"
        }
        // this.getProductsEnergyCategory(energyMethod);

    };

    getFuelEnergyCategory() {
        this.trackingService.getEnergyFuelType().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.fuelEnergyTypes = response.categories;

                }
            }
        })
    };
    getRefrigerants() {
        this.trackingService.getrefrigents().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.refrigeratedTypes = response.categories;

                }
            }
        })
    };

    onSubCategoryFranchiseChange(event: any) {
        this.subFranchiseCategoryValue = event.value;

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

    onProjectPhaseChnage(event: any) {
        const calMethod = event.value;
        if (calMethod == 'In Construction phase') {
            this.RevenueRow = true;
        } else {
            this.RevenueRow = false;
        }
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

    onInvestmentSectorChange(event: any) {
        const energyMethod = event.value;
        this.getInvestmentSubCategory(energyMethod);
    };

    getInvestmentSubCategory(category: any) {
        this.trackingService.getInvestmentSubCategory(category).subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.subFranchiseCategory = response.sub_categories;

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

    setUnit() {
        if (this.VehicleDE.modeOfDE == 'Average distance per trip') {
            this.dataEntry.unit = "Km"
        }
        else {
            this.dataEntry.unit = "Litre"
        }
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

    getInvestmentCategories() {
        this.trackingService.getInvestmentCategories().subscribe({
            next: (response) => {

                if (response.success == true) {
                    this.wasteGrid = response.categories;
                    // this.franchiseCategoryValue = this.franchiseGrid[0].categories
                }
            }
        })
    };

    getBatch() {
        this.trackingService.getBatches().subscribe({
            next: (response) => {
                if (response.success == true) {
                    this.batchId = response.batchIds[0].batch_id;
                    // this.getStatusData(1)

                } else {

                }

            }
        })
    };


    //retrieves the emission factor for a given subcategory seed ID and category ID.
    getEmissionfactor(subcatseedID: any, catID) {
        if (catID === 1) {
            this.trackingService
                .GetEmissionFactorStationarybyID(subcatseedID)
                .subscribe({
                    next: (response) => {
                        if (response) {
                            this.EmissionFactor = response;
                            //   this.getUnit(subcatseedID);
                        }
                        else {
                            this.EmissionFactor = [];
                        }
                    },
                    error: (err) => {
                        this.EmissionFactor = [];

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
                            // this.getUnit(subcatseedID);
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
                            // this.getUnit(subcatseedID);
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
                            // this.getUnit(subcatseedID);
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
                            // this.getUnit(subcatseedID);
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
                            // this.getUnit(subcatseedID);
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
    };


}
