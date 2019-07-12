/*
 * Methods for formatting/displaying information from weather API shared
 * between multiple components
 */


import { UNIT_CELCIUS } from '@/components/WeatherInfoUnitSelection'; 


const WEEKDAYS_NAMES = {
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
  7: 'Sun',
};


export default {
  methods: {
    convertTemperatureFromKelvin(temperature, targetUnits) {
      if (targetUnits === UNIT_CELCIUS) {
        return temperature - 273.15;
      } else {
        return (temperature * (9/5)) - 459.67;
      }
    },

    formatTemperature(temperature, targetUnits) {
      return Math.round(
        this.convertTemperatureFromKelvin(temperature, targetUnits)
      );
    },

    weekdayName(dateStr) {
      let weekdayNumber = ((new Date(dateStr).getDay() + 7) % 7) + 1;
      return WEEKDAYS_NAMES[weekdayNumber];
    },
  },
};
