/**
 * CampusLoop Activity Types
 * All activity and collaboration-related TypeScript interfaces
 */

export type CampusLoopActivityType =
    | 'study_group'
    | 'assignment_help'
    | 'sports'
    | 'event'
    | 'project_collab';

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
    university: string;
    location?: string;
    scheduledDate?: Date;
    createdAt: Date;
    isJoined: boolean;
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
}

export const CampusLoopActivityTypeLabels: Record<CampusLoopActivityType, string> = {
    study_group: 'Study Group',
    assignment_help: 'Assignment Help',
    sports: 'Sports',
    event: 'Event',
    project_collab: 'Project Collaboration',
};

export const CampusLoopActivityTypeIcons: Record<CampusLoopActivityType, string> = {
    study_group: 'book',
    assignment_help: 'help-circle',
    sports: 'basketball',
    event: 'calendar',
    project_collab: 'code',
};

export const CampusLoopActivityTypeColors: Record<CampusLoopActivityType, string> = {
    study_group: '#3B82F6',
    assignment_help: '#F59E0B',
    sports: '#10B981',
    event: '#EC4899',
    project_collab: '#8B5CF6',
};
