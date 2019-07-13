<!--
  Part of weather widget which actually displays the weather data
-->


<script>
import WeatherInfoDisplayForecast from '@/components/WeatherInfoDisplayForecast'; 
import WeatherInfoDisplayToday from '@/components/WeatherInfoDisplayToday'; 
import { default as WeatherInfoDisplayUnits, UNIT_CELCIUS, UNIT_FAHRENHEIT }
  from '@/components/WeatherInfoDisplayUnits'; 


export default {
  name: 'WeatherInfoDisplay',

  components: {
    WeatherInfoDisplayForecast,
    WeatherInfoDisplayToday,
    WeatherInfoDisplayUnits,
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
      <WeatherInfoDisplayToday
        :weatherCurrent="weatherCurrent"
        :units="units"
      />

      <WeatherInfoDisplayUnits
        class="WeatherInfoDisplay-unitToggle"
        @celciusSelected="changeUnitsToCelcius()"
        @fahrenheitSelected="changeUnitsToFahrenheit()"
      />
    </div>

    <WeatherInfoDisplayForecast
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
  display: flex;
  justify-content: center;
  align-items: center;
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
