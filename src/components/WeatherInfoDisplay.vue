<!--
  Part of weather widget which actually displays the weather data
-->


<script>
import WeatherInfoForecast from '@/components/WeatherInfoForecast'; 
import WeatherInfoIcon from '@/components/WeatherInfoIcon';
import WeatherInfoToday from '@/components/WeatherInfoToday'; 
import { default as WeatherInfoUnitSelection, UNIT_CELCIUS, UNIT_FAHRENHEIT }
  from '@/components/WeatherInfoUnitSelection'; 


export default {
  name: 'WeatherInfoDisplay',

  components: {
    WeatherInfoForecast,
    WeatherInfoIcon,
    WeatherInfoToday,
    WeatherInfoUnitSelection,
  },

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
    <WeatherInfoForecast
      :weatherForecast="weatherForecast"
      :units="units"
      class="WeatherInfoDisplay-forecast"
    />
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
}
</style>
