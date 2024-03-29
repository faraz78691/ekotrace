import { LoginInfo } from '@/models/loginInfo';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '@services/dashboard.service';
import { FacilityService } from '@services/facility.service';
import { TrackingService } from '@services/tracking.service';
import { ApexAxisChartSeries, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexPlotOptions, ApexStroke, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";

// type ApexXAxis = {
//   type?: "category" | "datetime" | "numeric";
//   categories?: any;
//   labels?: {
//     style?: {
//       colors?: string | string[];
//       fontSize?: string;
//     };
//   };
// };

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
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

export type Chart3Options = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
};
@Component({
  selector: 'app-business-travel',
  templateUrl: './business-travel.component.html',
  styleUrls: ['./business-travel.component.scss']
})
export class BusinessTravelComponent {
  @ViewChild("ct_emission_by_travel") ct_emission_by_travel: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public secondChart: Partial<ChartOptions>;
  public thirdChart: Partial<ChartOptions>;
  public fourChart: Partial<ChartOptions>;
  public areachart: Partial<ChartAreaOptions>;
  public areaBusinesschart: Partial<ChartAreaOptions>;
  public donotOptions1: Partial<ChartOptions2>;
  public donotOptions2: Partial<ChartOptions2>;
  public pieChart: Partial<ChartOptions2>;
  public groupChart: Partial<Chart3Options>;
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
  sumofScope2: any = '';
  series_graph: any[]
  topFIveE: any[];
  seriesScopeDonut1: any[] = [];
  barGraph1: any[] = [];
  seriesScopeDonut2: any[] = [];
  seriesScopeDonut3: any[] = [];
  labelScopeDonut1: any[] = [];
  labelScopeDonut2: any[] = [];
  labelScopeDonut3: any[] = [];
  upstreamArray: any[] = [];
  downstreamArray: any[] = [];
  vendorData: any[] = [];
  businessClass:any[]= [];
  businessType:any[]= [];
  groundLabel:any[]= [];
  groundSeries:any[]= [];

  constructor(private route: ActivatedRoute,
    private facilityService: FacilityService,
    private trackingService: TrackingService,
    private dashboardService: DashboardService) {
      this.year = new Date();

   

    this.donotOptions2 = {
      series:[21, 21, 13, 30],
      chart: {
        width: 380,
        type: "donut"
      },
      dataLabels: {
        enabled: true
      },
      legend: {
        position: "bottom",
        fontSize: '15px',
        floating: false,
        horizontalAlign: 'left', 
        
      },
      labels: [
        "EAMC", "COST"
      ],
      colors: ['#F3722C', '#0068F2', '#FFD914'],
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
   
    
  







  };

  ngOnInit() {
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo); // string to "any" object first
      this.loginInfo = jsonObj as LoginInfo;
    }
    this.GetAllfacilities();
  };

  GetAllfacilities() {
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    formData.set('tenantID', tenantId.toString())
    this.dashboardService.getdashboardfacilities(formData.toString()).subscribe((result: any) => {
      console.log(result);
      if (result.success == true) {
        this.dashboardData = result.categories;
        this.selectedFacility = this.dashboardData[0].ID;
        this.emssionByTravel(this.selectedFacility);
        this.totalEmissionByMonth(this.selectedFacility)
        this.emssionByTypeANDClass(this.selectedFacility)
        this.BygroundTravel(this.selectedFacility)
  
      }

    });
  };

  emssionByTravel(facility) {
    console.log(this.selectedFacility);
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    console.log(this.year);
    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.GEByTravel(formData.toString()).subscribe((result: any) => {
      console.log(result);

      this.scopeWiseSeries = result.series;
      this.labelScopeDonut1 = result.categories;


      this.donotOptions1 = {
        series: this.scopeWiseSeries,
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
          position: "bottom",
          fontSize: '15px',
          floating: false,
          horizontalAlign: 'left', 
        },
        colors: ['#246377', '#009087', '#002828', '#F9C74F'],
        labels: this.labelScopeDonut1,
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






    });
  };

  totalEmissionByMonth(facility) {
    console.log(this.selectedFacility);
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    console.log(this.year);
    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.businessTravelByMonth(formData.toString()).subscribe((result: any) => {
      console.log(result);

      this.barGraph1 = result.series[0].data;
      this.labelScopeDonut1 = result.categories;


      this.chartOptions = {
        series: [
          {
            name: "Inflation",
            data: this.barGraph1
          }
        ],
        chart: {
          height: 350,
          type: "bar"
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: "top" // top, center, bottom
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + "%";
          },
          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#304758"]
          }
        },
  
        xaxis: {
          categories: [
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
            "Jan",
            "Feb",
            "Mar"
          ],
          position: "bottom",
          labels: {
            offsetY: 0
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            fill: {
              type: "gradient",
              gradient: {
                colorFrom: "#D8E3F0",
                colorTo: "#BED1E6",
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5
              }
            }
          },
          tooltip: {
            enabled: true,
            offsetY: -35
          }
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            // stops: [50, 0, 100, 100]
          }
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          labels: {
            show: false,
            formatter: function (val) {
              return val + "%";
            }
          }
        },
      };






    });
  };

  emssionByTypeANDClass(facility) {
    console.log(this.selectedFacility);
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.businessdashboardemssionByAir(formData.toString()).subscribe((result: any) => {
      console.log(result);

      this.businessType = result.flight_type_series;
      this.businessClass = result.flight_class_series;
      this.labelScopeDonut1 = result.flight_type;
      this.labelScopeDonut2 = result.flight_class;

      this.donotOptions1 = {
        series: this.businessType,
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
          position: "bottom",
          fontSize: '15px',
          floating: false,
          horizontalAlign: 'left', 
        },
        colors: ['#246377', '#009087', '#002828', '#F9C74F'],
        labels: this.labelScopeDonut1,
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

     
      this.pieChart = {
        series: this.businessClass,
        chart: {
          width: 380,
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
  

    });
  };

  BygroundTravel(facility) {
    console.log(this.selectedFacility);
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.BygroundTravel(formData.toString()).subscribe((result: any) => {
      console.log(result);

      this.groundSeries = result.series;
      this.groundLabel = result.categories;
     

      this.groupChart = {
        series: [
          {
            name: "distibuted",
            data: this.groundSeries
          }
        ],
        chart: {
          height: 350,
          type: "bar",
          events: {
            click: function (chart, w, e) {
              // console.log(chart, w, e)
            }
          }
        },
        colors: [
          "#246377",
          "#F9C74F",
          "#009087",
          "#002828"
        ],
        plotOptions: {
          bar: {
            columnWidth: "45%",
            distributed: true
          }
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false
        },
        grid: {
          show: false
        },
        xaxis: {
          categories: [
            ["Car"],
            ["Bus"],
            ["Rail"],
            ["Auto"],
        
          ],
          labels: {
            style: {
              colors: [
                "#008FFB",
                "#00E396",
                "#FEB019",
                "#FF4560",
                "#775DD0",
                "#546E7A",
                "#26a69a",
                "#D10CE8"
              ],
              fontSize: "12px"
            }
          }
        }
      };

     
    
  

    });
  };

  onFacilityChange(event: any) {
    // console.log(event.target.value)
    // console.log(this.selectedFacility);
    this.emssionByTravel(this.selectedFacility)
    this.totalEmissionByMonth(this.selectedFacility)
    this.emssionByTypeANDClass(this.selectedFacility)
    this.BygroundTravel(this.selectedFacility)
  };

}