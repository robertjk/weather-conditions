<!--
  Part of weather widget which actually displays the weather data
-->


<script>
import { WEATHER_FORECAST_DAYS } from '@/components/WeatherInfo';
import WeatherInfoIcon from '@/components/WeatherInfoIcon';
import WeatherInfoToday from '@/components/WeatherInfoToday'; 
import { default as WeatherInfoUnitSelection, UNIT_CELCIUS, UNIT_FAHRENHEIT }
  from '@/components/WeatherInfoUnitSelection'; 

import weatherDataFormatting from '@/mixins/weatherDataFormatting';


export default {
  name: 'WeatherInfoDisplay',

  components: {
    WeatherInfoIcon,
    WeatherInfoToday,
    WeatherInfoUnitSelection,
  },

  mixins: [
    weatherDataFormatting,
  ],

  data() {
    return {
      units: UNIT_CELCIUS,
    };
  },

  props: {
    weatherCurrent: {
      type: Object,
      required: true,
    },

    weatherForecast: {
      type: Object,
      required: true,
      validator(weatherObject) {
        return ('list' in weatherObject);
      },
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

  methods: {
    changeUnitsToCelcius() {
      this.units = UNIT_CELCIUS;
    },

    changeUnitsToFahrenheit() {
      this.units = UNIT_FAHRENHEIT;
    },
  },
};
</script>


<template>
  <div class="WeatherInfoDisplay">
    <div class="WeatherInfoDisplay-topRow">
      <WeatherInfoToday
        :weatherCurrent="weatherCurrent"
        :units="units"
      />

      <WeatherInfoUnitSelection
        class="WeatherInfoDisplay-unitToggle"
        @celciusSelected="changeUnitsToCelcius()"
        @fahrenheitSelected="changeUnitsToFahrenheit()"
      />
    </div>

    <!-- Forecast for the next 5 days -->
    <ul class="WeatherInfoDisplay-forecast">
      <li
        v-for="[weekday, { max, min, icon }] in weatherForecastProcessed"
        class="WeatherInfoDisplay-forecastDay"
      >
        <WeatherInfoIcon
          :iconId="icon.id"
          :description="icon.description"
          class="WeatherInfoDisplay-forecastDayIcon"
        />

        <span class="WeatherInfoDisplay-forecastDayDetails">
          <!-- Name of the day -->
          <span class="WeatherInfoDisplay-forecastDayName">
            {{ weekday }}
          </span>
          <!-- Min and max temperatures -->
          {{ formatTemperature(max, units) }}/{{ formatTemperature(min, units) }}°
        </span>
      </li>
    </ul>
  </div>
</template>


<style scoped lang="scss">
@import '@/assets/styles/shared/_settings.scss';


.WeatherInfoDisplay {
  display: grid;
  grid-template:
    'currentWeather'  3fr
    'forecastWeather' 2fr /
     100%; 
  width: 100%;
  height: 100%;
}

.WeatherInfoDisplay-topRow {
  /* Relative position, so that the unit toggle can be positioned relatively */
  position: relative;
  grid-area: 'currentWeather';
}


.WeatherInfoDisplay-unitToggle {
  position: absolute;
  right: 0.6rem;
  bottom: 1.5rem;
}


.WeatherInfoDisplay-forecast {
  grid-area: 'forecastWeather';
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}


.WeatherInfoDisplay-forecastDay {
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


.WeatherInfoDisplay-forecastDayIcon {
  width: 7rem;
  font-size: $font-size-small;
}


.WeatherInfoDisplay-forecastDayDetails {
  font-size: $font-size-large;
}


.WeatherInfoDisplay-forecastDayName {
  text-transform: uppercase;
}
</style>
