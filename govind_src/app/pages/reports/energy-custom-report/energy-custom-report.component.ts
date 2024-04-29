import { DataEntrySetting } from '@/models/DataEntrySettings';
import { Facility } from '@/models/Facility';

import { EmissionFactor } from '@/models/EmissionFactorALL';
import { TrackingDataPoint } from '@/models/TrackingDataPoint';
import { ManageDataPointSubCategories } from '@/models/TrackingDataPointSubCategories';
import { LoginInfo } from '@/models/loginInfo';
import { Component, ViewChild, effect } from '@angular/core';
import { FacilityService } from '@services/facility.service';
import { TrackingService } from '@services/tracking.service';
import { environment } from 'environments/environment';
import { Calendar } from 'primeng/calendar';
import { CustomReportModel } from '@/models/CustomReportModel';
import jsPDF from 'jspdf';
import { months } from '@/models/months';
import { DatePipe } from '@angular/common';
import { DataEntry } from '@/models/DataEntry';
import { NotificationService } from '@services/notification.service';
interface financialyear {
    financialyear: string;
}
interface locations {
    location: string;
}

interface reportDatapoints {
    datapoints: string;
    januray: string;
    february: string;
    march: string;
    april: string;
    may: string;
    june: string;
    july: string;
    august: string;
    september: string;
    october: string;
    november: string;
    december: string;
}

@Component({
    selector: 'app-energy-custom-report',
    templateUrl: './energy-custom-report.component.html',
    styleUrls: ['./energy-custom-report.component.scss']
})
export class EnergyCustomReportComponent {
    public loginInfo: LoginInfo;
    financialyear: financialyear[];
    locations: locations[];
    reportdatapoints: reportDatapoints[];
    year: Date;
    months: months;
    entryExist: boolean = false;
    convertedYear: string;
    notevalue: string;
    Datapoints: string;
    AssignedDataPoint: TrackingDataPoint[] = [];
    selectedFacilityID: any;
    selectedYear: number;
    facilityhavedp = 'none';
    id_var: any;
    dataEntrySetting: DataEntrySetting = new DataEntrySetting();
    dataEntry: DataEntry = new DataEntry();
    SubCatAllData: ManageDataPointSubCategories;
    selectedDate: Date;
    currentYear: number;
    nextYear: number;
    facilityID;
    month: Date;
    facilitynothavedp = 'flex';
    facilityData: Facility[] = [];
    years: number[] = [];
    selectedCategory: number;
    selectMode: number;
    isDropdownOpen = false;
    StationaryCombustion: EmissionFactor = new EmissionFactor();
    yearRangeOptions: string;
    kgCO2e: number;
    lfcount: number = 0;
    selectMonths: any[] = [];
    reportData: any[] = [];
    Modes: any[] = [];
    modeShow = false;
    CustomReportData: CustomReportModel[] = [];
    
    reportmonths: any[] = [
        { name: 'Jan', value: 'Jan' },
        { name: 'Feb', value: 'Feb' },
        { name: 'Mar', value: 'Mar' },
        { name: 'Apr', value: 'Apr' },
        { name: 'May', value: 'May' },
        { name: 'June', value: 'Jun' },
        { name: 'July', value: 'July' },
        { name: 'Aug', value: 'Aug' },
        { name: 'Sep', value: 'Sep' },
        { name: 'Oct', value: 'Oct' },
        { name: 'Nov', value: 'Nov' },
        { name: 'Dec', value: 'Dec' }
    ];
    @ViewChild('calendarRef') calendarRef!: Calendar;
    date: Date;
    constructor(
        private notification: NotificationService,
        public facilityService: FacilityService,
        private trackingService: TrackingService
    ) {
 

      
        this.AssignedDataPoint = [];
        this.Modes =
            [

                {
                    "id": 1,
                    "modeType": "Flight"
                },
                {
                    "id": 2,
                    "modeType": "Hotel Stay"
                },
                {
                    "id": 3,
                    "modeType": "Other Modes"
                }

            ];
    };

    ngAfterContentInit(){
        console.log("working")
    }

   async ngOnInit() {
        this.loginInfo = new LoginInfo();
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
            this.facilityID = localStorage.getItem('SelectedfacilityID');
       
           
            setTimeout(()=>{
                    if(this.facilityService.facilitiesSignal()){
                         this.GetAssignedDataPoint(this.facilityService
                            .facilitiesSignal()[0].id
                        )
                    }
            },1000)
      
        }
    };

    ngDoCheck() {
        // if (localStorage.getItem('FacilityCount') != null) {
        //     let fcount = localStorage.getItem('FacilityCount');
        //     if (this.lfcount != Number(fcount)) {
        //         this.GetAllFacility();
        //     }
        // }
    };

    ngAfterViewInit(){
      
    }

    //Retrieves all facilities for a tenant
    GetAllFacility() {
        let tenantId = this.loginInfo.tenantID;
        this.facilityService.newGetFacilityByTenant(tenantId).subscribe((response) => {
            this.facilityData = response;
            this.GetAssignedDataPoint(this.facilityData[0].id)
            this.lfcount = this.facilityData.length;
        });
    };
    //opens calendar
    openCalendar(calendar: Calendar) {
        calendar.toggle();
    };
    //Checks the facility ID and calls the GetAssignedDataPoint function with the provided ID.
    checkFacilityID(id) {
        console.log("faciliyt cahnged call");
      

        this.GetAssignedDataPoint(id);
    };

    dataPointChangedID(id) {
        if (id == 13) {
            this.modeShow = true
        } else {
            this.modeShow = false
        }

      
    };
    //method for get assigned datapoint to a facility by facility id
    // GetAssignedDataPoint(facilityID: number) {
    //     this.trackingService
    //         .getSavedDataPointforTracking(facilityID)
    //         .subscribe({
    //             next: (response) => {
    //                 if (response === environment.NoData) {
    //                     this.AssignedDataPoint = [];
    //                 } else {
    //                     this.AssignedDataPoint = response;
    //                 }
    //             },
    //             error: (err) => { }
    //         });
    // };

    GetAssignedDataPoint(facilityID: number) {
        console.log(facilityID);
        this.trackingService
            .getDataPointsByFacility(facilityID)
            .subscribe({
                next: (response) => {
               
                    if (response === environment.NoData) {
                        this.AssignedDataPoint = [];
                    } else {
                        this.AssignedDataPoint = response.categories;
                    }
                },
                error: (err) => { }
            });
    };


    //method for download generated report in pdf format
    downloadAsPDF() {
        const doc = new jsPDF({
            orientation: 'portrait', // or 'landscape'
            unit: 'mm',
            format: 'a3'
        });

        const headers = [
            'Data Point',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
            'January',
            'February',
            'March'
        ];

        const rows = this.CustomReportData.map((item) => [
            item.dataPoint,
            item.April,
            item.May,
            item.June,
            item.July,
            item.August,
            item.September,
            item.October,
            item.November,
            item.December,
            item.January,
            item.February,
            item.March
        ]);

        (doc as any).autoTable({
            head: [headers],
            body: rows,
            theme: 'grid',
            styles: {
                cellPadding: 2,
                fontSize: 10,
                // Enable automatic page wrapping
                overflow: 'linebreak'
            },
            columnStyles: {
                0: { cellWidth: 18 },
                1: { cellWidth: 18 },
                2: { cellWidth: 18 },
                3: { cellWidth: 18 },
                4: { cellWidth: 18 },
                5: { cellWidth: 20 },
                6: { cellWidth: 23 },
                7: { cellWidth: 20 },
                8: { cellWidth: 23 },
                9: { cellWidth: 23 },
                10: { cellWidth: 18 },
                11: { cellWidth: 20 },
                //12: {cellWidth: 18}
            },
            startY: 15, // Adjust the starting Y position of the table
            pageBreak: 'auto', // Enable automatic page breaking
            margin: { top: 15, right: 20, bottom: 15, left: 10 },
            didParseCell: function (data) {
                if (data.section === 'head') {
                    data.cell.styles.fillColor = [0, 0, 0]; // Black color for header fill
                    data.cell.styles.textColor = [255, 255, 255]; // White color for header text
                }
            }
        });

        doc.save('report.pdf');
    };
    //method for generate a report
    // generateReport() {
    //     this.CustomReportData = [];

    //     this.selectedCategory.forEach((element) => {
    //         var entry: CustomReportModel = {
    //             dataPoint: element.subCatName,
    //             April: '',
    //             May: '',
    //             June: '',
    //             July: '',
    //             August: '',
    //             September: '',
    //             October: '',
    //             November: '',
    //             December: '',
    //             January: '',
    //             February: '',
    //             March: ''
    //         };

    //         element.dataEntries.forEach((subelement) => {
    //             const month = subelement.month;
    //             const year = subelement.year;
    //             const reportYear = this.date.getFullYear().toString();
    //             const readingValue = parseFloat(subelement.readingValue);
    //             if (!isNaN(readingValue) && year === reportYear) {
    //                 switch (month) {
    //                     case 'April':
    //                         entry.April = this.calculateMonthTotal(
    //                             entry.April,
    //                             readingValue
    //                         );
    //                         break;
    //                     case 'May':
    //                         entry.May = this.calculateMonthTotal(
    //                             entry.May,
    //                             readingValue
    //                         );
    //                         break;
    //                     case 'June':
    //                         entry.June = this.calculateMonthTotal(
    //                             entry.June,
    //                             readingValue
    //                         );
    //                         break;
    //                     case 'July':
    //                         entry.July = this.calculateMonthTotal(
    //                             entry.July,
    //                             readingValue
    //                         );
    //                         break;
    //                     case 'August':
    //                         entry.August = this.calculateMonthTotal(
    //                             entry.August,
    //                             readingValue
    //                         );
    //                         break;
    //                     case 'September':
    //                         entry.September = this.calculateMonthTotal(
    //                             entry.September,
    //                             readingValue
    //                         );
    //                         break;
    //                     case 'October':
    //                         entry.October = this.calculateMonthTotal(
    //                             entry.October,
    //                             readingValue
    //                         );
    //                         break;
    //                     case 'November':
    //                         entry.November = this.calculateMonthTotal(
    //                             entry.November,
    //                             readingValue
    //                         );
    //                         break;
    //                     case 'December':
    //                         entry.December = this.calculateMonthTotal(
    //                             entry.December,
    //                             readingValue
    //                         );
    //                         break;
    //                     case 'January':
    //                         entry.January = this.calculateMonthTotal(
    //                             entry.January,
    //                             readingValue
    //                         );
    //                         break;
    //                     case 'February':
    //                         entry.February = this.calculateMonthTotal(
    //                             entry.February,
    //                             readingValue
    //                         );
    //                         break;
    //                     case 'March':
    //                         entry.March = this.calculateMonthTotal(
    //                             entry.March,
    //                             readingValue
    //                         );
    //                         break;
    //                     default:
    //                         // Handle unknown month value
    //                         break;
    //                 }
    //             }
    //         });

    //         this.CustomReportData.push(entry);
    //     });
    // }

    newgenerateReport() {

        this.dataEntry.month = this.selectMonths.map((month) => month.value).join(', '); //this.getMonthName();
        this.dataEntry.year = this.date.getFullYear().toString();
        console.log(this.selectedCategory);
        this.CustomReportData = [];
        // this.selectedCategory = 'Stationary Combustion';
        let url = ''
        switch (this.selectedCategory) {
            case 1:
                url = 'reportStationaryCombustion'
                break;
            case 2:
                url = 'reportRegfriegrant'
                break;
            case 3:
                url = 'reportFireExtinguisher'
                break;
            case 6:
                url = 'reportStationaryCombustion'
                break;
            case 5:
                url = 'reportRenewableElectricity'
                break;
            case 7:
                url = 'reportHeatandSteam'
                break;
            case 8:
                url = 'reportFilterPurchaseGoods'
                break;
            case 9:
                url = 'reportStationaryCombustion'
                break;
            case 10:
                url = 'reportUpStreamVehicles'
                break;
            case 11:
                url = 'reportStationaryCombustion'
                break;
            case 12:
                url = 'reportWasteGeneratedEmission'
                break;
            case 13:
                switch (this.selectMode) {
                    case 1:
                        url = 'reportFlightTravel'
                        break;
                    case 2:
                        url = 'reportStationaryCombustion'
                        break;
                    case 3:
                        url = 'reportOtherTransport'
                        break;
                }
                break;
            case 14:
                // case 'Employee Commuting':
                url = 'reportStationaryCombustion'
                break;
            case 15:
                url = 'reportHomeOffice'
                break;
            case 16:
                url = 'reportUpstreamLeaseEmission'
                break;
            case 17:
                // case 'Downstream Transportation and Distribution':
                url = 'reportStationaryCombustion'
                break;
            case 18:
                url = 'reportProOfSoldProducts'
                break;
            case 19:
                // case 'Use of Sold Products':
                url = 'reportStationaryCombustion'
                break;
            case 20:
                url = 'reportEndOfLifeTreatment'
                break;
            case 21:
                url = 'reportDownstreamLeaseEmission'
                break;
            case 22:
                url = 'reportFranchiseEmission'
                break;
            case 23:
                url = 'reportInvestmentEmission'
                break;
            default:
                // Handle unknown month value
                break;
        }

        const reportFormData = new URLSearchParams();
        reportFormData.set('facility', this.selectedFacilityID)
        reportFormData.set('year', this.dataEntry.year)
        reportFormData.set('month', this.dataEntry.month)
        reportFormData.set('page', '1')
        reportFormData.set('page_size', '10')


        this.facilityService.gerReport(url, reportFormData.toString()).subscribe({
            next: res => {
                if(res.success){
                    this.reportData = res.result
                }else{
                    this.notification.showSuccess(
                        'No data found',
                        'Success'
                    );
                }
                // console.log( this.reportData );
                console.log(this.selectedCategory);
            }
        })
    };


    //Calculates the total value by adding the existing value and the new value for each datapoint
    calculateMonthTotal(existingValue: string, newValue: number): string {
        const existingValueNumber = parseFloat(existingValue);
        const totalValue = isNaN(existingValueNumber)
            ? newValue
            : existingValueNumber + newValue;
        return totalValue.toString();
    }
    //retrieves the subcategories under the Stationary Combustion category from the AssignedDataPoint object
    // stationaryCombustionCategory() {
    //     let subCategories: any[] = [];
    //     this.AssignedDataPoint.forEach(scope => {
    //         if (scope.manageDataPointCategories !== undefined) {
    //             const category =
    //                 scope.manageDataPointCategories.find(
    //                     (category) => category.catName === 'Stationary Combustion'
    //                 );
    //             if (category) {
    //                 let subCategories = category.manageDataPointSubCategories;
    //                 return subCategories;
    //             } else {
    //                 console.log('Category not found');
    //                 return [];
    //             }
    //         }
    //     })

    // }

}
