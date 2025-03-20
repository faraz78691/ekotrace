import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '@services/api.service';
import { AppService } from '@services/app.service';
import { FacilityService } from '@services/facility.service';
import { ApexNonAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexResponsive, ApexXAxis, ApexLegend, ApexFill, ApexGrid, ApexStroke, ApexAxisChartSeries } from 'ng-apexcharts';
import { Calendar } from 'primeng/calendar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  xaxis: ApexXAxis;
  fill: ApexFill;
  grid: ApexGrid;
  stroke: ApexStroke;
  colors: any;
};
@Component({
  selector: 'app-ghg-reporting',
  templateUrl: './ghg-reporting.component.html',
  styleUrls: ['./ghg-reporting.component.scss']
})
export class GhgReportingComponent {
  baseYear: any;
  loginInfo: any;
  facilityData: any[] = [];
  categoriesData: any[] = [];
  selectedMultipleFacility: any;
  selectedMultipleCategories: any;
  reportData: any;
  currentYear: any;
  scopeEmissons: any;
  scope1Emissions: any;
  scope2Emissions: any;

  pieChart: Partial<ChartOptions2>;
  pieElectricityChart: any;
  electrcityBarOptions: any;
  scope3PieOptions: any;
  scope3BarOptions: any;
  standardPieOptions: any;
  servicesPieOptions: any;
  capitalPieOptions: any;
  purchaseGoodsData: any;
  scope3Data: any;
  constructor(

    private _apiService: ApiService, private facilityService: FacilityService, private cdr: ChangeDetectorRef, private _appService: AppService,
  ) {
    this.categoriesData = [
      { id: 1, name: 'Purchased goods and services' },
      { id: 2, name: 'Fuel and related services' },
      { id: 3, name: 'Business travel' },
      { id: 4, name: 'Employee commuting' },
      { id: 5, name: 'Water supply' },
      { id: 6, name: 'Waste' }
    ]

  }
  openCalendar(calendar: Calendar) {
    calendar.toggle();
  };

  ngOnInit() {
    if (localStorage.getItem('LoginInfo') != null) {
      let userInfo = localStorage.getItem('LoginInfo');
      let jsonObj = JSON.parse(userInfo);
      this.loginInfo = jsonObj as any;
      this.currentYear = new Date().getFullYear()
      this.GetAllFacility();
      this.getScopeWiseEmission();
      this.scope1Categories();
      this.scope2Categories();
      this.scope3Categories();
      this.getPurchaseGoodsServices();
    }

  }

  GetAllFacility() {
    let tenantId = this.loginInfo.tenantID;
    this.facilityService.newGetFacilityByTenant(tenantId).subscribe((response) => {
      this.facilityData = response;
      // this.GetAssignedDataPoint(this.facilityData[0].id)

    });
  };

  onGenerateReport() {
    this.downloadPDF()
  }

  getScopeWiseEmission() {

    const formData = new URLSearchParams();
    formData.set('facilities', '1');
    formData.set('year', this.currentYear.toString());
    this._appService.postAPI('/GhgScopewiseEmssion', formData).subscribe((response) => {
      this.scopeEmissons = response;
      const pieEmissions = [this.scopeEmissons.Scope1[0].total_emission, this.scopeEmissons.Scope2[0].total_emission, this.scopeEmissons.Scope3[0].total_emission]
      this.pieChart = {
        dataLabels: {
          enabled: false
        },

        series: pieEmissions,
        chart: {
          // width: 380,
          width: '380',
          // height:'200',
          type: 'pie',
        },
        legend: {
          show: true,
          position: 'bottom',
          offsetY: 0
        },
        colors: ['#11235aa8', '#46A5CD', '#FFD914'],
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

    });
  };

  scope1Categories() {

    const formData = new URLSearchParams();
    formData.set('facilityIds', '30');
    formData.set('year', this.currentYear.toString());
    this._appService.postAPI('/ghgScope1Emissions', formData).subscribe((response: any) => {
      this.scope1Emissions = response;
    });
  };
  scope2Categories() {

    const formData = new URLSearchParams();
    formData.set('faciltyId', '30');
    formData.set('year', this.currentYear.toString());
    this._appService.postAPI('/fetchScope2Comission', formData).subscribe((response: any) => {
      this.scope2Emissions = response.data;

      if (this.scope2Emissions) {
        this.electrcityBarOptions = this.getHorizelBarChartOptions(
          [
            this.scope2Emissions.electricity.totalGHGEmission || 0,
            this.scope2Emissions.recSolar.totalGHGEmission || 0,
            this.scope2Emissions.recWind.totalGHGEmission || 0
          ],
          [
            "Electricity from Grid",
            "Renewable Energy (RECs) - Solar",
            "Renewable Energy (RECs) - Wind"
          ]
        );

        this.pieElectricityChart = this.getPieCharOptions([
          this.scope2Emissions.electricity.totalGHGEmission || 0,
          this.scope2Emissions.recSolar.totalGHGEmission || 0,
          this.scope2Emissions.recWind.totalGHGEmission || 0
        ],
          [
            "Electricity from Grid",
            "Renewable Energy (RECs) - Solar",
            "Renewable Energy (RECs) - Wind"
          ])
      }

      // this.GetAssignedDataPoint(this.facilityData[0].id)

    });
  };


  scope3Categories() {
    const formData = new URLSearchParams();
    formData.set('facilities', '30');
    formData.set('year', this.currentYear.toString());
    this._appService.postAPI('/Scope3WiseEmssionOnly', formData).subscribe((response: any) => {
      const scope3Data = response;
      this.scope3BarOptions = this.getHorizelBarChartOptions(scope3Data.seriesScope3, scope3Data.labelScope3);
      this.scope3PieOptions = this.getPieCharOptions(scope3Data.seriesScope3, scope3Data.labelScope3);
      this.scope3Data = scope3Data.Scope3

    });
  };

  getPurchaseGoodsServices() {
    const formData = new URLSearchParams();
    formData.set('faciltyId', '30');
    formData.set('year', this.currentYear.toString());
    this._appService.postAPI('/purchaseGoodAndService', formData).subscribe((response: any) => {
      const purchaseData = response.data;
      this.purchaseGoodsData = purchaseData;
      if (purchaseData.purchaseGoodDetailsByTypeOfPurchase1?.length > 0) {
        const standardSeries = purchaseData.purchaseGoodDetailsByTypeOfPurchase1.map(items => Number(items.total_emission));
        const standardLabels = purchaseData.purchaseGoodDetailsByTypeOfPurchase1.map(items => items.product);
        this.standardPieOptions = this.getPieCharOptions(standardSeries, standardLabels)
      } else {
        this.standardPieOptions = undefined;
      }

      if (purchaseData.purchaseGoodDetailsByTypeOfPurchase2?.length > 0) {
        var servicesSeries = purchaseData.purchaseGoodDetailsByTypeOfPurchase2.map(items => Number(items.total_emission));

        var serviesLabel = purchaseData.purchaseGoodDetailsByTypeOfPurchase2.map(items => items.product);
        this.servicesPieOptions = this.getPieCharOptions(servicesSeries, serviesLabel);

      } else {
        this.servicesPieOptions = undefined;
      }

      if (purchaseData.purchaseGoodDetailsByTypeOfPurchase3?.length > 0) {
        var capitalSeries = purchaseData.purchaseGoodDetailsByTypeOfPurchase3.map(items => Number(items.total_emission));
        var capitalLabel = purchaseData.purchaseGoodDetailsByTypeOfPurchase3.map(items => items.product);
        this.capitalPieOptions = this.getPieCharOptions(capitalSeries, capitalLabel)
      } else {
        this.capitalPieOptions = undefined;
      }
    });
  };


  getHorizelBarChartOptions(seriesValues: number[], categories: string[]) {
    return {
      series: [
        {
          name: "GHG Emission",
          data: seriesValues
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      colors: ['#11235aa8', '#46A5CD', '#FFD914'],
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: categories,
      },
      yaxis: {

        title: {
          style: {
            fontSize: '20px',
            fontWeight: '600'
          },
        },
        labels: {
          style: {
            fontSize: '20px'
          }
        },
      },

    };
  }




  getPieCharOptions(seriesValues: number[], categories: string[]) {
    return {
      dataLabels: {
        enabled: false
      },

      series: seriesValues,
      chart: {
        // width: 380,
        width: '380',
        // height:'200',
        type: 'pie',
      },
      legend: {
        show: true,
        position: 'bottom',
        offsetY: 0
      },
      colors: ['#11235aa8', '#46A5CD', '#FFD914'],
      labels: categories,
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

  async downloadPDF() {
    const pdf = new jsPDF('p', 'mm', [210, 210], true);
    const content = document.getElementById('pdf-content');

    if (!content) return;

    const margin = 5; // Reduced margin in mm
    const sections = Array.from(content.children) as HTMLElement[];

    // Process all sections in parallel
    const canvasPromises = sections.map(section =>
      html2canvas(section, {
        scale: 1.5,
        logging: false,
        useCORS: true,       // Correct property for cross-origin images
        allowTaint: false,    // Keep false unless you need to work with tainted canvas
        removeContainer: true, // Clean up temporary container
        backgroundColor: '#FFFFFF' // Ensure white background
      })
    );

    try {
      const canvases = await Promise.all(canvasPromises);

      canvases.forEach((canvas, index) => {
        if (index > 0) pdf.addPage();

        const imgWidth = 210 - (2 * margin);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(
          canvas.toDataURL('image/jpeg', 0.4),
          'JPEG',
          margin,
          margin,
          imgWidth,
          imgHeight,
          undefined,
          'FAST'
        );
      });

      pdf.save('GHG_Emission_Report.pdf');
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  }
}
