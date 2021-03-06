const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3001
const www = process.env.WWW || './'

morgan.token('bodyContent', (req) => (req.method === 'POST' ? JSON.stringify(req.body) : ' '))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bodyContent'))
app.use(cors())
app.use(express.static('build'))
app.use(express.static(www))
app.use(express.json())

// let persons = [{
//   'name': 'Arto Hellas',
//   'number': '2324239',
//   'id': 1
// },
// {
//   'name': 'Ada Lovelace',
//   'number': '39-44-5323523',
//   'id': 2
// },
// {
//   'name': 'Dan Abramov',
//   'number': '1234455667788',
//   'id': 3
// },
// {
//   'name': 'Mary Poppendieck',
//   'number': '39-23-6423122',
//   'id': 4
// },
// {
//   'name': 'muhsincaliskan',
//   'number': '5555555555',
//   'id': 5
// },
// {
//   'name': 'asdfa',
//   'number': '3452345',
//   'id': 6
// }]

// const generateId = () => {
//   const maxId = persons.length > 0
//     ? Math.max(...persons.map(n => n.id))
//     : 0
//   return maxId + 1
// }

app.get('/', (req, res) => {
  res.send('<h1>home page</h1>')
})
app.get('/api/info', (req, res) => {
  Person.find().countDocuments(function (err, count) {
    if (err) console.log(err)
    else{
      res.send(`<p>phonebook has info for ${count} people</p>
    <p>${new Date()}<p>`)}
  })
})
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
    // mongoose.connection.close()
  })

})
app.get('/api/persons/:id', (request, response,next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})
app.post('/api/persons', (request, response,next) => {
  const body = request.body
  // const isExist = persons.filter(person => person.name.toLowerCase() === body.name.toLowerCase()).length
  // if (isExist) {
  //     return response.status(400).json({
  //         error: 'The name already exists in the phonebook'
  //     })
  // }
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'The name or number is missing'
    })
  }
  else {
    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person.save()
      .then(savedPerson => {response.json(savedPerson.toJSON())})
      .catch(error => next(error))
  }
})
app.delete('/api/persons/:id', (request, response,next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))

})
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
  console.error(error)
  if (error.name === 'Cast Error'&& error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(port, () => console.log(`listening on http://localhost:${port}`))
