import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AppUser,
  Book,
  CreateAssignmentRequest,
  ReadingAssignment,
  UpdateProgressRequest
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:8080/api';

  constructor(private readonly http: HttpClient) {}

  getBooks() {
    return this.http.get<Book[]>(`${this.apiUrl}/books`);
  }

  getStudents() {
    return this.http.get<AppUser[]>(`${this.apiUrl}/users/students`);
  }

  getTeacherAssignments(userId: number) {
    return this.http.get<ReadingAssignment[]>(`${this.apiUrl}/assignments`, {
      headers: this.userHeaders(userId)
    });
  }

  createAssignments(userId: number, request: CreateAssignmentRequest) {
    return this.http.post<ReadingAssignment[]>(`${this.apiUrl}/assignments`, request, {
      headers: this.userHeaders(userId)
    });
  }

  getStudentAssignments(userId: number) {
    return this.http.get<ReadingAssignment[]>(`${this.apiUrl}/assignments/student`, {
      headers: this.userHeaders(userId)
    });
  }

  updateProgress(userId: number, assignmentId: number, request: UpdateProgressRequest) {
    return this.http.patch<ReadingAssignment>(
      `${this.apiUrl}/assignments/${assignmentId}/progress`,
      request,
      {
        headers: this.userHeaders(userId)
      }
    );
  }

  private userHeaders(userId: number) {
    return new HttpHeaders({
      'X-User-Id': String(userId)
    });
  }
}
