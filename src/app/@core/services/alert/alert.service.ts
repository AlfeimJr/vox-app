import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from '../../components/alert/alert.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private snackBar: MatSnackBar) {}

  showAlert(
    message: string,
    action: string = 'Close',
    duration: number = 3000,
    type: 'success' | 'error' = 'success'
  ) {
    this.snackBar.openFromComponent(AlertComponent, {
      duration: duration,
      data: { message: message, action: action, type: type },
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type,
    });
  }
}
