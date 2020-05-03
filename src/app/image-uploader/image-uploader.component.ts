import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/storage';

export interface DialogData {
  directoryName: string;
}

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})

export class ImageUploaderComponent implements OnInit {
  file: File;
  isError = false;

  constructor(
    private dialogRef: MatDialogRef<ImageUploaderComponent>,
    private angularFireStrage: AngularFireStorage,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
  }

  selectFile(event: any): void {
    this.file = event.target.files[0];
    this.isError = false;
  }

  onFileDrop(files: File[]): void {
    this.file = files[0];
    this.isError = false;
  }

  uploadFile(): void {
    const fileName = this.file.name;
    const filePath = `upload_files/${this.data.directoryName}/${fileName}`;
    this.angularFireStrage.upload(filePath, this.file)
      .then(() => {
        this.closeDialog();
      })
      .catch((error: Error) => {
        this.isError = true;
        console.log(error);
      })
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
