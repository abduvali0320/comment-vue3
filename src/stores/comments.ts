import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Comment, CommentFormData, PaginatedResult } from '../types/comment'
import { localStorageService } from '../services/localStorage'
import { commentsApi } from '../api/comments'

export const useCommentsStore = defineStore('comments', () => {
  const comments = ref<Comment[]>([])
  const loading = ref(false)

  const getFilteredComments = (search: string): Comment[] => {
    if (!search.trim()) return comments.value
    const query = search.toLowerCase()
    return comments.value.filter(
      c => c.name.toLowerCase().includes(query) ||
           c.email.toLowerCase().includes(query) ||
           c.body.toLowerCase().includes(query)
    )
  }

  const getPaginated = (page: number, perPage: number, search: string): PaginatedResult<Comment> => {
    const filtered = getFilteredComments(search)
    const total = filtered.length
    const totalPages = Math.ceil(total / perPage)
    const start = (page - 1) * perPage
    const data = filtered.slice(start, start + perPage)
    return { data, total, page, perPage, totalPages }
  }

  const initialize = async (): Promise<void> => {
    if (localStorageService.isInitialized()) {
      comments.value = localStorageService.getComments()
      return
    }
    loading.value = true
    try {
      const data = await commentsApi.fetchAll()
      comments.value = data
      localStorageService.setComments(data)
      localStorageService.setInitialized()
    } finally {
      loading.value = false
    }
  }

  const getById = (id: number): Comment | undefined => {
    return comments.value.find(c => c.id === id)
  }

  const create = (data: CommentFormData): Comment => {
    const maxId = comments.value.length > 0 ? Math.max(...comments.value.map(c => c.id)) : 0
    const newComment: Comment = { ...data, id: maxId + 1 }
    comments.value.unshift(newComment)
    localStorageService.setComments(comments.value)
    return newComment
  }

  const update = (id: number, data: CommentFormData): Comment | null => {
    const index = comments.value.findIndex(c => c.id === id)
    if (index === -1) return null
    const updated: Comment = { ...comments.value[index], ...data }
    comments.value[index] = updated
    localStorageService.setComments(comments.value)
    return updated
  }

  const remove = (id: number): boolean => {
    const index = comments.value.findIndex(c => c.id === id)
    if (index === -1) return false
    comments.value.splice(index, 1)
    localStorageService.setComments(comments.value)
    return true
  }

  return {
    comments,
    loading,
    getPaginated,
    initialize,
    getById,
    create,
    update,
    remove
  }
})
