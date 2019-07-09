import { expect } from 'chai';
import Vue from 'vue';

import WeatherInfoDisplay from '@/components/WeatherInfoDisplay.vue';


// Kelvin to Fahrenheit conversions are not round, so the float rounding errors
// need to be accounted for
const DELTA_FAHRENHEIT = 0.01;


describe('WeatherInfoDisplay.vue', () => {
  let component = new Vue(WeatherInfoDisplay);
  let convert = component.convertTemperatureFromKelvin;

  it('converts the temperature properly from Kelvin to Celcius', () => {
    component.changeUnitsToCelcius();

    expect(convert(0)).to.equal(-273.15);
    expect(convert(1)).to.equal(-272.15);
    expect(convert(273.15)).to.equal(0);
    expect(convert(300.15)).to.equal(27);
    expect(convert(373.15)).to.equal(100);
  });

  it('converts the temperature properly from Kelvin to Fahrenheit', () => {
    component.changeUnitsToFenhrenheit();

    expect(convert(0)).to.be.closeTo(-459.67, DELTA_FAHRENHEIT);
    expect(convert(100)).to.be.closeTo(-279.67, DELTA_FAHRENHEIT);
    expect(convert(255.372222222222)).to.be.closeTo(0, DELTA_FAHRENHEIT);
    expect(convert(305)).to.be.closeTo(89.33, DELTA_FAHRENHEIT);
    expect(convert(310.927777777778)).to.be.closeTo(100, DELTA_FAHRENHEIT);
  });
});
