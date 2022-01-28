<template>
    <Lunchbox
        background="lightsalmon"
        :cameraPosition="[5, 5, 5]"
        :cameraLook="[0, 1, 0]"
        orthographic
        shadow
    >
        <ambientLight :intensity="0.4" />
        <pointLight :position="[0, 10, 0]" />

        <group :scale="scale" :key="dimensions">
            <SingleBlock
                v-for="i in dimensions * dimensions"
                :key="i"
                :position-x="((i - 1) % dimensions) - dimensions * 0.5"
                :position-z="
                    Math.floor((i - 1) / dimensions) - dimensions * 0.5
                "
                :scale="0.8"
                :correct="correctIndices.includes(i - 1)"
                :flipped="flippedIndices.includes(i - 1)"
                @clicked="onClick(i - 1)"
            />
        </group>
    </Lunchbox>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import SingleBlock from './SingleBlock.vue'
import { tween } from 'popmotion'

// game
const dimensions = ref(3)
const correctIndices = ref<number[]>([])
const playable = ref(false)
const guesses = ref<number[]>([])
const flippedIndices = ref<number[]>([])
const scale = ref(2)

watch(
    dimensions,
    (newVal) => {
        // clear guesses
        guesses.value = []
        // all tiles start visible
        flippedIndices.value = new Array(newVal * newVal)
            .fill(undefined)
            .map((v, i) => i)

        // generate new answers
        correctIndices.value = []
        for (let i = 0; i < newVal / 2; i++) {
            let generated: number
            do {
                generated = Math.floor(Math.random() * newVal * newVal)
            } while (correctIndices.value.includes(generated))
            correctIndices.value.push(generated)
        }

        // hide tiles one by one
        tween({
            from: scale.value,
            to: 2,
        }).start({
            update: (v: number) => {
                scale.value = v
            },
            complete: () => {
                setTimeout(() => {
                    unflipAll()
                }, 2000)
            },
        })
    },
    {
        immediate: true,
    }
)

const unflipAll = () => {
    const interval = setInterval(() => {
        flippedIndices.value.shift()
        flippedIndices.value = [...flippedIndices.value]
        if (!flippedIndices.value.length) {
            clearInterval(interval)
            playable.value = true
        }
    }, (1 / dimensions.value) * 150)
}

const onClick = (idx: number) => {
    if (!playable.value || flippedIndices.value.includes(idx)) return

    if (correctIndices.value.includes(idx)) {
        guesses.value = [...guesses.value, idx]
    } else {
        // reset and unflip all on incorrect
        guesses.value = []
        playable.value = false
        setTimeout(() => {
            unflipAll()
        }, 600)
    }

    if (!flippedIndices.value.includes(idx)) {
        flippedIndices.value.push(idx)
    } else {
        flippedIndices.value = flippedIndices.value.filter((v) => v !== idx)
    }
}

// game win
watch(guesses, (newVal) => {
    console.log(newVal.length, correctIndices.value.length)
    if (newVal.length === correctIndices.value.length) {
        playable.value = false
        setTimeout(() => {
            tween({
                from: scale.value,
                to: 0,
            }).start({
                update: (v: number) => {
                    scale.value = v
                },
                complete() {
                    setTimeout(() => {
                        dimensions.value++
                    }, 250)
                },
            })
        }, 1000)
    }
})
</script>