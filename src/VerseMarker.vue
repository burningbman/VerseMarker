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
    <AudioPlayer :file="file" ref="audioPlayer" v-on:audio-update="onAudioUpdate" />
    <b-container>
        <b-row class="justify-content-md-center">
            <b-form inline>
                <!--<label>Nudge value:</label>
                <b-form-input class="nudge m-2" v-model="nudgeAmount"></b-form-input>-->
                <b-form-checkbox v-model="checking" class="mb-2 mr-sm-2 mb-sm-0">Checking Playback</b-form-checkbox>
            </b-form>
        </b-row>
        <b-row>
            <Verse v-for="(verse, index) in verses" :key="verse.id" :verse="verse" v-on:delete-verse="deleteVerse" v-on:play-verse="playVerse" :file="file" :index="index + 1" :nudge="nudgeAmount" />
        </b-row>
    </b-container>
</div>
</template>

<script>
import Verse from './components/Verse.vue'
import AudioPlayer from './components/AudioPlayer.vue'
import Utils from './utils/Utils.js'
import Database from './utils/Database.js'
import uuid from 'uuid'

const INIT_FILE_NAME = 'thisIsAFileThatIsntReal'

var file = new File([''], INIT_FILE_NAME)

export default {
    name: 'VerseMarker',
    data() {
        return {
            file: file,
            verses: [],
            checking: false,
            nudgeAmount: 0.01,
            activeVerseIndex: -1
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
                    onComplete: (verses) => {
                        this.verses = verses
                    }
                })
            } else {
                this.verses.splice(0, this.verses.length)
            }
        },
        activeVerseIndex(newVal, oldVal) {
            var oldVerse = this.$el.getElementsByClassName('verse')[oldVal]
            if (oldVerse) {
                oldVerse.classList.remove('active')
            }

            var newVerse = this.$el.getElementsByClassName('verse')[newVal]
            if (newVerse) {
                newVerse.classList.add('active')
            }
        },
        checking(newVal) {
            if (newVal) {
                this.onAudioUpdate(this.$refs.audioPlayer.audio.currentTime)
            } else {
                this.activeVerseIndex = -1
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
        },
        onAudioUpdate(time) {
            if (!this.checking) {
                return
            }

            var currentVerse = -1

            this.verses.forEach(function(verse, index) {
                if (verse.timestamp > time) {
                    return
                }
                currentVerse = index
            })

            this.activeVerseIndex = currentVerse
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

.form-inline .form-control.nudge {
    width: 75px;
}
</style>
