import Problem from "../models/problemModel.js";
import Submission from "../models/submissionModel.js";
import User from "../models/userModel.js";
import { executeCode } from '../utils/codeExecutor.js';


// @desc    Submit code
// @route   POST /api/submissions
// @access  Private
export const submitCode = async (req, res) => {
  try {
    const { problemId, language, code } = req.body;
    const userId = req.user._id || req.body.userId || req.body.user._id ;

    // Get problem with test cases
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    // Execute code against test cases
    let testCasesPassed = 0;
    let status = 'Accepted';
    let output = '';
    let error = '';
    let runtime = 0;

    const startTime = Date.now();

    for (const testCase of problem.testCases) {
      const result = await executeCode(language, code, testCase.input);
      
      if (!result.success) {
        status = result.error.includes('timeout') ? 'Time Limit Exceeded' : 'Runtime Error';
        error = result.error;
        break;
      }

      const normalizedOutput = result.output.trim();
      const normalizedExpected = testCase.expectedOutput.trim();

      if (normalizedOutput === normalizedExpected) {
        testCasesPassed++;
      } else {
        status = 'Wrong Answer';
        output = result.output;
        break;
      }
    }

    const endTime = Date.now();
    runtime = endTime - startTime;

    // Create submission
    const submission = await Submission.create({
      userId,
      problemId,
      language,
      code,
      status,
      runtime,
      testCasesPassed,
      totalTestCases: problem.testCases.length,
      output,
      error,
    });

    // Update problem stats
    problem.totalSubmissions += 1;
    if (status === 'Accepted') {
      problem.totalAccepted += 1;
      
      // Add to user's solved problems
      const user = await User.findById(userId);
      if (!user.solvedProblems.some(p => p.problemId.equals(problemId))) {
        user.solvedProblems.push({ problemId });
        await user.save();
      }
    }
    problem.acceptanceRate = (problem.totalAccepted / problem.totalSubmissions) * 100;
    await problem.save();

    res.status(201).json({success: true, data: submission});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user submissions
// @route   GET /api/submissions/user/:userId
// @access  Private
export const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.params.userId })
      .populate('problemId', 'title difficulty')
      .sort('-createdAt')
      .limit(50);

    res.status(200).json({data: submissions});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get submission by ID
// @route   GET /api/submissions/:id
// @access  Private
export const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('problemId', 'title difficulty')
      .populate('userId', 'name email');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.status(200).json({ data: submission});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};