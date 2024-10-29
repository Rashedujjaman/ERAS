import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { GuacamoleVncService } from '../../services/guacamole-vnc.service';
import { Router } from '@angular/router';

interface Equipment {
  name: string;
  hostName: string;
  image: string;
  ipAddress: string;
  zone: number;
  vncPassword: string;
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
  @Input() isLoading!: false;
  urlToken: string = 'MjEAYwBteXNxbA';


  constructor(private vncService: GuacamoleVncService, private router: Router) { }

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

  onClick() {
    this.router.navigate(['/vnc-client'], { queryParams: { urlToken: this.urlToken, hostName: this.equipment.hostName, ip: this.equipment.ipAddress, password: this.equipment.vncPassword } });
    //this.router.navigate(['/vnc-component', this.equipment.ipAddress, this.equipment.vncPassword]);
  }
}
