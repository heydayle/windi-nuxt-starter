<script setup lang="ts">
import CHIM_SAU_MP3 from '~/public/mp3/ChimSau.mp3'
import { useIntervalFn } from '@vueuse/core'
const props = defineProps<{}>()
const emits = defineEmits<{}>()

const audio = ref<HTMLAudioElement>(null)
const isPlaying = ref(false)
const listenerActive = ref(false)
const onPlay = () => {
  isPlaying.value = true
  audio.value?.play()
  resume()
}
const onPause = () => {
  isPlaying.value = false
  audio.value?.pause()
  pause()
}
const time = computed(() => parseInt(Math.round(audio.value?.duration)))
const playbackTime = ref(0)
const convertTime = (seconds) => {
  const format = (val) => `0${Math.floor(val)}`.slice(-2)
  const minutes = (seconds % 3600) / 60
  return [minutes, seconds % 60].map(format).join(':')
}
const currentTime = ref(0)
const countTime = () => {
  currentTime.value++
}
const { resume, pause } = useIntervalFn(() => countTime(), 1100)
onMounted(() => {
  pause()
})
watch(currentTime, () => {
  if (currentTime.value === time.value) {
    pause()
    currentTime.value = 0
  }
})
const percentWidth = computed(() =>
  Math.round((currentTime.value / time.value) * 100),
)
</script>
<template>
  <div class="rounded-2xl p-4">
    <audio ref="audio">
      <source :src="CHIM_SAU_MP3" type="audio/mpeg" />
    </audio>
    <div>
      <UButton icon="mdi:arrow-back" :ui="{ rounded: 'rounded-full' }" />
    </div>
    <div class="py-4 gap-4">
      <div
        class="mb-4 overflow-hidden transition transform-all duration-1000 animate"
        :class="isPlaying ? 'rounded-full animate-spinning' : 'rounded-2xl'"
      >
        <img src="~/public/images/ab-99.png" alt="album-cover" />
      </div>
      <div>
        <div class="flex space-x-4">
          <UButton
            size="xs"
            icon="mdi:heart"
            variant="ghost"
            :ui="{ rounded: 'rounded-full' }"
          />
          <UButton
            size="xs"
            icon="ri:loop-left-fill"
            variant="ghost"
            :ui="{ rounded: 'rounded-full' }"
          />
          <UButton
            size="xs"
            icon="lets-icons:sort-random"
            variant="ghost"
            :ui="{ rounded: 'rounded-full' }"
          />
        </div>
        <div class="py-2">
          <div>Chìm sâu</div>
          <div>MCK</div>
        </div>
        <UMeter :value="percentWidth" class="mt-4">
          <template #label="{ percent }">
            <div class="flex gap-1.5 justify-between text-sm">
              <p>{{ convertTime(currentTime) }}</p>
              <p class="text-gray-500 dark:text-gray-400">
                {{ convertTime(time) }}
              </p>
            </div>
          </template>
        </UMeter>
        <div class="flex justify-center space-x-4">
          <UButton
            icon="material-symbols:skip-previous"
            variant="ghost"
            :ui="{ rounded: 'rounded-full' }"
          />
          <UButton
            v-if="isPlaying"
            size="xl"
            icon="material-symbols:pause"
            variant="ghost"
            :ui="{ rounded: 'rounded-full' }"
            @click="onPause"
          />
          <UButton
            v-else
            size="xl"
            icon="material-symbols:play-arrow"
            variant="ghost"
            :ui="{ rounded: 'rounded-full' }"
            @click="onPlay"
          />
          <UButton
            icon="material-symbols:skip-next"
            variant="ghost"
            :ui="{ rounded: 'rounded-full' }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
