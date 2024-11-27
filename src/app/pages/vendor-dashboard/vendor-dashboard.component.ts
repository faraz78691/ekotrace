import { Component } from '@angular/core';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.scss']
})
export class VendorDashboardComponent {
  // flightsTravelTypes:any[]= []

  flightsTravelTypes =
  [

      {
          "id": 1,
          "flightType": "Standard Goods"
      },
      {
          "id": 2,
          "flightType": "Capital Goods"
      },
      {
          "id": 3,
          "flightType": "Standard Services"
      }

  ];
  
  shortBy =
  [

      {
          "id": 1,
          "shortBy": "Rank high to Low"
      },
      {
          "id": 2,
          "shortBy": "Rank by Emisissions"
      },
      {
          "id": 3,
          "shortBy": "Rank by Emissions to Expense Ratio"
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
}
