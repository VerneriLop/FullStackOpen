import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_BORN } from '../queries'
import { useQuery } from '@apollo/client'
import Select from 'react-select';


const SetBirthYear = (props) => {
  //const [name, setName] = useState('')
  const result = useQuery(ALL_AUTHORS)
  const [setBornTo, setBornYear] = useState('')
  const [selected, setSelected] = useState(null);

  const [ changeBorn ] = useMutation(EDIT_BORN, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const submit = async (event) => {
    event.preventDefault()
    const name = selected.value

    changeBorn({ variables: { name, setBornTo } })

    //setName('')
    setBornYear('')
  }

  const authors = result.data.allAuthors

  const authorOptions = authors.map((author) => (
    { value: author.name, label: author.name }
  ))

  return (
    <div>
      <h2>Set birthyear</h2>

      <form onSubmit={submit}>
      <div>
          Author
          <Select
            defaultValue={selected}
            onChange={setSelected}
            options={authorOptions}
          />
        </div>
        <div>
          born <input
            value={setBornTo}
            onChange={({ target }) => setBornYear(parseInt(target.value))}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default SetBirthYear