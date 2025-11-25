import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { CREATE_POST, UPDATE_POST, DELETE_POST } from '../utils/mutations';
import auth from '../utils/auth';

const BlogPost = ({ post, showCreateForm, refetchPosts }) => {
  const [createPost] = useMutation(CREATE_POST);
  const [updatePost] = useMutation(UPDATE_POST);
  const [deletePost] = useMutation(DELETE_POST);
  const [editMode, setEditMode] = useState(false);
  const [postContent, setPostContent] = useState({ title: post?.title || '', content: post?.content || '' });

  const userId = auth.getProfile()?.userId;
  const isAuthor = post && userId === post.author.id;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (editMode) {
      if (isAuthor) {
        try {
          await updatePost({ variables: { postId: post.id, title: postContent.title, content: postContent.content } });
          setEditMode(false);
          refetchPosts?.();
        } catch (error) {
          console.error("Error updating post:", error);
        }
      }
    } else if (showCreateForm) {
      try {
        await createPost({ variables: { title: postContent.title, content: postContent.content, authorId: userId } });
        setPostContent({ title: '', content: '' }); // Reset form fields
        refetchPosts?.();
      } catch (error) {
        console.error("Error creating post:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (isAuthor && window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost({ variables: { postId: post.id } });
        refetchPosts?.();
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPostContent({ ...postContent, [name]: value });
  };

  const renderEditForm = () => (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="postTitle">
        <Form.Control
          type="text"
          name="title"
          value={postContent.title}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
      <Form.Group controlId="postContent">
        <Form.Control
          as="textarea"
          name="content"
          value={postContent.content}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
      <Button variant="secondary" type="submit">
        {editMode ? 'Update Post' : 'Create Post'}
      </Button>
    </Form>
  );

  const renderPostContent = () => (
    <>
      <Card.Title>{post.title}</Card.Title>
      <Card.Text>{post.content}</Card.Text>
      <Card.Subtitle className="mb-2 text-muted">
        Author: {post.author.username}
      </Card.Subtitle>
      {isAuthor && (
        <div>
          <Button variant="secondary" onClick={() => setEditMode(true)}>
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}
    </>
  );

  return (
    <Card className="mb-3">
      <Card.Body>
        {editMode || showCreateForm ? renderEditForm() : renderPostContent()}
      </Card.Body>
    </Card>
  );
};

export default BlogPost;
