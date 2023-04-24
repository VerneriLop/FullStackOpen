const express = require('express');
const app = express();
app.use(express.json());
//web-sovelluksen selaimessa suoritettava JavaScript-koodi saa oletusarvoisesti kommunikoida 
//vain samassa originissa olevan palvelimen kanssa. Koska palvelin on localhostin portissa 3001 
//ja frontend localhostin portissa 3000, niiden origin ei ole sama.
//Voimme sallia muista origineista tulevat pyynnöt käyttämällä Noden cors-middlewarea
const cors = require('cors')
app.use(cors())
app.use(express.static('build')) //osaa tarjoilla staattista html sivua.

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})
  
app.get('/api/notes', (req, res) => {
res.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    console.log(id);
    const note = notes.find(note => note.id === id)
    console.log(note);
  
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id)) //Muodostaa taulukon. Taulukko voidaan muuttaa yksittäisiksi luvuiksi käyttäen taulukon spread-syntaksia ja etsitään sieltä maksimi
      : 0
    return maxId + 1
}
  
app.post('/api/notes', (request, response) => {
const body = request.body

    if (!body.content) {
        return response.status(400).json({ 
        error: 'content missing' 
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)