<script>
export const UNIT_CELCIUS = 'celcius';
export const UNIT_FAHRENHEIT = 'fahrenheit';


export default {
  name: 'WeatherInfoUnitSelection',


  data() {
    return {
      selectedUnits: undefined,
    };
  },

  computed: {
    isCelciusSelected() {
      return (this.selectedUnits === UNIT_CELCIUS);
    },

    isFahrenheitSelected() {
      return (this.selectedUnits === UNIT_FAHRENHEIT);
    },
  },

  methods: {
    selectCelcius() {
      this.selectedUnits = UNIT_CELCIUS;
      this.$emit('celciusSelected');
    },

    selectFahrenheit() {
      this.selectedUnits = UNIT_FAHRENHEIT;
      this.$emit('fahrenheitSelected');
    },
  },

  mounted() {
    // Select Celcius as default units
    this.selectCelcius();
  },
};
</script>


<template>
  <div class="WeatherInfoUnitSelection">
    <button
      class="WeatherInfoUnitSelection-unitButton"
      :class="{ 'WeatherInfoUnitSelection--isActive': isCelciusSelected }"
      aria-label="Celcius"
      @click="selectCelcius()"
    >
      C
    </button>
      <button
        class="WeatherInfoUnitSelection-unitButton"
        :class="{ 'WeatherInfoUnitSelection--isActive': isFahrenheitSelected }"
        aria-label="Fahrenheit"
        @click="selectFahrenheit()"
      >
        F
      </button>
  </div>
</template>


<style scoped lang="scss">
@import '@/assets/styles/shared/_settings.scss';



.WeatherInfoUnitSelection {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}

.WeatherInfoUnitSelection-unitButton {
  $size: 3rem;

  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid $color-white;
  width: $size;
  height: $size;

  &:hover {
    cursor: pointer;
  }

  & + & {
    margin-left: 0.8rem;
  }

  &.WeatherInfoUnitSelection--isActive {
    border: none;
    color: $color-grey-dark;
    background-color: $color-white;
  }
}
</style>
