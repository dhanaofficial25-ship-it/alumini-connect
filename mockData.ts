
import { User, UserRole, Job, Event } from './types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Admin User',
    email: 'admin@college.edu',
    password: 'admin123',
    role: UserRole.ADMIN,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    bio: 'System Administrator for AlumniConnect.'
  },
  {
    id: 'u2',
    name: 'Sarah Jenkins',
    email: 'sarah.j@google.com',
    password: 'password123',
    role: UserRole.ALUMNI,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    company: 'Google',
    jobTitle: 'Senior UX Architect',
    skills: ['Figma', 'React', 'Product Strategy'],
    location: 'Mountain View, CA',
    bio: 'Class of 2012. Passionate about inclusive design.'
  },
  {
    id: 'u3',
    name: 'David Chen',
    email: 'david.c@student.edu',
    password: 'password123',
    role: UserRole.STUDENT,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    academicYear: 'Junior',
    major: 'Computer Science',
    skills: ['Python', 'Django', 'ML'],
    bio: 'Looking for summer internships in AI.'
  },
  {
    id: 'u4',
    name: 'Michael Ross',
    email: 'm.ross@netflix.com',
    password: 'password123',
    role: UserRole.ALUMNI,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    company: 'Netflix',
    jobTitle: 'Backend Lead',
    skills: ['Java', 'Microservices', 'AWS'],
    location: 'Los Gatos, CA',
    bio: 'Love giving back to the community. Reach out for mock interviews!'
  },
  {
    id: 'u5',
    name: 'Elena Rodriguez',
    email: 'elena@student.edu',
    password: 'password123',
    role: UserRole.STUDENT,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    academicYear: 'Senior',
    major: 'Business Administration',
    skills: ['Finance', 'Data Analysis'],
    bio: 'Interested in FinTech startups.'
  }
];

export const mockJobs: Job[] = [
  {
    id: 'j1',
    title: 'Junior UI/UX Designer',
    company: 'Google',
    postedBy: 'u2',
    location: 'Remote',
    type: 'Full-time',
    salary: '$95,000 - $120,000',
    description: 'Join the Google Design team working on future workspace products. We value creativity and user empathy above all.',
    qualifications: ['Portfolio demonstrating UX process', 'Experience with Figma/Adobe XD', 'Understanding of Accessibility'],
    datePosted: '2024-05-15',
    applicants: ['u3', 'u5']
  },
  {
    id: 'j2',
    title: 'Software Engineering Intern',
    company: 'Netflix',
    postedBy: 'u4',
    location: 'Los Gatos, CA',
    type: 'Internship',
    salary: '$45 - $60 / hour',
    description: 'Work with the edge computing team at Netflix. Great mentorship and real-world impact on streaming quality.',
    qualifications: ['Enrolled in CS degree', 'Proficiency in Java or Python', 'Passion for distributed systems'],
    datePosted: '2024-05-18',
    applicants: ['u3']
  }
];

export const mockEvents: Event[] = [
  {
    id: 'e1',
    title: 'FinTech 2024 Networking Night',
    date: '2024-06-10',
    time: '18:30',
    location: 'Virtual',
    description: 'A deep dive into the world of FinTech with industry experts.',
    type: 'Webinar',
    attendees: ['u1', 'u5']
  }
];
