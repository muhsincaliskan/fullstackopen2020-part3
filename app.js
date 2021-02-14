const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const www = process.env.WWW || './';

let persons=[ {
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
console.log(`serving ${www}`);
app.get('/', (req, res) => {
    res.send(`<h1>home page</h1>`);
});
app.get('/persons', (req, res) => {
    res.json(persons);
});
app.listen(port, () => console.log(`listening on http://localhost:${port}`));
