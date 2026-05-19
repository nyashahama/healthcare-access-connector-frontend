import apiClient from "../apiClient";

const forumService = {
  getPosts: async (params = {}) => {
    const response = await apiClient.get("/api/v1/forum/posts", { params });
    return response.data;
  },

  getPost: async (postId) => {
    const response = await apiClient.get(`/api/v1/forum/posts/${postId}`);
    return response.data;
  },

  createPost: async (data) => {
    const response = await apiClient.post("/api/v1/forum/posts", data);
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await apiClient.delete(`/api/v1/forum/posts/${postId}`);
    return response.data;
  },

  getComments: async (postId) => {
    const response = await apiClient.get(`/api/v1/forum/posts/${postId}/comments`);
    return response.data;
  },

  createComment: async (postId, content) => {
    const response = await apiClient.post(`/api/v1/forum/posts/${postId}/comments`, { content });
    return response.data;
  },
};

export default forumService;
