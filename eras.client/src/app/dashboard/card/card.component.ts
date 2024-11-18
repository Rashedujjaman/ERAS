import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { GuacamoleVncService } from '../../services/guacamole-vnc.service';
import { Router } from '@angular/router';
import { Equipment } from '../../models/equipment';

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

  constructor(private vncService: GuacamoleVncService, private router: Router) { }

  get imageUrl(): string {
    return this.equipment.image? `data:image/png;base64,${this.equipment.image}` : 'assets/images/eq_4.jpeg';
  }
  get name(): string{
    return this.equipment.name ?? '';
  }
  get ipAddress(): string {
    return this.equipment.ipAddress ?? '0.0.0.0';
  }
  get zone(): string {
    return this.equipment.area?.name ?? '';
  }

  onClick() {
    //const authToken = localStorage.getItem('authToken');
    //const url = `http://localhost:8080/guacamole/#/client/${this.equipment.urlToken}?token=${authToken}`;
    //window.open(url, '_blank');

    const queryParams = {
      urlToken: this.equipment.urlToken,
      hostName: this.equipment.hostName,
      ip: this.equipment.ipAddress,
      password: this.equipment.vncPassword
    }
    //this.router.navigate(['/vnc-client'], { queryParams });

    // Construct the URL for the vnc-client component
    const url = this.router.createUrlTree(['/vnc-client'], { queryParams });

    // Open the URL in a new tab with features (optional)
    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  }
}
