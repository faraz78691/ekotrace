import { LoginInfo } from '@/models/loginInfo';
import { Component } from '@angular/core';

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
graph1:any;
graph2:any;
graph3:any;
graph4:any;
graph5:any;
graph6:any;
graph7:any;
graph8:any;







  kpiList = [
    { id: 1, name: 'Scope1 Emissions' },
    { id: 2, name: 'Scope2 Emissions' },
    { id: 3, name: 'Scope3 Emissions' },
    { id: 4, name: 'Total Emission per output' },
    { id: 5, name: 'Total Emission per mn revenue' },
    { id: 6, name: 'Total Emission per no. of employees' },
    { id: 7, name: 'Emission per unit area' },
    { id: 8, name: 'Emission per unit energy reference area' },
    { id: 9, name: 'Emission per KWh energy consumed (mix)' },
    { id: 10, name: 'Vehicle Emission per no. of vehicles (petrol)' },
    { id: 11, name: 'Vehicle Emission per no. of vehicles (diesel)' },
    { id: 12, name: 'Total Vehicle Emission per vehicle' },
    { id: 13, name: 'Transporatation Emission' },
    { id: 14, name: 'Transporatation Emission per tonne of freight' },
    { id: 15, name: 'Total Emissions in business travel' },
    { id: 16, name: 'Emissions in Flight travel' },
    { id: 17, name: 'Total Emissions in business travel per employee' },
    { id: 18, name: 'Emission per total working days' },
    { id: 19, name: 'Total energy consumed' },
    { id: 20, name: 'Renewable Electricity as % of total energy consumed' },
    { id: 21, name: 'Renewable Electricity as % of Total Electricity' },
    { id: 22, name: 'Total Fossil Fuel consumption' },
    { id: 23, name: 'Fossil Fuel Consumption / output' },
    { id: 24, name: 'Fossil Fuel Consumption / revenue (in mn)' },
    { id: 25, name: 'Emissions in waste treatment' },
    { id: 26, name: 'Waste generated per unit output' },
    { id: 27, name: 'Fossil Fuel Consumption / revenue (in mn)' },
    { id: 28, name: 'Waste diversion rate %' },
    { id: 29, name: 'Total water usage' },
    { id: 30, name: 'Water treated as % of total water discharged' },
    { id: 31, name: 'Water usage per employee' },
    { id: 32, name: 'Water usage per output' },
    { id: 33, name: 'Emissions in water treatment' },

  ]

  dateFormat =
    [

      {
        "id": 1,
        "shortBy": "Annually"
      },
      {
        "id": 2,
        "shortBy": "Quaterly"
      },
      {
        "id": 3,
        "shortBy": "Monthly"
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
      this.GetAllFacility();
      this.graph1 = this.getBarGraphOptions([104, 179, 65, 21, 89,2.5, 74, 27, 1, 129,123,20], ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] , '#FFEBB2');
      this.graph2 = this.getBarGraphOptions([167, 39, 97, 57, 123,20, 5, 2, 6.2, 3,45,77], ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], '#D4E157');
      this.graph3 = this.getBarGraphOptions([130, 159, 69, 193, 89 ,129, 43, 153, 67,54,199], ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],  '#B2EBF2');
      this.graph4 = this.getBarGraphOptions([97, 129, 43, 153, 67,130, 159, 69, 193, 89,7, 21], ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], '#FFCCBC');
      this.graph5 = this.getBarGraphOptions([20, 5, 2, 6.2, 3,167, 239, 97, 257,32,43, 153, ], ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], '#FFCDD2');
      this.graph6 = this.getBarGraphOptions([2.5, 74, 27, 1, 129, 2.5, 74, 27, 1, 129,74, 27], ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], '#C5E1A5');
      this.graph7 = this.getBarGraphOptions([6.2, 7, 21, 15, 32,2.5, 74, 27, 1, 129, 97, 257], ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'], '#CE93D8' );
      this.graph8 = this.getBarGraphOptions([167, 239, 97, 257,32 ,97, 129, 43, 153, 67,54,19 ], ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],  '#FFDDC1');
    

    }
  };




 
  GetAllFacility() {
    let tenantId = this.loginInfo.tenantID;
    this.facilityService.newGetFacilityByTenant(tenantId).subscribe((response) => {
      this.facilityData = response;
      // this.GetAssignedDataPoint(this.facilityData[0].id)

    });
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
  }


}
