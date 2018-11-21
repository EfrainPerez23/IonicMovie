
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '../../../node_modules/@angular/forms';
import { User } from '../models/user';
import { AlertController, NavController } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  private _signInForm: FormGroup;
  private alCtrl: HTMLIonAlertElement;

  public constructor(private userService: UserService, private localStorage: LocalStorageService, private alertController: AlertController,
    private router: NavController) {
    this._signInForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required])
    });
  }

  public ngOnInit(): void {
  }

  public get signInForm(): FormGroup {
    return this._signInForm;
  }

  public set signInForm(_signInForm: FormGroup) {
    this._signInForm = _signInForm;
  }

  public onSubmit(): void {
    if (this._signInForm.value) {
      const user: User = this._signInForm.value;
      this.userService.signInUser(user).subscribe((response: {token: string, user: User}): void => {
        if (response) {
          this.localStorage.setItem('user', JSON.stringify(response));
          this.userService.getSignInSubject().next(response);
          this.presentAlert('Thanks', response.user.name);
        }
      });
    }
  }

  private async presentAlert(message: string, name: string): Promise<void> {
    this.alCtrl = await this.alertController.create({
      header: 'Success',
      subHeader: message,
      message: `Welcome ${name} !`,
      buttons: [{
        text: 'Ok',
        handler: (): void => {
          this.router.navigateRoot(['']);
        }
      }],
      backdropDismiss: false
    });

    return await this.alCtrl.present();
  }

}
