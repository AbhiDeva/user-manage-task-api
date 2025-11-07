import { Schema } from "mongoose";

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
        type: Object,
        default: undefined
    }
}, {_id: false});

export default nodeSchema;