<!--
  Widget fetching and displaying weather after small user interaction
-->


<script>
import WeatherInfoDisplay from '@/components/WeatherInfoDisplay.vue';


// States the component can be in
const STATE_INITIAL = 'initial';
const STATE_LOCATING = 'locating';
const STATE_WEATHER_FETCHED = 'weatherFetched';
const STATE_FAILED = 'failed';

// Weather API settings
const WEATHER_API_URL_BASE_CURRENT = 'http://api.openweathermap.org/data/2.5/weather';
const WEATHER_API_URL_BASE_FORECAST = 'http://api.openweathermap.org/data/2.5/forecast';
const WEATHER_API_KEY_LATITUDE = 'lat';
const WEATHER_API_KEY_LONGITUDE = 'lon';
const WEATHER_API_KEY_COUNT = 'cnt';
const WEATHER_API_KEY_APIKEY = 'APPID';
const WEATHER_API_APIKEY = '081736222a23e791d6ca872f9b0d0cc0';
// When forecast for next days is returned, how many forecasts in the list
// are for a single day
const WEATHER_API_FORECAST_ENTRIES_PER_DAY = 8;

// The number of days for which the forecast is fetched
export const WEATHER_FORECAST_DAYS = 5;


export default {
  name: 'WeatherInfo',

  components: {
    WeatherInfoDisplay,
  },

  data() {
    return {
      state: STATE_INITIAL,
      location: undefined,
      weatherCurrent: undefined,
      weatherForecast: undefined,
    };
  },

  computed: {
    isStateInitial() {
      return this.state === STATE_INITIAL;
    },

    isStateLocating() {
      return this.state === STATE_LOCATING;
    },

    isStateWeatherFetched() {
      return this.state === STATE_WEATHER_FETCHED;
    },

    isStateFailed() {
      return this.state === STATE_FAILED;
    },

    weatherApiStandardParameters() {
      return (
        `?${WEATHER_API_KEY_APIKEY}=${WEATHER_API_APIKEY}` +
        `&${WEATHER_API_KEY_LATITUDE}=${this.location.coords.latitude}` +
        `&${WEATHER_API_KEY_LONGITUDE}=${this.location.coords.longitude}`
      );
    },

    weatherApiUrlCurrent() {
      return WEATHER_API_URL_BASE_CURRENT + this.weatherApiStandardParameters;
    },

    weatherApiUrlForecast() {
      let count = WEATHER_API_FORECAST_ENTRIES_PER_DAY * WEATHER_FORECAST_DAYS;
      return (
        WEATHER_API_URL_BASE_FORECAST +
        this.weatherApiStandardParameters +
        `&${WEATHER_API_KEY_COUNT }=${count}`
      );
    },
  },

  methods: {
    getWeather() {
      this.getLocation();
    },

    getLocation() {
      this.state = STATE_LOCATING;

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          // Success callback
          (position) => {
            this.location = position;
            this.fetchWeatherData();
          },
          // Failure callback
          this.makeStateFailed,
        );
      } else {
        this.makeStateFailed();
      }
    },

    fetchWeatherData() {
      Promise.all([
        fetch(this.weatherApiUrlCurrent),
        fetch(this.weatherApiUrlForecast),
      ])
        .then(([responseCurrent, responseForecast]) => {
          if (responseCurrent.ok && responseForecast.ok) {
            return Promise.all([
              responseCurrent.json(),
              responseForecast.json()
            ]);
          } else {
            throw new Error('Invalid response');
          }
        })
        .then(([weatherCurrent, weatherForecast]) => {
          this.weatherCurrent = weatherCurrent;
          this.weatherForecast = weatherForecast;
          console.log(weatherForecast);
          this.state = STATE_WEATHER_FETCHED;
        })
        .catch(this.makeStateFailed);
    },

    makeStateFailed() {
      this.state = STATE_FAILED;
    },
  },
}
</script>


<template>
  <div class="WeatherInfo">
    <!-- Initial state: button to initiate the process -->
    <button
      v-if="isStateInitial"
      @click="getWeather()"
      class="WeatherInfo-getButton"
    >
      Get the weather
    </button>

    <!-- Messages shown while request is being made -->
    <span
      v-if="isStateLocating || isStateFailed"
      class="WeatherInfo-stateText"
    >
      <template v-if="isStateLocating">
        Locating...
      </template>
      <template v-if="isStateFailed">
        Unable to retrieve the information at this moment
      </template>
    </span>

    <!-- Displaying weather when it's fetched -->
    <WeatherInfoDisplay
      v-if="isStateWeatherFetched"
      :weatherCurrent="weatherCurrent"
      :weatherForecast="weatherForecast"
    />
  </div>
</template>


<style scoped lang="scss">
@import '@/assets/styles/shared/_settings.scss';


$panel-width-to-height-factor: 0.8;
$panel-width: 80vw;
$panel-height: $panel-width-to-height-factor * $panel-width;
$panel-min-width: 45rem;
$panel-max-width: 50rem;
$panel-min-height: $panel-width-to-height-factor * $panel-min-width;
$panel-max-height: $panel-width-to-height-factor * $panel-max-width;


.WeatherInfo {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  border-radius: $border-radius;
  border: $border-width $border-style $border-color;
  width: $panel-width;
  height: $panel-height;
  min-width: $panel-min-width;
  min-height: $panel-min-height;
  max-width: $panel-max-width;
  max-height: $panel-max-height;
  background-color: $color-grey-dark;
  text-align: center;
}


.WeatherInfo-getButton {
  border-radius: $border-radius;
  padding: 0.5rem 1rem;
  color: $color-black;
  background-color: $color-white;

  &:hover {
    background-color: $color-grey-light;
    cursor: pointer;
  }
}


.WeatherInfo-stateText {
  font-size: $font-size-xlarge;
  max-width: 300px;
}
</style>
