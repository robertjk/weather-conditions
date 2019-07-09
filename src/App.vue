<template>
  <div id="app">
    <WeatherInfo />
  </div>
</template>


<script>
import WeatherInfo from '@/components/WeatherInfo.vue';


export default {
  name: 'app',
  components: {
    WeatherInfo,
  }
}
</script>


<style lang="scss">
/* Import all base styles */
@import './assets/styles/base/reset.css';
@import './assets/styles/base/universal-border-box-sizing.scss';
@import './assets/styles/base/typography.scss';
@import './assets/styles/base/layout.scss';
</style>
