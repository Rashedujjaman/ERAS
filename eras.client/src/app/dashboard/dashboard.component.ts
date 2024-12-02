//DashboardComponent
import { Component, OnInit } from '@angular/core';
import { CardComponent } from './card/card.component';
import { CardSkeletonComponent } from './card-skeleton/card-skeleton';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { SnackBarService } from '../services/snackbar.service';
import { CommonModule } from '@angular/common';
import { FilterComponent } from '../filter/filter.component';
import { Area } from '../models/area';
import { Equipment } from '../models/equipment';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardComponent, CardSkeletonComponent, CommonModule, FilterComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private snackBar: SnackBarService,
    private router: Router
  ) { }

  equipmentList: Equipment[] = [];
  equipments: Equipment[] = [];
  areas: Area[] = [];
  selectedAreas: Area[] = [];

  isLoading = true;
  isError = false;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.isError = false;


    forkJoin({
      equipments: this.http.get<Equipment[]>('/api/Equipment/getAllEquipments'),
      areas: this.http.get<Area[]>(`api/Users/getExistingAreasByUser/${localStorage.getItem('userId')}`)
    }).subscribe({
      next: ({ equipments, areas }) => {
        this.equipments = equipments;
        this.areas = areas;
        this.filterEquipments(this.areas);
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        if (error.error.sessionOut === true) {
          this.router.navigate(['']);
          this.snackBar.error(error.error.message, null, 3000);
        }
        this.isError = true;
        this.isLoading = false;
      }
    });
  }

  filterEquipments(areas: Array<Area>) {
    this.isLoading = true;
    if (this.equipments && areas) {
      const areaIds = areas.map(area => area.id);
      this.equipmentList = this.equipments.filter(equipment => equipment.areaId != undefined && areaIds.includes(equipment.areaId));
      this.isLoading = false;
    }
  }

  toggleFilterSelection(area: Area): void {
    if (this.isAreaSelected(area)) {
      this.selectedAreas = this.selectedAreas.filter(r => r.id !== area.id);
    } else {
      this.selectedAreas.push(area);
    }

    this.selectedAreas.length > 0 ? this.filterEquipments(this.selectedAreas) : this.filterEquipments(this.areas);
  }

  // Check if a Area is selected
  isAreaSelected(area: Area): boolean {
    return this.selectedAreas.some(selectedArea => selectedArea.id === area.id);
  }

  noAreaFound() {
    return this.areas.length === 0;
  }
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
