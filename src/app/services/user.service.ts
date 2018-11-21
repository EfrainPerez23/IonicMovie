import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Observable, Subject } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = `${environment.ApiUrl}/sign-up`;
  private loginUrl = `${environment.ApiUrl}/login`;
  private _user: User | null;
  private positionSubject: Subject<number> = new Subject<number>();
  private signInSubject: Subject<{token: string, user: User} | null> = new Subject<{token: string, user: User} | null>();

  public constructor(private httpClient: HttpClient) { }


  public signUpUser(user: User): Observable<{message: string, data: User}> {
    return this.httpClient.post<{message: string, data: User}>(this.userUrl, user);
  }

  public signInUser(user: User): Observable<{token: string, user: User}> {
    return this.httpClient.post<{token: string, user: User}>(this.loginUrl, user);
  }

  public get user(): User | null {
    return this._user;
  }

  public set user(_user: User | null) {
    this._user = _user;
  }

  public getPositionSubject(): Subject<number> {
    return this.positionSubject;
  }

  public getSignInSubject(): Subject<{token: string, user: User} | null>  {
    return this.signInSubject;
  }
}
