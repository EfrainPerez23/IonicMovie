import { UserService } from './../services/user.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: 'contact.page.html',
  styleUrls: ['contact.page.scss']
})
export class ContactPage {

  private _option = 1;

  public constructor(private userService: UserService) {
    this.userService.getPositionSubject().subscribe((_option: number): void => {
      if (_option) {
        this._option = _option;
      }
    });
  }

  public get option(): number {
    return this._option;
  }

  public set option(_option: number) {
    this._option = _option;
  }

}
