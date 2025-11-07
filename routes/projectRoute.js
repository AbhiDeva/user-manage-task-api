import express from "express";
import {
    createProject,
    updateProject,
    getProject
} from '../controllers/projectController.js';
import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protectRoute, isAdminRoute, createTask);
router.get("/", protectRoute, getTasks);
router.get("/:id", protectRoute, getTask);

export default router;