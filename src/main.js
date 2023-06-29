import { Notyf } from 'notyf';
import getJSON from './http';
import { capitalize, isEmpty } from './helpers';

const form = document.querySelector('#form');
const input = document.querySelector('#input');
const cityScreen = document.querySelector('#city-screen');
const weatherScreen = document.querySelector('#weather-screen');
const getBackBtn = document.querySelector('#get-back-btn');
const myCityBtn = document.querySelector('#my-city-btn');

const API_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${
  import.meta.env.VITE_API_KEY
}&units=metric`;

class App {
  _cityName = '';
  _data = {};
  _coords = {};

  constructor() {
    form.addEventListener('submit', this.#handleSubmit.bind(this));
    input.addEventListener('keyup', this.#cityNameChange.bind(this));
    getBackBtn.addEventListener('click', this.#showCityScreen.bind(this));
    myCityBtn.addEventListener('click', this.#showMyCityWeather.bind(this));
  }

  async #handleSubmit(e) {
    if (e) {
      e.preventDefault();
    }

    if (!this._cityName.trim() && isEmpty(this._coords)) {
      this.#showError();
    }

    try {
      let data;
      if (this._cityName) {
        data = await getJSON(`${API_URL}&q=${this._cityName}`);
      } else {
        data = await getJSON(
          `${API_URL}&lat=${this._coords.lat}&lon=${this._coords.lon}`
        );
      }

      this._data = data;
      cityScreen.classList.add('hidden');
      weatherScreen.classList.remove('hidden');
      this.#displayWeather();
    } catch (e) {
      this.#showError(e);
    } finally {
      this._cityName = '';
      this._coords = {};
      input.value = '';
    }
  }

  #displayWeather() {
    const {
      name,
      main: { temp, feels_like },
      sys: { country },
    } = this._data;

    weatherScreen.querySelector('.screen__data').innerHTML = `
    <img class="weather-img" src="http://openweathermap.org/img/wn/${this._data.weather[0].icon}@2x.png" />
      <div class="city-name">
        <img src="https://flagsapi.com/${country}/flat/32.png">
        <h3 class="heading-thirsty">${name}</h3>
      </div>
      <h2 class="heading-primary">${temp}°C</h2>
      <h4 class="heading-thirsty">feels like ${feels_like}°C</h4>
    `;
  }

  #showError(message) {
    message = capitalize(message);
    new Notyf().error({
      message,
      duration: 5000,
      position: { x: 'center', y: 'top' },
    });
  }

  #cityNameChange() {
    this._cityName = input.value;
  }

  #showCityScreen() {
    cityScreen.classList.remove('hidden');
    weatherScreen.classList.add('hidden');
  }

  async #showMyCityWeather() {
    const {
      coords: { latitude: lat, longitude: lon },
    } = await this.#getMyLocation();
    this._coords = { lat, lon };
    this.#handleSubmit();
  }

  #getMyLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
}

const app = new App();
