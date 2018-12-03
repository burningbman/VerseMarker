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
            <Verse v-for="(verse, index) in verses" :key="verse.id" :verse="verse" v-on:delete-verse="deleteVerse" v-on:play-verse="playVerse" :file="file" :index="index + 1"/>
        </b-row>
    </b-container>
</div>
</template>

<script>
import Verse from './components/Verse.vue'
import AudioPlayer from './components/AudioPlayer.vue'
import Utils from './utils/Utils.js'
import Database from './utils/Database.js'
import AWS from 'aws-sdk'
import uuid from 'uuid'

const INIT_FILE_NAME = 'thisIsAFileThatIsntReal'

var file = new File([''], INIT_FILE_NAME)

export default {
    name: 'VerseMarker',
    data() {
        return {
            file: file,
            verses: []
        }
    },
    components: {
        Verse,
        AudioPlayer
    },
    mounted() {
        Database.init()
    },
    watch: {
        file() {
            if (this.file) {
                Database.fetchVerses({
                    fileName: this.file.name,
                    onComplete:(verses) => {
                        this.verses = verses
                    }
                })
            } else {
                this.verses.splice(0, this.verses.length)
            }
        }
    },
    methods: {
        deleteVerse(verse) {
            var verseIndex = this.verses.indexOf(verse.timestamp)
            this.verses.splice(verseIndex, 1)
        },
        addVerse() {
            if (this.file.name === INIT_FILE_NAME) {
                alert('Choose an audio file first.')
                return
            }

            var time = Utils.toTwoDecimals(this.$refs.audioPlayer.getCurrentTime())
            var verse = {
                id: uuid(),
                timestamp: time,
                book: this.file.name
            }
            this.verses.push(verse)
            this.verses.sort(Utils.arraySortFunc)

            Database.saveVerse(verse)
        },
        playVerse(verse) {
            this.$refs.audioPlayer.setAudioTime(verse.timestamp)
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
