//DashboardComponent
import { Component, OnInit } from '@angular/core';
import { CardComponent } from './card/card.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FilterComponent } from '../filter/filter.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardComponent, CommonModule, FilterComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] 
})

export class DashboardComponent {
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  equipmentList: any[] = [];

  ngOnInit() {
    this.loadEquipments();
  }

  loadEquipments() {
    this.http.get<any[]>('/api/equipment').subscribe((response: any) => {this.equipmentList = response.equipments});
  }
}
