import { CustomReportModel } from '@/models/CustomReportModel';
import { DataEntry } from '@/models/DataEntry';
import { DataEntrySetting } from '@/models/DataEntrySettings';
import { EmissionFactor } from '@/models/EmissionFactorALL';
import { Facility } from '@/models/Facility';
import { LoginInfo } from '@/models/loginInfo';
import { months } from '@/models/months';
import { TrackingDataPoint } from '@/models/TrackingDataPoint';
import { ManageDataPointSubCategories } from '@/models/TrackingDataPointSubCategories';
import { Component, ViewChild } from '@angular/core';
import { FacilityService } from '@services/facility.service';
import { NotificationService } from '@services/notification.service';
import { TrackingService } from '@services/tracking.service';
import { environment } from 'environments/environment';
import jsPDF from 'jspdf';
import { Calendar } from 'primeng/calendar';


import * as XLSX from 'xlsx';
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
    selector: 'app-single-report',
    templateUrl: './single-report.component.html',
    styleUrls: ['./single-report.component.scss']
})
export class SingleReportComponent {

    public loginInfo: LoginInfo;
    financialyear: financialyear[];
    locations: locations[];
    reportdatapoints: reportDatapoints[];
    year: Date;
    months: months;
    entryExist: boolean = false;
    convertedYear: string;
    selectReportType = 'Monthly'
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
    isMultiple: boolean = undefined
    selectedMultipleCategories: any;
    selectedMultipleFacility: any;
    @ViewChild('dt', { static: false }) table: any;
    startMonth: any;
    startYear: any;
    endMonth: any;
    endYear: any;


    reportmonths: any[] = [
        { name: 'Jan', value: 'Jan' },
        { name: 'Feb', value: 'Feb' },
        { name: 'Mar', value: 'Mar' },
        { name: 'Apr', value: 'Apr' },
        { name: 'May', value: 'May' },
        { name: 'June', value: 'Jun' },
        { name: 'July', value: 'Jul' },
        { name: 'Aug', value: 'Aug' },
        { name: 'Sep', value: 'Sep' },
        { name: 'Oct', value: 'Oct' },
        { name: 'Nov', value: 'Nov' },
        { name: 'Dec', value: 'Dec' }
    ];
    reportType: any[] = [
        { name: '1', value: 'Monthly' },
        { name: '2', value: 'Consolidated' },

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



    async ngOnInit() {

        this.loginInfo = new LoginInfo();
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
            this.facilityID = sessionStorage.getItem('SelectedfacilityID');

            this.GetAllFacility()


        }
    };





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



        this.GetAssignedDataPoint(id);
    };

    dataPointChangedID(id) {
        
        if (id == 13) {
            this.modeShow = true
        } else {
            this.modeShow = false
        }
        this.reportData = []
    };

    multipleDataPointsChanged(event: any) {
        this.selectedMultipleCategories = event.value; // This stores the selected IDs in the array

        if (this.selectedMultipleCategories.includes(13)) {
            this.modeShow = true;  // Show the mode section if ID 13 is selected
        } else {
            this.modeShow = false; // Hide the mode section if ID 13 is not selected
        }
    };

    readonly monthCategoryIds = [1, 10, 11, 12, 13, 16, 17, 18, 19, 20, 21, 22, 23];

    isMonthCategory(categoryId: number): boolean {
        return this.monthCategoryIds.includes(categoryId);
    }

    isMonthsCategory(categoryId: number): boolean {
        return !this.isMonthCategory(categoryId) && categoryId !== 8 && categoryId !== 14 && categoryId !== 15;
    }


    dataInputType: string = 'single';

    // multipleDataPointsChanged(id: any){
    //     if (id == 13) {
    //         this.modeShow = true
    //     } else {
    //         this.modeShow = false
    //     }
    // }
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

        this.trackingService
            .getDataPointsByFacility(facilityID)
            .subscribe({
                next: (response) => {

                    if (response === environment.NoData) {
                        this.AssignedDataPoint = [];
                    } else {
                        this.AssignedDataPoint = response.categories;
                        console.log(this.AssignedDataPoint);
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
   

    newgenerateReport() {

        this.CustomReportData = [];
        const reportFormData = new URLSearchParams();
        // this.selectedCategory = 'Stationary Combustion';
        let url = ''

        if (this.isMultiple) {
            const startYear = this.startYear.getFullYear().toString();
            const endYear = this.endYear.getFullYear().toString();
            if (this.selectReportType == 'Monthly') {
                url = 'reportFilterMultipleCategoryNew'
            } else {
                url = 'reportFilterMultipleCategoryConsolidated'
            }
            let selectedFacilities = this.selectedMultipleFacility.map(String).map(item => `'${item}'`).join(',');

            const categoryMap = {
                "Purchased goods and services": "purchase_goods",
                "Upstream Transportation and Distribution": "upstream",
                "Downstream Transportation and Distribution": "downstream",
                "Franchises": "franchise_emission",
                "Investment Emissions": "investment_emission",
                "Stationary Combustion": "stationary_combustion",
                "Upstream Leased Assets": "upstreamlease_emission",
                "Downstream Leased Assets": "downstreamlease_emission",
                "Waste generated in operations": "waste_generation",
                "Business Travel": "other_transport",
                "Other Transportation": "other_transport",
                "Employee Commuting": "employee_commuting",
                "Home Office": "home_office",
                "Use of Sold Products": "sold_products",
                "Processing of Sold Products": "process_sold_products",
                "Refrigerants": "refrigerant",
                "Heat and Steam": "heat_steam",
                "Electricity": "renewable_electricity",
                "Company Owned Vehicles": "company_owned_vehicles",
                // "Water Supply and Treatment": "water_supply_treatment",
                "End-of-Life Treatment of Sold Products": "end_of_life_treatment",
                "Fire Extinguisher": "fire_extinguisher"
            };


            this.AssignedDataPoint.forEach(category => {
                const field = categoryMap[category.CatName];
                if (field) {
                    if (this.selectedMultipleCategories.includes(category.Id)) {
                        reportFormData.set(field, '1'); // Set selected category to 1
                    } else {
                        reportFormData.set(field, '0'); // Set unselected category to 0
                    }
                }
            })

            reportFormData.set('facility', selectedFacilities)
            reportFormData.set('investment_emission', '0')
            reportFormData.set('flight_travel', '0')
            reportFormData.set('hotel_stays', '0')
            reportFormData.set('start_year', startYear)
            reportFormData.set('end_year', endYear)
            reportFormData.set('start_month', this.startMonth.value)
            reportFormData.set('end_month', this.endMonth.value)

        } else {
            this.dataEntry.month = this.selectMonths.map((month) => month.value).join(',');
            this.dataEntry.year = this.date.getFullYear().toString();

            const selectedMonths = this.dataEntry.month.split(',').map(month => `'${month}'`).join(',');
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
                    url = 'reportCompanyOwnedVehicles'
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
                    url = 'reportWaterSupplyandTreatment'
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
                            url = 'reportHotelStays'
                            break;
                        case 3:
                            url = 'reportOtherTransport'
                            break;
                    }
                    break;
                case 14:
                    // case 'Employee Commuting':
                    url = 'reportEmployeeCommuting'
                    break;
                case 15:
                    url = 'reportHomeOffice'
                    break;
                case 16:
                    url = 'reportUpstreamLeaseEmission'
                    break;
                case 17:
                    // case 'Downstream Transportation and Distribution':
                    url = 'reportDownStreamVehicles'
                    break;
                case 18:
                    url = 'reportProOfSoldProducts'
                    break;
                case 19:
                    // case 'Use of Sold Products':
                    url = 'reportSoldProducts'
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
            reportFormData.set('facility', this.selectedFacilityID)
            reportFormData.set('year', this.dataEntry.year)
            // reportFormData.set('page', '1')
            // reportFormData.set('page_size', '10')
            if (url != 'reportEmployeeCommuting' && url != 'reportHomeOffice') {
                reportFormData.set('month', selectedMonths)

            }
        }

        this.facilityService.gerReport(url, reportFormData.toString()).subscribe({
            next: res => {
                if (res.success) {
                    this.reportData = res.result

                } else {
                    this.notification.showSuccess(
                        'No data found for tihs month',
                        'Success'
                    );
                }
                // // console.log( this.reportData );

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


    exportTableToExcel() {
        // Get the table element
        const tableElement = this.table.el.nativeElement.querySelector('.p-datatable-table');

        // Create a new worksheet from the table element
        const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tableElement);

        // Create a new workbook and append the worksheet
        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'ReportData');

        // Generate the Excel file and download it
        XLSX.writeFile(workbook, 'ReportData.xlsx');
    };

    onMultpleChange(e: any) {
        this.reportData = []

    };

    selectModeChanged(e: any) {
        this.reportData = []
    }
}
