import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '../../../node_modules/@angular/router';
import { MovieService } from '../services/movie.service';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.page.html',
  styleUrls: ['./movie.page.scss'],
})
export class MoviePage implements OnInit {

  public videoId: string;
  private _movie: any;
  private tab = '';

  public constructor(private route: ActivatedRoute, private movieService: MovieService, private navController: NavController,
    private router: Router, private userService: UserService) {
    this.movieService.getTabSubject().subscribe((tab: string): void => {
      this.tab = tab;
    });
  }

  public ngOnInit(): void {
    this.route.params.subscribe((params: Params): void => {
      if (params['id']) {
        this.movieService.getYouTubeVideo(params['id']).subscribe((movie: any): void => {
          if (movie) {
            this._movie = movie;
            if (movie.videos.results) {
              if (movie.videos.results[0].site === 'YouTube') {
                this.videoId = movie.videos.results[0].key;
              }
            }
          }
        }, (error: HttpErrorResponse): void => {
        });
      }
    }, (error: HttpErrorResponse): void => {
    });
  }

  public get movie(): any {
    return this._movie;
  }

  public set movie(_movie: any) {
    this._movie = _movie;
  }
  public goBack(): void {
    this.navController.navigateForward(this.tab);
  }

}
