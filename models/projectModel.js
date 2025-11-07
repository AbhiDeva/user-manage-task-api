import mongoose, { Schema } from "mongoose";
import Node from "./models/nodeModel.js"

const projectSchema = new Schema({
    name: {
        type: String,
        default: 'Untitled Project'
    },
    structure:{
        type: Node,
        required : true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


const Project = mongoose.model("Project", projectSchema);

export default Project;
