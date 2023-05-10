import { ALL_AUTHORS } from "../queries"
import { useQuery } from '@apollo/client'
import { useState } from "react"
import SetBirthYear from "./SetBirthYear"


const Authors = (props) => {

  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_AUTHORS)
  console.log(result)

  if (!props.show) {
    return null
  }
  //const authors = []

  if (result.loading)  {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetBirthYear/>
    </div>
  )
}

export default Authors
