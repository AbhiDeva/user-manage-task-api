import mongoose, { Schema } from "mongoose";
import nodeSchema from "../nodeModel.js";

const projectSchema = new Schema({
    name: {
        type: String,
        default: 'Untitled Project'
    },
    structure:{
        type: nodeSchema,
        required : true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


const Project = mongoose.model("Project", projectSchema);

export default Project;
