import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAssignmentComponent } from '../create-assignment/create-assignment.component';
import { ApiService } from '../../core/api.service';
import { DemoAuthService } from '../../core/demo-auth.service';
import { ReadingAssignment } from '../../models';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, CreateAssignmentComponent],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.scss'
})
export class TeacherDashboardComponent implements OnInit {
  readonly assignments = signal<ReadingAssignment[]>([]);
  readonly loading = signal(false);

  constructor(
    private readonly api: ApiService,
    private readonly auth: DemoAuthService
  ) {}

  ngOnInit() {
    this.loadAssignments();
  }

  loadAssignments() {
    this.loading.set(true);

    this.api.getTeacherAssignments(this.auth.currentUser().userId).subscribe({
      next: assignments => {
        this.assignments.set(assignments);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  fetchTimeDiffInMinutes(assignment: ReadingAssignment) {
    const startedReadingAt = new Date(assignment.startedReadingAt);
    let diffInMs;

    if (assignment.status === 'IN_PROGRESS') {
      diffInMs = Math.abs(new Date().getTime() - startedReadingAt.getTime());
    } else if (assignment.status === 'COMPLETED') {
      diffInMs = Math.abs(new Date(assignment.finishedReadingAt).getTime() - startedReadingAt.getTime());
    } else {
      return '';
    }

    return Math.ceil(diffInMs / (1000 * 60));
  }
}
