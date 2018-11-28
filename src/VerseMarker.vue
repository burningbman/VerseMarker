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
                <b-button>Add Verse</b-button>
            </b-col>
        </b-row>
    </b-container>
    <b-container>
        <template v-for="verse in verses">
            <Verse :initialTimestamp="verse"/>
        </template>
    </b-container>
</div>
</template>

<script>
import Verse from './components/Verse.vue'

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
