import apiClient from '@/api/apiClient'
import type { ApiResponse } from '@/types/api'

export interface ForumPost {
  id: string
  title: string
  content: string
  author_id: string
  author_name?: string
  created_at: string
  updated_at: string
  comment_count?: number
}

export interface ForumComment {
  id: string
  post_id: string
  content: string
  author_id: string
  author_name?: string
  created_at: string
}

export const forumService = {
  getPosts: async (params: Record<string, unknown> = {}): Promise<ApiResponse<ForumPost[]>> => {
    const response = await apiClient.get<ApiResponse<ForumPost[]>>('/api/v1/forum/posts', { params })
    return response.data
  },

  getPost: async (postId: string): Promise<ApiResponse<ForumPost>> => {
    const response = await apiClient.get<ApiResponse<ForumPost>>(`/api/v1/forum/posts/${postId}`)
    return response.data
  },

  createPost: async (data: Record<string, unknown>): Promise<ApiResponse<ForumPost>> => {
    const response = await apiClient.post<ApiResponse<ForumPost>>('/api/v1/forum/posts', data)
    return response.data
  },

  deletePost: async (postId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/v1/forum/posts/${postId}`)
    return response.data
  },

  getComments: async (postId: string): Promise<ApiResponse<ForumComment[]>> => {
    const response = await apiClient.get<ApiResponse<ForumComment[]>>(`/api/v1/forum/posts/${postId}/comments`)
    return response.data
  },

  createComment: async (postId: string, content: string): Promise<ApiResponse<ForumComment>> => {
    const response = await apiClient.post<ApiResponse<ForumComment>>(`/api/v1/forum/posts/${postId}/comments`, { content })
    return response.data
  },
}
