import express from 'express';
import {
  submitCode,
  getUserSubmissions,
  getSubmissionById,
} from '../controllers/submissionController.js';
import {  protectRoute } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post('/', protectRoute, submitCode);
router.get('/user/:userId', protectRoute, getUserSubmissions);
router.get('/:id', protectRoute, getSubmissionById);

export default router;