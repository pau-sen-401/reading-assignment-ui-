import { Routes } from '@angular/router';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'teacher',
    pathMatch: 'full'
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
    redirectTo: 'teacher'
  }
];
