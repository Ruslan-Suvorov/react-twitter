const express = require("express");
const router = express.Router();
const { Post } = require("../class/post");

router.post("/post-create", (req, res) => {
  try {
    const { username, text, postId } = req.body;

    if (!username || !text) {
      return res.status(400).json({
        messsage: "Need all data to create a post!",
      });
    }

    let post = null;

    if (postId) {
      post = Post.getById(Number(postId));

      if (!post) {
        return res.status(400).json({
          messsage: "Post is undefined!",
        });
      }
    }

    const newPost = Post.create(username, text, post);

    return res.status(200).json({
      post: {
        id: newPost.id,
        text: newPost.text,
        username: newPost.username,
        date: newPost.date,
      },
    });
  } catch (err) {
    return res.status(400).json({
      messsage: err.messsage,
    });
  }
});

router.get("/post-list", (req, res) => {
  try {
    const list = Post.getList();

    if (list.length === 0) {
      return res.status(200).json({ list: [] });
    }

    return res.status(200).json({
      list: list.map(({ id, username, text, date }) => ({
        id,
        username,
        text,
        date,
      })),
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

router.get("/post-item", (req, res) => {
  const { id } = req.query;

  try {
    if (!id) {
      return res.status(400).json({ message: "ID is undefined." });
    }
    const post = Post.getById(Number(id));

    if (!post) {
      return res.status(400).json({ message: "Post is undefined." });
    }

    return res.status(200).json({
      post: {
        id: post.id,
        username: post.username,
        text: post.text,
        date: post.date,
        reply: post.reply.map(({ id, username, text, date }) => ({
          id,
          username,
          text,
          date,
        })),
      },
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = router;
