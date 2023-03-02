const { Schema, model } = require("mongoose");

const favoriteSchema = new Schema(
  {

    user: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User' 
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

const Favorite = model("Favorite", favoriteSchema);

module.exports = Favorite;
