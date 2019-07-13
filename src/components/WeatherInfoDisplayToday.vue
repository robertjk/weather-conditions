<!--
  Part of weather display, which displays weather for today
-->


<script>
import WeatherInfoDisplayIcon from '@/components/WeatherInfoDisplayIcon';

import weatherDataFormatting from '@/mixins/weatherDataFormatting';


export default {
  name: 'WeatherInfoDisplayToday',

  components: {
    WeatherInfoDisplayIcon,
  },

  mixins: [
    weatherDataFormatting,
  ],

  props: {
    weatherCurrent: {
      type: Object,
      required: true,
      validator(weatherObject) {
        return ('main' in weatherObject);
      },
    },

    units: {
      type: String,
      required: true,
    },
  },
}
</script>


<template>
  <!-- Current weather -->
  <div class="WeatherInfoDisplayToday">
    <WeatherInfoDisplayIcon
      :iconId="weatherCurrent.weather[0].icon"
      :description="weatherCurrent.weather[0].description"
      :bigSize="true"
      class="WeatherInfoDisplayToday-icon"
    />

    <span class="WeatherInfoDisplayToday-temperatures">
      <span class="WeatherInfoDisplayToday-current">
        {{ formatTemperature(weatherCurrent.main.temp, units) }}°
      </span>

      <span class="WeatherInfoDisplayToday-extremes">
        {{ formatTemperature(weatherCurrent.main.temp_min, units) }} /
        {{ formatTemperature(weatherCurrent.main.temp_max, units) }}°
      </span>
    </span>
  </div>
</template>


<style scoped lang="scss">
@import '@/assets/styles/shared/_settings.scss';


.WeatherInfoDisplayToday {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}


.WeatherInfoDisplayToday-icon {
  width: 13rem;
}


.WeatherInfoDisplayToday-temperatures {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
  font-size: $font-size-xxlarge;
}


.WeatherInfoDisplayToday-current {
  margin-bottom: -2.2rem;
  font-size: $font-size-xxxlarge;
}
</style>
