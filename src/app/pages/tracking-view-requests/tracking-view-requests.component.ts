import { DataEntry } from '@/models/DataEntry';
import { PendingDataEntries } from '@/models/PendingDataEntry';
import { SendNotification } from '@/models/SendNotification';
import { TrackingDataPoint } from '@/models/TrackingDataPoint';
import { TrackingTable } from '@/models/TrackingTable';
import { ViewrequestTable } from '@/models/ViewrequestTable';
import { LoginInfo } from '@/models/loginInfo';
import { months } from '@/models/months';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@services/notification.service';
import { TrackingService } from '@services/tracking.service';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { ManageDataPointCategories } from '@/models/TrackingDataPointCategories';
import { ManageDataPointCategory } from '@/models/ManageDataPointCategory';
import { StationaryCombustionDE, selectedObjectEntry } from '@/models/StationaryCombustionDE';
import { RefrigerantsDE } from '@/models/RefrigerantsDE';
import { FireExtinguisherDE } from '@/models/FireExtinguisherDE';
import { VehicleDE } from '@/models/VehicleDE';
import { ElectricityDE } from '@/models/ElectricityDE';
import { HeatandSteamDE } from '@/models/HeatandSteamDE';

@Component({
    selector: 'app-tracking-view-requests',
    templateUrl: './tracking-view-requests.component.html',
    styleUrls: ['./tracking-view-requests.component.scss']
})

export class TrackingViewRequestsComponent {
    @ViewChild('dt1') dt!: Table;
    status: ViewrequestTable[];
    facilityID;
    flag;
    modeShow = false;
    AssignedDataPoint: TrackingDataPoint[] = [];;
    dataEntriesPending: PendingDataEntries;
    selectedEntry: PendingDataEntries[] = [];
    selectedScEntry: StationaryCombustionDE;
    selectedObjectEntry: selectedObjectEntry;
    selectedSendEntry: any[] = [];
    selectedrefEntry: RefrigerantsDE;
    selectedfireEntry: FireExtinguisherDE;
    selectedvehicleEntry: VehicleDE;
    selectedelecEntry: ElectricityDE;
    selectedHSEntry: HeatandSteamDE;
    sendEntries: DataEntry[] = [];
    sendSCEntries: StationaryCombustionDE[] = [];
    sendApprovalEntries: any[] = [];
    sendrefEntries: RefrigerantsDE[] = [];
    sendfireEntries: FireExtinguisherDE[] = [];
    sendvehicleEntries: VehicleDE[] = [];
    sendelecEntries: ElectricityDE[] = [];
    sendHSEntries: HeatandSteamDE[] = [];
    public loginInfo: LoginInfo;
    Approver = environment.Approver;
    Preparer = environment.Preparer;
    Admin = environment.Admin;
    SuperAdmin = environment.SuperAdmin;
    Manager = environment.Manager;
    sendelement: DataEntry;
    sendSCelement: StationaryCombustionDE;
    sendrefelement: RefrigerantsDE;
    sendfireelement: FireExtinguisherDE;
    sendvehicleelement: VehicleDE;
    sendelecelement: ElectricityDE;
    sendHSelement: HeatandSteamDE;
    Pending = environment.pending;
    Rejected = environment.rejected;
    Approved = environment.approved;
    sendNotificationData: SendNotification;
    visible: boolean = false;
    reason: string;
    issended: boolean;
    year: Date;
    convertedYear: string;
    filteredStatus: any;
    months: months;
    sortField: string = ''; // Initialize sortField property
    globalFilterValue: string;
    clonedProducts: { [n: string]: PendingDataEntries } = {};
    filterDropdownVisible: boolean;
    yearOptions: any[] = [];
    selectedCategory: any;
    AllCategory: ManageDataPointCategory[] = [];
    mandatorySCDP: any[] = [];
    mandatoryRefDP: any[] = [];
    mandatoryFireDP: any[] = [];
    mandatoryVehicleDP: any[] = [];
    mandatoryElecDP: any[] = [];
    mandatoryHSDP: any[] = [];
    dataEntry: any;
    display = 'none'
    Modes: any[] = [];
    selectMode: number =1
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private trackingService: TrackingService,
        private notification: NotificationService,
        private toastr: ToastrService
    ) {
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
        this.reason = '';
        this.sendSCelement = new StationaryCombustionDE();
        this.sendrefelement = new RefrigerantsDE();
        this.sendfireelement = new FireExtinguisherDE();
        this.sendvehicleelement = new VehicleDE();
        this.sendelecelement = new ElectricityDE();
        this.sendHSelement = new HeatandSteamDE();
        this.sendelement = new DataEntry();
        this.year = new Date();
        this.months = new months();
        this.globalFilterValue = '';
        this.AllCategory = [];
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 20;

        this.yearOptions.push({ label: 'All', value: null });

        for (let year = startYear; year <= currentYear; year++) {
            this.yearOptions.push({ label: year.toString(), value: year });
        }
    }
    statusOptions: any[] = [
        { label: 'All', value: null },
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Rejected', value: 'rejected' }
    ];
    ngOnInit() {
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;
            this.route.queryParams.subscribe((params) => {
                this.facilityID = params['data']; // Access the passed data parameter
                this.getCat();
                // Use the data as needed

            });
        }
        // if (this.loginInfo.role == 'Admin' || this.loginInfo.role == 'Super Admin') {
        //     this.GetAssignedDataPoint(this.facilityID);
        // }
        // else {
        //     this.GetAssignedDataPoint(this.loginInfo.facilityID)
        // }
    };

    ngDoCheck() {

        let fId = localStorage.getItem('SelectedfacilityID');
        this.flag = localStorage.getItem('Flag');
        if (this.facilityID != fId) {
            this.ALLEntries(Number(fId));
            this.facilityID = fId;
        }

    };
    getAllDataentries(facilityID: any) {
        //this.getAllDataentries()
    }
    showDialog() {
        this.visible = true;
    };

    onUpdateUserStatus(data: any) {
        this.dataEntry = '';

        this.display = 'block';
        this.dataEntry = data

    };

    onClose2() {
        this.dataEntry = '';
        this.display = 'none';
    };
    sendEntryForApproval() {

        console.log("selcted ", this.selectedEntry);

        if (this.selectedEntry.length === 0) {
            this.notification.showWarning('Please select any entry', 'Warning');
            return
        }
        if (this.selectedEntry[0].ID == undefined || this.selectedEntry[0].ID == null) {
            console.log("SDGsdh");
            this.sendSCEntries = [];
            this.selectedEntry.forEach((element) => {
                this.selectedObjectEntry = {
                    // Create a new object for each iteration
                    id: element.id,
                    categoryID: element.categoryID,
                    tablename: element.tablename
                };
                this.sendApprovalEntries.push(this.selectedObjectEntry); // Add the new object to the sendEntries array
            });
        } else {
            console.log("herer");
            this.sendSCEntries = [];
            console.log(this.sendApprovalEntries);
            this.sendApprovalEntries = [];
            this.selectedEntry.forEach((element) => {
                this.selectedObjectEntry = {
                    // Create a new object for each iteration
                    id: element.ID,
                    categoryID: element.categoryID,
                    tablename: element.tablename
                };
                this.sendApprovalEntries.push(this.selectedObjectEntry); // Add the new object to the sendEntries array
            });
        }

        let stringfyUrlData = JSON.stringify(this.sendApprovalEntries)
        const formURlData = new URLSearchParams();
        formURlData.set('updateJson', stringfyUrlData);
        formURlData.set('categoryID', this.selectedEntry[0].categoryID.toString());

        this.trackingService.newUpdateSCEntry(formURlData).subscribe({
            next: (response: any) => {
                console.log(response)

                if (response.success == true) {
                    this.notification.showSuccess(
                        'Entries sent for approval',
                        'Success'
                    );
                    this.ALLEntries(this.facilityID);
                    var recipient = environment.Approver;
                    var message = environment.SendEntryMessage;
                    var count = this.sendEntries.length;
                    this.SendNotification(count, recipient, message);
                    this.sendApprovalEntries = [];
                    this.selectedEntry = []
                }
            },
            error: (err) => {
                this.notification.showError(
                    'Entries sent for approval Failed.',
                    'Error'
                );
                console.error('errrrrrr>>>>>>', err);
            }
        });
     

    };

    ALLEntries(facilityID: number) {
        console.log(


            "seelcted", this.selectedCategory
        );
        this.modeShow = false;
        this.months = new months();
        this.convertedYear = this.trackingService.getYear(this.year);
        const formData = new URLSearchParams();
        formData.set('year', this.convertedYear)
        formData.set('facilities', facilityID.toString())
        formData.set('categoryID', this.selectedCategory)
        if (this.selectedCategory == 1) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (var i = 0; i < this.mandatorySCDP.length; i++) {
                                    for (var j = 0; j < this.dataEntriesPending.length; j++) {
                                        if (this.dataEntriesPending[j].subCatName == this.mandatorySCDP[i].subCatName) {

                                        }
                                    }
                                }
                                // console.log("dp mandatory>", this.mandatorySCDP);
                                // console.log("dp list >", this.dataEntriesPending);

                                for (let d of this.dataEntriesPending) {

                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.status ===
                                                    "P"
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 2) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 3) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 5) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 6) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 7) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 8) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 9) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 10) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 11) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 12) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 13) {
            this.modeShow = true;
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            if (this.selectMode == 1) {
                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'flight_travel');
                            } else if (this.selectMode == 2) {
                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'hotel_stay');
                            } else if (this.selectMode == 3) {
    
                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'other_modes_of_transport');
                            } else {
                                this.dataEntriesPending = response.categories;
                            }
                            this.dataEntriesPending = response.categories;
                            console.log("data entries =====>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 14) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 15) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 16) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 17) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 18) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 19) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 20) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 21) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 22) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 23) {
            this.trackingService
                .newgetSCpendingDataEntries(formData)
                .subscribe({
                    next: (response) => {
                        if (response.success === false) {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response.categories;
                            console.log("data>", this.dataEntriesPending)
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                        }

                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }

    };
    GetsendforApprovalDataPoint(facilityID: number) {
        this.months = new months();
        this.convertedYear = this.trackingService.getYear(this.year);
        if (this.selectedCategory == 1) {
            this.trackingService
                .getSendforApprovalSCDataEntries(facilityID, this.convertedYear)
                .subscribe({
                    next: (response) => {
                        if (response === 'No Data Point') {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response;
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                            if (this.loginInfo.role === environment.Approver) {
                                if (Array.isArray(this.dataEntriesPending)) {
                                    this.issended = this.dataEntriesPending.every(
                                        (category) =>
                                            category.status != environment.pending
                                    );
                                }
                            }
                        }
                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 2) {
            this.trackingService
                .getSendforApprovalrefDataEntries(facilityID, this.convertedYear)
                .subscribe({
                    next: (response) => {
                        if (response === 'No Data Point') {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response;
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                            if (this.loginInfo.role === environment.Approver) {
                                if (Array.isArray(this.dataEntriesPending)) {
                                    this.issended = this.dataEntriesPending.every(
                                        (category) =>
                                            category.status != environment.pending
                                    );
                                }
                            }
                        }
                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 3) {
            this.trackingService
                .getSendforApprovalFireDataEntries(facilityID, this.convertedYear)
                .subscribe({
                    next: (response) => {
                        if (response === 'No Data Point') {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response;
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                            if (this.loginInfo.role === environment.Approver) {
                                if (Array.isArray(this.dataEntriesPending)) {
                                    this.issended = this.dataEntriesPending.every(
                                        (category) =>
                                            category.status != environment.pending
                                    );
                                }
                            }
                        }
                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 5) {
            this.trackingService
                .getSendforApprovalelecDataEntries(facilityID, this.convertedYear)
                .subscribe({
                    next: (response) => {
                        if (response === 'No Data Point') {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response;
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                            if (this.loginInfo.role === environment.Approver) {
                                if (Array.isArray(this.dataEntriesPending)) {
                                    this.issended = this.dataEntriesPending.every(
                                        (category) =>
                                            category.status != environment.pending
                                    );
                                }
                            }
                        }
                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 6) {
            this.trackingService
                .getSendforApprovalVehicleDataEntries(facilityID, this.convertedYear)
                .subscribe({
                    next: (response) => {
                        if (response === 'No Data Point') {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response;
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                            if (this.loginInfo.role === environment.Approver) {
                                if (Array.isArray(this.dataEntriesPending)) {
                                    this.issended = this.dataEntriesPending.every(
                                        (category) =>
                                            category.status != environment.pending
                                    );
                                }
                            }
                        }
                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 7) {
            this.trackingService
                .getSendforApprovalHSDataEntries(facilityID, this.convertedYear)
                .subscribe({
                    next: (response) => {
                        if (response === 'No Data Point') {
                            this.dataEntriesPending = null;
                        } else {
                            this.dataEntriesPending = response;
                            if (Array.isArray(this.dataEntriesPending)) {
                                for (let d of this.dataEntriesPending) {
                                    if (d.status === environment.approved) {
                                        const month = d.month;
                                        switch (month) {
                                            case 'April':
                                                this.months.april = true;
                                                break;
                                            case 'May':
                                                this.months.may = true;
                                                break;
                                            case 'June':
                                                this.months.june = true;
                                                break;
                                            case 'July':
                                                this.months.july = true;
                                                break;
                                            case 'August':
                                                this.months.august = true;
                                                break;
                                            case 'September':
                                                this.months.september = true;
                                                break;
                                            case 'October':
                                                this.months.october = true;
                                                break;
                                            case 'November':
                                                this.months.november = true;
                                                break;
                                            case 'December':
                                                this.months.december = true;
                                                break;
                                            case 'January':
                                                this.months.january = true;
                                                break;
                                            case 'February':
                                                this.months.february = true;
                                                break;
                                            case 'March':
                                                this.months.march = true;
                                                break;
                                            default:
                                                // Handle unknown month value
                                                break;
                                        }
                                    }
                                }
                                if (this.loginInfo.role != environment.Approver) {
                                    if (Array.isArray(this.dataEntriesPending)) {
                                        this.issended =
                                            this.dataEntriesPending.every(
                                                (category) =>
                                                    category.sendForApproval ===
                                                    true
                                            );
                                    }
                                }
                            }
                            if (this.loginInfo.role === environment.Approver) {
                                if (Array.isArray(this.dataEntriesPending)) {
                                    this.issended = this.dataEntriesPending.every(
                                        (category) =>
                                            category.status != environment.pending
                                    );
                                }
                            }
                        }
                    },
                    error: (err) => {
                        this.notification.showError(
                            'Get data Point failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }

    };

    isOutOfStock(data) {
        return data.inventoryStatus === 'OUTOFSTOCK';
    };
    AcceptAllEntry() {
        if (this.selectedEntry.length === 0) {
            this.notification.showWarning('Please select any entry', 'Warning');
            return;
        }
        if (this.selectedCategory == 1) {
            this.sendSCEntries = []; // Clear the sendEntries array before populating it again
            this.selectedEntry.forEach((element) => {
                this.sendSCelement = {
                    // Create a new object for each iteration
                    id: element.dataEntryID,
                    manageDataPointSubCategoriesID: element.subcategoryID,
                    month: element.month,
                    note: element.note,
                    readingValue: element.readingValue,
                    sendForApproval: element.sendForApproval,
                    status: environment.approved,
                    statusDate: new Date(),
                    submissionDate: element.submissionDate,
                    unit: element.unit,
                    year: element.year,
                    fileName: element.fileName,
                    filePath: element.filePath,
                    tenantID: element.tenantID,
                    gHGEmission: element.ghgEmission,
                    reason: this.sendSCelement.reason,
                    blendID: element.blendID,
                    blendPercent: element.blendPercent,
                    blendType: element.blendType,
                    typeID: element.typeID,
                    calorificValue: element.calorificValue
                };
                if (element.status == 'pending') {
                    this.sendSCEntries.push(this.sendSCelement); // Add the new object to the sendEntries array
                }
            });

            this.trackingService.UpdateSCEntry(this.sendSCEntries).subscribe({
                next: (response) => {
                    if (response == environment.EntrySended) {
                        this.notification.showSuccess(
                            'Entries Approved',
                            'Success'
                        );
                        if (this.loginInfo.role == environment.Approver) {
                            this.GetsendforApprovalDataPoint(this.loginInfo.facilityID);
                        }
                        if (this.loginInfo.role == environment.Preparer || this.loginInfo.role == environment.Manager) {
                            this.ALLEntries(this.loginInfo.facilityID);

                        } else {
                            this.ALLEntries(this.facilityID);
                        }
                        var count = this.sendSCEntries.length;
                        var recipient = environment.Preparer;
                        var message = environment.SendAcceptMessage;
                        this.SendNotification(count, recipient, message);
                    } else {
                        this.notification.showWarning(
                            'Entries not Approved',
                            'Warning'
                        );
                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Entries Approval Failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                }
            });
        }
        if (this.selectedCategory == 2) {
            this.sendrefEntries = []; // Clear the sendEntries array before populating it again
            this.selectedEntry.forEach((element) => {
                this.sendrefelement = {
                    // Create a new object for each iteration
                    id: element.dataEntryID,
                    manageDataPointSubCategoriesID: element.subcategoryID,
                    month: element.month,
                    note: element.note,
                    sendForApproval: element.sendForApproval,
                    status: environment.approved,
                    statusDate: new Date(),
                    submissionDate: element.submissionDate,
                    unit: element.unit,
                    year: element.year,
                    fileName: element.fileName,
                    filePath: element.filePath,
                    tenantID: element.tenantID,
                    gHGEmission: element.ghgEmission,
                    reason: this.sendSCelement.reason,
                    refAmount: element.refAmount,
                    typeID: element.typeID
                    // cO2LeakagePerUnit: element.cO2LeakagePerUnit,
                    // capacity: element.capacity,
                    // leakagePerOfCapacity: element.leakagePerOfCapacity,
                    // airConnIDRef: element.airConnIDRef
                };
                if (element.status == 'pending') {
                    this.sendrefEntries.push(this.sendrefelement); // Add the new object to the sendEntries array
                }
            });

            this.trackingService.UpdaterefEntry(this.sendrefEntries).subscribe({
                next: (response) => {
                    if (response == environment.EntrySended) {
                        this.notification.showSuccess(
                            'Entries Approved',
                            'Success'
                        );
                        if (this.loginInfo.role == environment.Approver) {
                            this.GetsendforApprovalDataPoint(this.loginInfo.facilityID);
                        }
                        if (this.loginInfo.role == environment.Preparer || this.loginInfo.role == environment.Manager) {
                            this.ALLEntries(this.loginInfo.facilityID);

                        } else {
                            this.ALLEntries(this.facilityID);
                        }
                        var count = this.sendrefEntries.length;
                        var recipient = environment.Preparer;
                        var message = environment.SendAcceptMessage;
                        this.SendNotification(count, recipient, message);
                    } else {
                        this.notification.showWarning(
                            'Entries not Approved',
                            'Warning'
                        );
                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Entries Approval Failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                }
            });
        }
        if (this.selectedCategory == 3) {
            this.sendfireEntries = []; // Clear the sendEntries array before populating it again
            this.selectedEntry.forEach((element) => {
                this.sendfireelement = {
                    // Create a new object for each iteration
                    id: element.dataEntryID,
                    manageDataPointSubCategoriesID: element.subcategoryID,
                    month: element.month,
                    note: element.note,
                    sendForApproval: element.sendForApproval,
                    status: environment.approved,
                    statusDate: new Date(),
                    submissionDate: element.submissionDate,
                    unit: element.unit,
                    year: element.year,
                    fileName: element.fileName,
                    filePath: element.filePath,
                    tenantID: element.tenantID,
                    gHGEmission: element.ghgEmission,
                    reason: this.sendSCelement.reason,
                    readingValue: element.readingValue,
                    numberOfExtinguisher: element.numberOfExtinguisher,
                    quantityOfCO2makeup: element.quantityOfCO2makeup,
                    fireExtinguisherID: element.fireExtinguisherID,
                    typeID: element.typeID
                };
                if (element.status == 'pending') {
                    this.sendfireEntries.push(this.sendfireelement); // Add the new object to the sendEntries array
                }
            });

            this.trackingService.UpdatefireEntry(this.sendfireEntries).subscribe({
                next: (response) => {
                    if (response == environment.EntrySended) {
                        this.notification.showSuccess(
                            'Entries Approved',
                            'Success'
                        );
                        if (this.loginInfo.role == environment.Approver) {
                            this.GetsendforApprovalDataPoint(this.loginInfo.facilityID);
                        }
                        if (this.loginInfo.role == environment.Preparer || this.loginInfo.role == environment.Manager) {
                            this.ALLEntries(this.loginInfo.facilityID);

                        } else {
                            this.ALLEntries(this.facilityID);
                        }
                        var count = this.sendfireEntries.length;
                        var recipient = environment.Preparer;
                        var message = environment.SendAcceptMessage;
                        this.SendNotification(count, recipient, message);
                    } else {
                        this.notification.showWarning(
                            'Entries not Approved',
                            'Warning'
                        );
                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Entries Approval Failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                }
            });
        }
        if (this.selectedCategory == 6) {
            this.sendvehicleEntries = []; // Clear the sendEntries array before populating it again
            this.selectedEntry.forEach((element) => {
                this.sendvehicleelement = {
                    // Create a new object for each iteration
                    id: element.dataEntryID,
                    manageDataPointSubCategoriesID: element.subcategoryID,
                    month: element.month,
                    note: element.note,
                    sendForApproval: element.sendForApproval,
                    status: environment.approved,
                    statusDate: new Date(),
                    submissionDate: element.submissionDate,
                    unit: element.unit,
                    year: element.year,
                    fileName: element.fileName,
                    filePath: element.filePath,
                    tenantID: element.tenantID,
                    gHGEmission: element.ghgEmission,
                    reason: this.sendSCelement.reason,
                    readingValue: element.readingValue,
                    noOfVehicles: element.noOfVehicles,
                    modeOfDE: element.modeOfDE,
                    value: element.value,
                    modeofDEID: element.modeofDEID,
                    vehicleTypeID: element.vehicleTypeID,
                    avgPeoplePerTrip: element.avgPeoplePerTrip,
                    totalnoOftripsPerVehicle: element.totalnoOftripsPerVehicle,
                    chargingPerc: element.chargingPerc,
                    typeID: element.typeID
                };
                if (element.status == 'pending') {
                    this.sendvehicleEntries.push(this.sendvehicleelement); // Add the new object to the sendEntries array
                }
            });

            this.trackingService.UpdatevehicleEntry(this.sendvehicleEntries).subscribe({
                next: (response) => {
                    if (response == environment.EntrySended) {
                        this.notification.showSuccess(
                            'Entries Approved',
                            'Success'
                        );
                        if (this.loginInfo.role == environment.Approver) {
                            this.GetsendforApprovalDataPoint(this.loginInfo.facilityID);
                        }
                        if (this.loginInfo.role == environment.Preparer || this.loginInfo.role == environment.Manager) {
                            this.ALLEntries(this.loginInfo.facilityID);

                        } else {
                            this.ALLEntries(this.facilityID);
                        }
                        var count = this.sendvehicleEntries.length;
                        var recipient = environment.Preparer;
                        var message = environment.SendAcceptMessage;
                        this.SendNotification(count, recipient, message);
                    } else {
                        this.notification.showWarning(
                            'Entries not Approved',
                            'Warning'
                        );
                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Entries Approval Failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                }
            });
        }
        if (this.selectedCategory == 5) {
            this.sendelecEntries = []; // Clear the sendEntries array before populating it again
            this.selectedEntry.forEach((element) => {
                this.sendelecelement = {
                    // Create a new object for each iteration
                    id: element.dataEntryID,
                    manageDataPointSubCategoriesID: element.subcategoryID,
                    month: element.month,
                    note: element.note,
                    sendForApproval: element.sendForApproval,
                    status: environment.approved,
                    statusDate: new Date(),
                    submissionDate: element.submissionDate,
                    unit: element.unit,
                    year: element.year,
                    fileName: element.fileName,
                    filePath: element.filePath,
                    tenantID: element.tenantID,
                    gHGEmission: element.ghgEmission,
                    reason: this.sendSCelement.reason,
                    readingValue: element.readingValue,
                    sourceID: element.sourceID,
                    sourceName: element.sourceName,
                    typeID: element.typeID,
                    electricityRegionID: element.electricityRegionID
                };
                if (element.status == 'pending') {
                    this.sendelecEntries.push(this.sendelecelement); // Add the new object to the sendEntries array
                }
            });

            this.trackingService.UpdateelecEntry(this.sendelecEntries).subscribe({
                next: (response) => {
                    if (response == environment.EntrySended) {
                        this.notification.showSuccess(
                            'Entries Approved',
                            'Success'
                        );
                        if (this.loginInfo.role == environment.Approver) {
                            this.GetsendforApprovalDataPoint(this.loginInfo.facilityID);
                        }
                        if (this.loginInfo.role == environment.Preparer || this.loginInfo.role == environment.Manager) {
                            this.ALLEntries(this.loginInfo.facilityID);

                        } else {
                            this.ALLEntries(this.facilityID);
                        }
                        var count = this.sendelecEntries.length;
                        var recipient = environment.Preparer;
                        var message = environment.SendAcceptMessage;
                        this.SendNotification(count, recipient, message);
                    } else {
                        this.notification.showWarning(
                            'Entries not Approved',
                            'Warning'
                        );
                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Entries Approval Failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                }
            });
        }
        if (this.selectedCategory == 7) {
            this.sendHSEntries = []; // Clear the sendEntries array before populating it again
            this.selectedEntry.forEach((element) => {
                this.sendHSelement = {
                    // Create a new object for each iteration
                    id: element.dataEntryID,
                    manageDataPointSubCategoriesID: element.subcategoryID,
                    month: element.month,
                    note: element.note,
                    sendForApproval: element.sendForApproval,
                    status: environment.approved,
                    statusDate: new Date(),
                    submissionDate: element.submissionDate,
                    unit: element.unit,
                    year: element.year,
                    fileName: element.fileName,
                    filePath: element.filePath,
                    tenantID: element.tenantID,
                    gHGEmission: element.ghgEmission,
                    reason: this.sendSCelement.reason,
                    readingValue: element.readingValue,
                    typeID: element.typeID
                };
                if (element.status == 'pending') {
                    this.sendHSEntries.push(this.sendHSelement); // Add the new object to the sendEntries array
                }
            });

            this.trackingService.UpdateHSEntry(this.sendHSEntries).subscribe({
                next: (response) => {
                    if (response == environment.EntrySended) {
                        this.notification.showSuccess(
                            'Entries Approved',
                            'Success'
                        );
                        if (this.loginInfo.role == environment.Approver) {
                            this.GetsendforApprovalDataPoint(this.loginInfo.facilityID);
                        }
                        if (this.loginInfo.role == environment.Preparer || this.loginInfo.role == environment.Manager) {
                            this.ALLEntries(this.loginInfo.facilityID);

                        } else {
                            this.ALLEntries(this.facilityID);
                        }
                        var count = this.sendHSEntries.length;
                        var recipient = environment.Preparer;
                        var message = environment.SendAcceptMessage;
                        this.SendNotification(count, recipient, message);
                    } else {
                        this.notification.showWarning(
                            'Entries not Approved',
                            'Warning'
                        );
                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Entries Approval Failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                }
            });
        }

    }
    AcceptSingleEntry() {
        const entry = this.dataEntry;
        console.log(this.dataEntry);
        console.log(this.sendApprovalEntries);
        this.sendApprovalEntries = [];
        if (entry.ID == undefined || entry.ID == null) {
            this.selectedObjectEntry = {
                // Create a new object for each iteration
                id: entry.id,
                categoryID: entry.categoryID,
                tablename: entry.tablename
            };

        } else {
            this.selectedObjectEntry = {
                // Create a new object for each iteration
                id: entry.id,
                categoryID: entry.categoryID,
                tablename: entry.tablename
            };
        }
        this.sendApprovalEntries.push(this.selectedObjectEntry); // Add the new object to the sendEntries array

        let stringfyUrlData = JSON.stringify(this.sendApprovalEntries)
        const formURlData = new URLSearchParams();
        formURlData.set('updateJson', stringfyUrlData);
        formURlData.set('categoryID', entry.categoryID);

        this.trackingService
            .newSendSCSingleDataforApprove(formURlData)
            .subscribe({
                next: (response) => {
                    console.log(response);
                    if (response.success == true) {
                        this.notification.showSuccess(
                            'Entry Approved',
                            'Success'
                        );
                        this.ALLEntries(this.facilityID);
                        this.onClose2();
                        this.sendApprovalEntries = [];
                       
                        this.selectedEntry = [];
                    } else {
                        this.notification.showWarning(
                            'Entry not Approved',
                            'Warning'
                        );
                        this.onClose2();
                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Entry Approval Failed.',
                        'Error'
                    );
                    this.onClose2();
                    console.error('errrrrrr>>>>>>', err);
                }
            });

    };

    RejectSingleEntry() {
        const entry = this.dataEntry;

        this.sendApprovalEntries = [];

        this.selectedObjectEntry = {
            // Create a new object for each iteration
            id: entry.id,

            categoryID: entry.categoryID,
            tablename: entry.tablename,
            Reason: entry.reason
        };
        this.sendApprovalEntries.push(this.selectedObjectEntry); // Add the new object to the sendEntries array

        let stringfyUrlData = JSON.stringify(this.sendApprovalEntries)
        const formURlData = new URLSearchParams();
        formURlData.set('updateJson', stringfyUrlData);
        formURlData.set('categoryID', entry.categoryID);


        this.trackingService
            .newSendDeleteSingleDataforApprove(formURlData)
            .subscribe({
                next: (response) => {
                    if (response.success == true) {
                        this.notification.showSuccess(
                            'Entry Rejected',
                            'Success'
                        );
                        this.ALLEntries(this.facilityID);
                        this.visible = false;

                        this.onClose2();
       
                        this.selectedEntry = [];
                    } else {
                        this.notification.showWarning(
                            'Entry not Rejected',
                            'Warning'
                        );
                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Entry Rejection Failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                }
            });
        return
     
    }

    SendNotification(count, recipient, message) {
        var currentDate = new Date();
        this.sendNotificationData = new SendNotification();
        (this.sendNotificationData.facilityID = this.facilityID),
            (this.sendNotificationData.message = message);
        this.sendNotificationData.isRead = false;
        this.sendNotificationData.count = count;
        this.sendNotificationData.tenantID = this.loginInfo.tenantID;
        this.sendNotificationData.createdDate = currentDate;
        this.sendNotificationData.recipient = recipient;
        this.notification
            .SaveNotifications(this.sendNotificationData)
            .subscribe({
                next: (response) => { },
                error: (err) => {
                    console.error(err);
                },
                complete: () => console.info('notification send')
            });
    }
    downloadFile(fileName) {
        if (fileName) {
            this.trackingService.downloadFile(fileName).subscribe(
                (response: Blob) => {
                    const url = window.URL.createObjectURL(response);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName; // Specify the desired file name
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    this.toastr.success('Doc downloaded successfully');
                },
                (error) => {
                    console.error('Error downloading the file.', error);
                    this.toastr.error('Error downloading the file.');
                }
            );
        } else {
            this.toastr.warning('File not found!');
        }
    }
    FilterByYear() {
        if (this.loginInfo.role == environment.Approver) {
            this.GetsendforApprovalDataPoint(this.loginInfo.facilityID);
        }
        if (this.loginInfo.role == environment.Preparer || this.loginInfo.role == environment.Manager) {
            this.ALLEntries(this.loginInfo.facilityID);

        } else {
            this.ALLEntries(this.facilityID);
        }
    }
    EditDataEntry(dataEntry: any) {
        // this.trackingService.dataEntry = dataEntry;
        // this.router.navigate(['/tracking']);
    }
    onRowEditInit(dataEntry: PendingDataEntries) {
        this.clonedProducts[dataEntry.dataEntryID as any] = { ...dataEntry };
    }

    onRowEditSave(dataENtry: PendingDataEntries) {
        if (this.selectedCategory == 1) {
            this.sendSCelement = {
                id: dataENtry.dataEntryID,
                manageDataPointSubCategoriesID: dataENtry.subcategoryID,
                month: dataENtry.month,
                note: dataENtry.note,
                readingValue: dataENtry.readingValue,
                sendForApproval: dataENtry.sendForApproval,
                status: dataENtry.status,
                statusDate: dataENtry.statusDate,
                submissionDate: dataENtry.submissionDate,
                unit: dataENtry.unit,
                year: dataENtry.year,
                fileName: dataENtry.fileName,
                filePath: dataENtry.filePath,
                tenantID: dataENtry.tenantID,
                gHGEmission: dataENtry.ghgEmission,
                reason: dataENtry.reason,
                blendID: dataENtry.blendID,
                blendPercent: dataENtry.blendPercent,
                blendType: dataENtry.blendType,
                typeID: dataENtry.typeID,
                calorificValue: dataENtry.calorificValue
            };
            this.trackingService
                .sendSCSingleDataforApprove(this.sendSCelement.id, this.sendSCelement)
                .subscribe({
                    next: (response) => {
                        if (response == environment.Updated) {
                            this.notification.showSuccess(
                                'Entry Approved',
                                'Success'
                            );
                            if (this.loginInfo.role == environment.Approver) {
                                this.GetsendforApprovalDataPoint(this.loginInfo.facilityID);
                            }
                            if (this.loginInfo.role == environment.Preparer || this.loginInfo.role == environment.Manager) {
                                this.ALLEntries(this.loginInfo.facilityID);

                            } else {
                                this.ALLEntries(this.facilityID);
                            }
                            var count = 1;
                            var recipient = environment.Approver;
                            var message = environment.Updated;
                            this.SendNotification(count, recipient, message);
                            this.selectedEntry = [];
                        } else {
                            this.notification.showWarning(
                                'Entry Updated',
                                'Warning'
                            );
                        }
                    },
                    error: (err) => {
                        this.notification.showError(
                            'Entry update Failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 2) {
            this.sendrefelement = {
                id: dataENtry.dataEntryID,
                manageDataPointSubCategoriesID: dataENtry.subcategoryID,
                month: dataENtry.month,
                note: dataENtry.note,
                sendForApproval: dataENtry.sendForApproval,
                status: dataENtry.status,
                statusDate: dataENtry.statusDate,
                submissionDate: dataENtry.submissionDate,
                unit: dataENtry.unit,
                year: dataENtry.year,
                fileName: dataENtry.fileName,
                filePath: dataENtry.filePath,
                tenantID: dataENtry.tenantID,
                gHGEmission: dataENtry.ghgEmission,
                reason: dataENtry.reason,
                refAmount: dataENtry.refAmount,
                typeID: dataENtry.typeID
                // cO2LeakagePerUnit: dataENtry.cO2LeakagePerUnit,
                // capacity: dataENtry.capacity,
                // leakagePerOfCapacity: dataENtry.leakagePerOfCapacity,
                // airConnIDRef: dataENtry.airConnIDRef
            };
            this.trackingService
                .sendrefSingleDataforApprove(this.sendrefelement.id, this.sendrefelement)
                .subscribe({
                    next: (response) => {
                        if (response == environment.Updated) {
                            this.notification.showSuccess(
                                'Entry Updated',
                                'Success'
                            );
                            if (this.loginInfo.role == environment.Approver) {
                                this.GetsendforApprovalDataPoint(this.loginInfo.facilityID);
                            }
                            if (this.loginInfo.role == environment.Preparer || this.loginInfo.role == environment.Manager) {
                                this.ALLEntries(this.loginInfo.facilityID);

                            } else {
                                this.ALLEntries(this.facilityID);
                            }
                            var count = 1;
                            var recipient = environment.Approver;
                            var message = environment.SendAcceptMessage;
                            this.SendNotification(count, recipient, message);
                            this.selectedEntry = [];
                        } else {
                            this.notification.showWarning(
                                'Entry not Approved',
                                'Warning'
                            );
                        }
                    },
                    error: (err) => {
                        this.notification.showError(
                            'Entry update Failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 3) {
            this.sendfireelement = {
                id: dataENtry.dataEntryID,
                manageDataPointSubCategoriesID: dataENtry.subcategoryID,
                month: dataENtry.month,
                note: dataENtry.note,
                readingValue: dataENtry.readingValue,
                sendForApproval: dataENtry.sendForApproval,
                status: dataENtry.status,
                statusDate: dataENtry.statusDate,
                submissionDate: dataENtry.submissionDate,
                unit: dataENtry.unit,
                year: dataENtry.year,
                fileName: dataENtry.fileName,
                filePath: dataENtry.filePath,
                tenantID: dataENtry.tenantID,
                gHGEmission: dataENtry.ghgEmission,
                reason: dataENtry.reason,
                numberOfExtinguisher: dataENtry.numberOfExtinguisher,
                quantityOfCO2makeup: dataENtry.quantityOfCO2makeup,
                fireExtinguisherID: dataENtry.fireExtinguisherID,
                typeID: dataENtry.typeID
            };
            this.trackingService
                .sendfireSingleDataforApprove(this.sendfireelement.id, this.sendfireelement)
                .subscribe({
                    next: (response) => {
                        if (response == environment.Updated) {
                            this.notification.showSuccess(
                                'Entry Updated',
                                'Success'
                            );
                            if (this.loginInfo.role == environment.Approver) {
                                this.GetsendforApprovalDataPoint(this.loginInfo.facilityID);
                            }
                            if (this.loginInfo.role == environment.Preparer || this.loginInfo.role == environment.Manager) {
                                this.ALLEntries(this.loginInfo.facilityID);

                            } else {
                                this.ALLEntries(this.facilityID);
                            }
                            var count = 1;
                            var recipient = environment.Approver;
                            var message = environment.SendAcceptMessage;
                            this.SendNotification(count, recipient, message);
                            this.selectedEntry = [];
                        } else {
                            this.notification.showWarning(
                                'Entry not updated',
                                'Warning'
                            );
                        }
                    },
                    error: (err) => {
                        this.notification.showError(
                            'Entry updated Failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 5) {
            this.sendelecelement = {
                id: dataENtry.dataEntryID,
                manageDataPointSubCategoriesID: dataENtry.subcategoryID,
                month: dataENtry.month,
                note: dataENtry.note,
                readingValue: dataENtry.readingValue,
                sendForApproval: dataENtry.sendForApproval,
                status: dataENtry.status,
                statusDate: dataENtry.statusDate,
                submissionDate: dataENtry.submissionDate,
                unit: dataENtry.unit,
                year: dataENtry.year,
                fileName: dataENtry.fileName,
                filePath: dataENtry.filePath,
                tenantID: dataENtry.tenantID,
                gHGEmission: dataENtry.ghgEmission,
                reason: dataENtry.reason,
                sourceID: dataENtry.sourceID,
                sourceName: dataENtry.sourceName,
                typeID: dataENtry.typeID,
                electricityRegionID: dataENtry.electricityRegionID
            };
            this.trackingService
                .sendelecSingleDataforApprove(this.sendelecelement.id, this.sendelecelement)
                .subscribe({
                    next: (response) => {
                        if (response == environment.Updated) {
                            this.notification.showSuccess(
                                'Entry Updated',
                                'Success'
                            );
                            if (this.loginInfo.role == environment.Approver) {
                                this.GetsendforApprovalDataPoint(this.loginInfo.facilityID);
                            }
                            if (this.loginInfo.role == environment.Preparer || this.loginInfo.role == environment.Manager) {
                                this.ALLEntries(this.loginInfo.facilityID);

                            } else {
                                this.ALLEntries(this.facilityID);
                            }
                            var count = 1;
                            var recipient = environment.Approver;
                            var message = environment.SendAcceptMessage;
                            this.SendNotification(count, recipient, message);
                            this.selectedEntry = [];
                        } else {
                            this.notification.showWarning(
                                'Entry not updated',
                                'Warning'
                            );
                        }
                    },
                    error: (err) => {
                        this.notification.showError(
                            'Entry update Failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 6) {
            this.sendvehicleelement = {
                id: dataENtry.dataEntryID,
                manageDataPointSubCategoriesID: dataENtry.subcategoryID,
                month: dataENtry.month,
                note: dataENtry.note,
                readingValue: dataENtry.readingValue,
                sendForApproval: dataENtry.sendForApproval,
                status: dataENtry.status,
                statusDate: dataENtry.statusDate,
                submissionDate: dataENtry.submissionDate,
                unit: dataENtry.unit,
                year: dataENtry.year,
                fileName: dataENtry.fileName,
                filePath: dataENtry.filePath,
                tenantID: dataENtry.tenantID,
                gHGEmission: dataENtry.ghgEmission,
                reason: dataENtry.reason,
                noOfVehicles: dataENtry.noOfVehicles,
                modeOfDE: dataENtry.modeOfDE,
                value: dataENtry.value,
                modeofDEID: dataENtry.modeofDEID,
                vehicleTypeID: dataENtry.vehicleTypeID,
                avgPeoplePerTrip: dataENtry.avgPeoplePerTrip,
                totalnoOftripsPerVehicle: dataENtry.totalnoOftripsPerVehicle,
                chargingPerc: dataENtry.chargingPerc,
                typeID: dataENtry.typeID
            };
            this.trackingService
                .sendvehicleSingleDataforApprove(this.sendvehicleelement.id, this.sendvehicleelement)
                .subscribe({
                    next: (response) => {
                        if (response == environment.Updated) {
                            this.notification.showSuccess(
                                'Entry Updated',
                                'Success'
                            );
                            if (this.loginInfo.role == environment.Approver) {
                                this.GetsendforApprovalDataPoint(this.loginInfo.facilityID);
                            }
                            if (this.loginInfo.role == environment.Preparer || this.loginInfo.role == environment.Manager) {
                                this.ALLEntries(this.loginInfo.facilityID);

                            } else {
                                this.ALLEntries(this.facilityID);
                            }
                            var count = 1;
                            var recipient = environment.Approver;
                            var message = environment.SendAcceptMessage;
                            this.SendNotification(count, recipient, message);
                            this.selectedEntry = [];
                        } else {
                            this.notification.showWarning(
                                'Entry not Updated',
                                'Warning'
                            );
                        }
                    },
                    error: (err) => {
                        this.notification.showError(
                            'Entry Update Failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
        if (this.selectedCategory == 7) {
            this.sendHSelement = {
                id: dataENtry.dataEntryID,
                manageDataPointSubCategoriesID: dataENtry.subcategoryID,
                month: dataENtry.month,
                note: dataENtry.note,
                readingValue: dataENtry.readingValue,
                sendForApproval: dataENtry.sendForApproval,
                status: dataENtry.status,
                statusDate: dataENtry.statusDate,
                submissionDate: dataENtry.submissionDate,
                unit: dataENtry.unit,
                year: dataENtry.year,
                fileName: dataENtry.fileName,
                filePath: dataENtry.filePath,
                tenantID: dataENtry.tenantID,
                gHGEmission: dataENtry.ghgEmission,
                reason: dataENtry.reason,
                typeID: dataENtry.typeID
            };
            this.trackingService
                .sendHSSingleDataforApprove(this.sendHSelement.id, this.sendHSelement)
                .subscribe({
                    next: (response) => {
                        if (response == environment.Updated) {
                            this.notification.showSuccess(
                                'Entry Updated',
                                'Success'
                            );
                            if (this.loginInfo.role == environment.Approver) {
                                this.GetsendforApprovalDataPoint(this.loginInfo.facilityID);
                            }
                            if (this.loginInfo.role == environment.Preparer || this.loginInfo.role == environment.Manager) {
                                this.ALLEntries(this.loginInfo.facilityID);

                            } else {
                                this.ALLEntries(this.facilityID);
                            }
                            var count = 1;
                            var recipient = environment.Approver;
                            var message = environment.SendAcceptMessage;
                            this.SendNotification(count, recipient, message);
                            this.selectedEntry = [];
                        } else {
                            this.notification.showWarning(
                                'Entry not Updated',
                                'Warning'
                            );
                        }
                    },
                    error: (err) => {
                        this.notification.showError(
                            'Entry Update Failed.',
                            'Error'
                        );
                        console.error('errrrrrr>>>>>>', err);
                    }
                });
        }
    }
    DeleteEntry(dataENtry: PendingDataEntries) {
        this.trackingService.DeleteEntry(dataENtry.dataEntryID, this.selectedCategory).subscribe({
            next: (response) => {
                if (response == true) {
                    this.notification.showSuccess('Entry Updated', 'Success');
                    if (this.loginInfo.role == environment.Approver) {
                        this.GetsendforApprovalDataPoint(this.loginInfo.facilityID);
                    }
                    if (this.loginInfo.role == environment.Preparer || this.loginInfo.role == environment.Manager) {
                        this.ALLEntries(this.loginInfo.facilityID);

                    } else {
                        this.ALLEntries(this.facilityID);
                    }
                } else {
                    this.notification.showWarning(
                        'Entry not apdated',
                        'Warning'
                    );
                }
            },
            error: (err) => {
                this.notification.showError('Entry Update Failed.', 'Error');
                console.error('errrrrrr>>>>>>', err);
            }
        });
    }

    onRowEditCancel(dataENtry: PendingDataEntries, index: number) { }
    onRowDelete(de) { }
    getCat() {
        this.trackingService.newgetCategory().subscribe({
            next: (response) => {

                console.log(response);
                this.AllCategory = response;
                this.selectedCategory = this.AllCategory[0].id;
                if (this.loginInfo.role == environment.Approver) {
                    this.GetsendforApprovalDataPoint(this.loginInfo.facilityID);
                }
                if (this.loginInfo.role == environment.Preparer || this.loginInfo.role == environment.Manager) {
                    // this.ALLEntries(this.loginInfo.facilityID);
                    this.ALLEntries(this.facilityID);

                } else {
                    this.ALLEntries(this.facilityID);
                }
            }
        })
    }
    getEntry() {
        this.ALLEntries(this.facilityID);
    }
    GetAssignedDataPoint(facilityID: number) {
        this.AssignedDataPoint = [];
        this.trackingService
            .getSavedDataPointforTracking(facilityID)
            .subscribe({
                next: (response) => {
                    if (response === environment.NoData) {

                    } else {
                        this.AssignedDataPoint = response;
                        this.AssignedDataPoint.forEach(scope => {
                            scope.manageDataPointCategories.forEach(Category => {
                                if (Category.manageDataPointCategorySeedID == 1) {
                                    Category.manageDataPointSubCategories.forEach(subCat => {
                                        if (subCat.isMandatory == true) {
                                            this.mandatorySCDP.push(subCat.subCatName)
                                        }

                                    })
                                }
                                if (Category.manageDataPointCategorySeedID == 2) {
                                    Category.manageDataPointSubCategories.forEach(subCat => {
                                        if (subCat.isMandatory == true) {
                                            this.mandatoryRefDP.push(subCat.subCatName)
                                        }

                                    })
                                }
                                if (Category.manageDataPointCategorySeedID == 3) {
                                    Category.manageDataPointSubCategories.forEach(subCat => {
                                        if (subCat.isMandatory == true) {
                                            this.mandatoryFireDP.push(subCat.subCatName)
                                        }

                                    })
                                }
                                if (Category.manageDataPointCategorySeedID == 6) {
                                    Category.manageDataPointSubCategories.forEach(subCat => {
                                        if (subCat.isMandatory == true) {
                                            this.mandatoryVehicleDP.push(subCat.subCatName)
                                        }

                                    })
                                }
                                if (Category.manageDataPointCategorySeedID == 5) {
                                    Category.manageDataPointSubCategories.forEach(subCat => {
                                        if (subCat.isMandatory == true) {
                                            this.mandatoryElecDP.push(subCat.subCatName)
                                        }

                                    })
                                }
                                if (Category.manageDataPointCategorySeedID == 7) {
                                    Category.manageDataPointSubCategories.forEach(subCat => {
                                        if (subCat.isMandatory == true) {
                                            this.mandatoryHSDP.push(subCat.subCatName)
                                        }

                                    })
                                }
                            })
                        })
                    }
                },
                error: (err) => {
                    this.notification.showError(
                        'Get data Point failed.',
                        'Error'
                    );
                    console.error('errrrrrr>>>>>>', err);
                }
            });
    }

}
