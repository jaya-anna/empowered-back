const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
    {

    content: { 
        type: String, 
        required: true 
    },

    author: { 
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    },

    postId: { 
        type: Schema.Types.ObjectId, ref: 'Post',
        required: true
    },

    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`    
        timestamps: true
    }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
