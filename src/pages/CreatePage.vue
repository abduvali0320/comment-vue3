<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Create Comment</div>
    <q-card class="q-pa-md" style="max-width: 600px">
      <CommentForm :loading="loading" @submit="onSubmit" />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useCommentsStore } from '../stores/comments'
import CommentForm from '../components/CommentForm.vue'
import type { CommentFormData } from '../types/comment'

const router = useRouter()
const $q = useQuasar()
const store = useCommentsStore()
const loading = ref(false)

const onSubmit = (data: CommentFormData) => {
  loading.value = true
  store.create(data)
  $q.notify({ type: 'positive', message: 'Comment created' })
  router.push('/')
}
</script>
