import { Injectable } from '@angular/core';
import Guacamole from 'guacamole-common-js';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Connection, ConnectionResponse } from '../models/guacamole-connection.model';
import { Observable} from 'rxjs';
import { OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class GuacamoleVncService {
  private tunnel: any;
  private client: any;

  //Server Details
  private baseUrl: string = `http://localhost:8080/guacamole/api`;

  private vncPort: string = '5900';
  private guacUser: string = 'Admin';
  private guacPass: string = 'Admin1234';


  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    //this.authenticate();
  }


  // Authenticate the user and return a Promise for the auth token
  public async authenticate(): Promise<any> {
    const body = new URLSearchParams();
    body.set('username', this.guacUser);
    body.set('password', this.guacPass);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post(`${this.baseUrl}/tokens`, body.toString(), {headers}).toPromise().then((authResponse: any) => {
      return authResponse ? { authToken: authResponse.authToken, dataSource: authResponse.dataSource } : null;
    });
  }

  // Existing connection check in Guacamole server
  public getExistingConnections(authToken: string, dataSource: string): Observable<ConnectionResponse> {
    //this.getAuthToken();
    //const headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this.http.get<ConnectionResponse>(`${this.baseUrl}/session/data/${dataSource}/connections?token=${authToken}`);
  }

  // Create new connection in Guacamole server
  public createConnection( hostName: string, ipAddress: string, vncPassword: string, userName: string, authToken: string, dataSource: string) {
    //Constructing Connection data here
    const connectionData = {
      "parentIdentifier": "ROOT",
      "name": hostName,
      "protocol": "vnc",
      "parameters": {
        "port": this.vncPort,
        "password": vncPassword,
        "username": userName,
        "hostname": ipAddress,
        "read-only": "",
        "swap-red-blue": "",
        "cursor": "",
        "color-depth": "",
        "clipboard-encoding": "",
        "disable-copy": "",
        "disable-paste": "",
        "dest-port": "",
        "recording-exclude-output": "",
        "recording-exclude-mouse": "",
        "recording-include-keys": "",
        "create-recording-path": "",
        "enable-sftp": "",
        "sftp-port": "",
        "sftp-server-alive-interval": "",
        "enable-audio": "",
        "audio-servername": "",
        "sftp-directory": "",
        "sftp-root-directory": "",
        "sftp-passphrase": "",
        "sftp-private-key": "",
        "sftp-username": "",
        "sftp-password": "",
        "sftp-host-key": "",
        "sftp-hostname": "",
        "recording-name": "",
        "recording-path": "",
        "dest-host": ""
      },

      "attributes": {
        "max-connections": "",
        "max-connections-per-user": "",
        "weight": "",
        "failover-only": "",
        "guacd-port": "",
        "guacd-encryption": "",
        "guacd-hostname": ""
      }
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<Connection>(`${this.baseUrl}/session/data/${dataSource}/connections?token=${authToken}`, connectionData, { headers });
  }

  // Update existing connection
  public updateConnection(connectionId: string, hostName: string, ipAddress: string, vncPassword: string, userName: string, authToken: string, dataSource: string) {
    const connectionData = {
      "parentIdentifier": "ROOT",
      "name": hostName,
      "identifier": connectionId,
      "activeConnections": 0,
      "protocol": "vnc",
      "parameters": {
        "port": this.vncPort,
        "read-only": "",
        "swap-red-blue": "",
        "cursor": "",
        "color-depth": "",
        "clipboard-encoding": "",
        "disable-copy": "",
        "disable-paste": "",
        "dest-port": "",
        "recording-exclude-output": "",
        "recording-exclude-mouse": "",
        "recording-include-keys": "",
        "create-recording-path": "",
        "enable-sftp": "true",
        "sftp-port": "",
        "sftp-server-alive-interval": "",
        "enable-audio": "",
        "audio-servername": "",
        "sftp-directory": "",
        "sftp-root-directory": "",
        "sftp-passphrase": "",
        "sftp-private-key": "",
        "sftp-username": "",
        "sftp-password": "",
        "sftp-host-key": "",
        "sftp-hostname": "",
        "recording-name": "",
        "recording-path": "",
        "dest-host": "",
        "password": vncPassword,
        "username": userName,
        "hostname": ipAddress
      },
      "attributes": {
        "max-connections": "",
        "max-connections-per-user": "",
        "weight": "",
        "failover-only": "",
        "guacd-port": "",
        "guacd-encryption": "",
        "guacd-hostname": ""
      }
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });


    return this.http.put<Connection>(`${this.baseUrl}/session/data/${dataSource}/connections/${connectionId}?token=${authToken}`,
      connectionData,
      { headers });
  }

  //Delete connection
  public deleteConnection(connectionId: string, authToken: string, dataSource: string) {

    return this.http.delete(
      `${this.baseUrl}/session/data/${dataSource}/connections/${connectionId}?token=${authToken}`);
    console.log(`${this.baseUrl}/session/data/${dataSource}/connections/${connectionId}?token=${authToken}`);
  }
}



//import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
//import Guacamole from 'guacamole-common-js';
//import { Router } from '@angular/router';

//interface Connection {
//  name: string;
//  identifier: string;
//  parentIdentifier: string;
//  protocol: string;
//  attributes: any;
//  activeConnections: number;
//  lastActive?: number;
//}

//interface ConnectionResponse {
//  [key: string]: Connection;
//}

//@Injectable({
//  providedIn: 'root'
//})

//export class GuacamoleVncService {
//  private baseUrl = '/guacamole/api'; // Base API URL of Guacamole
//  private client: any;
//  private guacUser: string = 'Admin';
//  private guacPass: string = 'Admin1234';

//  constructor(private http: HttpClient, private router: Router) {
//}

//  public generateToken(name: string, ipAddress: string, vncPassword: string, displayElementId: string) {

//    // Step 1: Authenticate with the Guacamole server
//    this.authenticate(this.guacUser, this.guacPass)
//      .subscribe((authResponse: any) => {
//        const authToken = authResponse.authToken;
//        const dataSource = authResponse.dataSource;
//        console.log('Authentication Response: ', authResponse);

//        // Step 2: Check if the connection exists
//        this.existingConnectionCheck(authToken, dataSource, name).subscribe((response: ConnectionResponse) => {
//          // Convert the object to an array of connections
//          const existingConnections = Object.values(response);

//          // Find the connection with the specified name
//          const existingConnection = existingConnections.find((connection: Connection) => connection.name === name);

//          if (existingConnection) {
//            // Use the existing connection ID
//            const connectionId = existingConnection.identifier;
//            console.log('Found existing connection:', existingConnection);

//            this.generateTunnelUrl(authToken, connectionId, displayElementId);

//          } else {
//            // Create a new connection if none exists
//            this.createConnection(authToken, dataSource, name, ipAddress, vncPassword).subscribe((connectionResponse: Connection) => {
//              const connectionId = connectionResponse.identifier;
//              console.log('Created new connection: ', connectionResponse);

//              this.generateTunnelUrl(authToken, connectionId, displayElementId);

//            }, error => {
//              console.error('Failed to create connection', error);
//              alert('Failed to create VNC connection. Please check the server.');
//            });
//          }
//        }, error => {
//          console.error('Failed to check for existing connections', error);
//        });

//      }, error => {
//        console.error('Authentication failed', error);
//        alert('Authentication failed. Please check your credentials.');
//      });
//  }


//  // Step 1: Authenticate with Guacamole
//  private authenticate(username: string, password: string) {
//    const body = new URLSearchParams();
//    body.set('username', username);
//    body.set('password', password);

//    //return this.http.post(`${this.baseUrl}/tokens`, body.toString(), {
//    return this.http.post(`/guacamole/api/tokens`, body.toString(), {
//      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
//    });
//  }

//  // Step 2: Existing connection check
//  private existingConnectionCheck(authToken: string, datasource: string, name: string) {
//    return this.http.get<ConnectionResponse>(`/guacamole/api/session/data/${datasource}/connections?token=${authToken}`);
//  }

//  // Step 3: Create a new VNC connection dynamically
//  private createConnection(authToken: string, dataSource: string, name: string, ipAddress: string, vncPassword: string) {
//    var port = '5900';

//    const connectionData = {
//      "parentIdentifier": "ROOT",
//      "name": name,
//      "protocol": "vnc",
//      "parameters": {
//        "port": port,
//        "password": vncPassword,
//        "username": name,
//        "hostname": ipAddress,
//        "read-only": "",
//        "swap-red-blue": "",
//        "cursor": "",
//        "color-depth": "",
//        "clipboard-encoding": "",
//        "disable-copy": "",
//        "disable-paste": "",
//        "dest-port": "",
//        "recording-exclude-output": "",
//        "recording-exclude-mouse": "",
//        "recording-include-keys": "",
//        "create-recording-path": "",
//        "enable-sftp": "",
//        "sftp-port": "",
//        "sftp-server-alive-interval": "",
//        "enable-audio": "",
//        "audio-servername": "",
//        "sftp-directory": "",
//        "sftp-root-directory": "",
//        "sftp-passphrase": "",
//        "sftp-private-key": "",
//        "sftp-username": "",
//        "sftp-password": "",
//        "sftp-host-key": "",
//        "sftp-hostname": "",
//        "recording-name": "",
//        "recording-path": "",
//        "dest-host": ""
//      },

//      "attributes": {
//        "max-connections": "",
//        "max-connections-per-user": "",
//        "weight": "",
//        "failover-only": "",
//        "guacd-port": "",
//        "guacd-encryption": "",
//        "guacd-hostname": ""
//      }
//    };

//    return this.http.post<Connection>(`/guacamole/api/session/data/${dataSource}/connections?token=${authToken}`, connectionData);
//  }

//  // Step 4: Generate tunnel URL
//  private generateTunnelUrl(authToken: string, connectionId: string, displayElementId: string) {
//    const connectionParams = new URLSearchParams();
//    connectionParams.set('GUAC_DATA_SOURCE', 'mysql');
//    connectionParams.set('GUAC_ID', connectionId);
//    connectionParams.set('GUAC_TYPE', 'c');
//    connectionParams.set('GUAC_WIDTH', '1024');
//    connectionParams.set('GUAC_HEIGHT', '768');
//    connectionParams.set('GUAC_DPI', '96');
//    connectionParams.set('GUAC_TIMEZONE', 'Asia/Kuala_Lumpur');
//    connectionParams.set('GUAC_AUDIO', 'audio/L8');
//    connectionParams.set('GUAC_IMAGE', 'image/jpeg,image/png,image/webp');
//    connectionParams.set('GUAC_CURSOR', 'remote');

//    const tunnelUrl = `/guacamole/websocket-tunnel?token=${authToken}&${connectionParams.toString()}`;

//    // Start the Guacamole client with the existing connection
//    this.startGuacamoleClient(tunnelUrl, displayElementId);
//  }

//  // Step 5: Initialize the Guacamole Client and WebSocket Tunnel
//  private startGuacamoleClient(tunnelUrl: string, displayElementId: string): void {

//    // Initialize the Guacamole client with the WebSocketTunnel
//    this.client = new Guacamole.Client(new Guacamole.WebSocketTunnel(tunnelUrl));

//    // Get the display element from the DOM
//    const display = document.getElementById(displayElementId);

//    if (display) {
//      // Clear any existing content in the display element
//      display.innerHTML = '';

//      // Append the Guacamole display to the element
//      display.appendChild(this.client.getDisplay().getElement());

//      // Start the Guacamole client without additional connectArgs (token is in tunnelUrl)
//      this.client.connect();

//      console.log('Guacamole session started successfully.');
//    } else {
//      console.error('Display element not found.');
//    }
//  }



//  // Disconnect from the server
//  public disconnect(displayElementId: string): void {
//    this.client.disconnect();
//    const displayElement = document.getElementById(displayElementId);
//    if (displayElement) {
//      displayElement.innerHTML = ''; // Clear the content (remove iframe)
//      console.log('Disconnected from the Guacamole session.');
//    }
//    this.router.navigate(['/dashboard']);
//  }
//}
