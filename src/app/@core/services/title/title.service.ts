import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  constructor(
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  initializeTitleWatcher() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute.firstChild;
          let routeTitle = '';
          while (route) {
            if (route.snapshot.data['title']) {
              routeTitle = route.snapshot.data['title'];
            }
            route = route.firstChild;
          }
          return routeTitle;
        })
      )
      .subscribe((title: string) => {
        if (title) {
          this.titleService.setTitle(title);
        }
      });

    let initialRoute = this.activatedRoute.firstChild;
    while (initialRoute) {
      if (initialRoute.snapshot.data['title']) {
        this.titleService.setTitle(initialRoute.snapshot.data['title']);
      }
      initialRoute = initialRoute.firstChild;
    }
  }
}
