import type { Comment } from '../types/comment'

const STORAGE_KEY = 'comments_data'
const INITIALIZED_KEY = 'comments_initialized'

export const localStorageService = {
  getComments(): Comment[] {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  setComments(comments: Comment[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments))
  },

  isInitialized(): boolean {
    return localStorage.getItem(INITIALIZED_KEY) === 'true'
  },

  setInitialized(): void {
    localStorage.setItem(INITIALIZED_KEY, 'true')
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(INITIALIZED_KEY)
  }
}
