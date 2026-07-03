import { Routes } from '@angular/router';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'teacher',
    component: TeacherDashboardComponent
  },
  {
    path: 'student',
    component: StudentDashboardComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
