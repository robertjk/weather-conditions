<!--
  Part of weather display, which displays weather for today
-->


<script>
import WeatherInfoIcon from '@/components/WeatherInfoIcon';

import weatherDataFormatting from '@/mixins/weatherDataFormatting';


export default {
  name: 'WeatherInfoToday',

  components: {
    WeatherInfoIcon,
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
  <div class="WeatherInfoToday">
    <WeatherInfoIcon
      :iconId="weatherCurrent.weather[0].icon"
      :description="weatherCurrent.weather[0].description"
      :bigSize="true"
      class="WeatherInfoToday-icon"
    />

    <span class="WeatherInfoToday-temperatures">
      <span class="WeatherInfoToday-current">
        {{ formatTemperature(weatherCurrent.main.temp, units) }}°
      </span>

      <span class="WeatherInfoToday-extremes">
        {{ formatTemperature(weatherCurrent.main.temp_min, units) }} /
        {{ formatTemperature(weatherCurrent.main.temp_max, units) }}°
      </span>
    </span>
  </div>
</template>


<style scoped lang="scss">
@import '@/assets/styles/shared/_settings.scss';


.WeatherInfoToday {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}


.WeatherInfoToday-icon {
  width: 13rem;
}


.WeatherInfoToday-temperatures {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
  font-size: $font-size-xxlarge;
}


.WeatherInfoToday-current {
  margin-bottom: -2.2rem;
  font-size: $font-size-xxxlarge;
}
</style>
