import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-redirect',
  templateUrl: './dialog-redirect.component.html',
  styleUrls: ['./dialog-redirect.component.css']
})
export class DialogRedirectComponent implements OnInit {
  message = 'Are you sure?';
  confirmButtonText = 'Yes';
  cancelButtonText = 'Cancel';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogRedirectComponent>) {
    dialogRef.disableClose = true;
    if (data) {
      this.message = data.message || this.message;
      if (data.buttonText) {
        this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
        this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
    }
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

  onCancleClick(): void {
    this.dialogRef.close(false);
  }

  ngOnInit(): void {
  }

}
