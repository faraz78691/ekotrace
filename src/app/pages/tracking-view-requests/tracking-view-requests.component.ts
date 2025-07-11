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
    dataEntriesPending: PendingDataEntries[] = [];
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
    BusinessEntires: any[] = [];
    mandatoryFireDP: any[] = [];
    mandatoryVehicleDP: any[] = [];
    mandatoryElecDP: any[] = [];
    mandatoryHSDP: any[] = [];
    dataEntry: any;
    display = 'none'
    Modes: any[] = [];
    selectMode: number = 1
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

    };

    ngDoCheck() {

        let fId = sessionStorage.getItem('SelectedfacilityID');
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
        console.log(this.selectedEntry);

        if (this.loginInfo.role == 'Auditor') {
            this.notification.showWarning('You are not Authorized', 'Warning');
            return
        }
        if (this.loginInfo.role == 'Preparer') {
            this.notification.showWarning(
                'You are not Authorized to approve entry',
                'Warning'
            );
            return false
        }
        if (this.selectedEntry.length === 0) {
            this.notification.showWarning('Please select any entry', 'Warning');
            return
        }
        if (this.selectedEntry[0].ID == undefined || this.selectedEntry[0].ID == null) {
            this.sendApprovalEntries = [];
            this.sendSCEntries = [];
            this.selectedEntry.forEach((element) => {
                if (element.status === 'Pending') {
                    const selectedObject = {
                        id: element.id,
                        categoryID: element.categoryID,
                        tablename: element.tablename
                    };
                    this.sendApprovalEntries.push(selectedObject);
                }
            });
        } else {
            console.log(this.selectedEntry);
            this.sendSCEntries = [];

            this.sendApprovalEntries = [];
            this.selectedEntry.forEach((element) => {
                if (element.status === 'Pending') {
                    const selectedObject = {
                        id: element.id,
                        categoryID: element.categoryID,
                        tablename: element.tablename
                    };
                    this.sendApprovalEntries.push(selectedObject);
                }
            });
        }

        let stringfyUrlData = JSON.stringify(this.sendApprovalEntries)
        const formURlData = new URLSearchParams();
        formURlData.set('updateJson', stringfyUrlData);
        formURlData.set('categoryID', this.selectedEntry[0].categoryID.toString());

        this.trackingService.newUpdateSCEntry(formURlData).subscribe({
            next: (response: any) => {

                if (response.success == true) {
                    this.notification.showSuccess(
                        'Entries approved',
                        'Success'
                    );
                    this.ALLEntries(this.facilityID);
                    var recipient = environment.Approver;
                    var message = environment.SendEntryMessage;
                    var count = this.sendEntries.length;

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

                            if (Array.isArray(this.dataEntriesPending)) {
                                for (var i = 0; i < this.mandatorySCDP.length; i++) {
                                    for (var j = 0; j < this.dataEntriesPending.length; j++) {
                                        if (this.dataEntriesPending[j]?.subCatName == this.mandatorySCDP[i].subCatName) {

                                        }
                                    }
                                }
                                // // console.log("dp mandatory>", this.mandatorySCDP);
                                // // console.log("dp list >", this.dataEntriesPending);

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
                                                    "Approved"
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
                            this.BusinessEntires = response.categories
                            if (this.selectMode == 1) {
                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'flight_travel');
                            } else if (this.selectMode == 2) {
                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'hotel_stay');
                            } else if (this.selectMode == 3) {

                                this.dataEntriesPending = (response.categories).filter(items => items.tablename == 'other_modes_of_transport');
                            } else {
                                this.dataEntriesPending = response.categories;
                            }
                            // this.dataEntriesPending = response.categories;

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
   
    AcceptSingleEntry() {
        if (this.loginInfo.role == 'Preparer') {
            this.notification.showWarning(
                'You are not authorized to approve entry',
                'Warning'
            );
            return false
        }
        const entry = this.dataEntry;
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
                    // console.log(response);
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
                    this.sendApprovalEntries = [];
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
                        this.sendApprovalEntries = [];
                    } else {
                        this.notification.showWarning(
                            'Entry not Rejected',
                            'Warning'
                        );
                    }
                    this.sendApprovalEntries = [];
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
        this.ALLEntries(this.facilityID);

    }

    getCat() {
        this.trackingService.newgetCategory().subscribe({
            next: (response) => {

                // console.log(response);
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


    getModesEntry() {
        if (this.selectMode == 1) {
            this.dataEntriesPending = this.BusinessEntires.filter(items => items.tablename == 'flight_travel');
        } else if (this.selectMode == 2) {
            this.dataEntriesPending = this.BusinessEntires.filter(items => items.tablename == 'hotel_stay');
        } else if (this.selectMode == 3) {

            this.dataEntriesPending = this.BusinessEntires.filter(items => items.tablename == 'other_modes_of_transport');
        } else {
            this.dataEntriesPending = this.dataEntriesPending;
        }

    }



}
