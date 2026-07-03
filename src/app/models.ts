export type UserRole = 'TEACHER' | 'STUDENT';

export type AssignmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  contentUrl: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface AppUser {
  id: number;
  name: string;
  email: string;
  userId: string;
  role: UserRole;
}

export interface ReadingAssignment {
  id: number;
  book: Book;
  student: AppUser;
  teacher: AppUser;
  dueDate: string;
  status: AssignmentStatus;
  minutesRead: number;
  createdAt: string;
}

export interface CreateAssignmentRequest {
  bookId: number;
  studentIds: string[];
  dueDate: string;
}

export interface UpdateProgressRequest {
  status: AssignmentStatus;
  minutesRead: number;
}
