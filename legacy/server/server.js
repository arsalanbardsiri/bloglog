require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const typeDefs = require("./schemas/typeDefs");
const resolvers = require("./schemas/resolvers");
const commentRoutes = require("./routes/commentRoutes");
const postRoutes = require("./routes/postRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const userRoutes = require("./routes/userRoutes");
// const jwt = require('jsonwebtoken');
const { authMiddleware } = require("./utils/auth");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const dbConfig = require("./config/dbConfig");
mongoose
  .connect(dbConfig.db)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: async ({ req }) => {
    const { user } = await authMiddleware(req);
    return { user };
  },
});

// Start Apollo Server
(async () => {
  await server.start();
  server.applyMiddleware({ app });

  // Serve static files in production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
    });
  }

  // Define routes
  app.use("/api/comments", commentRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/stripe", stripeRoutes);
  app.use("/api/users", userRoutes);

  // Middleware for raw bodies for Stripe webhook
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    stripeRoutes
  );

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(
      `Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
})();
