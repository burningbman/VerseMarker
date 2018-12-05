<template>
<div id="app">
    <h1>Verse Marker</h1>
    <b-container>
        <b-row class="justify-content-md-center">
            <b-col cols="7">
                <b-form>
                    <b-form-file v-model="file" accept=".mp3" placeholder="Choose an audio file..."></b-form-file>
                </b-form>
            </b-col>
        </b-row>
    </b-container>
    <b-container v-if="file.name">
        <b-row class="justify-content-md-center mt-2">
            <b-form class="mt-2">
                <label>Playback Mode:</label>
                <b-form-radio-group v-model="playbackMode">
                    <b-form-radio value="normal">Normal</b-form-radio>
                    <b-form-radio value="checking">Checking</b-form-radio>
                </b-form-radio-group>
            </b-form>
            <AudioPlayer :file="file" ref="audioPlayer" v-on:audio-update="onAudioUpdate" />
        </b-row>
        <b-row class="justify-content-md-center">
            <b-form inline>
                <b-button class="mr-2" @click="addVerse">Add Verse</b-button>
                <label>Nudge value:</label>
                <b-form-input type="number" class="nudge m-2" v-model="nudgeAmount" v-on:change="formatNudgeAmount"></b-form-input>
                <label>Pause value:</label>
                <b-form-input type="number" class="nudge m-2" v-model="pauseAmount" v-on:change="formatPauseAmount"></b-form-input>
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

var file = new File([''], '')

export default {
    name: 'VerseMarker',
    data() {
        return {
            file: file,
            verses: [],
            playbackMode: 'normal',
            nudgeAmount: 0.01,
            pauseAmount: 0.5,
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
        playbackMode(newVal) {
            if (newVal === 'checking') {
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
            if (this.file.name === '') {
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
            if (this.playbackMode === 'normal') {
                return
            }

            var currentVerse = -1

            this.verses.forEach(function(verse) {
                if (verse.timestamp > time) {
                    return
                }
                currentVerse++
            })

            if (currentVerse !== this.activeVerseIndex && currentVerse !== -1) {
                this.$refs.audioPlayer.audio.pause()
                setTimeout(function() {
                    this.$refs.audioPlayer.audio.play()
                }.bind(this), this.pauseAmount * 1000)
            }

            this.activeVerseIndex = currentVerse
        },
        formatNudgeAmount(value) {
            this.nudgeAmount = parseFloat(value)
        },
        formatPauseAmount(value) {
            this.pauseAmount = parseFloat(value)
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
