import mongoose, { Schema } from "mongoose";

const nodeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["file", "folder"],
        required: true
    },
    path: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: ""
    },
    children: {
        type: [this],
        default: undefined
    }
}, {_id: false});

const Node = mongoose.model("Node", nodeSchema);

export default Node;