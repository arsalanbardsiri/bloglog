const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    posts: [Post]
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    comments: [Comment]
  }

  type Comment {
    id: ID!
    content: String!
    author: User!
    post: Post!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    posts: [Post]
    post(id: ID!): Post
  }

  type AuthPayload {
    token: String!
    user: User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): AuthPayload
    createPost(title: String!, content: String!, authorId: ID!): Post
    createComment(content: String!, postId: ID!, authorId: ID!): Comment
    loginUser(email: String!, password: String!): AuthPayload
    updatePost(postId: ID!, title: String!, content: String!): Post
    deletePost(postId: ID!): Boolean
  }
`;

module.exports = typeDefs;
