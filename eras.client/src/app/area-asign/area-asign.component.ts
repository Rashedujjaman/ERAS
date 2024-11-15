import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash} from '@fortawesome/free-solid-svg-icons';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { SnackBarService } from '../services/snackbar.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { User } from '../models/user';
import { UserArea } from '../models/user-area';
import { Area } from '../models/area';
import { CdkColumnDef } from '@angular/cdk/table';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';




@Component({
  standalone: true,
  selector: 'area-asign',
  templateUrl: './area-asign.component.html',
  styleUrls: ['./area-asign.component.css'],
  imports: [CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatPaginatorModule,
    FontAwesomeModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule],
  providers: [CdkColumnDef]
})
export class AreaAsignComponent implements OnInit {

  //arrays
  users: User[] = [];
  areas: Area[] = [];
  userAreas: UserArea[] = [];
  selectedAreas: Area[] = [];

  //number
  selectedUserId: number = 0;


  isLoading = false;
  displayedColumns = ['user', 'area', 'actions'];
  tableData = new MatTableDataSource<any>();

  //Guacamole Service
  authToken: string | null = '';
  dataSource: string | null = '';

  //Icon
  faTrash = faTrash;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: SnackBarService,
  ) { }

  ngOnInit() {
    //this.fetchAllAreas();
    this.fetchAllUserAreas();
    this.fetchAllUsers();
    this.fetchAllAreas();
  }

  resetForm(): void {
    this.selectedUserId = 0;
    this.selectedAreas = [];
  }

  // Toggle role selection on click
  toggleAreaSelection(area : Area): void {
    if (this.isAreaSelected(area)) {
      this.selectedAreas = this.selectedAreas.filter(r => r.id !== area.id);
    } else {
      this.selectedAreas.push(area);
    }
  }

  // Check if a Area is selected
  isAreaSelected(area: Area): boolean {
    return this.selectedAreas.some(selectedArea => selectedArea.id === area.id);
  }


  updateTableData() {
    if (!this.tableData) {
      this.tableData = new MatTableDataSource();
    }
    this.tableData.data = this.userAreas.length ? this.userAreas : [];
    this.tableData.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableData.filter = filterValue.trim().toLowerCase();
  }

  assignArea() {
    const params = {
      Areas: this.selectedAreas.map(area => area.id),
      UserId: this.selectedUserId
    }
    this.http.post(`/api/Users/assignArea`, params).subscribe({
      next: () => {
        this.snackBar.success('Area updated successfully!', 'Close', 2000);
        this.fetchAllUserAreas();
        this.resetForm();
      },
      error: () => {
        this.snackBar.error('Failed to assign area.', 'Close', 3000);
      }
    });
  }

  deleteUserArea(userArea: any) {
    console.log("Delete button pressed");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = { commingFrom: 'UserArea' };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`/api/Users/deleteUserArea/${userArea.id}`)
          .subscribe({
            next: (response: any) => {
              const index = this.userAreas.findIndex(ua => ua.id === userArea.id);
              this.userAreas.splice(index, 1);
              this.updateTableData();
              this.snackBar.bottomSuccess(response.message, 'Close', 2000);
            },
            error: (error: HttpErrorResponse) => {
              this.snackBar.bottomError(error.error.message, 'Close', 2000);
            }
          });
      }
    });
  }

  onUserSelected(event: any) {
    // Fetch the areas that the selected user has been assigned to
    this.http.get<Area[]>(`api/Users/getExistingAreasByUser/${event.value}`).subscribe({
      next: (areas: Area[]) => {
        this.selectedAreas = areas;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  //onAreaSelectionChange(event: MatSelectChange): void {
  //  this.selectedAreas = event.value;
  //}


  fetchAllUserAreas() {
    this.http.get<UserArea[]>(`/api/Users/getAllUserArea`)
      .subscribe({
        next: (response: UserArea[]) => {
          this.userAreas = response;
          this.updateTableData();
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      })
  }

  fetchAllAreas() {
    this.http.get<any>(`/api/Area/getAllArea`)
      .subscribe({
        next: (response: any) => {
          this.areas = response.areas;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      })
  }

  fetchAllUsers() {
    this.http.get<User[]>(`/api/Users/getAllUsers`)
      .subscribe({
        next: (response: User[]) => {
          this.users = response;
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      })
  }
}
