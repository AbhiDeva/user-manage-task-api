import mongoose, { Schema } from "mongoose";
import nodeTextSchema from "./nodeTextModel.js";

const projectSchema = new Schema({
    name: {
        type: String,
        default: 'Untitled Project'
    },
    structure:{
        type: nodeTextSchema,
        required : true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


const Project = mongoose.model("Project", projectSchema);

export default Project;
