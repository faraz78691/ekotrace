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
import { countries } from '@/store/countrieslist';
import { Component, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-finance-emissions',
  templateUrl: './finance-emissions.component.html',
  styleUrls: ['./finance-emissions.component.scss']
})
export class FinanceEmissionsComponent {
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
  marketEElecID: any;;


  carFuel_type: any[] = [];
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
      // $(document).ready(function () {
      //     $('.ct_custom_dropdown').click(function () {

      //         $('.ct_custom_dropdown').toggleClass('ct_open_modal')
      //     })
      // })
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
      console.log("called");
      this.categoryName = categoryName;
      this.recycle = false;
      this.isVisited = false;
      this.renewableSelected =false;
      this.supplierSelected = false;

      this.id_var = data.manageDataPointSubCategorySeedID;

      this.categoryId = catID;
      console.log("subCatTypeID", this.categoryId);

      this.SubCatAllData = data;
      this.ALLEntries()
      if (catID == 1) {

          this.getsubCategoryType(this.SubCatAllData
              .manageDataPointSubCategorySeedID);
          this.getUnit(this.SubCatAllData
              .manageDataPointSubCategorySeedID);
      }

      if (catID == 2) {

          this.getsubCategoryType(this.SubCatAllData
              .manageDataPointSubCategorySeedID);
          this.getUnit(this.SubCatAllData
              .manageDataPointSubCategorySeedID);
      }

      if (catID == 3) {

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

      if (this.facilityID == 0) {
          this.notification.showInfo(
              'Select Facility',
              ''
          );
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
              formData.set('business_unit', form.value.businessunits);
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
              formData.set('business_unit', form.value.businessunits);
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
              formData.set('business_unit', form.value.businessunits);
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


  onInputEdit() {
      this.isInputEdited = true;
  };







 
  //resetForm method for resetting the form and clearing any selected values or input fields.
  resetForm() {
      this.dataEntryForm.resetForm();
      // this.fileUpload.clear();
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
