import mongoose, { Schema } from "mongoose";

const ExampleSchema = new Schema({
     input: String,
     output: String,
     explanation: String
});

const StarterCodeSchema = new Schema({
  javascript: String,
  python: String,
  java: String
});

const ExpectedOutputSchema = new Schema({
  javascript: String,
  python: String,
  java: String
});

const ProblemSchema = new Schema({
  //id: { type: String, required: true, unique: true },
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    text: String,
    notes: [String]
  },

  examples: [ExampleSchema],

  constraints: [String],

  starterCode: StarterCodeSchema,

  expectedOutput: ExpectedOutputSchema,
  testCases: [
      {
        input: String,
        expectedOutput: String,
        isHidden: {
          type: Boolean,
          default: false,
        },
      },
    ],
    acceptanceRate: {
      type: Number,
      default: 0,
    },
    totalSubmissions: {
      type: Number,
      default: 0,
    },
    totalAccepted: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
},{
     timestamps: true,
});

const Problem = mongoose.model("Problem", ProblemSchema);

export default Problem;