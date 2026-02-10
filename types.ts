
export interface Student {
  id: string;
  name: string;
  role: string;
  avatar: string;
  department: string;
  email?: string;
  phone?: string;
  enrollmentDate?: string;
  bio?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: Date;
  status: 'Present' | 'Late';
  confidence: number;
}

export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  LIVE_SCAN = 'LIVE_SCAN',
  RECORDS = 'RECORDS',
  STUDENTS = 'STUDENTS',
  STUDENT_PROFILE = 'STUDENT_PROFILE',
  PYTHON_CODE = 'PYTHON_CODE'
}

export interface RecognitionResult {
  studentId: string | null;
  confidence: number;
  message: string;
}
