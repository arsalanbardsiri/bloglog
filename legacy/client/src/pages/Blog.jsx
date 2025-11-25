// Blog.jsx

import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import BlogPost from '../components/BlogPost';
import { GET_POSTS } from '../utils/queries';
import { useQuery } from '@apollo/client';

const Blog = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { loading, error, data, refetch } = useQuery(GET_POSTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts.</p>;

  return (
    <Container className="mt-4">
      <Row className="justify-content-md-center mb-3">
        <Col md={8}>
          <Button variant="secondary" className="w-100" onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : 'Create New Post'}
          </Button>
        </Col>
      </Row>
      {showCreateForm && <Row><Col><BlogPost showCreateForm={true} refetchPosts={refetch} /></Col></Row>}
      <Row xs={1} md={2} lg={3} className="g-4"> {/* Responsive grid layout */}
        {data.posts.map(post => (
          <Col key={post.id}>
            <BlogPost key={post.id} post={post} refetchPosts={refetch} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Blog;
