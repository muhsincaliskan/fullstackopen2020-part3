const mongoose = require('mongoose')

let newName, newNumber
const personSchema = new mongoose.Schema({
  name: String,
  number: String,

})
const listAll = () => {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}
else if (process.argv.length === 3) listAll()
else {
  newName = process.argv[3].replace(/"/g, '')
  newNumber = process.argv[4]
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@cluster0.wyfwh.mongodb.net/person-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
const Person = mongoose.model('Person', personSchema)
const person = new Person({
  name: newName,
  number: newNumber,
})

person.save().then(result => {
  console.log(result)
  mongoose.connection.close()
})