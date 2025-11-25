// client/src/utils/mutations.js
import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      user {
        id
        username
        email
      }
      token
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $authorId: ID!) {
    createPost(title: $title, content: $content, authorId: $authorId) {
      id
      title
      content
      author {
        id
        username
      }
    }
  }
`;
export const UPDATE_POST = gql`
  mutation UpdatePost($postId: ID!, $title: String!, $content: String!) {
    updatePost(postId: $postId, title: $title, content: $content) {
      id
      title
      content
      author {
        id
        username
      }
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($content: String!, $postId: ID!, $authorId: ID!) {
    createComment(content: $content, postId: $postId, authorId: $authorId) {
      id
      content
      author {
        id
        username
      }
      post {
        id
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
    }
  }
`;
