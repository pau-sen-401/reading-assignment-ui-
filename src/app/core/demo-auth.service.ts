import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AppUser, UserRole } from '../models';

export interface DemoUser {
  id: number;
  name: string;
  userId: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class DemoAuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'reading-assignment-current-user';

  currentUser = signal<DemoUser>(this.getStoredUser());

  setCurrentUser(user: AppUser) {
    const currentUser: DemoUser = {
      id: user.id,
      name: user.name,
      userId: user.userId,
      role: user.role
    };

    this.currentUser.set(currentUser);

    if (this.isBrowser()) {
      localStorage.setItem(this.storageKey, JSON.stringify(currentUser));
    }
  }

  clearCurrentUser() {
    if (this.isBrowser()) {
      localStorage.removeItem(this.storageKey);
    }

    this.currentUser.set(this.emptyUser());
  }

  private getStoredUser(): DemoUser {
    if (!this.isBrowser()) {
      return this.emptyUser();
    }

    const storedUser = localStorage.getItem(this.storageKey);

    if (!storedUser) {
      return this.emptyUser();
    }

    try {
      return JSON.parse(storedUser) as DemoUser;
    } catch {
      localStorage.removeItem(this.storageKey);
      return this.emptyUser();
    }
  }

  private isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  private emptyUser(): DemoUser {
    return {
      id: 0,
      name: '',
      userId: '',
      role: 'STUDENT'
    };
  }
}
