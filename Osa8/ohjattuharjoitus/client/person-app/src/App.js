import { gql, useQuery } from '@apollo/client'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import { ALL_PERSONS } from './queries'


const App = () => {
  const result = useQuery(ALL_PERSONS, {
    pollInterval: 2000 //2 sec välein hakee tiedot. Päivittyy kaikilla, mutta turhan paljon tietoliikennettä.
  })

  if (result.loading)  {
    return <div>loading...</div>
  }

  return (
    <>
      <Persons persons={result.data.allPersons}/>
      <PersonForm/>
    </>
  )
}

export default App