<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
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
const isShowForm = ref(false)
const { success } = useAlert()

const { errors, handleSubmit, defineField } = useForm({
  initialValues: {
    ...props.modelValue,
  },
  validationSchema: yup.object({
    name: yup.string().required('Please enter your name!'),
    email: yup.string().email().required('Please enter your email!'),
    phone: yup.string().required('Please enter your phone!'),
  }),
})
const onSubmit = handleSubmit((values) => {
  success({
    text: JSON.stringify(values, null, 2),
  })
})
const [email, emailAttrs] = defineField('email')
const [name, nameAttrs] = defineField('name')
const [phone, phoneAttrs] = defineField('phone')
</script>

<template>
  <div>
    <UButton variant="outline" @click="isShowForm = !isShowForm"
      >Open Layout Modal</UButton
    >
    <WindModal
      v-model="isShowForm"
      type="layout"
      backdrop-opacity="lg"
      class="bg-gray-900 w-full max-w-md text-left"
    >
      <template #title>
        <div
          class="flex p-4 justify-between items-center text-lg font-medium leading-6 text-gray-100 border-b border-b-1 border-b-gray-500"
        >
          <div>Vee validation</div>
          <div>
            <UButton
              class="rounded-full p-1"
              variant="ghost"
              icon="mdi:close"
              color="gray"
              :ui="{ rounded: 'rounded-full', padding: 'p-4' }"
              @click="isShowForm = !isShowForm"
            ></UButton>
          </div>
        </div>
      </template>
      <template #action>
        <div
          class="p-4 text-right space-x-2 border-t border-t-1 border-t-gray-500"
        >
          <UButton
            variant="ghost"
            class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium"
            @click="isShowForm = !isShowForm"
          >
            Cancel
          </UButton>
          <UButton
            variant="solid"
            class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium"
            @click="onSubmit"
          >
            Submit
          </UButton>
        </div>
      </template>
      <form class="p-4 space-y-4" @submit="onSubmit">
        <div>
          <label>Name</label>
          <UInput
            v-model="name"
            placeholder="Devaloka Mes"
            v-bind="nameAttrs"
          />
          <div class="yc-validate-message">{{ errors.name }}</div>
        </div>
        <div>
          <label>Phone number</label>
          <UInput
            v-model="phone"
            placeholder="0983313128"
            v-bind="phoneAttrs"
          />
          <div class="yc-validate-message">{{ errors.phone }}</div>
        </div>
        <div>
          <label>Email address</label>
          <UInput
            v-model="email"
            placeholder="yourmail@mail.com"
            v-bind="emailAttrs"
          />
          <div class="yc-validate-message">{{ errors.email }}</div>
        </div>
      </form>
    </WindModal>
  </div>
</template>

<style scoped lang="scss"></style>
