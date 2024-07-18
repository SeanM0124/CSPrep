const express = require('express');
const app = express();
const morgan = require('morgan');

const cors = require('cors')

app.use(cors());
app.use(express.static('dist'));

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res)
  ].join(' ')
}));

app.use(express.json());

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

const alreadyExists = (name) => {
  return persons.some(person => person.name === name);
}

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]


app.get('/api/persons', (request, response) => {
  response.json(persons)
});

app.get('/info', (request, response) => {
  let time = new Date();
  let string = `Phonebook has info for ${persons.length} people`;
  response.send(`<p>${string}</p><p>${time}</p>`);
})

app.get('/api/persons/:id', (request, response) => {
  let id = request.params.id;
  let contact = persons.find(person => person.id === id);

  if(contact) {
    response.json(contact);
  } else {
    response.status(404).end();
  }
}) 

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number || alreadyExists(body.name)) {
    console.log('error');
    return response.status(400).json({
      error: 'error'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person);
  response.json(person);
})

app.delete('/api/persons/:id', (request, response) => {
  let id = request.params.id;
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});