<template>
  <q-page padding>
    <div class="row items-center q-mb-md q-gutter-sm">
      <div class="text-h5">Comments</div>
      <q-space />
      <q-btn color="negative" icon="refresh" label="Reset" @click="confirmReset" />
      <q-btn color="primary" icon="add" label="Create" to="/create" />
    </div>

    <q-input
      v-model="searchInput"
      placeholder="Search..."
      outlined
      dense
      clearable
      class="q-mb-md"
      @update:model-value="onSearchChange"
    >
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <q-table
      :rows="paginatedData.data"
      :columns="columns"
      row-key="id"
      :loading="store.loading"
      v-model:pagination="pagination"
      :rows-per-page-options="[5, 10, 20, 50]"
      @request="onRequest"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense color="primary" icon="edit" :to="`/edit/${props.row.id}`" />
          <q-btn flat dense color="negative" icon="delete" @click="confirmDelete(props.row)" />
        </q-td>
      </template>

      <template #body-cell-body="props">
        <q-td :props="props">
          <div class="ellipsis" style="max-width: 300px">{{ props.row.body }}</div>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useCommentsStore } from '../stores/comments'
import { localStorageService } from '../services/localStorage'
import type { Comment } from '../types/comment'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const store = useCommentsStore()

const currentPage = computed(() => Number(route.query.page) || 1)
const perPage = computed(() => Number(route.query.perPage) || 10)
const searchQuery = computed(() => (route.query.search as string) || '')
const searchInput = ref(searchQuery.value)

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' as const, sortable: true },
  { name: 'name', label: 'Name', field: 'name', align: 'left' as const },
  { name: 'email', label: 'Email', field: 'email', align: 'left' as const },
  { name: 'body', label: 'Body', field: 'body', align: 'left' as const },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' as const }
]

const paginatedData = computed(() => store.getPaginated(currentPage.value, perPage.value, searchQuery.value))

const pagination = ref({
  page: currentPage.value,
  rowsPerPage: perPage.value,
  rowsNumber: 0
})

watch(paginatedData, (val) => {
  pagination.value.rowsNumber = val.total
}, { immediate: true })

watch([currentPage, perPage], ([page, rows]) => {
  pagination.value.page = page
  pagination.value.rowsPerPage = rows
}, { immediate: true })

const updateParams = (params: Record<string, string | number>) => {
  const query: Record<string, string> = {}
  const newPage = params.page ?? currentPage.value
  const newPerPage = params.perPage ?? perPage.value
  const newSearch = params.search ?? searchQuery.value

  if (newPage > 1) query.page = String(newPage)
  if (newPerPage !== 10) query.perPage = String(newPerPage)
  if (newSearch) query.search = String(newSearch)

  router.push({ query })
}

const onRequest = (props: { pagination: { page: number; rowsPerPage: number } }) => {
  updateParams({ page: props.pagination.page, perPage: props.pagination.rowsPerPage })
}

const onSearchChange = (value: string | null) => {
  updateParams({ search: value || '', page: 1 })
}

const confirmDelete = (comment: Comment) => {
  $q.dialog({
    title: 'Confirm',
    message: `Delete comment "${comment.name}"?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    store.remove(comment.id)
    $q.notify({ type: 'positive', message: 'Comment deleted' })
  })
}

const confirmReset = () => {
  $q.dialog({
    title: 'Reset Data',
    message: 'Are you sure you want to reset all data? This will clear LocalStorage and reload from API.',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    localStorageService.clear()
    await store.initialize()
    router.push({ query: {} })
    $q.notify({ type: 'positive', message: 'Data reset successfully' })
  })
}

watch(() => route.query.search, (val) => {
  searchInput.value = (val as string) || ''
})

onMounted(() => store.initialize())
</script>
