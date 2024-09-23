import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuacamoleVncService } from '../services/guacamole-vnc.service';

@Component({
  selector: 'app-vnc-client',
  templateUrl: './vnc-client.component.html',
  styleUrls: ['./vnc-client.component.css']
})
export class VncClientComponent implements OnInit {
  ipAddress: string = '';
  vncPassword: string = '';

  constructor(private route: ActivatedRoute, private guacService: GuacamoleVncService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.ipAddress = params['ip']?.trim();
      this.vncPassword = params['password']?.trim();

      if (this.ipAddress && this.vncPassword) {
        console.log(this.ipAddress, this.vncPassword)
        const port = 5900;
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const tunnelUrl = `ws://localhost:${port}`;
        //const tunnelUrl = `${protocol}://${this.ipAddress}:${port}/guacamole/websocket-tunnel?token=${this.vncPassword}`;
        // Call the connect method from the service
        this.guacService.connect(tunnelUrl, this.vncPassword);
      } else {
        console.error('Missing IP address or password');
      }
    });
  }

  onDisconnect(): void {
    this.guacService.disconnect();
  }
}





















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
