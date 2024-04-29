import { Component, OnDestroy, ViewChild } from '@angular/core';
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
import { Observable, Subscription, catchError, combineLatest, forkJoin, of, switchMap, tap } from 'rxjs';
import { facilities } from '@/models/dashboardFacilities';


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
export class GhgEmmissionsComponent implements OnDestroy {
  dashboardFacilities$ = new Observable<facilities>();
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
  selectedFacility: number;
  year: Date;
  scopeWiseSeries: any[] = [];
  progress1: any = '';
  progress2: any = '';
  progress3: any = '';
  scope1E: any = '';
  scope2E: any = '';
  scope3E: any = '';
  sumofScope2: any = '';
  series_graph: any[]
  topFIveE: any[];
  seriesScopeDonut1: any[] = [];
  seriesScopeDonut2: any[] = [];
  seriesScopeDonut3: any[] = [];
  labelScopeDonut1: any[] = [];
  labelScopeDonut2: any[] = [];
  labelScopeDonut3: any[] = [];
  upstreamArray: any[] = [];
  downstreamArray: any[] = [];
  vendorData: any[] = [];
  combinedSubscription: Subscription;


  constructor(private router: Router,
    private route: ActivatedRoute,
    private facilityService: FacilityService,
    private trackingService: TrackingService,
    private dashboardService: DashboardService) {
    this.year = new Date();
    console.log(this.year)
    this.loginInfo = new LoginInfo();

  };

  ngOnInit() {
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;
    }
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    formData.set('tenantID', tenantId.toString())
    this.dashboardFacilities$ = this.dashboardService.getdashboardfacilities(formData.toString()).pipe(
      tap(response => {
        this.selectedFacility = response.categories[0].ID;
        this.makeCombinedApiCall(this.selectedFacility)
      })
    );

    this.donotoptions = {
      series: [55, 45],
      chart: {
        width: "100%",
        height: 350,
        type: "donut"
      },
      dataLabels: {
        enabled: true
      },
      // fill: {
      //   type: "gradient"
      // },

      legend: {
        position: "bottom",
        fontSize: '15px',
        floating: false,
        horizontalAlign: 'left',
      },
      labels: ['Reduction', "Emission"],
      colors: ['#F3722C', '#0068F2', '#F8961E', '#ACE1AF', '#7BAFD4', '#B284BE'],
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


  };


  private createFormData(facility) {
    const formData = new URLSearchParams();
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    return formData;
  }


  // Combined method to make both API calls
  makeCombinedApiCall(facility) {
   
    const formData = this.createFormData(facility);

    // Create observables for both API calls
    const scopeWiseEmission$ = this.dashboardService.GScopeWiseEimssion(formData.toString()).pipe(
      catchError(error => {
        console.error('Error occurred in scopeWiseEmission API call:', error);
        return of(null); // Return null or default value in case of error
      })
    );
    const topWiseEmission$ = this.dashboardService.GTopWiseEimssion(formData.toString()).pipe(
      catchError(error => {
        console.error('Error occurred in topWiseEmission API call:', error);
        return of(null); // Return null or default value in case of error
      })
    );
    const getScopeSDonuts$ = this.dashboardService.getScopeDonutsER(formData.toString()).pipe(
      catchError(error => {
        console.error('Error occurred in topWiseEmission API call:', error);
        return of(null); // Return null or default value in case of error
      })
    );
    const getScopeActivity$ = this.dashboardService.GemissionActivity(formData.toString()).pipe(
      catchError(error => {
        console.error('Error occurred in topWiseEmission API call:', error);
        return of(null);
      })
    );

    const formVendorData = new URLSearchParams();
    formVendorData.set('facilities', facility);
    const GVEndorActivity$ = this.dashboardService.GVEndorActivity(formVendorData.toString()).pipe(
      catchError(error => {
        console.error('Error occurred in topWiseEmission API call:', error);
        return of(null);
      })
    );

    // Combine both observables using combineLatest and return the combined observable
    this.combinedSubscription = combineLatest([
      scopeWiseEmission$,
      topWiseEmission$,
      getScopeSDonuts$,
      getScopeActivity$,
      GVEndorActivity$
    ]).subscribe((results: [any, any, any, any, any]) => {
      const [scopeWiseResult, topWiseResult, getScopeSDonuts, getScopeActivity, getVendorE] = results;



      // Process the results of both API calls here
      if (scopeWiseResult) {
        // Handle scopeWise result
        this.handleScopeWiseResult(scopeWiseResult);
      } else {
        // Handle absence of scopeWise result or error
      }

      if (topWiseResult) {
        // Handle topWise result
        this.topFIveE = topWiseResult.top5Emissions;
      } else {
        // Handle absence of topWise result or error
      }
      if (getScopeSDonuts) {
        this.seriesScopeDonut1 = getScopeSDonuts.seriesScope1;
        this.seriesScopeDonut2 = getScopeSDonuts.seriesScope2;
        this.seriesScopeDonut3 = getScopeSDonuts.seriesScope3;
        this.labelScopeDonut1 = getScopeSDonuts.labelScope1;
        this.labelScopeDonut2 = getScopeSDonuts.labelScope2;
        this.labelScopeDonut3 = getScopeSDonuts.labelScope3;

        this.donotOptions1 = {
          series: this.seriesScopeDonut1,
          chart: {
            width: "100%",
            height: 350,
            type: "donut"
          },
          dataLabels: {
            enabled: true
          },
          // fill: {
          //   type: "gradient"
          // },

          legend: {
            position: "bottom",
            fontSize: '15px',
            floating: false,
            horizontalAlign: 'left',
          },
          labels: this.labelScopeDonut1,
          colors: ['#F3722C', '#0068F2', '#F8961E'],
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
            width: "100%",
            height: 320,
            type: "donut"
          },
          dataLabels: {
            enabled: true
          },
          // fill: {
          //   type: "gradient"
          // },
          legend: {
            position: "bottom",
            fontSize: '15px',
            floating: false,
            horizontalAlign: 'left',
          },
          colors: ['#F3722C', '#0068F2', '#F8961E', '#ACE1AF', '#7BAFD4', '#B284BE','#98817B'],
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
        if (this.seriesScopeDonut3.length > 5) {
          var height = 430;
        } else {
          height = 360;
        };
        this.donotOptions3 = {
          series: this.seriesScopeDonut3,
          chart: {
            width: "100%",
            height: height,
            type: "donut"
          },
          dataLabels: {
            enabled: true
          },
          // fill: {
          //   type: "gradient"
          // },
          legend: {
            position: "bottom",
            fontSize: '14px',
            floating: false,
            horizontalAlign: 'left',
          },
          colors: ['#F3722C', '#0068F2', '#F4C430', '#ACE1AF', '#7BAFD4', '#B284BE'],
          labels: this.labelScopeDonut3,
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
      }
      if (getScopeActivity) {
        this.upstreamArray = getScopeActivity.upstream;
        this.downstreamArray = getScopeActivity.downstrem;
      }
      if (getVendorE) {
        this.vendorData = getVendorE.purchaseGoods
      }
    });
  };

  // Handle the scopeWiseResult
  handleScopeWiseResult(scopeWiseResult: any) {
  
    this.scopeWiseSeries = scopeWiseResult.series;
    this.series_graph = scopeWiseResult.series_graph;
    this.sumofScope2 = scopeWiseResult.scope1 + scopeWiseResult.scope2 + scopeWiseResult.scope3;
    this.scope1E = scopeWiseResult.scope1;
    this.scope2E = scopeWiseResult.scope2;
    this.scope3E = scopeWiseResult.scope3;
    const sumofScope = this.sumofScope2;
    this.progress1 = (scopeWiseResult.scope1 / sumofScope) * 100;
    this.progress2 = (scopeWiseResult.scope2 / sumofScope) * 100;
    this.progress3 = (scopeWiseResult.scope3 / sumofScope) * 100;

    this.chartOptions = {
      dataLabels: {
        enabled: false
      },
      legend: {
    fontSize:'12px'
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
            fontSize:'12px',
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
                fontSize: '12px',
                fontWeight: 900
              },
              formatter: function(val) {
                const numericValue = parseFloat(val);
                return numericValue.toFixed(2);
              }
            }
          }
        },
      },
      xaxis: {
        labels:{
          style:{
            fontSize:'12px'
          }
        },
        categories: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
      },
      yaxis:{
        labels:{
          style:{
            fontSize:'13px'
          }
        },
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
  }



  onFacilityChange(event: any) {
  
    this.makeCombinedApiCall(this.selectedFacility)
    // console.log(event.target.value)
    // console.log(this.selectedFacility);
    // this.GScopeWiseE(this.selectedFacility)
    // this.getTopFiveE(this.selectedFacility);
  };

  ngOnDestroy(): void {
    this.combinedSubscription.unsubscribe();
  }



}
