import React from 'react';
import { ListGroup } from 'react-bootstrap';

const CommentSection = ({ comments }) => {
  return (
    <ListGroup>
      {comments.map(comment => (
        <ListGroup.Item key={comment.id}>{comment.content}</ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default CommentSection;
