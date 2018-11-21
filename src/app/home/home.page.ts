import { FavoriteMovie } from './../models/favoriteMovie';
import { LoadingController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { Movie, Result } from '../models/movie';
import { environment } from '../../environments/environment';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { User } from '../models/user';
import { LocalStorageService } from '../services/local-storage.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  private _movies: Movie;
  private readonly _imageUrl: string = environment.imageMovie;
  private lCtrl: HTMLIonLoadingElement;
  private _movieName: string;
  private _favMovie: FavoriteMovie[];
  private user: {token: string, user: User} | null;
  private alCtrl: HTMLIonAlertElement;

  public constructor(private movieService: MovieService, private loadingCtrl: LoadingController,
    private localStorageService: LocalStorageService, private userService: UserService, private alertController: AlertController) { }

  public ngOnInit(): void {
    this.user = JSON.parse(this.localStorageService.getItem('user'));
    this.userService.getSignInSubject().subscribe((_user: {token: string, user: User} | null): void => {
      if (_user) {
        this.user = _user;
        this.ionViewDidEnter();
      }
    });
  }

  public ionViewDidEnter(): void {
    this.getMoviesPage();
    if (this.user) {
      this.movieService.getFavoritesMovie(this.user).subscribe((data: {data: FavoriteMovie[]}) => {
        if (data.data.length > 0) {
          this._favMovie = data.data;
          if (this._movies) {
            this._movies.response.results.forEach((element: Result): void => {
              this._favMovie.forEach((movie: FavoriteMovie): void => {
                if (element.id === movie.id) {
                  element.favorite = true;
                }
              });
            });
          }
        }
      }, (error: HttpErrorResponse): void => {
        if (error.status === 401) {
          this.localStorageService.removeItem('user');
        }
      });
    }
  }

  public get movies(): Movie {
    return this._movies;
  }

  public get imageUrl(): string {
    return this._imageUrl;
  }

  public get movieName(): string {
    return this._movieName;
  }

  public set movieName(_movieName: string) {
    this._movieName = _movieName;
  }

  public getMoviesPage(page: number = 1) {
    if (this._movieName) {
      this.searchByName(page);
    } else {
      this.presentLoading();
      this.movieService.getMoviesByPage(page).subscribe((movies: Movie): void => {
        if (movies) {
          this._movies = movies;
        }
        this.lCtrl.dismiss();
      }, (error: HttpErrorResponse): void => {
        this.lCtrl.dismiss();
      });
    }
  }

  public searchByName(page: number): void {
    this.presentLoading();
    this.movieService.getMoviesByName(this._movieName, page).subscribe((movies: Movie): void => {
      if (movies) {
        this._movies = movies;
      }
      this.lCtrl.dismiss();
    }, (error: HttpErrorResponse): void => {
      this.lCtrl.dismiss();
    });
  }

  public movieSelected(): void {
    this.movieService.getTabSubject().next('/tabs/(home:home)');
  }

  public setFavorite(movie: Result): void {
    if (this.user) {
      if (!movie.favorite) {
        this.movieService.setFavoriteMovie(movie, this.user).subscribe((data: {data: FavoriteMovie[]}): void => {
          if (data.data) {
            movie.favorite = true;
          }
        });
      } else {
        this.movieService.deleteFavoriteMovie(movie, this.user).subscribe((data: {data: boolean}): void => {
          if (data.data) {
            movie.favorite = false;
          }
        });
      }
    } else {
      console.log('debe iniciar sesion');
    }
  }

  private async presentAlert(message: string, name: string): Promise<void> {
    this.alCtrl = await this.alertController.create({
      header: 'Success',
      subHeader: message,
      message: `Welcome ${name} !`,
      buttons: [{
        text: 'Ok'
      }],
      backdropDismiss: false
    });

    return await this.alCtrl.present();
  }

  private async presentLoading(present: boolean = true): Promise<void> {
    this.lCtrl = await this.loadingCtrl.create({
      message: 'Cargando Películas'
    });
    return await this.lCtrl.present();
  }
}
