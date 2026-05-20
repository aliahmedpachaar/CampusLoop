const Post = require('../models/Post');
const Notification = require('../models/Notification');

// GET /api/posts
const getPosts = async (req, res) => {
    try {
        const { category, limit = 20, page = 1 } = req.query;
        const query = { isDeleted: false, university: req.user.university };
        if (category && category !== 'all') query.category = category;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const posts = await Post.find(query)
            .populate('author', 'fullName avatar campus course')
            .populate('comments.user', 'fullName avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Post.countDocuments(query);

        const formatted = posts.map(p => ({
            id:            p._id,
            authorId:      p.author._id,
            authorName:    p.author.fullName,
            authorAvatar:  p.author.avatar,
            authorCampus:  p.author.campus,
            authorCourse:  p.author.course,
            category:      p.category,
            content:       p.content,
            likesCount:    p.likes.length,
            isLiked:       p.likes.map(String).includes(String(req.user.id)),
            commentsCount: p.comments.length,
            comments:      p.comments.map(c => ({
                id:         c._id,
                authorId:   c.user._id,
                authorName: c.user.fullName,
                authorAvatar: c.user.avatar,
                content:    c.content,
                createdAt:  c.createdAt,
            })),
            createdAt: p.createdAt,
        }));

        res.json({ success: true, data: formatted, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching posts' });
    }
};

// POST /api/posts
const createPost = async (req, res) => {
    try {
        const { content, category } = req.body;
        if (!content?.trim()) return res.status(400).json({ success: false, message: 'Content is required' });
        if (!category)        return res.status(400).json({ success: false, message: 'Category is required' });

        const post = await Post.create({
            author:     req.user.id,
            content:    content.trim(),
            category,
            university: req.user.university,
            campus:     req.user.campus || '',
        });

        await post.populate('author', 'fullName avatar campus course');

        res.status(201).json({
            success: true,
            data: {
                id:            post._id,
                authorId:      post.author._id,
                authorName:    post.author.fullName,
                authorAvatar:  post.author.avatar,
                authorCampus:  post.author.campus,
                authorCourse:  post.author.course,
                category:      post.category,
                content:       post.content,
                likesCount:    0,
                isLiked:       false,
                commentsCount: 0,
                comments:      [],
                createdAt:     post.createdAt,
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error creating post' });
    }
};

// POST /api/posts/:id/like
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post || post.isDeleted) return res.status(404).json({ success: false, message: 'Post not found' });

        const userId   = String(req.user.id);
        const likeList = post.likes.map(String);
        const isLiked  = likeList.includes(userId);

        if (isLiked) {
            post.likes = post.likes.filter(id => String(id) !== userId);
        } else {
            post.likes.push(req.user.id);
            // Notify author
            if (String(post.author) !== userId) {
                const io = req.app.get('io');
                await Notification.create({
                    recipient: post.author,
                    sender:    req.user.id,
                    type:      'activity_join', // reuse as generic
                    title:     'Someone liked your post',
                    message:   `${req.user.fullName} liked your post`,
                });
                if (io) io.to(String(post.author)).emit('newNotification', { type: 'like' });
            }
        }
        await post.save();

        res.json({ success: true, data: { likesCount: post.likes.length, isLiked: !isLiked } });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error liking post' });
    }
};

// POST /api/posts/:id/comment
const addComment = async (req, res) => {
    try {
        const { content } = req.body;
        if (!content?.trim()) return res.status(400).json({ success: false, message: 'Comment cannot be empty' });

        const post = await Post.findById(req.params.id);
        if (!post || post.isDeleted) return res.status(404).json({ success: false, message: 'Post not found' });

        post.comments.push({ user: req.user.id, content: content.trim() });
        await post.save();
        await post.populate('comments.user', 'fullName avatar');

        const newComment = post.comments[post.comments.length - 1];

        if (String(post.author) !== String(req.user.id)) {
            const io = req.app.get('io');
            await Notification.create({
                recipient: post.author,
                sender:    req.user.id,
                type:      'activity_join',
                title:     'New comment on your post',
                message:   `${req.user.fullName} commented: "${content.trim().slice(0, 50)}"`,
            });
            if (io) io.to(String(post.author)).emit('newNotification', { type: 'comment' });
        }

        res.status(201).json({
            success: true,
            data: {
                id:          newComment._id,
                authorId:    newComment.user._id,
                authorName:  newComment.user.fullName,
                authorAvatar: newComment.user.avatar,
                content:     newComment.content,
                createdAt:   newComment.createdAt,
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error adding comment' });
    }
};

// DELETE /api/posts/:id
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post || post.isDeleted) return res.status(404).json({ success: false, message: 'Post not found' });
        if (String(post.author) !== String(req.user.id)) return res.status(403).json({ success: false, message: 'Not authorized' });

        post.isDeleted = true;
        await post.save();
        res.json({ success: true, message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting post' });
    }
};

module.exports = { getPosts, createPost, likePost, addComment, deletePost };
