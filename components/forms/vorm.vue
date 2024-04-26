<script setup lang="ts">
import { useForm } from '@vorms/core'
import { useAlert } from '~/composables/alert'

interface IUser {
  name: string
  phone: string
  email: string
}
interface IProp {
  modelValue: IUser
}
const props = defineProps<IProp>()
const isShowDialog = ref(false)
const { success } = useAlert()

const { errors, register, handleSubmit } = useForm({
  initialValues: {
    ...props.modelValue,
  },
  validate(values) {
    const errors: Record<string, any> = {}

    if (!values.name) {
      errors.name = 'Please enter your name!'
    }
    if (!values.phone) {
      errors.phone = 'Please enter your phone!'
    }
    if (!values.email) {
      errors.email = 'Please enter your email!'
    }

    return errors
  },
  onSubmit(data) {
    success({
      text: JSON.stringify(data, null, 2),
    })
  },
})
const { value: name, attrs: nameFieldAttrs } = register('name')
const { value: phone, attrs: phoneFieldAttrs } = register('phone')
const { value: email, attrs: emailFieldAttrs } = register('email')
</script>

<template>
  <div>
    <UButton @click="isShowDialog = !isShowDialog">Open Free Modal</UButton>
    <WindModal
      v-model="isShowDialog"
      type="free"
      backdrop-opacity="lg"
      class="bg-gray-900 w-[420px] m-4 text-left"
    >
      <div
        class="flex justify-between items-center border-b border-b-1 border-b-gray-500 p-4"
      >
        <h3 class="text-lg">Vorm validation</h3>
        <div>
          <UButton
            variant="ghost"
            color="gray"
            icon="mdi:close"
            @click="isShowDialog = !isShowDialog"
          />
        </div>
      </div>
      <form class="p-4" @submit="handleSubmit">
        <div class="space-y-4">
          <div>
            <label>Name</label>
            <UInput
              v-model="name"
              placeholder="Devaloka Mes"
              v-bind="nameFieldAttrs"
            />
            <div class="yc-validate-message">{{ errors.name }}</div>
          </div>
          <div>
            <label>Phone number</label>
            <UInput
              v-model="phone"
              placeholder="0983313128"
              v-bind="phoneFieldAttrs"
            />
            <div class="yc-validate-message">{{ errors.phone }}</div>
          </div>
          <div>
            <label>Email address</label>
            <UInput
              v-model="email"
              placeholder="yourmail@mail.com"
              v-bind="emailFieldAttrs"
            />
            <div class="yc-validate-message">{{ errors.email }}</div>
          </div>
        </div>
        <div class="mt-4 text-right space-x-4">
          <UButton variant="outline" @click="isShowDialog = !isShowDialog"
            >Cancel</UButton
          >
          <UButton type="submit">Submit</UButton>
        </div>
      </form>
    </WindModal>
  </div>
</template>

<style scoped lang="scss"></style>
