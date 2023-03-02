const { Schema, model } = require("mongoose");

const postSchema = new Schema(
    {

    title: { 
        type: String, 
        required: true 
    },

    content: { 
        type: String, 
        required: true 
    },

    author: { 
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    },

    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`    
        timestamps: true
    }
);

const Post = model("Post", postSchema);

module.exports = Post;
