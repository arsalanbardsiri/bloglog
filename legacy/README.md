
# Bloglog: Simple Blogging Platform

## Description
Bloglog is a web application that allows users to create, view, and interact with blog posts. Built using the MERN stack (MongoDB, Express.js, React, Node.js), it features GraphQL for data handling, JWT for secure authentication, and Stripe for optional donation functionality.

```
Bloglog/
│
├── .gitignore
│
├── README.md
│   └── (Project description and setup instructions)
│
├── client/
│   ├── package.json
│   ├── public/
│   │   └── vite.svg
│   └── src/
│       ├── App.jsx
│       ├── assets
│       │   ├── react.svg
│       ├── components/
│       │   ├── BlogPost.jsx
│       │   ├── CommentSection.jsx
│       │   ├── DonationButton.jsx
│       │   ├── Footer.jsx
│       │   ├── LoginForm.jsx
│       │   ├── Navbar.jsx
│       │   └── RegisterForm.jsx
│       ├── main.jsx
│       ├── pages/
│       │   ├── About.jsx
│       │   ├── Blog.jsx
│       │   ├── Home.jsx
│       │   └── Profile.jsx
│       └── utils/
│           ├── api.js
│           ├── apolloClient.js
│           ├── mutations.js
│           ├── queries.js
│           └── auth.js
│
└── server/
    ├── config/
    │   ├── authConfig.js
    │   └── dbConfig.js
    ├── controllers/
    │   ├── commentController.js
    │   ├── postController.js
    │   ├── stripeController.js
    │   └── userController.js
    ├── models/
    │   ├── Comment.js
    │   ├── Post.js
    │   └── User.js
    ├── package.json
    ├── routes/
    │   ├── commentRoutes.js
    │   ├── postRoutes.js
    │   ├── stripeRoutes.js
    │   └── userRoutes.js
    ├── schemas/
    │   ├── resolvers.js
    │   └── typeDefs.js
    ├── server.js
    └── utils/
        ├── auth.js
        └── jwtAuth.js
```

## Enhanced Features
- **User Authentication**: Secure login and registration with JWT.
- **CRUD Operations**: Users can manage blog posts (create, read, update, delete).
- **Comments**: Interactive comment system for each post.
- **Responsive Design**: Mobile-friendly and responsive user interface.
- **Stripe Integration**: Option for users to make donations to bloggers.
- **GraphQL API**: Efficient data fetching and mutations with GraphQL.

## Technologies Used
- React for front-end
- Node.js and Express.js for back-end
- MongoDB with Mongoose for database
- GraphQL for API
- JWT for Authentication
- Stripe for donation processing
- Heroku for deployment

## Installation and Setup
1. Clone the repository.
2. Install dependencies in both `client` and `server` directories.
3. Set up required environment variables.
4. Run `npm start` in both directories to start the application.

## Running the Application
- The application will run on `localhost:3000` (client) and `localhost:4000` (server).

## Contributing
Contributions are welcome. Please fork the repository and create a pull request for review.

## License
This project is licensed under the MIT License.

<!-- ## Screenshots
*Include screenshots of the application.* -->
