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
                route: '/energy-custom-report'
            },
            {
                heading: 'Water Report',
                pera: ' Pick and choose the data and analysis for review and audits from the array of options provided.',
                button: 'view',
                route: '/water-supply-report'
            },
            {
                heading: 'Waste Report',
                pera: ' Pick and choose the data and analysis for review and audits from the array of options provided.',
                button: 'view',
                route: '/waste-report'
            },
            {
                heading: 'Business Travel Report',
                pera: ' Pick and choose the data and analysis for review and audits from the array of options provided.',
                button: 'view',
                route: '/businessTravel-report'
            },
            {
                heading: 'Vendor Report',
                pera: ' Pick and choose the data and analysis for review and audits from the array of options provided.',
                button: 'view',
                route: '/vendor-report'
            },
            {
                heading: 'Financed Report',
                pera: ' Pick and choose the data and analysis for review and audits from the array of options provided.',
                button: 'view',
                route: '/financed-report'
            },
          
        ];
    }

    ngDoCheck() {
        this.updatedtheme = this.themeservice.getValue('theme');
    }
}
