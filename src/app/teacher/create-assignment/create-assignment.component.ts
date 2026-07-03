import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../core/api.service';
import { DemoAuthService } from '../../core/demo-auth.service';
import { AppUser, Book } from '../../models';

@Component({
  selector: 'app-create-assignment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-assignment.component.html',
  styleUrl: './create-assignment.component.scss'
})
export class CreateAssignmentComponent implements OnInit {
  @Output() assignmentCreated = new EventEmitter<void>();

  readonly books = signal<Book[]>([]);
  readonly students = signal<AppUser[]>([]);
  readonly saving = signal(false);
  readonly submitted = signal(false);
  readonly apiError = signal<string | null>(null);

  selectedBookId?: number;
  selectedStudentIds: string[] = [];
  dueDate = '';

  readonly minDueDate = new Date().toISOString().split('T')[0];

  constructor(
    private readonly api: ApiService,
    private readonly auth: DemoAuthService
  ) {}

  ngOnInit() {
    this.api.getBooks().subscribe(books => this.books.set(books));
    this.api.getStudents().subscribe(students => this.students.set(students));
  }

  get hasSelectedStudents() {
    return this.selectedStudentIds.length > 0;
  }

  get isDueDateInPast() {
    return !!this.dueDate && this.dueDate < this.minDueDate;
  }

  get isFormValid() {
    return !!this.selectedBookId && this.hasSelectedStudents && !!this.dueDate && !this.isDueDateInPast;
  }

  toggleStudent(studentId: string, checked: boolean) {
    if (checked) {
      this.selectedStudentIds = [...this.selectedStudentIds, studentId];
    } else {
      this.selectedStudentIds = this.selectedStudentIds.filter(id => id !== studentId);
    }
  }

  submit() {
    this.submitted.set(true);
    this.apiError.set(null);

    if (!this.isFormValid) {
      return;
    }

    this.saving.set(true);

    this.api.createAssignments(this.auth.currentUser().userId, {
      bookId: this.selectedBookId!,
      studentIds: this.selectedStudentIds,
      dueDate: this.dueDate
    }).subscribe({
      next: () => {
        this.selectedBookId = undefined;
        this.selectedStudentIds = [];
        this.dueDate = '';
        this.submitted.set(false);
        this.saving.set(false);
        this.apiError.set(null);
        this.assignmentCreated.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.saving.set(false);

        if (error.status === 400 && typeof error.error?.message === 'string') {
          this.apiError.set(error.error.message);
          return;
        }

        this.apiError.set('Unable to create assignment. Please try again.');
      }
    });
  }
}
