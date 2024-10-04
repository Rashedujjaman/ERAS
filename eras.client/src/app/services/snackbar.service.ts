import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SnackBarService {
  constructor(private snackBar: MatSnackBar) { }
  
  success(message: string, action: string, duration: number) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['success'];
    config.horizontalPosition = 'center';
    config.verticalPosition = 'top';
    config.duration = duration;

    this.snackBar.open(message, action, config);
  }

  bottomSuccess(message: string, action: string, duration: number) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['success'];
    config.horizontalPosition = 'center';
    config.verticalPosition = 'bottom';
    config.duration = duration;

    this.snackBar.open(message, action, config);
  }

  error(message: string, action: string, duration: number) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['error'];
    config.horizontalPosition = 'center';
    config.verticalPosition = 'top';
    config.duration = duration;

    this.snackBar.open(message, action, config);
  }

  bottomError(message: string, action: string, duration: number) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['error'];
    config.horizontalPosition = 'center';
    config.verticalPosition = 'bottom';
    config.duration = duration;

    this.snackBar.open(message, action, config);
  }
}

