<!--
  Part of weather display, which displays weather forecast for next few days
-->


<script>
import { WEATHER_FORECAST_DAYS } from '@/components/WeatherInfo';
import WeatherInfoDisplayIcon from '@/components/WeatherInfoDisplayIcon';

import weatherDataFormatting from '@/mixins/weatherDataFormatting';


export default {
  name: 'WeatherInfoDisplayForecast',

  components: {
    WeatherInfoDisplayIcon,
  },

  mixins: [
    weatherDataFormatting,
  ],

  props: {
    weatherForecast: {
      type: Object,
      required: true,
      validator(weatherObject) {
        return ('list' in weatherObject);
      },
    },

    units: {
      type: String,
      required: true,
    },
  },

  computed: {
    // Compute weather forecast for the user from API data
    weatherForecastProcessed() {
      let dayData = new Map();

      // Calculate maximum and minimum temperature of each day, based on all
      // the data in the forecasts
      for (let forecast of this.weatherForecast.list) {
        let forecastMax = forecast.main.temp_max;
        let forecastMin = forecast.main.temp_min;
        let weekdayName = this.weekdayName(forecast.dt_txt);
        if (dayData.has(weekdayName)) {
          let day = dayData.get(weekdayName);
          day.max = Math.max(day.max, forecastMax);
          day.min = Math.min(day.min, forecastMin);
        } else {
          // Only set number of days has to be displayed
          if (dayData.size < WEATHER_FORECAST_DAYS) {
              dayData.set(weekdayName, {
                max: forecastMax,
                min: forecastMin,
                icon: {
                  id: forecast.weather[0].icon,
                  description: forecast.weather[0].description,
                },
              });
          }
        }
      }

      return Array.from(dayData.entries());
    },
  },
}
</script>


<template>
  <ul class="WeatherInfoDisplayForecast">
    <li
      v-for="[weekday, { max, min, icon }] in weatherForecastProcessed"
      class="WeatherInfoDisplayForecast-day"
    >
      <WeatherInfoDisplayIcon
        :iconId="icon.id"
        :description="icon.description"
        class="WeatherInfoDisplayForecast-dayIcon"
      />

      <span class="WeatherInfoDisplayForecast-dayDetails">
        <!-- Name of the day -->
        <span class="WeatherInfoDisplayForecast-dayName">
          {{ weekday }}
        </span>
        <!-- Min and max temperatures -->
        {{ formatTemperature(max, units) }}/{{ formatTemperature(min, units) }}°
      </span>
    </li>
  </ul>
</template>


<style scoped lang="scss">
@import '@/assets/styles/shared/_settings.scss';


.WeatherInfoDisplayForecast {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}


.WeatherInfoDisplayForecast-day {
  $border: #{$border-width / 2} $border-style $border-color;

  flex-grow: 1;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  border-left: $border;
  border-right: $border;
  padding: 0.8rem;
  width: 0;

  &:first-child {
    border-left: none;
  }

  &:last-child {
    border-right: none;
  }

  &:nth-child(2n) {
    color: $color-black;
    background-color: $color-grey-light;
  }

  &:nth-child(2n + 1) {
    background-color: $color-orange;
  }
}


.WeatherInfoDisplayForecast-dayIcon {
  width: 7rem;
  font-size: $font-size-small;
}


.WeatherInfoDisplayForecast-dayDetails {
  font-size: $font-size-large;
}


.WeatherInfoDisplayForecast-dayName {
  text-transform: uppercase;
}
</style>
