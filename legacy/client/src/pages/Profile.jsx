import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import { GET_USER } from "../utils/queries";
import { GET_POSTS } from "../utils/queries";
import { useQuery } from "@apollo/client";
import auth from "../utils/auth";
import BlogPost from '../components/BlogPost';

const Profile = () => {
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(GET_POSTS);
  useEffect(() => {
    if (!auth.isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  const decoded = auth.getProfile();
  const userId = decoded ? decoded.userId : null;

  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER, { variables: { id: userId } });

  if (userLoading) return <p>Loading...</p>;
  if (userError) return <p>Error loading profile...</p>;

  // Extract user's posts from userData
  const userPosts = userData && userData.user && userData.user.posts ? userData.user.posts : [];

  return (
    <Container>
      <Row className="my-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>{userData.user.username}</Card.Title>
              <Card.Text>Email: {userData.user.email}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <h2>My Blog Posts</h2>
          {auth.isLoggedIn() && (
            <>
              <Button variant="secondary" onClick={() => setShowCreateForm(!showCreateForm)}>
                {showCreateForm ? "Cancel" : "Create New Post"}
              </Button>
              {showCreateForm && (
                <BlogPost showCreateForm={true} refetchPosts={() => {}} /> 
              )}
            </>
          )}
          <ListGroup>
            {userPosts.map((post) => (
              <ListGroup.Item key={post.id} post={post} refetchPosts={refetch}>
                {post.title}
                {/* Add links to the full post, edit, or delete functionality */}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
