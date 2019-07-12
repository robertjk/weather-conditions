<!--
  Icon representing the weather conditions
-->


<script>
// Weather API parameters
const WEATHER_API_ICON_URL_BASE = 'http://openweathermap.org/img/wn/';
const WEATHER_API_BIG_SIZE_PARAM = '@2x';
const WEATHER_API_ICON_EXTENSION = '.png';


export default {
  name: 'WeatherInfoIcon',

  props: {
    iconId: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    bigSize: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  computed: {
    weatherIconUrl() {
      let iconPart = String(this.iconId);
      if (this.bigSize) {
        iconPart += WEATHER_API_BIG_SIZE_PARAM;
      }
      return WEATHER_API_ICON_URL_BASE + iconPart + WEATHER_API_ICON_EXTENSION;
    },
  },
};
</script>


<template>
  <img
    :src="weatherIconUrl"
    :alt="description"
  />
</template>
