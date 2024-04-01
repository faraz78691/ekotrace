import { LoginInfo } from '@/models/loginInfo';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '@services/dashboard.service';
import { FacilityService } from '@services/facility.service';
import { TrackingService } from '@services/tracking.service';
import { ChartComponent } from 'ng-apexcharts';
import { Chart3Options } from '../business-travel/business-travel.component';
import { ChartOptions, ChartAreaOptions, ChartOptions2 } from '../ghg-emmissions/ghg-emmissions.component';

@Component({
  selector: 'app-water-usage',
  templateUrl: './water-usage.component.html',
  styleUrls: ['./water-usage.component.scss']
})
export class WaterUsageComponent {
  @ViewChild("ct_emission_by_travel") ct_emission_by_travel: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;
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
  scopeWiseSeries2: any[] = [];
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
  labelSeries1: any[] = [];

  constructor(private route: ActivatedRoute,
    private facilityService: FacilityService,
    private trackingService: TrackingService,
    private dashboardService: DashboardService) {
      this.year = new Date();

    this.groupChart = {
      series: [
        {
          name: "distibuted",
          data: [21, 21, 13, 30]
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
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#D10CE8"
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
          ["John"],
          ["Joe"],
          ["Jake"],
          ["Peter"],
      
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

   
    this.chartOptions2 = {
      series: [
        {
          name: "Net Emission",
          data: [44, 55, 57, 56, 61, 58, 63]
        }
  
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct"
        ]
      },
      yaxis: {
        title: {
          text: "$ (thousands)"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return "$ " + val + " thousands";
          }
        }
      }
    };
   
    
    this.donotOptions2 = {
      series:[44, 55, 13, 43, 22],
      chart: {
        width: 380,
        type: "donut"
      },
      dataLabels: {
        enabled: true
      },
      legend: {
        position: "bottom"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
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
        this.Waterwithdrawnby_source(this.selectedFacility);
        this.dashboardWaterDischargedbydestination(this.selectedFacility);
        this.dashboardWaterTreated_nonTreated(this.selectedFacility);
        // this.getTopFiveE(this.selectedFacility);
        //  this.getScopeDonnutsE(this.selectedFacility);
        //  this.getActivityE(this.selectedFacility);
        //  this.getVendorE(this.selectedFacility)
      }

    });
  };

  Waterwithdrawnby_source(facility) {
    console.log(this.selectedFacility);
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    console.log(this.year);
    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.Waterwithdrawnby_source(formData.toString()).subscribe((result: any) => {
      console.log(result);

      this.scopeWiseSeries = result.series[0].data;
      this.labelSeries1 = result.series;
      this.labelScopeDonut1 = result.categories;
      this.chartOptions = {
        series: [
          {
            name: "Net Emission",
            data: this.scopeWiseSeries
          }
        ],
        chart: {
          type: "bar",
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
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
          ]
        },
        yaxis: {
          title: {
            text: "$ (thousands)"
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return "$ " + val + " thousands";
            }
          }
        }
      };
     

     






    });
  };
 dashboardWaterDischargedbydestination(facility) {
    console.log(this.selectedFacility);
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    console.log(this.year);
    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.WaterDischargedbydestination(formData.toString()).subscribe((result: any) => {
      console.log(result);

      this.scopeWiseSeries2 = result.series[0].data;
      this.labelScopeDonut1 = result.categories;

      this.chartOptions2 = {
        series: [
          {
            name: "Net Emission",
            data: this.scopeWiseSeries
          }
        ],
        chart: {
          type: "bar",
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"]
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
          ]
        },
        yaxis: {
          title: {
            text: "$ (thousands)"
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function(val) {
              return "$ " + val + " thousands";
            }
          }
        }
      };






    });
  };

 dashboardWaterTreated_nonTreated(facility) {
    console.log(this.selectedFacility);
    let tenantId = this.loginInfo.tenantID;
    const formData = new URLSearchParams();
    console.log(this.year);
    // formData.set('year', this.year.getFullYear().toString());
    formData.set('year', this.year.getFullYear().toString());
    formData.set('facilities', facility);
    this.dashboardService.dashboardWaterTreated_nonTreated(formData.toString()).subscribe((result: any) => {
      console.log(result);

      this.seriesScopeDonut1 = result.water_treated_nontreated;
      this.labelScopeDonut1 = result.category;

      this.donotOptions1 = {
        series: this.seriesScopeDonut1,
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
          position: "bottom"
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
    






    });
  };

  onFacilityChange(event: any) {
    // console.log(event.target.value)
    // console.log(this.selectedFacility);
    // this.emssionByTravel(this.selectedFacility)
  };
}
