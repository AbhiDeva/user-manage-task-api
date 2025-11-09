import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ['javascript', 'python', 'java', 'cpp', 'typescript'],
    },
    code: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error'],
      required: true,
    },
    runtime: {
      type: Number, // in milliseconds
    },
    memory: {
      type: Number, // in KB
    },
    testCasesPassed: {
      type: Number,
      default: 0,
    },
    totalTestCases: {
      type: Number,
      default: 0,
    },
    output: {
      type: String,
    },
    error: {
      type: String,
    },
  },
  {
    timestamps: true,
  });

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
 
