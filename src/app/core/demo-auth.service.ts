import { Injectable, signal } from '@angular/core';
import { UserRole } from '../models';

export interface DemoUser {
  id: number;
  name: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class DemoAuthService {
  readonly demoUsers: DemoUser[] = [
    {
      id: 1,
      name: 'Demo Teacher',
      role: 'TEACHER'
    },
    {
      id: 2,
      name: 'Demo Student',
      role: 'STUDENT'
    }
  ];

  readonly currentUser = signal<DemoUser>(this.demoUsers[0]);

  selectUser(userId: number) {
    const user = this.demoUsers.find(candidate => candidate.id === userId);

    if (user) {
      this.currentUser.set(user);
    }
  }
}
