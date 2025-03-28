import { LoginInfo } from '@/models/loginInfo';
import { Component } from '@angular/core';
import { AppService } from '@services/app.service';

import { DashboardService } from '@services/dashboard.service';
import { FacilityService } from '@services/facility.service';
import { ThemeService } from '@services/theme.service';
import { ApexNonAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexResponsive, ApexXAxis, ApexLegend, ApexFill, ApexGrid, ApexStroke, ApexAxisChartSeries, ApexYAxis } from 'ng-apexcharts';

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

export type ChartOptions = {
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
  selector: 'app-kpi-dashboard',
  templateUrl: './kpi-dashboard.component.html',
  styleUrls: ['./kpi-dashboard.component.scss']
})
export class KpiDashboardComponent {
 // flightsTravelTypes:any[]= []
  public loginInfo: LoginInfo;
  public pieChart: Partial<ChartOptions2>;
  public pieChart2: Partial<ChartOptions2>;
  facilityData: any[] = [];
  targerKpisData: any[] = [];
graph1:any;
graph2:any;
graph3:any;
graph4:any;
graph5:any;
graph6:any;
graph7:any;
graph8:any;

kpiList:any[]=[]






  dateFormat =
    [

      {
        id: 1,
        shortBy: "Annually"
      },
      {
        id: 2,
        shortBy: "Quaterly"
      },
      {
        id: 3,
        shortBy: "Monthly"
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
visible2: boolean = false;
  visible: boolean = false;
  FormEdit: boolean = false;

  constructor(
    private themeservice: ThemeService,
    private facilityService: FacilityService,
    private dashboardService: DashboardService,
    private appService: AppService
  ) { }

  ngOnInit() {
    this.loginInfo = new LoginInfo();
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo);
      this.loginInfo = jsonObj as LoginInfo;
      this.GetAllFacility();
      this.getKPIList();
      this.graph1 = this.getBarGraphOptions([104, 179, 65, 21, 89,2.5, 74, 27, 1, 129,123,20], ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] , '#FFEBB2');
      this.graph2 = this.getBarGraphOptions([167, 39, 97, 57, 123,20, 5, 2, 6.2, 3,45,77], ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], '#D4E157');
      this.graph3 = this.getBarGraphOptions([130, 159, 69, 193, 89 ,129, 43, 153, 67,54,199], ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],  '#B2EBF2');
      this.graph4 = this.getBarGraphOptions([97, 129, 43, 153, 67,130, 159, 69, 193, 89,7, 21], ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], '#FFCCBC');
      this.graph5 = this.getBarGraphOptions([20, 5, 2, 6.2, 3,167, 239, 97, 257,32,43, 153, ], ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], '#FFCDD2');
      this.graph6 = this.getBarGraphOptions([2.5, 74, 27, 1, 129, 2.5, 74, 27, 1, 129,74, 27], ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], '#C5E1A5');
      this.graph7 = this.getBarGraphOptions([6.2, 7, 21, 15, 32,2.5, 74, 27, 1, 129, 97, 257], ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], '#CE93D8' );
      this.graph8 = this.getBarGraphOptions([167, 239, 97, 257,32 ,97, 129, 43, 153, 67,54,19 ], ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],  '#FFDDC1');
    
      for (let i = 1; i <= 8; i++) {
        this.targerKpisData.push({
            id: i,
            kpiId: null,
            target:null ,
            unit: null,
            target_type: null,
          
        });;
    };
    }
  };




 
  GetAllFacility() {
    let tenantId = this.loginInfo.tenantID;
    this.facilityService.newGetFacilityByTenant(tenantId).subscribe((response) => {
      this.facilityData = response;
      // this.GetAssignedDataPoint(this.facilityData[0].id)

    });
  };

  getKPIList() {
    let tenantId = this.loginInfo.tenantID;
    this.appService.getApi('/kpiItemsList').subscribe((response:any) => {
      this.kpiList = response.data;
     

    });
  };

  onKpiChange(kpiId: any, row: any) {
    const unit = this.kpiList.find((item) => item.id == kpiId).unit;
    this.targerKpisData[row].unit = unit;
  };


  pushTargetKpis() {
    this.targerKpisData.push({
        id: this.targerKpisData.length + 1,
        kpiId: null,
        target:null ,
        unit: null,
        target_type: null,
      
    });;
  };



  getBarGraphOptions(series:any[], label:any[], color:any) {
    return {

          series: [
            {
              name: "distibuted",
              data: series
            }
          ],
          chart: {
            height: 350,
            type: "bar",
            events: {
              click: function(chart, w, e) {
                // console.log(chart, w, e)
              }
            }
          },
          colors: [
            color
        
          
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
              ["Jan"],
              ["Feb"],
              ["Mar"],
              ["Apr"],
              ["May"],
              ["Jun"],
              ["Jul"],
              ["Aug"],
              ["Sep"],
              ["Oct"],
              ["Nov"],
              ["Dec"]
           
            ],
            labels: {
              style: {
                fontSize: "12px"
              }
            }
          }
        
      
    }
  };


  submitTarget() {

  }


}
