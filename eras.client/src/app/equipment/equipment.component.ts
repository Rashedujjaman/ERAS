import { CdkColumnDef } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Connection, ConnectionResponse } from '../models/guacamole-connection.model';
import { GuacamoleVncService } from '../services/guacamole-vnc.service';
import { SnackBarService } from '../services/snackbar.service';
import { AddEditUrlTokenDialogComponent } from './add-edit-connection-token-dialog/add-edit-url-token-dialog.component';
import { AddEditEquipmentDialogComponent } from './add-edit-equipment-dialog/add-edit-equipment-dialog.component';
import { Equipment } from '../models/equipment';



@Component({
  standalone: true,
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css'],
  imports: [CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    FontAwesomeModule,
    MatSortModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule],
  providers: [CdkColumnDef]
})
export class EquipmentComponent implements OnInit, AfterViewInit {
  equipments: Equipment[] = [];
  isLoading = false;
  displayedColumns = ['id', 'name', 'alias', 'ipAddress', 'hostName', 'urlToken', 'vncUserName', 'model', 'zone', 'actions'];
  tableData = new MatTableDataSource<any>();

  //Guacamole Service
  authToken: string | null = '';
  dataSource: string | null = '';

  //Icon
  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlusCircle;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //@ViewChild(MatSort) sort!: MatSort;
  constructor(private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: SnackBarService,
    private guacamoleService: GuacamoleVncService,
  ) { }

  ngOnInit(): void {
    this.loadEquipments();
    this.authToken = localStorage.getItem('authToken');
    this.dataSource = localStorage.getItem('dataSource');

  }

  ngAfterViewInit() {
    this.tableData.paginator = this.paginator;
    //this.tableData.sort = this.sort;
  }

  loadEquipments() {
    this.isLoading = true;

    this.http.get<Equipment[]>('/api/Equipment/getAllEquipments')
      .subscribe({
        next: (equipments: Equipment[]) => {
          this.equipments = equipments;
          this.updateTableData();

          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 200) {
            this.snackBar.error('You are not authorized to perform this action.', null, 6000);
            this.router.navigate(['']);

          } else if (error.error.sessionOut === true) {
            this.snackBar.error(error.error.message, null, 4000);
            this.router.navigate(['']);
          }
          else {
            this.snackBar.error(error.error.message, null, 4000);
          }
          this.isLoading = false;
        }
      })
  }

  updateTableData() {
    if (!this.tableData) {
      this.tableData = new MatTableDataSource();
    }
    this.tableData.data = this.equipments.length ? this.equipments : [];
    this.tableData.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableData.filter = filterValue.trim().toLowerCase();
  }

  openAddEquipmentDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '800px';
    dialogConfig.data = { isEditingMode: false }

    const dialogRef = this.dialog.open(AddEditEquipmentDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.equipments.push(result);
        this.updateTableData();
        this.updateUrlToken(result);
      }
    });
  }

  editEquipment(equipment: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '800px';
    dialogConfig.data = { equipment: equipment, isEditMode: true }
    const dialogRef = this.dialog.open(AddEditEquipmentDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.equipments.findIndex(eq => eq.id === equipment.id);
        this.equipments[index] = result;
        this.updateTableData();
        this.updateUrlToken(result);
      }
    });
  }

  deleteEquipment(id: number, hostName: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = { commingFrom: 'equipment'};
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.delete(`/api/Equipment/deleteEquipment/${id}`)
          .subscribe({
            next: (response: any) => {
              const index = this.equipments.findIndex(eq => eq.id === id);
              this.equipments.splice(index,1);
              this.updateTableData();
              this.deleteConnection(hostName);
              this.snackBar.success(response.message, null, 2000);
            },
            error: (error: HttpErrorResponse) => {
              this.snackBar.error(error.error.message, null, 3000);
            }
          });
      }
    });
  }

  updateUrlToken(equipment: any): void {
    const dialogRef = this.dialog.open(AddEditUrlTokenDialogComponent, {
      width: '400px',
      data: { id: equipment.id, hostName: equipment.hostName, urlToken: equipment.urlToken, isEditMode: equipment.urlToken ? true : false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Refresh the displayed token
        equipment.urlToken = result;
        console.log('Url token updated successfully');
      } else {
        console.log('URL token update failed');
      }
    });
  }

  private async deleteConnection(hostName: string) {
    const existingConnection = await this.checkExistingGuacamoleConnection(hostName).toPromise();

    //If the connection exist in the server only then attemp to delete the connection.
    if (this.authToken && this.dataSource && existingConnection) {
      this.guacamoleService.deleteConnection(existingConnection.connectionId, this.authToken, this.dataSource).toPromise()
        .then(response => {
          console.log('Connection deleted successfully', response);
        })
        .catch(error => {
          console.log('Failed to delete connection.', error);
          throw error;
        });
    }
  }

  private checkExistingGuacamoleConnection(hostName: string): Observable<any> {
    if (this.authToken && this.dataSource) {
      return this.guacamoleService.getExistingConnections(this.authToken, this.dataSource).pipe(
        map((response: ConnectionResponse) => {
          const existingConnections = Object.values(response);
          const existingConnection = existingConnections.find((connection: Connection) => connection.name === hostName);
          return existingConnection ? { connectionId: existingConnection.identifier } : null;
        }),
        catchError((error) => {
          console.log('Failed to get existing connections', error);
          return of({ error: true });
        })
      );
    } else {
      return of({ error: true });
    }
  }
}
