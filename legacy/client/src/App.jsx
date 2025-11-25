import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Profile from "./pages/Profile";
import About from "./pages/About";
import RegisterForm from "./components/RegisterForm"; 
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import { Container } from 'react-bootstrap'; 
import "./App.css";



function App() {
  return (
    <ErrorBoundary>
      <div className="body-wrapper">
        <Container>
          <Navbar />
        </Container>
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
        <Container>
          <Footer />
        </Container>
      </div>
    </ErrorBoundary>
  );
}

export default App;
