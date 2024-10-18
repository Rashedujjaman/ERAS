import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Guacamole  from 'guacamole-common-js';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuacamoleVncService {
  private baseUrl = 'http://localhost:8080/guacamole/api'; // Base API URL of Guacamole
  private client: any;
  private guacUser: string = 'Admin';
  private guacPass: string = 'Admin1234';

  constructor(private http: HttpClient, private router: Router) {
}

  // Step 1: Authenticate with Guacamole
  private authenticate(username: string, password: string) {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    return this.http.post(`${this.baseUrl}/tokens`, body.toString(), {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });
  }

  // Step 2: Create a new VNC connection dynamically
  private createConnection(authToken: string, dataSource: string, name: string, ipAddress: string, vncPassword: string) {
    var port = '5900';
    const connectionData = {
      "parentIdentifier": "ROOT",
      "name": name,
      "protocol": "vnc",
      "attributes": {
        "failover- only": "",
        "guacd-encryption": "",
        "guacd-hostname": "",
        "guacd-port": "",
        "max-connections": "",
        "max-connections-per-user": "",
        "weight": ""

      },
      "parameters": {
        "hostname": ipAddress,
        "port": port,
        "username": this.guacUser,
        "password": this.guacPass,
        //"password": "vncPassword" // Pass VNC password if required
      }
    };

    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
    return this.http.post(`${this.baseUrl}/session/data/${dataSource}/connections`, connectionData, { headers });
  }

  // Step 2: Generate connection token
  public generateToken(name: string, ipAddress: string, vncPassword: string, displayElementId: string) {

    // Step 1: Authenticate with the Guacamole server
    this.authenticate(this.guacUser, this.guacPass)
      .subscribe((authResponse: any) => {
        const authToken = authResponse.authToken;
        const dataSource = authResponse.dataSource;
        console.log('Authentication Response: ', authResponse);

          //const connectionParams = new URLSearchParams();
          //connectionParams.set('id', '1');

          //const tunnelUrl = `${this.baseUrl}/tunnel?token=${authToken}&${connectionParams.toString()}`;

          //// Step 4: Load the connection into the Guacamole client
          //this.startGuacamoleClient(tunnelUrl, displayElementId);

        //// Step 2: Create a new connection
        this.createConnection(authToken, dataSource, name, ipAddress, vncPassword).subscribe((connectionResponse: any) => {
          const connectionId = connectionResponse.identifier;
          console.log('Connection ID: ', connectionId);
          console.log('Connection Response: ', connectionResponse);


          // Step 3: Prepare the WebSocket tunnel URL
          const connectionParams = new URLSearchParams();
          connectionParams.set('id', connectionId); // Use the dynamically created connection ID

          const tunnelUrl = `${this.baseUrl}/tunnel?token=${authToken}&${connectionParams.toString()}`;

          // Step 4: Load the connection into the Guacamole client
          this.startGuacamoleClient(tunnelUrl, displayElementId);
        }, error => {
          console.error('Failed to create connection', error);
          alert('Failed to create VNC connection. Please check the server.');
        });
      }, error => {
        console.error('Authentication failed', error);
        alert('Authentication failed. Please check your credentials.');
      });
  }

  // Step 3: Initialize the Guacamole Client and WebSocket Tunnel
  private startGuacamoleClient(tunnelUrl: string, displayElementId: string): void {
    // Initialize WebSocket tunnel
    const tunnel = new Guacamole.HTTPTunnel(tunnelUrl);
    //const tunnel = new Guacamole.WebSocketTunnel(tunnelUrl);

    // Initialize Guacamole client with the tunnel
    this.client = new Guacamole.Client(tunnel);

    // Get the display element (canvas) where the remote screen will be shown
    const displayElement = document.getElementById(displayElementId);
    if (displayElement) {
      // Set up the Guacamole client display
      displayElement.innerHTML = '';  // Clear previous content
      displayElement.appendChild(this.client.getDisplay().getElement());  // Add Guacamole canvas to display element

      // Start the client
      this.client.connect(tunnelUrl);

      console.log('Guacamole session started successfully.');
    } else {
      console.error('Display element not found.');
    }
  }

  // Disconnect from the server
  public disconnect(displayElementId: string): void {
    const displayElement = document.getElementById(displayElementId);
    if (displayElement) {
      displayElement.innerHTML = ''; // Clear the content (remove iframe)
      console.log('Disconnected from the Guacamole session.');
    }
    this.router.navigate(['/dashboard']);
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
//  public connect(tunnelUrl: string, password: string, url: string): void {
//    try {
//      //this.tunnel = new Guacamole.WebSocketTunnel(tunnelUrl);
//      //this.client = new Guacamole.Client(this.tunnel);

//      const displayElement = document.getElementById('guac-container');
//      if (displayElement) {
//        // Create an iframe element to display the Guacamole session
//        const iframe = document.createElement('iframe');
//        iframe.src = url;
//        iframe.width = '100%';
//        iframe.height = '100%';
//        iframe.frameBorder = '0';
//        displayElement.innerHTML = '';
//        displayElement.appendChild(iframe);
//        console.log('Guacamole session embedded successfully.');
//      } else {
//        throw new Error('Display element not found');
//        return;
//      }

//    } catch (error) {
//      console.error('Connection error:', error);
//      alert('Connection failed. Please check the url and try again.');
//    }
//  }

//  // Disconnect from the server
//  public disconnect() {
//    const displayElement = document.getElementById('guac-container');
//    if (displayElement) {
//      displayElement.innerHTML = ''; // Clear the content (remove iframe)
//      console.log('Disconnected from the Guacamole session.');
//    }
//    this.router.navigate(['/dashboard']);
//  }
//}
