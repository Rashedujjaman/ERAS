import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'equipment-card-skeleton',
  standalone: true,
  templateUrl: './card-skeleton.html',
  styleUrls: ['./card-skeleton.css'],
  imports: [MatCardModule],
})
export class CardSkeletonComponent { }
