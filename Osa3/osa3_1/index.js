const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(express.json());
//app.use(morgan('tiny'));

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "04023534612"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "232-23236"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "98765432234567"
    },
]

morgan.token('postData', (req) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))


app.get('/api/persons', (req, res) => {
    res.json(persons)
});

app.get('/info', (req, res) => {
    let response = 
    `<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date}</p>
    </div>`
    res.send(response);
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);
    console.log(person)
    
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id)) //Muodostaa taulukon. Taulukko voidaan muuttaa yksittäisiksi luvuiksi käyttäen taulukon spread-syntaksia ja etsitään sieltä maksimi
      : 0
    return maxId + 1
}
  
app.post('/api/persons', (request, response) => {
const body = request.body

    if (!body.name || !body.number ) {
        return response.status(400).json({ 
        error: 'name or number missing' 
        })
    }

    if (persons.find(p => p.name === body.name)) {
        return response.status(409).json({
            error: 'name is already on use'
        })
    }

    const person = {
        name: body.name,
        important: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);