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

  // Initialization of the Guacamole connection after WebSocket server check
  public connect(tunnelUrl: string, password: string): void {
    const websocketUrl = tunnelUrl;

    // Check WebSocket connection first
    this.checkWebSocketConnection(websocketUrl).then((connected) => {
      if (connected) {
        console.log('WebSocket server is available, proceeding with Guacamole connection.');
        this.initializeGuacamoleConnection(websocketUrl, password);
      } else {
        console.error('Unable to connect to WebSocket server.');
        alert('Error: Unable to connect to the WebSocket server. Please check the server status.');
        this.router.navigate(['/dashboard']); // Redirect user on failure
      }
    });
  }

  // Check if the WebSocket server is available
  private checkWebSocketConnection(websocketUrl: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const ws = new WebSocket(websocketUrl);

        ws.onopen = () => {
          console.log('WebSocket connection established successfully.');
          ws.close();
          resolve(true);
        };

        ws.onerror = (error) => {
          console.error('WebSocket connection failed:', error);
          resolve(false);
        };

        ws.onclose = (event) => {
          console.log('WebSocket connection closed:', event);
          resolve(false);
        };
      } catch (error) {
        console.error('Error while checking WebSocket connection:', error);
        resolve(false);
      }
    });
  }

  // Initialization of Guacamole connection
  private initializeGuacamoleConnection(tunnelUrl: string, password: string): void {
    try {
      // Initialize WebSocket tunnel for Guacamole
      this.tunnel = new Guacamole.WebSocketTunnel(tunnelUrl);
      this.client = new Guacamole.Client(this.tunnel);

      // Append the Guacamole display element to the DOM
      const displayElement = document.getElementById('guac-container');
      if (displayElement) {
        displayElement.appendChild(this.client.getDisplay().getElement());
      } else {
        throw new Error('Display element not found');
      }

      // Connect to Guacamole using the provided password
      this.client.connect(password);

      // Handle WebSocket tunnel errors
      this.tunnel.onerror = (error: any) => {
        console.error('Guacamole WebSocket Tunnel Error:', error);
        //alert('Error: Unable to connect to the VNC server. The host might be offline.');
        this.disconnect();
        this.router.navigate(['/dashboard']);
      };
    } catch (error) {
      console.error('Error during Guacamole connection:', error);
      alert('Connection failed. Please check the host address and try again.');
    }
  }

  // Disconnect from Guacamole
  public disconnect() {
    if (this.client) {
      this.client.disconnect();
    }
    if (this.tunnel && typeof this.tunnel.close === 'function') {
      this.tunnel.close();
    }
  }
}













//import { Injectable } from '@angular/core';
//import Guacamole from 'guacamole-common-js';
//import { Router } from '@angular/router';

//@Injectable({
//  providedIn: 'root'
//})
//export class GuacamoleVncService {
//  private tunnel: any;
//  private client: any;

//  constructor(private router: Router) { }

//  // Initialization of the Guacamole connection
//  public connect(tunnelUrl: string, password: string): void {
//    try {
//      this.tunnel = new Guacamole.WebSocketTunnel(tunnelUrl);
//      this.client = new Guacamole.Client(this.tunnel);

//      const displayElement = document.getElementById('guac-container');
//      if (displayElement) {
//        displayElement.appendChild(this.client.getDisplay().getElement());
//        // Connect to the Guacamole server
//        this.client.connect(password);
//      } else {
//        throw new Error('Display element not found');
//        console.error('Display element not found');
//        return;
//      }

//      // Add event listener for errors
//      this.tunnel.onerror = (error: any) => {
//        console.error('Error during WebSocket connection:', error);
//        alert('Error: Unable to connect to the VNC server. The host might be offline.');
//        this.disconnect();
//      };

//    } catch (error) {
//      console.error('Connection error:', error);
//      alert('Connection failed. Please check the host address and try again.');
//    }
//  }

//  // Disconnect from the server
//  public disconnect() {
//    if (this.tunnel && this.tunnel.state === Guacamole.Tunnel.State.OPEN) {
//      this.tunnel.disconnect();
//      console.log('Disconnected from VNC server.');
//    }
//    this.router.navigate(['/dashboard']);
//  }
//}
































//import { Injectable } from '@angular/core';
//import Guacamole from 'guacamole-common-js';
//import { Router } from '@angular/router';

//@Injectable({
//  providedIn: 'root'
//})
//export class GuacamoleVncService {
//  private tunnel: any;
//  private client: any;

//  constructor(private router: Router) { }

//  // Initialize the Guacamole connection
//  public connect(host: string, password: string): void {
//    console.log(host, password);
//    const port = 5900;
//    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
//    const tunnelUrl = `wss://${host}:${port}/guacamole/websocket-tunnel?token=${password}`;
//    //const tunnelUrl = `${protocol}://${host}:${port}/guacamole/websocket-tunnel?token=${password}`;

//    try {
//      this.tunnel = new Guacamole.WebSocketTunnel(tunnelUrl);
//      this.client = new Guacamole.Client(this.tunnel);

//      const displayElement = document.getElementById('guac-container');
//      if (displayElement) {
//        displayElement.appendChild(this.client.getDisplay().getElement());
//      } else {
//        throw new Error('Display element not found');
//      }

//      // Connect to the Guacamole server
//      this.client.connect(password);

//      // Add event listener for errors
//      this.tunnel.onerror = (error: any) => {
//        console.error('Error during WebSocket connection:', error);
//        alert('Error: Unable to connect to the VNC server. The host might be offline.');
//        this.disconnect();
//        this.router.navigate(['/dashboard']);
//      };

//    } catch (error) {
//      console.error('Connection error:', error);
//      alert('Connection failed. Please check the host address and try again.');
//    }
//  }

//  // Disconnect from the server
//  public disconnect() {
//    if (this.tunnel && this.tunnel.state === Guacamole.Tunnel.State.OPEN) {
//      this.tunnel.disconnect();  // Make sure 'disconnect()' is the correct method
//      console.log('Disconnected from VNC server.');
//    }
//    //this.tunnel.onstatechange = function (state) {
//    //  console.log("Tunnel state changed:", state);
//    //};

//  }
  
//  //public disconnect(): void {
//  //  if (this.client) {
//  //    this.client.disconnect();
//  //  }
//  //  if (this.tunnel) {
//  //    this.tunnel.close();
//  //  }
//  //}
//}
