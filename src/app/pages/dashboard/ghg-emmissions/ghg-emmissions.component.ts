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


    this.areaBusinesschart = {
      colors: ['#213D49', '#46A5CD'],
      series: [{
        name: 'Type 1',
        data: [44, 55, 41, 64, 22, 43, 21, 43, 21]
      }, {
        name: 'Type 2',
        data: [53, 32, 33, 52, 13, 44, 32, 44, 32]
      }],
      chart: {
        type: 'bar',
        height: 430
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: 'top',
          },
        }
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: '12px',
          colors: ['#fff']
        }
      },
      stroke: {
        show: true,
        width: 1,
        colors: ['#fff']
      },
      tooltip: {
        shared: true,
        intersect: false
      },
      xaxis: {
        categories: [0, 1.25, 2.5, 3.75, 5, 6.25, 7.5, 8.75, 10],
      },

    };


    this.carbonFootvarOptions = {
      series: [{
        name: 'Carbon Footprint',
        data: [1.45, 5.42, 5.9, -0.42, -12.6, -18.1, -18.2, -14.16, -11.1, -6.09, 0.34, 3.88, 13.07,
          5.8, 2, 7.37, 8.1, 13.57, 15.75, 17.1, 19.8, -27.03, -54.4, -47.2, -43.3, -18.6, -
          48.6, -41.1, -39.6, -37.6, -29.4, -21.4, -2.4
        ]
      }],
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          colors: {
            ranges: [{
              from: -100,
              to: -46,
              color: '#F94144'
            }, {
              from: -45,
              to: 0,
              color: '#90BE6D'
            }, {
              from: -40,
              to: 0,
              color: '#2D9CDB'
            }]
          },
          columnWidth: '25%',
        }
      },
      dataLabels: {
        enabled: false,
      },
      yaxis: {

        labels: {
          formatter: function (y) {
            return y.toFixed(0) + "%";
          }
        }
      },
      xaxis: {
        type: 'datetime',
        categories: [
          '2011-01-01', '2011-02-01', '2011-03-01', '2011-04-01', '2011-05-01', '2011-06-01',
          '2011-07-01', '2011-08-01', '2011-09-01', '2011-10-01', '2011-11-01', '2011-12-01',
          '2012-01-01', '2012-02-01', '2012-03-01', '2012-04-01', '2012-05-01', '2012-06-01',
          '2012-07-01', '2012-08-01', '2012-09-01', '2012-10-01', '2012-11-01', '2012-12-01',
          '2013-01-01', '2013-02-01', '2013-03-01', '2013-04-01', '2013-05-01', '2013-06-01',
          '2013-07-01', '2013-08-01', '2013-09-01'
        ],
        labels: {
          rotate: -90
        }
      }
    };




    this.lineoptions = {
      series: [
        {
          name: "Scope 1",
          data: [28, 29, 33, 36, 32, 32, 33]
        },
        {
          name: "Scope 2",
          data: [12, 11, 14, 18, 17, 13, 13]
        }
      ],
      chart: {
        height: 350,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      colors: ['#075101', '#0534AD'],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: 'Average High & Low Temperature',
        align: 'left'
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      markers: {
        size: 1
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        title: {
          text: 'Month'
        }
      },
      yaxis: {
        title: {
          text: 'Temperature'
        },
        min: 5,
        max: 40
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };

    this.donotoptions = {
      series: [44, 55],
      chart: {
        width: 360,
        height: 900,
        type: 'donut',
      },
      dataLabels: {
        enabled: true
      },
      legend: {
        formatter: function(val, opts) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex];
        }
      },
      fill: {
        type: "gradient"
      },
      colors: ['#DC6B52', '#17B4B4'],
     

      labels: ['Reductions 1', 'Emissions'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 260
          },

        }
      }]
    };
  

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
          width: 450,
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
