const router = require('express').Router();
const Comment = require('../models/Comment.model');
const Post = require('../models/Post.model');
const isAuthenticated = require('../middlewares/isAuthenticated');

router.post('/createpost', isAuthenticated, async(req,res) => {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const author = req.user._id;

        await Post.create({ title: title, content: content, author: author });
        res.status(201).json({message: "Post created successfully"});
    } catch (error) {
        console.log("Error creating a post: ", error);
        res.status(400).json({errorMessage: "Error creating a post"});
      }
})

router.post('/createcomment', isAuthenticated, async(req,res) => {
    try {
        const content = req.body.content;
        const author = req.session.user._id;
        const postIdComment = req.params.postId;

        await Comment.create({ postId: postIdComment, content: content, author: author });
        res.status(201).json({message: "Comment created successfully"});
    } catch (error) {
        console.log("Error creating a Comment: ", error);
        res.status(400).json({errorMessage: "Error creating a Comment"});
      }
})

router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().populate('author');
        res.status(200).json(posts);
    } catch (error) {
        console.log("Error fetching posts: ", error);
        res.status(500).json({errorMessage: "Error fetching posts"});
    }
});

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


module.exports = router;