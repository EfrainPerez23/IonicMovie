import { LoadingController, ToastController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '../../../node_modules/@angular/forms';
import { User } from '../models/user';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { AlertController } from '@ionic/angular';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  private _signUpForm: FormGroup;
  private lCtrl: HTMLIonLoadingElement;
  private alCtrl: HTMLIonAlertElement;

  public constructor(private loadingCtrl: LoadingController, private userService: UserService,
    private toastController: ToastController, private alertController: AlertController) { }

  public ngOnInit(): void {
    this._signUpForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormGroup({
        password: new FormControl(null, [Validators.required]),
        confirmPassword: new FormControl(null, [Validators.required])
      }, this.matchPassword)
    });
  }

  public get signUpForm(): FormGroup {
    return this._signUpForm;
  }

  public set signUpForm(_signUpForm: FormGroup) {
    this._signUpForm = _signUpForm;
  }

  public onSubmit(): void {
    if (this._signUpForm.value) {
      this.presentLoading();
      const user: User = <User>this._signUpForm.value;
      user.password = (<User>this._signUpForm.value).password['password'];
      this.userService.signUpUser(user).subscribe((response: {message: string, data: User}): void => {
        if (response) {
          this.presentAlert(response.message);
        }
        this.lCtrl.dismiss();
      }, (error: HttpErrorResponse): void => {
        this.lCtrl.dismiss();
        if (error.status === 400) {
          this.presentToast(error.error['message']);
        }
      });
    }
  }

  private async presentLoading(present: boolean = true): Promise<void> {
    this.lCtrl = await this.loadingCtrl.create({
      message: 'Cargando Películas'
    });
    return await this.lCtrl.present();
  }

  private async presentToast(errorMessage: string): Promise<void> {
    const toast: HTMLIonToastElement = await this.toastController.create({
      message: errorMessage,
      showCloseButton: true,
      position: 'bottom',
      closeButtonText: 'Ok',
      cssClass: 'toast--color'
    });
    toast.present();
  }
  private async presentAlert(message: string): Promise<void> {
    this.alCtrl = await this.alertController.create({
      header: 'Success',
      subHeader: message,
      message: 'Please Sign In...',
      buttons: [{
        text: 'Ok',
        handler: (): void => {
          this.userService.getPositionSubject().next(2);
        }
      }],
      backdropDismiss: false
    });

    return await this.alCtrl.present();
  }

  private matchPassword(formGroup: AbstractControl): { [invalid: string]: boolean } | null {
    if (formGroup.get('password').value !== formGroup.get('confirmPassword').value) {
      return { invalid: true };
    }
    return null;
  }

}
