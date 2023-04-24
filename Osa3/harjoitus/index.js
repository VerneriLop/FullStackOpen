const express = require('express');
const app = express()
//web-sovelluksen selaimessa suoritettava JavaScript-koodi saa oletusarvoisesti kommunikoida 
//vain samassa originissa olevan palvelimen kanssa. Koska palvelin on localhostin portissa 3001 
//ja frontend localhostin portissa 3000, niiden origin ei ole sama.
//https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
//Voimme sallia muista origineista tulevat pyynnöt käyttämällä Noden cors-middlewarea
const cors = require('cors')
require('dotenv').config()
const Note = require('./models/note')


const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}


app.use(express.json());
app.use(cors())
app.use(express.static('build')) //osaa tarjoilla staattista html sivua.
app.use(requestLogger)




/*let notes = [
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
]*/

/*
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})
*/

/*
app.get('/api/notes', (req, res) => {
res.json(notes)
})
*/

/*
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
*/

//MONGODB OSIO
/*
const mongoose = require('mongoose')

// ÄLÄ KOSKAAN TALLETA SALASANOJA GitHubiin!
const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@cluster0.e6wu6fk.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

const Note = mongoose.model('Note', noteSchema)
*/

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
      response.json(notes)
    })
})

app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
  
    const note = new Note({
      content: body.content,
      important: body.important || false,
    })
  
    note.save().then(savedNote => {
      response.json(savedNote)
    })
})

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
    .then(note => {
        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
        
})

app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body
  
    const note = {
      content: body.content,
      important: body.important,
    }
  
    Note.findByIdAndUpdate(request.params.id, note, { new: true })
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
}
  
app.use(unknownEndpoint)
app.use(errorHandler) //tämä tulee kaikkien muiden middlewarejen rekisteröinnin jälkeen!



const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)