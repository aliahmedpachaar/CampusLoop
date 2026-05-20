import { CampusLoopPost, CampusLoopComment, CampusLoopCreatePostData, CampusLoopPostCategory } from '../types/post';
import { apiService } from './api';
import { API_CONFIG } from '../config/api';

export const CampusLoopPostService = {

    getPosts: async (category?: CampusLoopPostCategory | 'all'): Promise<CampusLoopPost[]> => {
        const params: Record<string, string> = {};
        if (category && category !== 'all') params.category = category;
        const res = await apiService.get<any[]>(API_CONFIG.ENDPOINTS.POSTS, params);
        if (!res.success || !res.data) return [];
        return res.data.map((p: any) => ({
            id:               p.id,
            authorId:         p.authorId,
            authorName:       p.authorName,
            authorAvatar:     p.authorAvatar,
            authorUniversity: p.authorCampus || '',
            category:         p.category,
            content:          p.content,
            likesCount:       p.likesCount,
            commentsCount:    p.commentsCount,
            isLiked:          p.isLiked,
            comments:         p.comments || [],
            createdAt:        new Date(p.createdAt),
        }));
    },

    createPost: async (_userId: string, _userName: string, _university: string, data: CampusLoopCreatePostData): Promise<CampusLoopPost> => {
        const res = await apiService.post<any>(API_CONFIG.ENDPOINTS.POSTS, data);
        if (!res.success || !res.data) throw new Error(res.message || 'Failed to create post');
        const p = res.data;
        return {
            id:               p.id,
            authorId:         p.authorId,
            authorName:       p.authorName,
            authorAvatar:     p.authorAvatar,
            authorUniversity: p.authorCampus || '',
            category:         p.category,
            content:          p.content,
            likesCount:       0,
            commentsCount:    0,
            isLiked:          false,
            comments:         [],
            createdAt:        new Date(p.createdAt),
        };
    },

    likePost: async (postId: string, _userId: string): Promise<{ likesCount: number; isLiked: boolean }> => {
        const res = await apiService.post<any>(API_CONFIG.ENDPOINTS.LIKE_POST(postId));
        if (!res.success || !res.data) throw new Error('Failed to like post');
        return { likesCount: res.data.likesCount, isLiked: res.data.isLiked };
    },

    addComment: async (postId: string, _userId: string, _userName: string, content: string): Promise<CampusLoopComment> => {
        const res = await apiService.post<any>(API_CONFIG.ENDPOINTS.COMMENT_POST(postId), { content });
        if (!res.success || !res.data) throw new Error('Failed to add comment');
        const c = res.data;
        return {
            id:           c.id,
            postId,
            authorId:     c.authorId,
            authorName:   c.authorName,
            authorAvatar: c.authorAvatar,
            content:      c.content,
            createdAt:    new Date(c.createdAt),
        };
    },

    deletePost: async (postId: string): Promise<void> => {
        await apiService.delete(API_CONFIG.ENDPOINTS.DELETE_POST(postId));
    },

    getComments: async (_postId: string): Promise<CampusLoopComment[]> => [],
};
