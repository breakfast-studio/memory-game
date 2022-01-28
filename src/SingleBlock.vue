<template>
    <group :rotation-z="rotZ">
        <!-- main mesh -->
        <mesh :scale-y="0.1" @click="onClick">
            <RoundedBoxGeometry />
            <meshBasicMaterial />
        </mesh>

        <!-- correct value -->
        <mesh
            v-if="props.correct"
            :scale="[0.75, 0.05, 0.75]"
            :position-y="0.05"
        >
            <RoundedBoxGeometry />
            <meshBasicMaterial color="#00a000" />
        </mesh>

        <!-- mesh back -->
        <mesh :scale="[1, 0.05, 1]" :position-y="-0.05">
            <RoundedBoxGeometry />
            <meshBasicMaterial color="blue" />
        </mesh>
    </group>
</template>

<script lang="ts" setup>
import { ColdSubscription, spring } from 'popmotion'
import { ref, watch } from 'vue'

// props, emits
const props = defineProps<{
    correct: boolean
    flipped: boolean
}>()
const emits = defineEmits<{
    (event: 'clicked'): void
}>()

// rotation
const rotZ = ref(0)
let animation: ColdSubscription

// flip action
const flip = () => {
    animation?.stop()
    animation = spring({
        from: rotZ.value,
        to: props.flipped ? 0 : Math.PI,
        stiffness: 300,
        damping: 20,
    }).start((v: number) => {
        rotZ.value = v
    })
}

// on click
const onClick = () => {
    emits('clicked')
}

watch(
    () => props.flipped,
    (newVal, oldVal) => {
        if (newVal === oldVal) return
        flip()
    }
)
</script>