/**
 * CampusLoop Backend - Activity Routes
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getActivities,
    getActivity,
    createActivity,
    joinActivity,
    leaveActivity,
    updateActivity,
    deleteActivity,
    getMyActivities
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Validation rules
const createActivityValidation = [
    body('type').isIn(['study_group', 'assignment_help', 'sports', 'movies', 'trip', 'food', 'event', 'project', 'other'])
        .withMessage('Invalid activity type'),
    body('title').trim().notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description').trim().notEmpty().withMessage('Description is required')
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('maxParticipants').isInt({ min: 2, max: 50 }).withMessage('Max participants must be between 2 and 50')
];

// Routes
router.get('/my', getMyActivities);
router.get('/', getActivities);
router.get('/:id', getActivity);
router.post('/', createActivityValidation, createActivity);
router.post('/:id/join', joinActivity);
router.post('/:id/leave', leaveActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

module.exports = router;
