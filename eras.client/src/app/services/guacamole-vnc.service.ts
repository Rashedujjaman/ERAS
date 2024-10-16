import { Injectable } from '@angular/core';
import Guacamole from 'guacamole-common-js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class GuacamoleVncService {
  private tunnel: any;
  private client: any;

  constructor(private router: Router) { }

  // Initialization of the Guacamole connection
  public connect(tunnelUrl: string, password: string, url: string): void {
    try {
      //this.tunnel = new Guacamole.WebSocketTunnel(tunnelUrl);
      //this.client = new Guacamole.Client(this.tunnel);

      const displayElement = document.getElementById('guac-container');
      if (displayElement) {
        // Create an iframe element to display the Guacamole session
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.frameBorder = '0';
        displayElement.innerHTML = '';
        displayElement.appendChild(iframe);
        console.log('Guacamole session embedded successfully.');
      } else {
        throw new Error('Display element not found');
        return;
      }

    } catch (error) {
      console.error('Connection error:', error);
      alert('Connection failed. Please check the url and try again.');
    }
  }

  // Disconnect from the server
  public disconnect() {
    const displayElement = document.getElementById('guac-container');
    if (displayElement) {
      displayElement.innerHTML = ''; // Clear the content (remove iframe)
      console.log('Disconnected from the Guacamole session.');
    }
    this.router.navigate(['/dashboard']);
  }
}
