<template>
<div class="player">
    <div class="player-controls">
        <div>
            <a v-on:click.prevent="stop" title="Stop" href="#">
                <svg width="18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path fill="currentColor" d="M16,4.995v9.808C16,15.464,15.464,16,14.804,16H4.997C4.446,16,4,15.554,4,15.003V5.196C4,4.536,4.536,4,5.196,4h9.808C15.554,4,16,4.446,16,4.995z" />
                </svg>
            </a>
        </div>
        <div>
            <a v-on:click.prevent="playing = !playing" title="Play/Pause" href="#">
                <svg width="18px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path v-if="!playing" fill="currentColor" d="M15,10.001c0,0.299-0.305,0.514-0.305,0.514l-8.561,5.303C5.51,16.227,5,15.924,5,15.149V4.852c0-0.777,0.51-1.078,1.135-0.67l8.561,5.305C14.695,9.487,15,9.702,15,10.001z" />
                    <path v-else fill="currentColor" d="M15,3h-2c-0.553,0-1,0.048-1,0.6v12.8c0,0.552,0.447,0.6,1,0.6h2c0.553,0,1-0.048,1-0.6V3.6C16,3.048,15.553,3,15,3z M7,3H5C4.447,3,4,3.048,4,3.6v12.8C4,16.952,4.447,17,5,17h2c0.553,0,1-0.048,1-0.6V3.6C8,3.048,7.553,3,7,3z" />
                </svg>
            </a>
        </div>
        <div>
            <div v-on:click="seek" class="player-progress" title="Time played : Total time">
                <div :style="{ width: this.percentComplete + '%' }" class="player-seeker"></div>
            </div>
            <div class="player-time">
                <div class="player-time-current">{{ currentTime }}</div>
                <div class="player-time-total">{{ durationTime }}</div>
            </div>
        </div>
    </div>
    <audio ref="audiofile" :src="fileName" preload="auto" style="display: none;"></audio>
</div>
</template>

<script>
const convertTimeHHMMSS = (val) => {
    let hhmmss = new Date(val * 1000).toISOString().substr(11, 8);

    return hhmmss.indexOf("00:") === 0 ? hhmmss.substr(3) : hhmmss;
};

export default {
    name: 'AudioPlayer',
    props: {
        file: {
            type: File
        }
    },
    data: () => ({
        audio: undefined,
        currentSeconds: 0,
        durationSeconds: 0,
        loaded: false,
        playing: false
    }),
    computed: {
        fileName() {
            if (this.file) {
                return URL.createObjectURL(this.file)
            } else {
                return ''
            }
        },
        currentTime() {
            return convertTimeHHMMSS(this.currentSeconds);
        },
        durationTime() {
            return convertTimeHHMMSS(this.durationSeconds);
        },
        percentComplete() {
            return parseInt(this.currentSeconds / this.durationSeconds * 100);
        }
    },
    watch: {
        playing(value) {
            if (value) {
                this.audio.play().catch(function() {
                    this.playing = false;
                }.bind(this));
            } else {
                this.audio.pause();
            }
        }
    },
    methods: {
        load() {
            if (this.audio.readyState >= 2) {
                this.loaded = true;
                this.durationSeconds = parseInt(this.audio.duration);
                return this.playing = this.autoPlay;
            }

            throw new Error('Failed to load sound file.');
        },
        seek(e) {
            if (!this.playing || e.target.tagName === 'SPAN') {
                return;
            }

            const el = e.target.getBoundingClientRect();
            const seekPos = (e.clientX - el.left) / el.width;

            this.setAudioTime(parseInt(this.audio.duration * seekPos));
        },
        setAudioTime(timestamp) {
            this.audio.currentTime = parseInt(timestamp);
        },
        stop() {
            this.playing = false;
            this.audio.currentTime = 0;
        },
        update() {
            this.currentSeconds = parseInt(this.audio.currentTime);
            this.$emit('audio-update', this.audio.currentTime);
        },
        getCurrentTime() {
            return this.audio.currentTime;
        }
    },
    created() {
        this.innerLoop = this.loop;
    },
    mounted() {
        this.audio = this.$el.querySelectorAll('audio')[0];
        this.audio.addEventListener('timeupdate', this.update);
        this.audio.addEventListener('loadeddata', this.load);
        this.audio.addEventListener('pause', () => {
            this.playing = false;
        });
        this.audio.addEventListener('play', () => {
            this.playing = true;
        });
    }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Nunito:400,700');

body {
    font-family: 'Nunito', sans-serif;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
}

$player-bg: #fff;
$player-border-color: darken($player-bg, 12%);
$player-link-color: darken($player-bg, 75%);
$player-progress-color: $player-border-color;
$player-seeker-color: $player-link-color;
$player-text-color: $player-link-color;

.player-wrapper {
    align-items: center;
    background-color: $player-bg;
    background-image: linear-gradient(90deg, #fff 0, darken(#fff, 12%));
    display: flex;
    justify-content: center;
    height: 100vh;
}

.player {
    background-color: $player-bg;
    border: 1px solid $player-border-color;
    border-radius: 5px;
    box-shadow: 0 5px 8px rgba(0, 0, 0, 0.15);
    color: $player-text-color;
    display: inline-block;
    line-height: 1.5625;
    margin: 10px 0;
}

.player-controls {
    display: flex;

    > div {
        border-right: 1px solid $player-border-color;

        &:last-child {
            border-right: none;
        }

        a {
            color: $player-link-color;
            display: block;
            line-height: 0;
            padding: 1em;
            text-decoration: none;
        }
    }
}

.player-progress {
    background-color: $player-progress-color;
    cursor: pointer;
    height: 50%;
    min-width: 570px;
    position: relative;

    .player-seeker {
        background-color: $player-seeker-color;
        bottom: 0;
        left: 0;
        position: absolute;
        top: 0;
    }
}

.player-time {
    display: flex;
    // font-size: 18px;
    justify-content: space-between;

    .player-time-current {
        font-weight: 700;
        padding-left: 5px;
    }

    .player-time-total {
        opacity: 0.5;
        padding-right: 5px;
    }
}
</style>
