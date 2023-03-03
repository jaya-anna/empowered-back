const router = require('express').Router();
const Comment = require('../models/Comment.model');
const Post = require('../models/Post.model');
const isAuthenticated = require('../middlewares/isAuthenticated');

// POST ----- FOR POSTS
router.post('/createpost', isAuthenticated, async(req,res) => {
    try {
        console.log(req.body);
        console.log(req.payload);
        const title = req.body.title;
        const content = req.body.content;
        const author = req.payload.user;

        await Post.create({ title: title, content: content, author: author });
        res.status(201).json({message: "Post created successfully"});
    } catch (error) {
        console.log("Error creating a post: ", error);
        res.status(400).json({errorMessage: "Error creating a post"});
    }
})

// GET ALL POSTS
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().populate('author');
        res.status(200).json(posts);
    } catch (error) {
        console.log("Error fetching posts: ", error);
        res.status(500).json({errorMessage: "Error fetching posts"});
    }
});

// GET POST BY ID
router.get('/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
    
        const post = await Post.findById(postId).populate('author');
        if (!post) {
            return res.status(404).json({ errorMessage: "Post not found" });
        }
    
        res.status(200).json(post);
    } catch (error) {
        console.log("Error fetching post: ", error);
        res.status(500).json({errorMessage: "Error fetching post"});
    }
});

// DELETE ----- POST
router.delete('/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ errorMessage: "Post not found" });
        }

        await Post.deleteOne({ _id: postId });
        await Comment.deleteMany({ postId: postId });
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log("Error deleting post: ", error);
        res.status(500).json({ errorMessage: "Error deleting post" });
    }
});

// GET COMMENT BY POST ID
router.get('/posts/:postId/comments', async (req, res) => {
    try {
        const postId = req.params.postId;
    
        const comments = await Comment.find({ postId: postId }).populate('author');
        res.status(200).json(comments);
    } catch (error) {
        console.log("Error fetching comments: ", error);
        res.status(500).json({errorMessage: "Error fetching comments"});
    }
});

// POST ------ FOR COMMENTS
router.post('/posts/:postId/createcomment', isAuthenticated, async(req,res) => {
    try {
        const content = req.body.content;
        const author = req.payload.user;
        const postIdComment = req.params.postId;

        await Comment.create({ postId: postIdComment, content: content, author: author });
        res.status(201).json({message: "Comment created successfully"});
    } catch (error) {
        console.log("Error creating a Comment: ", error);
        res.status(400).json({errorMessage: "Error creating a Comment"});
    }
})

// DELETE COMMENTS
router.delete('/posts/:postId/comments/:commentId', isAuthenticated, async(req, res) => {
    try {
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ errorMessage: "Comment not found" });
        }

        await Comment.deleteOne({ _id: commentId });
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.log("Error deleting comment: ", error);
        res.status(500).json({ errorMessage: "Error deleting comment" });
    }
});


module.exports = router;