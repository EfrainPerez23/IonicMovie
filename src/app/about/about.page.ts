import { Component, OnInit } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { User } from '../models/user';
import { FavoriteMovie } from '../models/favoriteMovie';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { UserService } from '../services/user.service';
import { LocalStorageService } from '../services/local-storage.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss']
})
export class AboutPage implements OnInit {

  private user: {token: string, user: User} | null;
  private _favMovies: FavoriteMovie[];
  private readonly _imageUrl: string = environment.imageMovie;

  public constructor(private movieService: MovieService, private userService: UserService,
    private localStorageService: LocalStorageService) {

    this.user = JSON.parse(this.localStorageService.getItem('user'));
    this.userService.getSignInSubject().subscribe((_user: {token: string, user: User} | null): void => {
      if (_user) {
        this.user = _user;
        this.ngOnInit();
      }
    });
  }


  public ngOnInit(): void {
    this.movieService.getFavoritesMovie(this.user).subscribe((data: {data: FavoriteMovie[]}) => {
      if (data.data.length > 0) {
        this._favMovies = data.data;
      }
    }, (error: HttpErrorResponse): void => {
      if (error.status === 401) {
        this.localStorageService.removeItem('user');
      }
    });
  }

  public get favMovies(): FavoriteMovie[] {
    return this._favMovies;
  }

  public set favMovies(_favMovies: FavoriteMovie[]) {
    this._favMovies = _favMovies;
  }

  public get imageUrl(): string {
    return this._imageUrl;
  }

  public movieSelected(): void {
    this.movieService.getTabSubject().next('/tabs/(about:about)');
  }
}
