import { Component, Input } from '@angular/core';

interface Equipment {
  name: string;
  imageUrl: string;
  ipAddress: string;
  zone: number;
}

@Component({
  selector: 'equipment-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})


export class CardComponent {
  @Input() equipment!: Equipment;

  get imageUrl(): string {
    return this.equipment.imageUrl;
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
