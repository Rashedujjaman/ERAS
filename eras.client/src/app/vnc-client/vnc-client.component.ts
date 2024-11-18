import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuacamoleVncService } from '../services/guacamole-vnc.service';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-vnc-client',
  standalone: true,
  templateUrl: './vnc-client.component.html',
  styleUrls: ['./vnc-client.component.css'],
  imports: [MatIconModule],
})
export class VncClientComponent implements OnInit {
  hostName: string = '';
  ipAddress: string = '';
  vncPassword: string = '';
  urlToken: string = '';
  displayElementId = 'vnc-container';

  constructor(private route: ActivatedRoute, private guacService: GuacamoleVncService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.hostName = params['name']?.trim();
      this.ipAddress = params['ip']?.trim();
      this.vncPassword = params['password']?.trim();
      this.urlToken = params['urlToken']?.trim();

      if (this.ipAddress && this.vncPassword) {
        // Call the service to generate the token and connect
        //this.guacService.generateToken(this.hostName, this.ipAddress, this.vncPassword, this.displayElementId);

        //Call the service to connect to vnc using token
        this.connect(this.urlToken, this.displayElementId)
      } else {
        console.error('Missing IP address or password');
      }
    });
  }

  // Connect to the Server
  public connect(urlToken: string, displayElementId: string): void {
    try {
        const authToken = localStorage.getItem('authToken');
        const clientUrl = `http://localhost:8080/guacamole/#/client/${urlToken}?token=${authToken}`;

        const displayElement = document.getElementById(displayElementId);
        if (displayElement) {
          const iframe = document.createElement('iframe');
          iframe.src = clientUrl;
          iframe.width = '100%';
          iframe.height = '100%';
          iframe.allowFullscreen = true;
          iframe.autofocus = true;
          iframe.frameBorder = '0';
          iframe.setAttribute('tabindex', '-1');
          //displayElement.innerHTML = '';
          //displayElement.append(iframe);
          displayElement.appendChild(iframe);

          iframe.onload = () => {
            iframe.contentWindow?.focus();
          };

          console.log('Guacamole session embedded successfully.');
        } else {
          console.error('Display element not found');
        }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Connection failed. Please check the URL and try again.');
    }
  }

  // Disconnect from the server
  onDisconnect(): void {

    const displayElement = document.getElementById(this.displayElementId);
    if (displayElement) {
      displayElement.innerHTML = '';
      console.log('Disconnected from the Guacamole session.');
    }

    window.close();
  }
}














//import { Component, OnInit } from '@angular/core';
//import { ActivatedRoute } from '@angular/router';
//import { GuacamoleVncService } from '../services/guacamole-vnc.service';
//import { MatIconModule } from '@angular/material/icon';

//@Component({
//  selector: 'app-vnc-client',
//  standalone: true,
//  templateUrl: './vnc-client.component.html',
//  styleUrls: ['./vnc-client.component.css'],
//  imports: [MatIconModule],
//})
//export class VncClientComponent implements OnInit {
//  ipAddress: string = '';
//  vncPassword: string = '';
//  url: string = '';

//  constructor(private route: ActivatedRoute, private guacService: GuacamoleVncService) { }

//  ngOnInit(): void {
//    this.route.queryParams.subscribe(params => {
//      this.ipAddress = params['ip']?.trim();
//      this.vncPassword = params['password']?.trim();
//      //this.url = 'http://localhost:8080/guacamole/#/client/MQBjAG15c3Fs';
//      this.url = 'http://localhost:8080/guacamole/#/client/MgBjAG15c3Fs';

//      if (this.ipAddress && this.vncPassword) {
//        console.log(this.ipAddress, this.vncPassword)
//        const port = 5900;
//        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
//        const tunnelUrl = `${protocol}://localhost:8080/guacamole/websocket-tunnel?token=${this.vncPassword}&hostname=${this.ipAddress}&port=${port}`;
//        //const tunnelUrl = `ws://localhost:${port}`;
//        //const tunnelUrl = `${protocol}://${this.ipAddress}:${port}/guacamole/websocket-tunnel?token=${this.vncPassword}`;
//        //const tunnelUrl = `${protocol}://170.10.10.1:5900`;
//        // Call the connect method from the service
//        this.guacService.connect(tunnelUrl, this.vncPassword, this.url);
//      } else {
//        console.error('Missing IP address or password');
//      }
//    });
//  }

//  onDisconnect(): void {
//    this.guacService.disconnect();
//  }
//}





















//import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
//declare var Guacamole: any;

//@Component({
//  selector: 'app-vnc-client',
//  templateUrl: './vnc-client.component.html',
//  styleUrls: ['./vnc-client.component.css']
//})
//export class VncClientComponent implements OnInit {
//  @ViewChild('vncContainer', { static: true }) vncContainer: ElementRef;

//  private guacamoleClient: any;
//  private tunnel: any;

//  constructor() { }

//  ngOnInit(): void {
//    this.initializeGuacamoleClient();
//  }

//  initializeGuacamoleClient() {
//    // Create a new tunnel to your backend Guacamole servlet
//    this.tunnel = new Guacamole.Tunnel('your-backend-tunnel-url');

//    // Create a new Guacamole client using the tunnel
//    this.guacamoleClient = new Guacamole.Client(this.tunnel);

//    // Add the client display element to the DOM
//    this.vncContainer.nativeElement.appendChild(this.guacamoleClient.getDisplay().getElement());

//    // Connect the Guacamole client (optionally send credentials for VNC authentication)
//    this.guacamoleClient.connect();

//    // Error handling (optional)
//    this.guacamoleClient.onerror = function (error) {
//      console.error('Guacamole Error:', error);
//    };

//    // Clean up when the component is destroyed
//    window.addEventListener('beforeunload', () => {
//      if (this.guacamoleClient) {
//        this.guacamoleClient.disconnect();
//      }
//    });
//  }

//  ngOnDestroy(): void {
//    if (this.guacamoleClient) {
//      this.guacamoleClient.disconnect();
//    }
//  }
//}
