import './css/styles.css';
import { fetchCountries } from './fetchCountries'
var debounce = require('lodash.debounce');
import Notiflix from 'notiflix';

const refs = {
    input: document.querySelector('input#search-box'),
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info'),
}
const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(onSearchBox, DEBOUNCE_DELAY))

function onSearchBox(evt) {
    console.log('INPUT');
    const search = evt.target.value.trim();
    if (search) {
        fetchCountries(search).then(r => renderFetchCountry(r)
        ).catch(err => console.log(err))
    } 
    clearInfo();
    clearList();
    
}


function createListItemsMarkup(country) {
    if (country.length === 1) {
        clearList();
        return country.map(({ name, capital, population, flags, languages }) =>
            `<h2><img src='${flags.svg}' width='30'>${name.common}</h2>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><b>Population:</b> ${population}</p>
            <p><b>languages:</b> ${Object.values(languages)}`).join('');
    } else {
        clearInfo()
        return country.map(({ name, flags }) =>
        `<li class='country-list__item'><img src='${flags.svg}' width='30'>${name.common}</li>`).join('');
    }
    
}

function renderFetchCountry(r){
            if (!r.status) {
                if (r.length > 10) {
                    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                } else {
                    console.log(r);
                    clearList();

                    const listItemMarkup = createListItemsMarkup(r);
                    
                    if (r.length === 1) {
                        populateInfo(listItemMarkup);
                    } else {
                        populateList(listItemMarkup);
                    }
                    
                }
            } else {
                Notiflix.Notify.failure('Oops, there is no country with that name'); 
            }
}

function populateList(markup) {
    refs.list.innerHTML = markup;
}

function populateInfo(markup) {
    refs.info.innerHTML = markup;
}

function clearList() {
  refs.list.innerHTML = '';
}

function clearInfo() {
  refs.info.innerHTML = '';
}