import {Component} from '@angular/core';
import {ThemeService} from '@services/theme.service';

interface reports {
    heading: string;
    pera: string;
    button: string;
    route: string;
}
@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss']
})
export class ReportComponent {
    reports: reports[];
    updatedtheme: any;

    constructor(private themeservice: ThemeService) {
        this.reports = [
            {
                heading: 'Custom Report',
                pera: ' Pick and choose the data and analysis for review and audits from the array of options provided.',
                button: 'view',
                route: '/custom-report'
            },
            {
                heading: 'Status',
                pera: 'Review the status of the data entry forms across location for various months.',
                button: 'view',
                route: '/report-status'
            }
        ];
    }

    ngDoCheck() {
        this.updatedtheme = this.themeservice.getValue('theme');
    }
}
