import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SnackBarService {
  constructor(private snackBar: MatSnackBar) { }
  
  success(message: string, action: string, duration?: number) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['success-snackbar'];
    config.horizontalPosition = 'center';
    config.verticalPosition = 'top';
    if (duration) {
      config.duration = duration;
    }

    this.snackBar.open(message, action, config);
  }

  bottomSuccess(message: string, action: string, duration?: number) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['success-snackbar'];
    config.horizontalPosition = 'center';
    config.verticalPosition = 'bottom';
    if (duration) {
      config.duration = duration;
    }

    this.snackBar.open(message, action, config);
  }

  error(message: string, action: string, duration?: number) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['error-snackbar'];
    config.horizontalPosition = 'center';
    config.verticalPosition = 'top';
    if (duration) {
      config.duration = duration;
    }

    this.snackBar.open(message, action, config);
  }

  bottomError(message: string, action: string, duration?: number) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['error-snackbar'];
    config.horizontalPosition = 'center';
    config.verticalPosition = 'bottom';
    if (duration) {
      config.duration = duration;
    }

    this.snackBar.open(message, action, config);
  }
}

