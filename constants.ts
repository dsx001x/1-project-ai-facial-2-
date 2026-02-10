
import { Student } from './types';

export const MOCK_STUDENTS: Student[] = [
  { 
    id: 'S101', 
    name: 'John Doe', 
    role: 'Student', 
    avatar: 'https://picsum.photos/seed/john/200', 
    department: 'Computer Science',
    email: 'john.doe@university.edu',
    phone: '+1 (555) 010-1234',
    enrollmentDate: '2023-09-01',
    bio: 'Passionate about machine learning and computer vision. Active member of the AI Ethics club.'
  },
  { 
    id: 'S102', 
    name: 'Jane Smith', 
    role: 'Student', 
    avatar: 'https://picsum.photos/seed/jane/200', 
    department: 'Data Science',
    email: 'jane.smith@university.edu',
    phone: '+1 (555) 010-5678',
    enrollmentDate: '2023-08-15',
    bio: 'Data enthusiast focused on statistical modeling and big data analytics.'
  },
  { 
    id: 'S103', 
    name: 'Alex Johnson', 
    role: 'Student', 
    avatar: 'https://picsum.photos/seed/alex/200', 
    department: 'Electronics',
    email: 'alex.j@university.edu',
    phone: '+1 (555) 010-9012',
    enrollmentDate: '2024-01-10',
    bio: 'Exploring the intersection of hardware and artificial intelligence.'
  },
  { 
    id: 'S104', 
    name: 'Sarah Wilson', 
    role: 'Student', 
    avatar: 'https://picsum.photos/seed/sarah/200', 
    department: 'Computer Science',
    email: 'sarah.w@university.edu',
    phone: '+1 (555) 010-3456',
    enrollmentDate: '2023-09-01',
    bio: 'Full-stack developer with an interest in scalable cloud architectures.'
  },
  { 
    id: 'S105', 
    name: 'Michael Brown', 
    role: 'Student', 
    avatar: 'https://picsum.photos/seed/michael/200', 
    department: 'Mathematics',
    email: 'm.brown@university.edu',
    phone: '+1 (555) 010-7890',
    enrollmentDate: '2022-09-05',
    bio: 'Specializing in discrete mathematics and cryptography.'
  },
];

export const APP_CONFIG = {
  RECOGNITION_COOLDOWN_MS: 5000, 
  CAPTURE_INTERVAL_MS: 3000,
};
