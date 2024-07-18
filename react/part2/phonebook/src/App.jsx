import { useState, useEffect } from 'react';
import personService from './services/persons'


const Notification = ({ message }) => {
  if (message.type === null) {
    return null
  }

  if (message.type === 'error') {
    return (
      <div className='error'>
        {message.text}
      </div>
    )
  } else {
    return (
      <div className='good'>
        {message.text}
      </div>
    )
  }
}

const Person = (props) => {
  return (
    <>
      <form onSubmit={() => props.deletePerson(props.id, props.name)}>
        <p>
          {props.name} {props.number} <button type="submit">delete</button>
        </p>
      </form>
    </>
  )
}

const Filter = (props) => {
  return (
    <div>
      <form>
        Filter shown with: <input onChange={props.onChange}/>
      </form>
    </div>
  )
}

const Form = props => {
  return (
    <>
      <form onSubmit={props.addPerson}>
        <div>
          name: <input onChange={props.handleNameChange}/>
        </div>
        <div>
          number: <input onChange={props.handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

    </>
  )
}

const Persons = props => {
  return (
    <>
      {props.filtered.map(person => 
          <Person key={person.name} name={person.name} number={person.number} id={person.id} deletePerson={props.deleteContact}/>
        )}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filtered, setFiltered] = useState(persons);
  const [errorMessage, setErrorMessage] = useState({text: 'Some Error occurred', type: null});

  useEffect(() => {
    personService.getAll()
    .then(response => {
      setPersons(response.data)
      setFiltered(response.data)
    })
  }, [])


  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber
    }

    let names = persons.map(val => val.name)

    if (names.some(val => val === personObject.name)) { //This contact name exists already
      let currPerson = persons.filter(val => val.name == personObject.name)[0];
      console.log(currPerson.number, personObject.number);
      if (currPerson.number === personObject.number) { //existing cotnact with same data
        setErrorMessage({text: 'That contact already exists with that number', type: 'error'})
        setTimeout(() => {
          setErrorMessage({text: '', type: null})
        }, 5000)
      } else { //Update a contact
        if (window.confirm('Would you like to update this contacts number?')) {
          personService.update(currPerson.id, personObject)
          .then(response => {
            setPersons(persons.concat(response.data));
            setFiltered(persons);
            setNewName('');
            setErrorMessage({text: `Updated ${currPerson.name}`, type: 'good'});
            setTimeout(() => {
              setErrorMessage({text: '', type: null})
            }, 5000)
          })
          // eslint-disable-next-line no-unused-vars
          .catch(_ => {
            setErrorMessage({text:`${currPerson.name} was already removed from server`, type: 'error'});
            setTimeout(() => {
              setErrorMessage({text: '', type: null});
            }, 5000)
          })
        }
      }
    } else { //Create and add contact
      personService
      .create(personObject)
      .then(response => {
        persons.concat(response.data)
        setPersons(...persons.slice());
        setFiltered(persons.slice());
        setNewName('');
        setErrorMessage({text: `Added ${personObject.name}`, type: 'good'})
        setTimeout(() => {
          setErrorMessage({text: '', type: null})
        }, 5000)
      })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleFilterChange = (event) => {
    let filter = event.target.value.toLowerCase();
    let filteredPeople = persons.filter(val => val.name.toLowerCase().includes(filter));
    setFiltered(filteredPeople);
  }

  const handleDeleteButton = (id, name) => {
    if (window.confirm(`Delete ${name}'s contact?`)) {
      personService.deleteContact(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id));
        setFiltered(persons);
        setErrorMessage({text: `${name}'s contact has been deleted`, type: 'good'})
        setTimeout(() => {
          setErrorMessage({text: '', type: null})
        }, 5000)
      })
    }
  }

  return (
    <div>
      <h2>Phonebook:</h2>
        <Notification message={errorMessage}/>
        <Filter onChange={handleFilterChange}/>
      <h2>Add a new Contact: </h2>
        <Form addPerson={addPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
        <Persons filtered={filtered} deleteContact={handleDeleteButton}/>
    </div>
  )
}

export default App