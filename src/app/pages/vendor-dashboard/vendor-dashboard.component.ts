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
  vendorData:any[]= [];


  labelScopeDonut2: any[] = [];
  businessClass: any[] = [];
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
          "shortBy": "Rank high to Low"
      },
      {
          "id": 2,
          "shortBy": "Rank by Emisissions"
      },
      {
          "id": 3,
          "shortBy": "Rank by Emissions to Expense Ratio"
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
   
      this.getVendorDash();
      this.getVendorLocation();
    }
  };


  getVendorDash() {
    let tenantId = this.loginInfo.tenantID;
    this.facilityService.getVendorDashboard().subscribe((response:any) => {
        if(response.success == true){
this.vendorData = response.vendorWiseEmission;
        }
       
    });
  }
  getVendorLocation() {
    let tenantId = this.loginInfo.tenantID;
    this.facilityService.getVendorLocation().subscribe((response:any) => {
        if(response.success == true){
this.businessClass = response.renewable;
this.labelScopeDonut2 = response.series;
this.pieChart = {
    series: this.businessClass,
    chart: {
      width: "100%",
      height: 350,
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
  }
}
