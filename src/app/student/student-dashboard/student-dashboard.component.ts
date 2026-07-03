import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { DemoAuthService } from '../../core/demo-auth.service';
import { AssignmentStatus, ReadingAssignment } from '../../models';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent implements OnInit {
  readonly assignments = signal<ReadingAssignment[]>([]);
  readonly loading = signal(false);

  readonly statuses: AssignmentStatus[] = [
    'NOT_STARTED',
    'IN_PROGRESS',
    'COMPLETED'
  ];

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

  updateAssignment(assignment: ReadingAssignment) {
    this.api.updateProgress(this.auth.currentUser().userId, assignment.id, {
      status: assignment.status,
      minutesRead: assignment.minutesRead
    }).subscribe(updated => {
      this.assignments.update(assignments =>
        assignments.map(candidate =>
          candidate.id === updated.id ? updated : candidate
        )
      );
    });
  }
}
