<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Edit Comment</div>
    <q-card v-if="comment" class="q-pa-md" style="max-width: 600px">
      <CommentForm :initial-data="comment" :loading="loading" @submit="onSubmit" />
    </q-card>
    <div v-else class="text-negative">Comment not found</div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useCommentsStore } from '../stores/comments'
import CommentForm from '../components/CommentForm.vue'
import type { CommentFormData } from '../types/comment'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const store = useCommentsStore()
const loading = ref(false)

const commentId = computed(() => Number(route.params.id))
const comment = computed(() => store.getById(commentId.value))

const onSubmit = (data: CommentFormData) => {
  loading.value = true
  store.update(commentId.value, data)
  $q.notify({ type: 'positive', message: 'Comment updated' })
  router.push('/')
}

onMounted(() => store.initialize())
</script>
