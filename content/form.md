# [Vorms](https://vorms.mini-ghost.dev/guide/)

---

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

    <template>
        <form @submit="handleSubmit">
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
    <template>