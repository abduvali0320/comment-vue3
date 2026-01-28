import axios from 'axios'
import type { Comment } from '../types/comment'

const API_URL = 'https://jsonplaceholder.typicode.com'

export const commentsApi = {
  async fetchAll(): Promise<Comment[]> {
    const response = await axios.get<Comment[]>(`${API_URL}/comments`)
    return response.data
  }
}
