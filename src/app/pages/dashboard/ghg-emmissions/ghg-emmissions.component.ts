import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FacilityService } from '@services/facility.service';
import { TrackingService } from '@services/tracking.service';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill,
  ApexNonAxisChartSeries,
  ApexGrid,
  ApexStroke,
  ApexTitleSubtitle,
  ApexMarkers,
  ApexYAxis,
  ApexTooltip
} from "ng-apexcharts";

import { DashboardService } from '@services/dashboard.service';
import { LoginInfo } from '@/models/loginInfo';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
  colors: any;
  stroke: ApexStroke;
  labels: any;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
  markers: ApexMarkers
};
export type ChartOptions2 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
  grid: ApexGrid;
  stroke: ApexStroke;
  colors: any;
  labels: any;
};
export type ChartAreaOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  colors: any
};
@Component({
  selector: 'app-ghg-emmissions',
  templateUrl: './ghg-emmissions.component.html',
  styleUrls: ['./ghg-emmissions.component.scss']
})
export class GhgEmmissionsComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public carbonFootvarOptions: Partial<ChartOptions>;
  public donotoptions: Partial<ChartOptions2>;
  public lineoptions: Partial<ChartOptions>;
  public previoucsOptions: Partial<ChartOptions2>;
  public areaBusinesschart: Partial<ChartAreaOptions>;
  public donotOptions1: Partial<ChartOptions2>;
  public donotOptions2: Partial<ChartOptions2>;
  public donotOptions3: Partial<ChartOptions2>;
  dashboardData: any[] = [];
  public loginInfo: LoginInfo;
  selectedFacility = '';
  year: Date;
  scopeWiseSeries: any[] = [];
  progress1: any = '';
  progress2: any = '';
  progress3: any = '';
  scope1E: any = '';
  scope2E: any = '';
  scope3E: any = '';
  sumofScope2:any='';
  series_graph:any[]
  topFIveE:any[];
  seriesScopeDonut1:any[]=[];
  seriesScopeDonut2:any[]=[];
  seriesScopeDonut3:any[]=[];
  labelScopeDonut1:any[]=[];
  labelScopeDonut2:any[]=[];
  labelScopeDonut3:any[]=[];
  upstreamArray:any[]=[];
  downstreamArray:any[]=[];
  vendorData:any[]=[];



  constructor(private router: Router,
    private route: ActivatedRoute,
    private facilityService: FacilityService,
    private trackingService: TrackingService,
    private dashboardService: DashboardService) {
    this.year = new Date();
    this.loginInfo = new LoginInfo();

  };

  ngOnInit() {
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;
    }
    this.GetAllfacilities();
  };

  GScopeWiseE(facility) {
    console.log(this.selectedFacility);
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.GScopeWiseEimssion(formData.toString()).subscribe((result: any) => {
    
      this.scopeWiseSeries = result.series;
      this.series_graph = result.series_graph
      const sumofScope = parseInt(result.scope1) + parseInt(result.scope2) + parseInt(result.scope3);
      this.sumofScope2 = (result.scope1)+(result.scope2)+(result.scope3);
    
      this.scope1E = result.scope1;
      this.scope2E = result.scope2;
      this.scope3E = result.scope3;
      this.progress1 = (result.scope1 / sumofScope) * 100;
      this.progress2 = (result.scope2 / sumofScope) * 100;
      this.progress3 = (result.scope3 / sumofScope) * 100;
     
      this.chartOptions = {
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false,
          position: 'top',
          offsetY: 0
        },
        colors: ['#213D49', '#46A5CD', '#FFD914'],
        series: this.scopeWiseSeries,
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: true
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],

        plotOptions: {
          bar: {
            columnWidth: '40%',
            horizontal: false,
            borderRadius: 8,
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: '13px',
                  fontWeight: 900
                }
              }
            }
          },
        },

        xaxis: {
          categories: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
        },
        fill: {
          opacity: 1
        }
      };
       this.previoucsOptions = {
        dataLabels: {
          enabled: false
        },
        series: this.series_graph,
        chart: {
          // width: 380,
          width: '220',
          // height:'200',
          type: 'pie',
        },
        legend: {
          show: true,
          position: 'bottom',
          offsetY: 0
        },
        colors: ['#213D49', '#46A5CD', '#FFD914'],
        labels: ['Scope 1', 'Scope 2', 'Scope 3'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
          }
        }]
      };

      // this.admininfoList = result;


    });
  };

  GetAllfacilities() {
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    formData.set('tenantID', tenantId.toString())
    this.dashboardService.getdashboardfacilities(formData.toString()).subscribe((result: any) => {
      console.log(result);
      if(result.success == true){
        this.dashboardData = result.categories;
        this.selectedFacility = this.dashboardData[0].ID;
        this.GScopeWiseE(this.selectedFacility);
        this.getTopFiveE(this.selectedFacility);
         this.getScopeDonnutsE(this.selectedFacility);
         this.getActivityE(this.selectedFacility);
         this.getVendorE(this.selectedFacility)
      }

    });
  };

  getTopFiveE(facility) {
    console.log(this.selectedFacility);
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.GTopWiseEimssion(formData.toString()).subscribe((result: any) => {
      
      this.topFIveE = result.top5Emissions;
    });
  };

  getScopeDonnutsE(facility) {
    console.log(this.selectedFacility);
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.getScopeDonutsER(formData.toString()).subscribe((result: any) => {
      console.log(result)
      this.seriesScopeDonut1 = result.seriesScope1;
      this.seriesScopeDonut2 = result.seriesScope2;
      this.seriesScopeDonut3 = result.seriesScope3;
      this.labelScopeDonut1 = result.labelScope1;
      this.labelScopeDonut2 = result.labelScope2;
      this.labelScopeDonut3 = result.labelScope3;

      this.donotOptions1 = {
        series: this.seriesScopeDonut1,
        chart: {
          width: 380,
          type: "donut"
        },
        dataLabels: {
          enabled: false
        },
        fill: {
          type: "gradient"
        },
        legend: {
          position: 'bottom',
          // horizontalAlign: 'center', 

          // formatter: function(val, opts) {
          //   return val + " - " + opts.w.globals.series[opts.seriesIndex];
          // }
        },
        labels: this.labelScopeDonut1,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      };
      this.donotOptions2 = {
        series: this.seriesScopeDonut2,
        chart: {
          width: 380,
          type: "donut"
        },
        dataLabels: {
          enabled: true
        },
        fill: {
          type: "gradient"
        },
        legend: {
          formatter: function(val, opts) {
            return val + " - " + opts.w.globals.series[opts.seriesIndex];
          }
        },
        labels: this.labelScopeDonut2,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      };
      this.donotOptions3 = {
        series: this.seriesScopeDonut3,
        chart: {
          width: 540,
          type: "donut"
        },
        dataLabels: {
          enabled: true
        },
        fill: {
          type: "gradient"
        },
        legend: {
          formatter: function(val, opts) {
            return val + " - " + opts.w.globals.series[opts.seriesIndex];
          }
        },
        labels: this.labelScopeDonut3,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "top"
              }
            }
          }
        ]
      };
    },
    (err)=>{
      console.log(err)
    });
  };

  onFacilityChange(event: any) {
    // console.log(event.target.value)
    // console.log(this.selectedFacility);
    this.GScopeWiseE(this.selectedFacility)
    this.getTopFiveE(this.selectedFacility);
    this.getVendorE(this.selectedFacility)
this.getScopeDonnutsE(this.selectedFacility)
this.getActivityE(this.selectedFacility)
  };

  getActivityE(facility) {
    console.log(this.selectedFacility);
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.GemissionActivity(formData.toString()).subscribe((result: any) => {
      
      this.upstreamArray = result.upstream;
      this.downstreamArray = result.downstrem;
    });
  };

  getVendorE(facility) {
    console.log(this.selectedFacility);
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    formData.set('facilities', facility);
    this.dashboardService.GVEndorActivity(formData.toString()).subscribe((result: any) => {
      this.vendorData = result.purchaseGoods
    
    });
  };
}
