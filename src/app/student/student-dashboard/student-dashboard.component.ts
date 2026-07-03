import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { DemoAuthService } from '../../core/demo-auth.service';
import { AssignmentStatus, ReadingAssignment } from '../../models';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent implements OnInit {
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

    this.api.getStudentAssignments(this.auth.currentUser().userId).subscribe({
      next: assignments => {
        this.assignments.set(assignments);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getNextStatus(status: AssignmentStatus): AssignmentStatus {
    switch (status) {
      case 'NOT_STARTED':
        return 'IN_PROGRESS';
      case 'IN_PROGRESS':
        return 'COMPLETED';
      case 'COMPLETED':
        return 'COMPLETED';
    }
  }

  getProgressActionLabel(status: AssignmentStatus): string {
    switch (status) {
      case 'NOT_STARTED':
        return 'Start Reading';
      case 'IN_PROGRESS':
        return 'Mark Completed';
      case 'COMPLETED':
        return 'Completed';
    }
  }

  advanceAssignmentStatus(assignment: ReadingAssignment) {
    const nextStatus = this.getNextStatus(assignment.status);

    if (nextStatus === assignment.status) {
      return;
    }

    this.api.updateProgress(this.auth.currentUser().userId, assignment.id, {
      status: nextStatus
    }).subscribe(updated => {
      this.assignments.update(assignments =>
        assignments.map(candidate =>
          candidate.id === updated.id ? updated : candidate
        )
      );
    });
  }
}
