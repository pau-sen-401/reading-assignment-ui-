import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  selectedBookId?: number;
  selectedStudentIds: string[] = [];
  dueDate = '';

  constructor(
    private readonly api: ApiService,
    private readonly auth: DemoAuthService
  ) {}

  ngOnInit() {
    this.api.getBooks().subscribe(books => this.books.set(books));
    this.api.getStudents().subscribe(students => this.students.set(students));
  }

  toggleStudent(studentId: string, checked: boolean) {
    if (checked) {
      this.selectedStudentIds = [...this.selectedStudentIds, studentId];
    } else {
      this.selectedStudentIds = this.selectedStudentIds.filter(id => id !== studentId);
    }
  }

  submit() {
    if (!this.selectedBookId || this.selectedStudentIds.length === 0 || !this.dueDate) {
      return;
    }

    this.saving.set(true);

    this.api.createAssignments(this.auth.currentUser().userId, {
      bookId: this.selectedBookId,
      studentIds: this.selectedStudentIds,
      dueDate: this.dueDate
    }).subscribe({
      next: () => {
        this.selectedBookId = undefined;
        this.selectedStudentIds = [];
        this.dueDate = '';
        this.saving.set(false);
        this.assignmentCreated.emit();
      },
      error: () => {
        this.saving.set(false);
      }
    });
  }
}
