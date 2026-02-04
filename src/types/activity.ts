/**
 * CampusLoop Activity Types
 * All activity and collaboration-related TypeScript interfaces
 */

export type CampusLoopActivityType =
    | 'study_group'
    | 'assignment_help'
    | 'sports'
    | 'movies'
    | 'trip'
    | 'food'
    | 'event'
    | 'project'
    | 'other';

export interface CampusLoopActivityParticipantInfo {
    id: string;
    name: string;
    avatar?: string;
}

export interface CampusLoopActivity {
    id: string;
    creatorId: string;
    creatorName: string;
    creatorAvatar?: string;
    type: CampusLoopActivityType;
    title: string;
    description: string;
    maxParticipants: number;
    currentParticipants: number;
    participantIds: string[];
    participants?: CampusLoopActivityParticipantInfo[];
    university: string;
    campus?: string;
    location?: string;
    scheduledDate?: Date;
    createdAt: Date;
    isJoined: boolean;
    isCreator?: boolean;
    status?: 'active' | 'completed' | 'cancelled';
    tags?: string[];
}

export interface CampusLoopActivityParticipant {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    joinedAt: Date;
}

export interface CampusLoopCreateActivityData {
    type: CampusLoopActivityType;
    title: string;
    description: string;
    maxParticipants: number;
    location?: string;
    scheduledDate?: Date;
    tags?: string[];
}

export const CampusLoopActivityTypeLabels: Record<CampusLoopActivityType, string> = {
    study_group: 'Study Group',
    assignment_help: 'Need Help',
    sports: 'Sports',
    movies: 'Movies/Events',
    trip: 'Trip',
    food: 'Food',
    event: 'Event',
    project: 'Project',
    other: 'Other',
};

export const CampusLoopActivityTypeIcons: Record<CampusLoopActivityType, string> = {
    study_group: 'book',
    assignment_help: 'help-circle',
    sports: 'basketball',
    movies: 'film',
    trip: 'map',
    food: 'restaurant',
    event: 'calendar',
    project: 'code',
    other: 'ellipsis-horizontal',
};

export const CampusLoopActivityTypeColors: Record<CampusLoopActivityType, string> = {
    study_group: '#0D9488',
    assignment_help: '#F59E0B',
    sports: '#10B981',
    movies: '#EF4444',
    trip: '#0EA5E9',
    food: '#F97316',
    event: '#8B5CF6',
    project: '#6366F1',
    other: '#64748B',
};
