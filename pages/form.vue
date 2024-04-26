<script setup lang="ts">
import { useAlert } from '~/composables/alert'
import { useForm } from '@vorms/core'
import Vorm from '~/components/forms/vorm.vue'
import Vee from '~/components/forms/vee.vue'

const { error, warning, success, confirm } = useAlert()
const user = reactive({
  name: 'Devaloka',
  phone: '0999898981',
  email: 'cloud@tifa.com',
})
const { errors, register, handleSubmit, handleReset } = useForm({
  initialValues: {
    ...user,
  },
  validate(values) {
    const errors: Record<string, any> = {}

    if (!values.name) {
      errors.name = 'This is required!!'
    }
    if (!values.phone) {
      errors.phone = 'This is required!!'
    }
    if (!values.email) {
      errors.email = 'This is required!!'
    }

    return errors
  },
  onSubmit(data) {
    success({
      text: data.name,
    })
  },
})
const { value: name, attrs: nameFieldAttrs } = register('name')
const { value: phone, attrs: phoneFieldAttrs } = register('phone')
const { value: email, attrs: emailFieldAttrs } = register('email')

const isShowForm = ref(false)
const isShowDialog = ref(false)
const route = useRoute()
watch(
  () => route.query.id,
  (value) => {
    if (value) {
      isShowForm.value = true
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div
      class="from-green-500 via-indigo-500 to-green-500 animate animate-text bg-gradient-to-r bg-clip-text text-transparent mb-4"
    >
      Form modal
    </div>
    <div class="flex space-x-4">
      <Vee v-model="user" />
      <Vorm v-model="user" />
    </div>
  </div>
</template>
