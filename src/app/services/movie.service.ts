import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Movie, Result } from '../models/movie';
import { Observable, of, Subject, } from '../../../node_modules/rxjs';
import { Genre, GenreElement } from '../models/genre';

import * as _ from 'lodash';
import { FavoriteMovie } from '../models/favoriteMovie';
import { User } from '../models/user';
declare var require: any;

@Injectable({
  providedIn: 'root'
})
export class MovieService {


  public favorite: boolean;
  private moviesUrl = `${environment.ApiUrl}/movies`;
  private favtoriteMoviesUrl = `${environment.ApiUrl}/user_movie`;
  private _genre: Genre = <Genre>require('../models/genre.json');
  private deleteFavmovieUrl = `${environment.ApiUrl}/movie`;
  private tabSubject: Subject<string> = new Subject<string>();
  

  public constructor(private httpClient: HttpClient) { }


  public getMoviesByPage(page: number = 1): Observable<Movie> {
    const params: HttpParams = new HttpParams({
      fromObject: {
        page: page.toString(),
        id: '',
        gender: '',
        name: ''
      }
    });
    return this.httpClient.get<Movie>(this.moviesUrl, { params: params });
  }

  public getMoviesByName(name: string, page: number): Observable<Movie> {
    const params: HttpParams = new HttpParams({
      fromObject: {
        page: page.toString(),
        id: '',
        gender: '',
        name: name
      }
    });
    return this.httpClient.get<Movie>(this.moviesUrl, { params: params });
  }

  public getMoviesById(id: number): Observable<Movie> {
    const params: HttpParams = new HttpParams({
      fromObject: {
        page: '',
        id: id.toString(),
        gender: '',
        name: name
      }
    });
    return this.httpClient.get<Movie>(this.moviesUrl, { params: params });
  }

  public getFavoritesMovie(user: {token: string, user: User} | null): Observable<{data: FavoriteMovie[]}> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': 'JWT ' + (user ? user.token : '')});
    return this.httpClient.get<{data: FavoriteMovie[]}>(this.favtoriteMoviesUrl, {headers: headers});
  }

  public setFavoriteMovie(movie: Result, user: {token: string, user: User} | null): Observable<{data: FavoriteMovie[]}>  {
    const genre: string | null = _.find<GenreElement>(this._genre.genres, ['id', movie.genre_ids[0]]).name;
    movie.genre = genre ? genre : '';
    const headers: HttpHeaders = new HttpHeaders({'Authorization': 'JWT ' + (user ? user.token : '')});
    return this.httpClient.post<{data: FavoriteMovie[]}>(this.moviesUrl, movie, {headers: headers});
  }

  public deleteFavoriteMovie(movie: Result, user: {token: string, user: User} | null ): Observable<{data: boolean}> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': 'JWT ' + (user ? user.token : '')});
    return this.httpClient.delete<{data: boolean}>(`${this.deleteFavmovieUrl}/${movie.id}`, {headers: headers});
  }

  public getYouTubeVideo(id: string): Observable<any> {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=87829c8208f4f2fdaffabb5e72fa039f&append_to_response=videos`;
    return this.httpClient.get<any>(url);
  }

  public getTabSubject(): Subject<string>  {
    return this.tabSubject;
  }

}
