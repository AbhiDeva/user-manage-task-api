import express from 'express';
import {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
} from '../controllers/problemController.js';
import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route('/')
  .get(getProblems)
  .post(protectRoute, isAdminRoute, createProblem);

router.route('/:id')
  .get(getProblemById)
  .put(protectRoute, isAdminRoute, updateProblem)
  .delete(protectRoute, isAdminRoute, deleteProblem);

export default router;