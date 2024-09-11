//DashboardComponent
import { Component } from '@angular/core';
import { CardComponent } from '../card/card.component';

import { CommonModule } from '@angular/common';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardComponent, CommonModule, FilterComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] 
})

export class DashboardComponent {

  equipmentList = [
    {
      "name": "EQP-01-02-29",
      "imageUrl": "assets/images/eq_1.jpeg",
      "ipAddress": "192.168.10.2",
      "zone": 1
    },
    {
      "name": "EQP-02-03-30",
      "imageUrl": "assets/images/eq_2.jpeg",
      "ipAddress": "192.168.10.3",
      "zone": 2
    },
    {
      "name": "EQP-03-04-31",
      "imageUrl": "assets/images/eq_3.jpeg",
      "ipAddress": "192.168.10.4",
      "zone": 3
    },
    {
      "name": "EQP-04-05-32",
      "imageUrl": "assets/images/eq_4.jpeg",
      "ipAddress": "192.168.10.5",
      "zone": 4
    },
    {
      "name": "EQP-05-06-33",
      "imageUrl": "assets/images/eq_1.jpeg",
      "ipAddress": "192.168.10.6",
      "zone": 5
    },
    {
      "name": "EQP-06-07-34",
      "imageUrl": "assets/images/eq_2.jpeg",
      "ipAddress": "192.168.10.7",
      "zone": 6
    },
        {
      "name": "EQP-04-05-32",
      "imageUrl": "assets/images/eq_4.jpeg",
      "ipAddress": "192.168.10.5",
      "zone": 4
    },
    {
      "name": "EQP-05-06-33",
      "imageUrl": "assets/images/eq_1.jpeg",
      "ipAddress": "192.168.10.6",
      "zone": 5
    },
    {
      "name": "EQP-06-07-34",
      "imageUrl": "assets/images/eq_2.jpeg",
      "ipAddress": "192.168.10.7",
      "zone": 6
    },
        {
      "name": "EQP-04-05-32",
      "imageUrl": "assets/images/eq_4.jpeg",
      "ipAddress": "192.168.10.5",
      "zone": 4
    },
    {
      "name": "EQP-05-06-33",
      "imageUrl": "assets/images/eq_1.jpeg",
      "ipAddress": "192.168.10.6",
      "zone": 5
    },
    {
      "name": "EQP-06-07-34",
      "imageUrl": "assets/images/eq_2.jpeg",
      "ipAddress": "192.168.10.7",
      "zone": 6
    }
  ];
}
