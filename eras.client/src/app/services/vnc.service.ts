////vnc.service.ts
//import { Injectable } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
//import { Observable } from 'rxjs';
//import Guacamole from 'guacamole-common-js';

//@Injectable({
//  providedIn: 'root',
//})
//export class VncService {
//  private guac = new Guacamole.Client(new Guacamole.WebSocketTunnel('/api/vnc/tunnel'));
//  private apiUrl = '/api/vnc';

//  constructor(private http: HttpClient) { }

//  connectToVnc(hostAddress: string): Observable<any> {
//    const credentials = hostAddress;

//    return this.http.post(`${this.apiUrl}/connect`, credentials);
//  }

//  disconnectFromVnc(): Observable<any> {
//    return this.http.post(`${this.apiUrl}/disconnect`, {});
//  }

//  getVncStatus(): Observable<any> {
//    return this.http.get(`${this.apiUrl}/status`);
//  }
//}
