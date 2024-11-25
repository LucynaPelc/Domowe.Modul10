export function fetchCountries(name) {
    const url = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`

    return fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        return response.json();
    });
}


import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

// Funkcja renderująca listę krajów
function renderCountries(countries) {
  countryList.innerHTML = countries
    .map(
      country => `<li>
        <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="50">
        <span>${country.name.official}</span>
      </li>`
    )
    .join('');
}

// Funkcja renderująca dane pojedynczego kraju
function renderCountry(country) {
  countryInfo.innerHTML = `
    <div>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="100">
      <h1>${country.name.official}</h1>
      <p><strong>Capital:</strong> ${country.capital}</p>
      <p><strong>Population:</strong> ${country.population}</p>
      <p><strong>Languages:</strong> ${Object.values(country.languages).join(', ')}</p>
    </div>
  `;
}

// Funkcja obsługująca wyszukiwanie krajów
function handleSearch(event) {
  const query = event.target.value.trim();
  if (!query) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }

  fetchCountries(query)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
      } else if (countries.length >= 2 && countries.length <= 10) {
        renderCountries(countries);
        countryInfo.innerHTML = '';
      } else if (countries.length === 1) {
        renderCountry(countries[0]);
        countryList.innerHTML = '';
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
    });
}

// Debounce input
searchBox.addEventListener('input', debounce(handleSearch, 300));



.catch(error => {
    Notiflix.Notify.failure('Oops, there is no country with that name');
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  });