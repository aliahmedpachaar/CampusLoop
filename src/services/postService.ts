/**
 * CampusLoop Post Service
 * Mock post and feed service - ready for backend integration
 */

import {
    CampusLoopPost,
    CampusLoopComment,
    CampusLoopCreatePostData,
    CampusLoopPostCategory,
} from '../types/post';

const mockDelay = (ms: number = 700) => new Promise(resolve => setTimeout(resolve, ms));

// Mock posts database
let mockPosts: CampusLoopPost[] = [
    {
        id: 'post_1',
        authorId: '2',
        authorName: 'Sarah Johnson',
        authorUniversity: 'Massachusetts Institute of Technology (MIT)',
        category: 'assignment',
        content: 'Looking for 2 people to collaborate on the Machine Learning assignment due next week. Anyone interested?',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        likesCount: 5,
        commentsCount: 3,
        isLiked: false,
    },
    {
        id: 'post_2',
        authorId: '1',
        authorName: 'Demo Student',
        authorUniversity: 'Stanford University',
        category: 'coding',
        content: 'Anyone working on a React Native project? Would love to share tips and collaborate!',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        likesCount: 12,
        commentsCount: 7,
        isLiked: true,
    },
    {
        id: 'post_3',
        authorId: '2',
        authorName: 'Sarah Johnson',
        authorUniversity: 'Massachusetts Institute of Technology (MIT)',
        category: 'sports',
        content: 'Basketball game this Saturday at 4 PM. Need 2 more players! 🏀',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        likesCount: 8,
        commentsCount: 4,
        isLiked: false,
    },
];

export const CampusLoopPostService = {
    /**
     * Get posts with optional filters
     * TODO: Replace with actual API call
     */
    getPosts: async (
        category?: CampusLoopPostCategory,
        userId?: string
    ): Promise<CampusLoopPost[]> => {
        await mockDelay();

        let filtered = [...mockPosts];

        if (category) {
            filtered = filtered.filter(post => post.category === category);
        }

        if (userId) {
            filtered = filtered.filter(post => post.authorId === userId);
        }

        // Sort by date (newest first)
        return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    },

    /**
     * Create new post
     * TODO: Replace with actual API call
     */
    createPost: async (
        userId: string,
        userName: string,
        userUniversity: string,
        data: CampusLoopCreatePostData
    ): Promise<CampusLoopPost> => {
        await mockDelay(800);

        const newPost: CampusLoopPost = {
            id: `post_${Date.now()}`,
            authorId: userId,
            authorName: userName,
            authorUniversity: userUniversity,
            category: data.category,
            content: data.content,
            createdAt: new Date(),
            likesCount: 0,
            commentsCount: 0,
            isLiked: false,
        };

        mockPosts.unshift(newPost);
        return newPost;
    },

    /**
     * Toggle like on post
     * TODO: Replace with actual API call
     */
    likePost: async (postId: string, userId: string): Promise<CampusLoopPost> => {
        await mockDelay(300);

        const post = mockPosts.find(p => p.id === postId);

        if (!post) {
            throw new Error('Post not found');
        }

        // Toggle like
        post.isLiked = !post.isLiked;
        post.likesCount += post.isLiked ? 1 : -1;

        return post;
    },

    /**
     * Add comment to post
     * TODO: Replace with actual API call
     */
    addComment: async (
        postId: string,
        userId: string,
        userName: string,
        content: string
    ): Promise<CampusLoopComment> => {
        await mockDelay(500);

        const post = mockPosts.find(p => p.id === postId);

        if (!post) {
            throw new Error('Post not found');
        }

        const comment: CampusLoopComment = {
            id: `comment_${Date.now()}`,
            postId,
            authorId: userId,
            authorName: userName,
            content,
            createdAt: new Date(),
        };

        post.commentsCount += 1;

        return comment;
    },

    /**
     * Get comments for a post
     * TODO: Replace with actual API call
     */
    getComments: async (postId: string): Promise<CampusLoopComment[]> => {
        await mockDelay(500);

        // Mock comments
        return [];
    },
};
