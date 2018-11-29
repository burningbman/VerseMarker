<template>
<b-form class="m-1 verse" inline>
    <label class="mr-2 ml-5 verse-number">{{index}}.</label>
    <b-button class="mr-1" variant="success" @click="playVerse">></b-button>
    <b-button class="mr-1" @click="decrement">-</b-button>
    <b-form-input class="mr-1 verse-input" v-model="timestamp" />
    <b-button class="mr-1" @click="increment">+</b-button>
    <b-button class="mr-1" variant="danger" @click="deleteVerse">X</b-button>
</b-form>
</template>

<script>
import Utils from '../utils/Utils.js'

const NUDGE_VALUE = .01;

export default {
    name: 'Verse',
    props: ['initialTimestamp', 'index'],
    data() {
        return {
            timestamp: Number(this.initialTimestamp)
        }
    },
    methods: {
        decrement() {
            this.timestamp = Math.max(Utils.toTwoDecimals(this.timestamp - NUDGE_VALUE), 0)
        },
        increment() {
            this.timestamp = Utils.toTwoDecimals(this.timestamp + NUDGE_VALUE)
        },
        deleteVerse() {
            this.$emit('delete-verse', this.timestamp)
        },
        playVerse() {
            this.$emit('play-verse', this.timestamp)
        }
    }
}
</script>

<style scoped>
.form-inline .form-control.verse-input {
    width: 75px;
}
.verse-number {
    width: 30px;
}
</style>
