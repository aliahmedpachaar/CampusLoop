/**
 * CampusLoop - University & Course Data
 * University is fixed to City University Malaysia.
 */

export const CITY_UNIVERSITY = 'City University Malaysia';

export const CampusLoopCampuses = [
    'Petaling Jaya Campus',
    'Cyberjaya Campus',
    'Johor Campus',
] as const;

export const CampusLoopCourses = [
    'Computer Science',
    'Software Engineering',
    'Information Technology',
    'Data Science',
    'Artificial Intelligence',
    'Cybersecurity',
    'Business Administration',
    'Accounting & Finance',
    'Marketing',
    'Human Resource Management',
    'Mechanical Engineering',
    'Electrical & Electronic Engineering',
    'Civil Engineering',
    'Architecture',
    'Medicine',
    'Nursing',
    'Pharmacy',
    'Psychology',
    'Law',
    'Mass Communication',
    'Graphic Design',
    'Interior Design',
    'Education',
    'English Language Studies',
    'Foundation in Arts',
    'Foundation in Science',
];

export const CampusLoopSemesters = [
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8',
    'Year 1',
    'Year 2',
    'Year 3',
    'Year 4',
    'Graduate',
];

export const CampusLoopInterests = [
    'Coding', 'Web Development', 'Mobile Development', 'Machine Learning',
    'Gaming', 'Sports', 'Football', 'Basketball', 'Badminton', 'Gym & Fitness',
    'Music', 'Photography', 'Reading', 'Writing', 'Art & Design',
    'Cooking', 'Travel', 'Hiking', 'Volunteering', 'Entrepreneurship',
    'Public Speaking', 'Theater', 'Dance', 'Yoga', 'Chess',
    'Anime & Manga', 'Movies & TV', 'Podcasts',
];

export type CampusLoopCampus = typeof CampusLoopCampuses[number];
