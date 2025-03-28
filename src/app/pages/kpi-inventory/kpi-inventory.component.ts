import { LoginInfo } from '@/models/loginInfo';
import { Component } from '@angular/core';
import { AppService } from '@services/app.service';
import { CompanyService } from '@services/company.service';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { ThemeService } from '@services/theme.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-kpi-inventory',
  templateUrl: './kpi-inventory.component.html',
  styleUrls: ['./kpi-inventory.component.scss']
})
export class KpiInventoryComponent {

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
  dataProgress: any[] = [];
  facilityData: any[] = [];
  savedData: any[] = [];
  selectedScope1: any[] = [];
  selectedScope2: any[] = [];
  selectedScope3: any[] = [];
  facilities: any;
  merrgeProgress: any[] = [];
  dataPreparerCustom: any;
  dataPreparer: any;
  defaultScope = false
  scope3OrderCategories = [
    { index: 0, name: 'Purchased goods and services' },
    { index: 1, name: 'Fuel and Energy-related Activities' },
    { index: 2, name: 'Upstream Transportation and Distribution' },
    { index: 3, name: 'Water Supply and Treatment' },
    { index: 4, name: 'Waste generated in operations' },
    { index: 5, name: 'Business Travel' },
    { index: 6, name: 'Employee Commuting' },
    { index: 7, name: 'Home Office' },
    { index: 8, name: 'Upstream Leased Assets' },
    { index: 9, name: 'Downstream Transportation and Distribution' },
    { index: 10, name: 'Processing of Sold Products' },
    { index: 11, name: 'Use of Sold Products' },
    { index: 12, name: 'End-of-Life Treatment of Sold Products' },
    { index: 13, name: 'Downstream Leased Assets' },
    { index: 14, name: 'Franchises' }

  ]


  transformedData: any[] = [];
  fuelsTypes: any[] = [];

  public loginInfo: LoginInfo;
  selectedFacility: any;
  scopesEmissions: any;
  totalData: number[] = [];
  scope1: number[] = Array(12).fill(0);
  scope2: number[] = Array(12).fill(0);
  scope3: number[] = Array(12).fill(0);
  totalEmissions: number[] = Array(12).fill(0);
  scope1Total:number=0
  scope2Total:number=0
  scope3Total:number=0
  totalAnually: number = 0;
  private totalUpdate$ = new Subject<number>();
  private inputSubjects: Subject<number>[] = Array(12).fill(null).map(() => new Subject<number>());
  months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  fuelData1:any[]=[];
  fuelData2:any[]=[];
  fuelData3:any[]=[];
  energyDataHeating:any[]=[];
  electricityData:any[]=[];
  renewElectricityData:any[]=[];
  selectedFuel1 = 2
  selectedFuel2 = 3
  selectedFuel3 = 4
  energyData: any;
  passengerPetrol: any;
  passenderDiesel:any;
  vehiclesOwnedEmission:any;
  vehiclesFreightEmission:any;
  businessTravelData: any;
  constructor(
    private companyService: CompanyService,
    private notification: NotificationService,
    private facilityService: FacilityService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private themeservice: ThemeService,
    private appService: AppService
  ) {
  
 


  }
  ngOnInit() {
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;
      
    }
    let tenantID = this.loginInfo.tenantID;
    this.superAdminId = this.loginInfo.super_admin_id;
    this.GetFacilityList(tenantID);
    this.getFuelsTypes()
    this.getKPiScopes()
    this.getFuelEmissions1(2)
    this.getFuelEmissions2(3)
    this.getFuelEmissions3(4)
    this.getEnergyEmissions()
    this.getPassengerTypeEmissions()
    this.getVehiclesEmissions()


  }



  GetFacilityList(tenantID: any) {
    this.facilityService
      .newGetFacilityByTenant(tenantID)
      .subscribe((res) => {
        if (res.length > 0) {

          this.facilityData = res;

        }
      });
  };

  onFacilitySelect($event: any) {
    throw new Error('Method not implemented.');
  };


  getFuelsTypes() {
    this.appService.getApi(`/GetSubCategoryTypes/${1}?facilityId=1`).subscribe((response: any) => {
      this.fuelsTypes = response.categories;

    })
  };

  getKPiScopes() {
    const formData = new URLSearchParams();
    formData.append('facilities', '1');
    formData.append('year', '2025');
    this.appService.postAPI(`/kpiInventory`, formData).subscribe((response: any) => {
      if (response && response.series) {
      this.scope1 = response.series[0].data;
      this.scope2 = response.series[1].data;
      this.scope3 = response.series[2].data;
    
      this.months.forEach((month, index) => {
        this.onInput(index)
      })
  
      this.sumScops()
      
 
        
      }
    })
  };
  getEnergyEmissions() {
  
    const formData = new URLSearchParams();
    formData.append('facilities', '1');
    formData.append('year', '2025');

    this.appService.postAPI(`/kpiInventoryEnergyUse`, formData).subscribe((response: any) => {
      console.log(response.data.heatingCooling);
      this.energyDataHeating = response.data.heatingCooling;
      this.electricityData = response.data.electricity;
      this.renewElectricityData = response.data.electricity;
     
    })
  };
  getPassengerTypeEmissions() {
  
    const formData = new URLSearchParams();
    formData.append('facilities', '1');
    formData.append('year', '2025');

    this.appService.postAPI(`/kpiInventoryPassengerVehicleEmission`, formData).subscribe((response: any) => {
      this.passenderDiesel = response.data.vehicle_diesel;
      this.passengerPetrol = response.data.vehicle_petrol;
      
   
     
    })
  };
  getFuelEmissions1(event) {
    const typeId = event;
    const formData = new URLSearchParams();
    formData.append('facilities', '1');
    formData.append('year', '2025');
    formData.append('type_id', typeId);
    this.appService.postAPI(`/kpiInventoryFuelConsumption`, formData).subscribe((response: any) => {
      this.fuelData1 = response.data;
     
    })
  };

  getFuelEmissions2(event) {
    const typeId = event;
    const formData = new URLSearchParams();
    formData.append('facilities', '1');
    formData.append('year', '2025');
    formData.append('type_id', typeId);
    this.appService.postAPI(`/kpiInventoryFuelConsumption`, formData).subscribe((response: any) => {
      this.fuelData2 = response.data;
    })
  };
  getFuelEmissions3(event) {
    const typeId = event;
    const formData = new URLSearchParams();
    formData.append('facilities', '1');
    formData.append('year', '2025');
    formData.append('type_id', typeId);
    this.appService.postAPI(`/kpiInventoryFuelConsumption`, formData).subscribe((response: any) => {
      this.fuelData3 = response.data;
    })
  };
  getVehiclesEmissions() {
 
    const formData = new URLSearchParams();
    formData.append('facilities', '1');
    formData.append('year', '2025');
    this.appService.postAPI(`/kpiInventoryTransportVehicle`, formData).subscribe((response: any) => {
      this.vehiclesOwnedEmission = response.data.owend_transport;
      this.vehiclesFreightEmission = response.data.freight_transport;
     
    })
  };
  getBusinessTravel() {
 
    const formData = new URLSearchParams();
    formData.append('facilities', '1');
    formData.append('year', '2025');
    this.appService.postAPI(`/kpiInventoryBusinessTravel`, formData).subscribe((response: any) => {
      this.businessTravelData = response.data
     
    })
  };

    onInput(index: number) {
      this.totalEmissions[index] =
        (Number(this.scope1[index]) || 0) +
        (Number(this.scope2[index]) || 0) +
        (Number(this.scope3[index]) || 0);

        this.sumScops()
    }


    sumScops(){
      this.scope1Total = this.scope1.reduce((sum, num) => sum + (Number(num) || 0), 0);
      this.scope2Total = this.scope2.reduce((sum, num) => sum + (Number(num) || 0), 0);
      this.scope3Total = this.scope3.reduce((sum, num) => sum + (Number(num) || 0), 0);

      this.totalAnually = this.scope1Total + this.scope2Total + this.scope3Total;
      // this.scope2.forEach(num => this.scope2Total += Number(num));
      // this.scope3.forEach(num => this.scope3Total += Number(num));
    }
 
      // Calculate the total row initially


}



