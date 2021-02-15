const express = require('express');
const morgan = require('morgan')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3001;
const www = process.env.WWW || './';

  
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
 



  morgan.token('bodyContent', (req, res) => (req.method === 'POST' ? JSON.stringify(req.body) : ' '))
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyContent'))
  app.use(cors())
  app.use(express.static('build'))
let persons = [{
    "name": "Arto Hellas",
    "number": "2324239",
    "id": 1
},
{
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
},
{
    "name": "Dan Abramov",
    "number": "1234455667788",
    "id": 3
},
{
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
},
{
    "name": "muhsincaliskan",
    "number": "5555555555",
    "id": 5
},
{
    "name": "asdfa",
    "number": "3452345",
    "id": 6
}]

app.use(express.static(www));
app.use(express.json())
// app.use(unknownEndpoint())

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}


app.get('/', (req, res) => {
    res.send(`<h1>home page</h1>`);
});
app.get('/api/info', (req, res) => {
    res.send(`<p>phonebook has info for ${persons.length} people</p>
    <p>${new Date()}<p>`);
});
app.get('/api/persons', (req, res) => {
    res.json(persons);
});
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    }
    else
        response.status(404).end()

})
app.post('/api/persons', (request, response) => {
    const body = request.body
    const isExist = persons.filter(person => person.name.toLowerCase() === body.name.toLowerCase()).length
    if (isExist) {
        return response.status(400).json({
            error: 'The name already exists in the phonebook'
        })
    }
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'The name or number is missing'
        })
    }
    else {
        const person = {
            name: body.name,
            number: body.number,
            id: generateId(),
        }

        persons = persons.concat(person)
        console.log(person)
        response.json(person)
    }
})
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})
app.use(unknownEndpoint)
app.listen(port, () => console.log(`listening on http://localhost:${port}`));
