// client/src/utils/api.js
import axios from 'axios';

export const getPosts = async () => {
  try {
    const response = await axios.get('/api/posts');
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Add other API functions as needed
