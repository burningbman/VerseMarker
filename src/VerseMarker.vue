<template>
<div id="app">
    <h1>Verse Marker</h1>
    <b-container>
        <b-row class="justify-content-md-center">
            <b-col>
                <b-form>
                    <b-form-file v-model="file" accept=".mp3" placeholder="Choose a file..."></b-form-file>
                </b-form>
            </b-col>
            <b-col>
                <b-button @click="addVerse">Add Verse</b-button>
            </b-col>
        </b-row>
    </b-container>
    <b-container>
        <Verse v-for="verse in verses" :key="verse" :initialTimestamp="verse" v-on:delete-verse="deleteVerse" />
    </b-container>
</div>
</template>

<script>
import Verse from './components/Verse.vue'
import Utils from './utils/Utils.js'

export default {
    name: 'app',
    data() {
        return {
            file: null,
            verses: [0, 2.34, 4.56]
        }
    },
    components: {
        Verse
    },
    methods: {
        deleteVerse(timestamp) {
            var verseIndex = this.verses.indexOf(timestamp)
            this.verses.splice(verseIndex, 1)
        },
        addVerse() {
            var verse = Utils.toTwoDecimals(Math.random() * 100)
            this.verses.push(verse)
            this.verses.sort(function(a, b) {
                return a - b
            })
        }
    }
}
</script>

<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
