import Problem from "../models/problemModel.js";
import Submission from "../models/submissionModel.js";
import User from "../models/userModel.js";
import { executeCode } from '../utils/codeExecutor.js';


// @desc    Submit code
// @route   POST /api/submissions
// @access  Private
// export const submitCode = async (req, res) => {
//   try {
//     const { problemId, language, code } = req.body;
//     const userId = req.user._id || req.body.userId || req.body.user._id ;

//     // Get problem with test cases
//     const problem = await Problem.findById(problemId);
//     if (!problem) {
//       return res.status(404).json({ success: false, message: 'Problem not found' });
//     }

//     // Execute code against test cases
//     let testCasesPassed = 0;
//     let status = 'Accepted';
//     let output = '';
//     let error = '';
//     let runtime = 0;

//     const startTime = Date.now();

//     const normalize = (str) => {
//   return str
//     .trim()
//     .replace(/\s+/g, "")
//     .replace(/\s*,\s*/g, ",")
//     .replace(/\[\s*/g, "[")
//     .replace(/\s*\]/g, "]");
// };

//     for (const testCase of problem.testCases) {
//       const result = await executeCode(language, code, testCase.input);
      
//       if (!result.success) {
//         status = result.error.includes('timeout') ? 'Time Limit Exceeded' : 'Runtime Error';
//         error = result.error;
//         break;
//       }

//      // const normalizedOutput = result.output.trim();
//      // const normalizedExpected = testCase.expectedOutput.trim();

//        const normalizedOutput = normalize(result.output);
//   const normalizedExpected = normalize(testCase.expectedOutput);

//   console.log("Output:", normalizedOutput);
//   console.log("Expected:", normalizedExpected);

//       console.log(normalizedOutput);
//       console.log(normalizedExpected);

//       if (normalizedOutput === normalizedExpected) {
//         testCasesPassed++;
//       } else {
//         status = 'Wrong Answer';
//         output = result.output;
//         break;
//       }
//     }

//     const endTime = Date.now();
//     runtime = endTime - startTime;

//     // Create submission
//     const submission = await Submission.create({
//       userId,
//       problemId,
//       language,
//       code,
//       status,
//       runtime,
//       testCasesPassed,
//       totalTestCases: problem.testCases.length,
//       output,
//       error,
//     });

//     // Update problem stats
//     problem.totalSubmissions += 1;
//     if (status === 'Accepted') {
//       problem.totalAccepted += 1;
      
//       // Add to user's solved problems
//       const user = await User.findById(userId);
//       if (!user.solvedProblems.some(p => p.problemId.equals(problemId))) {
//         user.solvedProblems.push({ problemId });
//         await user.save();
//       }
//     }
//     problem.acceptanceRate = (problem.totalAccepted / problem.totalSubmissions) * 100;
//     await problem.save();

//     res.status(201).json({success: true, data: submission});
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const submitCode = async (req, res) => {
  try {
    const { problemId, language, code } = req.body;
    const userId = req.user._id || req.body.userId || req.body.user._id;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    const startTime = Date.now();

    // Execute code with ALL test cases at once
    const allInputs = problem.testCases.map(tc => tc.input);
    const result = await executeCode(language, code, allInputs);

    if (!result.success) {
      const submission = await Submission.create({
        userId,
        problemId,
        language,
        code,
        status: result.error.includes('timeout') ? 'Time Limit Exceeded' : 'Runtime Error',
        runtime: Date.now() - startTime,
        testCasesPassed: 0,
        totalTestCases: problem.testCases.length,
        output: '',
        error: result.error,
      });

      return res.status(201).json({ success: true, data: submission });
    }

    // Compare outputs
    const normalize = (str) => {
      if (typeof str !== 'string') str = JSON.stringify(str);
      return str.trim().replace(/\s+/g, "").replace(/\s*,\s*/g, ",");
    };

    let testCasesPassed = 0;
    let status = 'Accepted';
    let failedOutput = '';
    let failedTestCase = null;

    // Ensure result.output is an array
    const outputs = Array.isArray(result.output) ? result.output : [result.output];

    for (let i = 0; i < problem.testCases.length; i++) {
      const actualOutput = normalize(outputs[i]);
      const expectedOutput = normalize(problem.testCases[i].expectedOutput);

      console.log(`Test ${i + 1}: ${actualOutput} === ${expectedOutput}`);

      if (actualOutput === expectedOutput) {
        testCasesPassed++;
      } else {
        status = 'Wrong Answer';
        failedOutput = outputs[i];
        failedTestCase = i + 1;
        break;
      }
    }

    const submission = await Submission.create({
      userId,
      problemId,
      language,
      code,
      status,
      runtime: Date.now() - startTime,
      testCasesPassed,
      totalTestCases: problem.testCases.length,
      output: failedOutput || 'All passed',
      error: '',
      failedTestCase,
    });

    // Update stats
    problem.totalSubmissions += 1;
    if (status === 'Accepted') {
      problem.totalAccepted += 1;
      const user = await User.findById(userId);
      if (user && !user.solvedProblems.some(p => p.problemId.equals(problemId))) {
        user.solvedProblems.push({ problemId });
        await user.save();
      }
    }
    problem.acceptanceRate = ((problem.totalAccepted / problem.totalSubmissions) * 100).toFixed(2);
    await problem.save();

    res.status(201).json({ success: true, data: submission });

  } catch (error) {
    console.error('Submit Error:', error);
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