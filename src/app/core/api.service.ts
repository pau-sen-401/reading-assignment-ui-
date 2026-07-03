import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AppUser,
  Book,
  CreateAssignmentRequest, LoginRequest,
  ReadingAssignment,
  UpdateProgressRequest
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:8080/api';

  constructor(private readonly http: HttpClient) {}

  login(request: LoginRequest) {
    return this.http.post<AppUser>(`${this.apiUrl}/users/login`, request);
  }

  getBooks() {
    return this.http.get<Book[]>(`${this.apiUrl}/books`);
  }

  getStudents() {
    return this.http.get<AppUser[]>(`${this.apiUrl}/users/students`);
  }

  getTeacherAssignments(userId: string) {
    return this.http.get<ReadingAssignment[]>(`${this.apiUrl}/assignments`, {
      headers: this.userHeaders(userId)
    });
  }

  createAssignments(userId: string, request: CreateAssignmentRequest) {
    return this.http.post<ReadingAssignment[]>(`${this.apiUrl}/assignments`, request, {
      headers: this.userHeaders(userId)
    });
  }

  getStudentAssignments(userId: string) {
    return this.http.get<ReadingAssignment[]>(`${this.apiUrl}/assignments/student`, {
      headers: this.userHeaders(userId)
    });
  }

  updateProgress(userId: string, assignmentId: number, request: UpdateProgressRequest) {
    return this.http.patch<ReadingAssignment>(
      `${this.apiUrl}/assignments/${assignmentId}/progress`,
      request,
      {
        headers: this.userHeaders(userId)
      }
    );
  }

  private userHeaders(userId: string) {
    return new HttpHeaders({
      'X-User-Id': userId
    });
  }
}
