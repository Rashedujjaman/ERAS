import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

interface Equipment {
  name: string;
  image: string;
  ipAddress: string;
  zone: number;
}

@Component({
  selector: 'equipment-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  imports: [MatCardModule],
})


export class CardComponent {
  @Input() equipment!: Equipment;

  get imageUrl(): string {
      return this.equipment.image? `data:image/png;base64,${this.equipment.image}` : 'assets/images/eq_4.jpeg';
  }
  get name(): string{
    return this.equipment.name;
  }
  get ipAddress(): string {
    return this.equipment.ipAddress;
  }
  get zone(): number {
    return this.equipment.zone;
  }

}
