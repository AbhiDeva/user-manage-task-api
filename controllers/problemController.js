import asyncHandler from "express-async-handler";
import Problem from "../models/problemModel.js";

export const getProblems = asyncHandler(async (req, res) => {
     try {
    const {difficulty, category, search } = req.query;
    let query = {};
    
    if(difficulty) query.difficulty = difficulty;
    if(category) query.category = { $regex: category, $options: 'i'};
    if(search) {
        query.$or = [
            {
                title: { $regex: search, $options: 'i'}
            },
            {
                'description.text': {
                    $regex: search,
                    $options: 'i'
                }
            }
        ]
    }

    const problems = await Problem.find(query).select('-testCases');
    res.status(200).json({ success: true, data: problems });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// @desc    Get problem by ID
// @route   GET /api/problems/:id
// @access  Public
export const getProblemById = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id).select('-testCases');
        if (!problem) {
            return res.status(404).json({ status: false, message: 'Problem not found' });
        }
        res.status(200).json({ status: true, data: problem });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

// @desc    Create problem
// @route   POST /api/problems
// @access  Private/Admin
export const createProblem = async (req, res) => {
  try {
    const title = req.body.title;
    const slug = req.body.slug;
    const difficulty = req.body.difficulty;
    const category = req.body.category;

    // Basic validation
    if (!title || !title.trim()) {
      return res.status(400).json({ status:false, message: "Title is required" });
    }

    if (!slug || !slug.trim()) {
      return res.status(400).json({ status:false, message: "Slug is required" });
    }

    if (!difficulty || !difficulty.trim()) {
      return res.status(400).json({ status:false, message: "Difficulty is required" });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({ status:false, message: "Category is required" });
    }

    // Optional: Validate difficulty options
    const validDifficulties = ["Easy", "Medium", "Hard"];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        message: `Difficulty must be one of: ${validDifficulties.join(", ")}`,
        status:false
      });
    }

    // Optional: Ensure slug is unique
    const existing = await Problem.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Slug must be unique", status:false });
    }

    // Create
    const problem = await Problem.create(req.body);
    res.status(200).json({  status:true, data:problem });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


// @desc    Update problem
// @route   PUT /api/problems/:id
// @access  Private/Admin
export const updateProblem = async (req, res) => {
  try {

    const title = req.body.title;
    const slug = req.body.slug;
    const difficulty = req.body.difficulty;
    const category = req.body.category;

    // Basic validation
    if (!title || !title.trim()) {
      return res.status(400).json({ success:false, message: "Title is required" });
    }

    if (!slug || !slug.trim()) {
      return res.status(400).json({ success:false, message: "Slug is required" });
    }

    if (!difficulty || !difficulty.trim()) {
      return res.status(400).json({ success:false, message: "Difficulty is required" });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({ success:false, message: "Category is required" });
    }

    // Optional: Validate difficulty options
    const validDifficulties = ["Easy", "Medium", "Hard"];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        message: `Difficulty must be one of: ${validDifficulties.join(", ")}`,
        success:false
      });
    }

    // Optional: Ensure slug is unique
    const existing = await Problem.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Slug must be unique", success:false });
    }

    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    res.status(200).json({ success: true, data: problem});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Delete problem
// @route   DELETE /api/problems/:id
// @access  Private/Admin
export const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    res.status(200).json({ success: true, message: 'Problem removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

