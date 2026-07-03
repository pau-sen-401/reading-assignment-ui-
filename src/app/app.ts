import { Component, computed, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { DemoAuthService } from './core/demo-auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('reading-assignment-ui');
  protected readonly currentUrl = signal('');

  protected readonly showLogout = computed(() => {
    const url = this.currentUrl();
    return url.startsWith('/teacher') || url.startsWith('/student');
  });

  constructor(
    private readonly router: Router,
    private readonly auth: DemoAuthService
  ) {
    this.currentUrl.set(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }

  protected logout() {
    this.auth.clearCurrentUser();
    this.router.navigateByUrl('/');
  }
}
