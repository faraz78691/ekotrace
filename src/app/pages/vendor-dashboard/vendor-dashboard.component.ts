import { LoginInfo } from '@/models/loginInfo';
import { Component } from '@angular/core';
import { DashboardService } from '@services/dashboard.service';
import { FacilityService } from '@services/facility.service';
import { ThemeService } from '@services/theme.service';
import { ApexNonAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexResponsive, ApexXAxis, ApexLegend, ApexFill, ApexGrid, ApexStroke } from 'ng-apexcharts';


export type ChartOptions2 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
  grid: ApexGrid;
  stroke: ApexStroke;
  colors: any;
  labels: any;
};
@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss']
})
export class VendorDashboardComponent {
  // flightsTravelTypes:any[]= []
  public loginInfo: LoginInfo;
  public pieChart: Partial<ChartOptions2>;
  public pieChart2: Partial<ChartOptions2>;
  vendorData: any[] = [];
  dashboardData: any[] = [];
  originalData: any[] = [];
  selectedFacility: any[] = [];
  selectedProduct: any[] = [];
  labelScopeDonut2: any[] = [];
  businessClass: any[] = [];
  productsSeries: any[] = [];
  productsEmission: any[] = [];
  allVendorReport:any;

  flightsTravelTypes =
    [
      {
        "id": 1,
        "flightType": "Standard Goods"
      },
      {
        "id": 2,
        "flightType": "Capital Goods"
      },
      {
        "id": 3,
        "flightType": "Standard Services"
      }

    ];

  shortBy =
    [

      {
        "id": 1,
        "shortBy": "High to Low"
      },
      {
        "id": 2,
        "shortBy": "Low to High"
      }
    ];
  rankBy =
    [

      {
        "id": 1,
        "shortBy": "Emissions"
      },
      {
        "id": 2,
        "shortBy": "Emissions to Expense Ratio"
      }
    ];
  Show =
    [

      {
        "id": 1,
        "Show": "Top 5"
      },
      {
        "id": 2,
        "Show": "Top 10"
      },
      {
        "id": 3,
        "Show": "Top 15"
      }

    ];

  constructor(
    private themeservice: ThemeService,
    private facilityService: FacilityService,
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.loginInfo = new LoginInfo();
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;


      this.getVendorLocation();
      this.GetAllfacilities();
      this.getEmissionProducts();
    }
  };


  getVendorDash(id: any) {
    const formData = new URLSearchParams();
    formData.set('facilities', id)
    this.facilityService.getVendorDashboard(formData).subscribe((response: any) => {
      if (response.success == true) {
        this.originalData = response.vendorWiseEmission
        this.vendorData = response.vendorWiseEmission;
        this.allVendorReport = response
      }

    });
  };
  GetAllfacilities() {
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    formData.set('tenantID', tenantId.toString());

    this.dashboardService.getdashboardfacilities(formData.toString()).subscribe((result: any) => {
      if (result.success) {
        this.dashboardData = result.categories;

        // Initialize selectedFacility with the first ID as default
        this.selectedFacility = this.dashboardData.length ? [this.dashboardData[0].ID] : [];

        // Call getVendorDash with the selected value
        this.getVendorDash(this.selectedFacility);
      }
    });
  }


  getVendorLocation() {
    let tenantId = this.loginInfo.tenantID;
    this.facilityService.getVendorLocation().subscribe((response: any) => {
      if (response.success == true) {
        this.businessClass = response.renewable;
        this.labelScopeDonut2 = response.series;
        this.pieChart = {
          series: this.businessClass,
          chart: {
            width: "100%",
            height: 250,
            type: "pie",

          },
          legend: {
            position: "bottom",
            fontSize: '15px',
            floating: false,
            horizontalAlign: 'left',

          },
          labels: this.labelScopeDonut2,
          colors: ['#246377', '#009087', '#002828', '#F9C74F'],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 300
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        };
      }

    });
  };


  getEmissionProducts() {

    this.facilityService.getEmissionProducts().subscribe((response: any) => {
      if (response.success == true) {
        this.productsSeries = response.emissions.map(items=>items.Product);
        this.productsEmission = response.emissions.map(items=>Number(items.emission));
     console.log(  this.productsSeries);
     console.log(  this.productsEmission);
        this.pieChart2 = {
          series: this.productsEmission,
          chart: {
            width: "100%",
            height: 250,
            type: "pie",

          },
          legend: {
            position: "bottom",
            fontSize: '15px',
            floating: false,
            horizontalAlign: 'left',

          },
          labels: this.productsSeries,
          colors: ['#246377', '#009087', '#002828', '#F9C74F','#F9C74F'],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 300
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        };
      }

    });
  };

  onFacilityChange(event: any) {

    this.getVendorDash(this.selectedFacility)
  };
  onProductChange() {

    if (this.selectedProduct.length > 0) {
      const filtered = this.originalData.filter(item =>
        this.selectedProduct.includes(item.typesofpurchasename)
      );

      this.vendorData = filtered
    } else {
      this.vendorData = this.originalData
    }

  }
  onSortChange(event:any) {
    const sortVal = event.value;

    if (sortVal) {
      const filtered = this.sortDataByEmission(sortVal)

      this.vendorData = filtered
    } else {
      this.vendorData = this.originalData
    }

  };

  sortDataByEmission(order: string) {
    const sortedData = [...this.originalData].sort((a, b) => {
      const emissionA = parseFloat(a.perVenderEmission);
      const emissionB = parseFloat(b.perVenderEmission);
  
      if (order === 'Low to High') {
        return emissionA - emissionB; // Ascending order
      } else if (order === 'High to Low') {
        return emissionB - emissionA; // Descending order
      } else {
        return 0; // No sorting if order is invalid
      }
    });
  
    console.log(sortedData); // Sorted data for debugging
    return sortedData; // Return sorted data for further use
  }
}
