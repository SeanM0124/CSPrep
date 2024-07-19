const express = require('express');
const app = express();
const morgan = require('morgan');
const Contact = require('./models/contacts.js');

const cors = require('cors');
const contacts = require('./models/contacts.js');

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

const alreadyExists = (name) => {
  let contacts = [];
  Contact.find({name: name}).then(result => {
    contacts = result ? result : [];
  });
  return contacts.some(contact => contact.name === name);
}

const getIdByName = (name) => {
  contacts.find({name: name}).then(result => {
    return result._id;
  })
} 


app.get('/api/persons', (request, response) => {
  Contact.find({}).then(persons => {
    response.json(persons)
  })
});

app.get('/info', (request, response) => {
  let time = new Date();
  let string = `Phonebook has info for ${Contact.length} people`;
  response.send(`<p>${string}</p><p>${time}</p>`);
})

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact);
      } else {
        response.json(404).end();
      }
   })
   .catch(error => next(error));
}) 

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  const person = new Contact({
    name: body.name,
    number: body.number || '',
  })

  person.save().then(savedPerson => {
    response.json(savedPerson);
  })
  .catch(error => next(error));
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  let id = request.params.id ? request.params.id : getIdByName(body.name);

  Contact.findByIdAndUpdate(id, { name, number }, {new: true, runValidators: true, context: 'query' })
    .then(updatedContact => {
      response.json(updatedContact)
    })
    .catch(error => next(error));
})

app.delete('/api/persons/:id', (request, response) => {
  Contact.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformated id' });
  } else if (error.name === 'ValdiationError') {
    return response.status(400).json({ error: error.message });
  }
  next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});