import { gql, useQuery } from '@apollo/client'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import { ALL_PERSONS } from './queries'
import {useState} from 'react'
import PhoneForm from './components/PhoneForm'


const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS/*, {
    pollInterval: 2000 //2 sec välein hakee tiedot. Päivittyy kaikilla, mutta turhan paljon tietoliikennettä.
  }*/)

  if (result.loading)  {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <>
      <Notify errorMessage={errorMessage} />
      <Persons persons={result.data.allPersons}/>
      <PersonForm setError={notify}/>
      <PhoneForm/>
    </>
  )
}

export default App