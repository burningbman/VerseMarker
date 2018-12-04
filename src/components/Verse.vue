<template>
<b-form class="m-1 verse" inline>
    <label class="mr-2 ml-5 verse-number">{{index}}.</label>
    <b-button class="mr-1" variant="success" @click="playVerse">></b-button>
    <b-button class="mr-1" @click="decrement">-</b-button>
    <b-form-input class="mr-1 verse-input" v-model="verse.timestamp" />
    <b-button class="mr-1" @click="increment">+</b-button>
    <b-button class="mr-1" variant="danger" @click="deleteVerse">X</b-button>
</b-form>
</template>

<script>
import Utils from '../utils/Utils.js'
import Database from '../utils/Database.js'

export default {
    name: 'Verse',
    props: ['verse', 'file', 'index', 'nudge'],
    methods: {
        decrement() {
            this.verse.timestamp = Math.max(Utils.toTwoDecimals(parseFloat(this.verse.timestamp) - this.nudge), 0)
            this.saveVerse()
        },
        increment() {
            this.verse.timestamp = Utils.toTwoDecimals(parseFloat(this.verse.timestamp) + this.nudge)
            this.saveVerse()
        },
        deleteVerse() {
            this.$emit('delete-verse', this.verse)
            Database.deleteVerse(this.verse)
        },
        playVerse() {
            this.$emit('play-verse', this.verse)
        },
        saveVerse() {
            Database.saveVerse(this.verse)
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

.active {
    background-color: yellow;
}
</style>
