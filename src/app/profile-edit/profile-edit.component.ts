import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../user';
import { FormBuilder } from '@angular/forms';
import { UserAccountService } from '../user-account.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  user: User;

  form = this.fb.group({
    name: [''],
    introduction: [''],
  });

  constructor(
    private route: ActivatedRoute,
    private userAccountService: UserAccountService,
    private fb: FormBuilder,
    private location: Location,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    this.userAccountService.getUser(userId).subscribe(user => {
      this.form.patchValue(user);
      this.user = user;
    });
  }

  updateUser(): void {
    const updateParam = Object.assign({}, this.user);
    updateParam.name = this.form.get('name').value;
    updateParam.introduction = this.form.get('introduction').value;

    this.userAccountService.updateUser(updateParam)
      .then(() => {
        this.goBack();
      })
      .catch((error: Error) => {
        console.log('Update error', error);
      });
  }

  goBack(): void {
    this.location.back();
  }

  openImageUploaderDialog(): void {
    let dialogRef = this.matDialog.open(ImageUploaderComponent, {
      width: '55vw',
      height: '65vh',
      disableClose: true,
      data: { directoryName: 'user_icon' },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('result', result)
    });
  }

}
