const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {

  content: { 
    type: String, 
    required: true 
},

  author: { 
    type: String, 
    required: true 
},

    postId: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Post' 
    },
    
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
