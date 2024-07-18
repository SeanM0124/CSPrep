import { useState, useEffect } from 'react'
import countryService from './services/countries';
import './App.css'

const langaugesToArray = (languagesObj) => {
  return Object.keys(languagesObj).map(key => languagesObj[key]);
}

const Filter = props => {
  return (
    <>
      <form>
        Find countries: <input onChange={props.filterChange}/>
      </form>
    </>
  )
}

const Country = props => {
  return (
    <>
      <form onSubmit={(event) => props.showCountry(event, props.name)}>
        {props.name} <button type="submit">show</button>
      </form>
    </>
  )
}

const Languages = props => {
  return (
    <>
      {props.language}
    </>
  )
}

const ACountry = props => {
  return (
    <>
      <h2>{props.name}</h2>
        <p>Capital: {props.capital}</p>
        <p>Area: {props.area}</p>
      <h3>Languages:</h3>
      {props.languages.map(lang =>
        <li key={lang}><Languages language={lang}/></li>
      )}
      <img src={props.flag}></img>
    </>
  )
}

const Countries = props => {
  if (props.countries.length <= 10 && props.countries.length > 1) {
    return (
      <>
        {props.countries.map(country =>
          <Country key={country.name.common} name={country.name.common} showCountry={props.showCountry}/>
        )}
      </>
    )
  } else if (props.countries.length > 10) {
    return (
      <>
        <p>
          Too many matches, be more specific.
        </p>
      </>
    )
  } else if (props.countries.length === 1) {
    let country = props.countries[0];
    return (
      <>
        <ACountry name={country.name.common} capital={country.capital[0]} area={country.area} languages={langaugesToArray(country.languages)} flag={country.flags.png}/>
      </>
    )
  } else {
    return (
      <>
        <p>
          No matches
        </p>
      </>
    )
  }

}

const Main = props => {
  return (
    <>
      <Filter filterChange={props.filterChange}/>
      <Countries countries={props.countries} showCountry={props.showCountry}/>
    </>
  )
}

function App() {
  let [countries, setCountries] = useState([]);
  let [filter, setFilter] = useState('');

  useEffect(() => {
    setFilter('');
    setCountries([]);
  }, []);

  const handleFilterChange = (event) => {
    event.preventDefault();
    setFilter(event.target.value.toLowerCase());
    countryService.getAll()
    .then(response => {
      let countryFiltered = response.data.filter(val => val.name.common.toLowerCase().includes(filter));
      setCountries(countryFiltered);
    })
  }

  const showCountry = (event, name) => {
    event.preventDefault();
    countryService
    .getCountry(name.toLowerCase())
    .then(response => {
      setFilter(name);
      setCountries([response.data]);
    })
  }

  return (
    <Main filterChange={handleFilterChange} countries={countries} showCountry={showCountry}/>
  )
}

export default App
