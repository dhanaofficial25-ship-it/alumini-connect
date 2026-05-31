
export enum UserRole {
  STUDENT = 'STUDENT',
  ALUMNI = 'ALUMNI',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar: string;
  bio?: string;
  skills?: string[];
  company?: string;
  jobTitle?: string;
  academicYear?: string;
  major?: string;
  location?: string;
  isMentoring?: boolean; // Added for volunteer status
}

export interface Job {
  id: string;
  title: string;
  company: string;
  postedBy: string; // User ID
  location: string;
  type: 'Full-time' | 'Internship' | 'Part-time';
  description: string;
  qualifications?: string[];
  salary: string; 
  datePosted: string;
  applicants: string[]; // User IDs
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: 'Webinar' | 'Meetup' | 'Workshop';
  attendees: string[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}
