<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      v-model="form.name"
      label="Name"
      outlined
      :rules="[
        val => !!val || 'Name is required',
        val => val.length >= 3 || 'Minimum 3 characters'
      ]"
    />

    <q-input
      v-model="form.email"
      label="Email"
      type="email"
      outlined
      :rules="[
        val => !!val || 'Email is required',
        val => /.+@.+\..+/.test(val) || 'Invalid email format'
      ]"
    />

    <q-input
      v-model="form.body"
      label="Body"
      type="textarea"
      outlined
      autogrow
      :rules="[
        val => !!val || 'Body is required',
        val => val.length >= 10 || 'Minimum 10 characters'
      ]"
    />

    <div class="row q-gutter-sm">
      <q-btn type="submit" color="primary" :loading="loading" label="Save" />
      <q-btn flat color="grey" label="Cancel" @click="$router.back()" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { CommentFormData } from '../types/comment'

interface Props {
  initialData?: Partial<CommentFormData>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  submit: [data: CommentFormData]
}>()

const form = reactive<CommentFormData>({
  name: props.initialData?.name || '',
  email: props.initialData?.email || '',
  body: props.initialData?.body || '',
  postId: props.initialData?.postId || 1
})

const onSubmit = () => {
  emit('submit', { ...form })
}
</script>
