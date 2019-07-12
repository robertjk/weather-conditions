<!--
  Part of weather widget which actually displays the weather data
-->


<script>
import { WEATHER_FORECAST_DAYS } from '@/components/WeatherInfo.vue';
import { default as WeatherInfoUnitSelection, UNIT_CELCIUS, UNIT_FAHRENHEIT }
  from '@/components/WeatherInfoUnitSelection.vue'; 

const WEEKDAYS_NAMES = {
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
  7: 'Sun',
};

// Weather API parameters
const WEATHER_API_ICON_URL_BASE = 'http://openweathermap.org/img/wn/';
const WEATHER_API_BIG_SIZE_PARAM = '@2x';
const WEATHER_API_ICON_EXTENSION = '.png';


export default {
  name: 'WeatherInfoDisplay',

  components: {
    WeatherInfoUnitSelection,
  },

  data() {
    return {
      units: undefined,
    };
  },

  props: {
    weatherCurrent: {
      type: Object,
      required: true,
      validator(weatherObject) {
        return ('main' in weatherObject);
      },
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

    convertTemperatureFromKelvin(temperature) {
      if (this.units === UNIT_CELCIUS) {
        return temperature - 273.15;
      } else {
        return (temperature * (9/5)) - 459.67;
      }
    },

    formatTemperature(temperature) {
      return Math.round(this.convertTemperatureFromKelvin(temperature));
    },

    weekdayName(dateStr) {
      let weekdayNumber = ((new Date(dateStr).getDay() + 7) % 7) + 1;
      return WEEKDAYS_NAMES[weekdayNumber];
    },

    weatherIconUrl(iconId, big = false) {
      let iconPart = big ? (iconId + WEATHER_API_BIG_SIZE_PARAM) : iconId;
      return WEATHER_API_ICON_URL_BASE + iconPart + WEATHER_API_ICON_EXTENSION;
    },
  },
};
</script>


<template>
  <div class="WeatherInfoDisplay">
    <div class="WeatherInfoDisplay-topRow">
      <!-- Current weather -->
      <div class="WeatherInfoDisplay-today">
        <!-- Icon with weather symbol -->
        <img
          :src="weatherIconUrl(weatherCurrent.weather[0].icon, true)"
          :alt="weatherCurrent.weather[0].description"
          class="WeatherInfoDisplay-todayIcon"
        />

        <span class="WeatherInfoDisplay-todayTemperatures">
          <span class="WeatherInfoDisplay-todayCurrent">
            {{ formatTemperature(weatherCurrent.main.temp) }}°
          </span>

          <span class="WeatherInfoDisplay-todayExtremes">
            {{ formatTemperature(weatherCurrent.main.temp_min) }} /
            {{ formatTemperature(weatherCurrent.main.temp_max) }}°
          </span>
        </span>
      </div>

      <!-- Toggle for changing units -->
      <WeatherInfoUnitSelection
        @celciusSelected="changeUnitsToCelcius()"
        @fahrenheitSelected="changeUnitsToFahrenheit()"
        class="WeatherInfoDisplay-unitToggle"
      />
    </div>

    <!-- Forecast for the next 5 days -->
    <ul class="WeatherInfoDisplay-forecast">
      <li
        v-for="[weekday, { max, min, icon }] in weatherForecastProcessed"
        class="WeatherInfoDisplay-forecastDay"
      >
        <!-- Icon with weather symbol -->
        <img
          :src="weatherIconUrl(icon.id)"
          :alt="icon.description"
          class="WeatherInfoDisplay-forecastDayIcon"
        />

        <span class="WeatherInfoDisplay-forecastDayDetails">
          <!-- Name of the day -->
          <span class="WeatherInfoDisplay-forecastDayName">
            {{ weekday }}
          </span>
          <!-- Min and max temperatures -->
          {{ formatTemperature(max) }}/{{ formatTemperature(min) }}°
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
  /* Relative position, so that the buttons can be positioned relatively */
  position: relative;
  grid-area: 'currentWeather';
  display: flex;
  justify-content: center;
  align-items: center;
}


.WeatherInfoDisplay-today {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
}


.WeatherInfoDisplay-todayIcon {
  width: 13rem;
}


.WeatherInfoDisplay-todayTemperatures {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: flex-start;
  font-size: $font-size-xxlarge;
}


.WeatherInfoDisplay-todayCurrent {
  margin-bottom: -2.2rem;
  font-size: $font-size-xxxlarge;
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
  width: 6rem;
  font-size: $font-size-small;
}


.WeatherInfoDisplay-forecastDayDetails {
  font-size: $font-size-large;
}


.WeatherInfoDisplay-forecastDayName {
  text-transform: uppercase;
}
</style>
