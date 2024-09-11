import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
  imports: [MatDialogModule, MatButtonModule, CommonModule],
})
export class ConfirmDialogComponent {

  isVnc = false;
  isArea = false;
  isEquipment = false;
  isEquipmentModel = false;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { comingFrom: string },) {

    if (this.data.comingFrom === 'equipment') {
      this.isEquipment = true;
    }
    else if (this.data.comingFrom === 'equipmentModel') {
      this.isEquipmentModel = true;
    }
    else if (this.data.comingFrom === 'area') {
      this.isArea = true;
    }
    else if (this.data.comingFrom === 'vnc') {
      this.isVnc = true;
    }
  }


  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
