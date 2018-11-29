<template>
<div id="app">
    <h1>Verse Marker</h1>
    <b-container>
        <b-row class="justify-content-md-center">
            <b-col cols="6">
                <b-form>
                    <b-form-file v-model="file" accept=".mp3" placeholder="Choose a file..."></b-form-file>
                </b-form>
            </b-col>
            <b-col md="auto">
                <b-button @click="addVerse">Add Verse</b-button>
            </b-col>
        </b-row>
    </b-container>
    <AudioPlayer :file="file" ref="audioPlayer" />
    <b-container>
        <b-row>
            <Verse v-for="(verse, index) in verses" :index="index" :key="verse" :initialTimestamp="verse" v-on:delete-verse="deleteVerse" v-on:play-verse="playVerse"/>
        </b-row>
    </b-container>
</div>
</template>

<script>
import Verse from './components/Verse.vue'
import AudioPlayer from './components/AudioPlayer.vue'
import Utils from './utils/Utils.js'

const INIT_FILE_NAME = 'thisIsAFileThatIsntReal'

var file = new File([''], INIT_FILE_NAME)

export default {
    name: 'VerseMarker',
    data() {
        return {
            file: file,
            verses: [0, 2.34, 4.56]
        }
    },
    components: {
        Verse,
        AudioPlayer
    },
    methods: {
        deleteVerse(timestamp) {
            var verseIndex = this.verses.indexOf(timestamp)
            this.verses.splice(verseIndex, 1)
        },
        addVerse() {
            if (this.file.name === INIT_FILE_NAME) {
                alert('Choose an audio file first.')
                return
            }

            var time = Utils.toTwoDecimals(this.$refs.audioPlayer.getCurrentTime())
            this.verses.push(time)
            this.verses.sort(function(a, b) {
                return a - b
            })
        },
        playVerse(timestamp) {
            this.$refs.audioPlayer.setAudioTime(timestamp)
            this.$refs.audioPlayer.playing = true
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
