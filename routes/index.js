import express from "express";
import userRoutes from "./userRoute.js";
import taskRoutes from "./taskRoute.js";
import projectRoutes from "./projectRoute.js";
import problemRoutes from "./problemRoute.js";
import submissionRoutes from "./submissionRoute.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/task", taskRoutes);
router.use("/project", projectRoutes);
router.use('/problems', problemRoutes);
router.use('/submissions', submissionRoutes);

export default router;
