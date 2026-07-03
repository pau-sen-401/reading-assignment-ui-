import { Injectable, signal } from '@angular/core';
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

  currentUser = signal<DemoUser>({
    id: 0,
    name: '',
    userId: '',
    role: 'STUDENT'
  });

  setCurrentUser(user: AppUser) {
    this.currentUser.set({
      id: user.id,
      name: user.name,
      userId: user.userId,
      role: user.role
    });
  }

}
