//DashboardComponent
import { Component, OnInit } from '@angular/core';
import { CardComponent } from './card/card.component';
import { CardSkeletonComponent } from './card-skeleton/card-skeleton';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FilterComponent } from '../filter/filter.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardComponent, CardSkeletonComponent, CommonModule, FilterComponent],
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
  isLoading = true;
  isError = false;

  ngOnInit() {
    this.loadEquipments();
    //this.testApi();
  }

  loadEquipments() {
    this.isLoading = true;
    this.isError = false;
    this.http.get<any[]>('/api/equipment').subscribe({
      next: (response: any) => {
        this.equipmentList = response.equipments;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isError = true;
        this.isLoading = false;
        console.error('Error fetching data:', error);
      }
    });
  }

  //testApi(): void {
  //  const salesmanId = 'D00117';

  //  const params = new HttpParams().set('salesmanID', salesmanId);

  //  this.http.get('/WS/WS_SalesOrder.asmx/GetDSSalesmanBySalesmanID', { params, responseType: 'text' })
  //    .subscribe(
  //      (data) => {
  //        console.log(data);
  //      },
  //      (error) => {
  //        console.error('Error fetching data:', error);
  //      }
  //    );
  //}
}
