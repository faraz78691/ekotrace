import { Component, ViewChild } from '@angular/core';
import { ApexNonAxisChartSeries, ApexChart, ApexResponsive, ApexDataLabels, ApexAxisChartSeries, ApexXAxis, ApexStroke, ApexTooltip, ApexPlotOptions, ChartComponent } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  legend:any;
  colors:any
  dataLabels: ApexDataLabels;
};

export type ChartAreaOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  colors:any
};
@Component({
  selector: 'app-energy-emmsions',
  templateUrl: './energy-emmsions.component.html',
  styleUrls: ['./energy-emmsions.component.scss']
})
export class EnergyEmmsionsComponent {
  @ViewChild("ct_emission_by_travel") ct_emission_by_travel: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public secondChart: Partial<ChartOptions>;
  public thirdChart: Partial<ChartOptions>;
  public fourChart: Partial<ChartOptions>;
  public areachart: Partial<ChartAreaOptions>;
  public areaBusinesschart: Partial<ChartAreaOptions>;
  constructor() {
    this.chartOptions = {
      dataLabels: {
        enabled: true
      }, legend: {
        show: true,
        position: 'bottom',
        offsetY: 0
      },
    
      series: [44, 55, 13, 43, 22],
      chart: {
        width: 360,
        height:900,
        type: 'donut',
      },
      labels: ['Air travel', 'Ground travel','Rental car','Hotel stay'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 260
          },
          
        }
      }]
    };
  ;

  this.secondChart = {
    dataLabels: {
        enabled: true
      },
      legend: {
        show: true,
        position: 'bottom',
        offsetY: 0
      },
    colors : ['#786DBE', '#1A4D8F','#1A4D8F','#FFBC1C'],
    series: [44, 55,12,30],
    chart: {
    width: 360,
    height:900,
    type: 'donut',
  },
  
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


  this.areachart = {
    series: [{
    name: 'Scope 1',
    data: [31, 40, 28, 51, 42, 109, 100]
  }, {
    name: 'Scope 2',
    data: [11, 32, 45, 32, 34, 52, 41]
  }, {
    name: 'Scope 3',
    data: [11, 3, 15, 20, 14, 19, 20]
  }],
  colors : ['#0E9B93', '#8F2424','#CE6CFD'],
    chart: {
    height: 350,
    type: 'area'
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth'
  },
  xaxis: {
    type: 'datetime',
    categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
  },
  tooltip: {
    x: {
      format: 'dd/MM/yy HH:mm'
    },
  },

  // this.areaBusinesschart = {
  //   colors : ['#213D49', '#46A5CD'],
  //   series: [{
  //       name: 'Type 1',
  //   data: [44, 55, 41, 64, 22, 43, 21, 43, 21]
  // }, {
  //   name: 'Type 2',
  //   data: [53, 32, 33, 52, 13, 44, 32, 44, 32]
  // }],
  //   chart: {
  //   type: 'bar',
  //   height: 430
  // },
  // plotOptions: {
  //   bar: {
  //     horizontal: true,
  //     dataLabels: {
  //       position: 'top',
  //     },
  //   }
  // },
  // dataLabels: {
  //   enabled: true,
  //   offsetX: -6,
  //   style: {
  //     fontSize: '12px',
  //     colors: ['#fff']
  //   }
  // },
  // stroke: {
  //   show: true,
  //   width: 1,
  //   colors: ['#fff']
  // },
  // tooltip: {
  //   shared: true,
  //   intersect: false
  // },
  // xaxis: {
  //   categories: [0, 1.25, 2.5, 3.75, 5, 6.25, 7.5, 8.75, 10],
  // },
  
  // };

  // this.thirdChart = {
  //   dataLabels: {
  //       enabled: true
  //     },
  //     legend: {
  //       show: true,
  //       position: 'bottom',
  //       offsetY: 0
  //     },
  //   colors : ['#246377', '#009087','#002828','#F9C74F'],
  //   series: [44, 55,12,30],
  //   chart: {
  //   width: 360,
  //   height:900,
  //   type: 'donut',
  // },
  
  // labels: ['New York', 'Mumbai','Dubai','Bangkok'],
  // responsive: [{
  //   breakpoint: 480,
  //   options: {
  //     chart: {
  //       width: 260
  //     },
      
  //   }
  // }]
  // };

  // this.fourChart = {
  //   dataLabels: {
  //       enabled: true
  //     },
  //     legend: {
  //       show: true,
  //       position: 'bottom',
  //       offsetY: 0
  //     },
  //   colors : ['#DC6B52', '#17B4B4'],
  //   series: [44, 55],
  //   chart: {
  //   width: 360,
  //   height:900,
  //   type: 'donut',
  // },
  
  // labels: ['Reductions 1', 'Emissions'],
  // responsive: [{
  //   breakpoint: 480,
  //   options: {
  //     chart: {
  //       width: 260
  //     },
      
  //   }
  // }]
  // };

  }

}
}

