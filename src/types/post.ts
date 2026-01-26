/**
 * CampusLoop Post Types
 * All post and feed-related TypeScript interfaces
 */

export type CampusLoopPostCategory =
    | 'assignment'
    | 'coding'
    | 'activities'
    | 'sports'
    | 'events'
    | 'discussion';

export interface CampusLoopPost {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    authorUniversity: string;
    category: CampusLoopPostCategory;
    content: string;
    createdAt: Date;
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
}

export interface CampusLoopComment {
    id: string;
    postId: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    content: string;
    createdAt: Date;
}

export interface CampusLoopCreatePostData {
    category: CampusLoopPostCategory;
    content: string;
}

export const CampusLoopPostCategoryLabels: Record<CampusLoopPostCategory, string> = {
    assignment: 'Assignment',
    coding: 'Coding',
    activities: 'Activities',
    sports: 'Sports',
    events: 'Events',
    discussion: 'Discussion',
};

export const CampusLoopPostCategoryColors: Record<CampusLoopPostCategory, string> = {
    assignment: '#3B82F6',
    coding: '#8B5CF6',
    activities: '#EC4899',
    sports: '#10B981',
    events: '#F59E0B',
    discussion: '#6366F1',
};
