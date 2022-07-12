const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const app = express();

app.use(express.json());

app.use(cors());

morgan.token('json', (request) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body);
  }
})

app.use(morgan(':method :url :response-time ms :json'));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
         <p>${Date()}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).json({
      error: "person doesn't exist",
    });
}});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    persons = persons.filter(p => p.name !== person.name)
  }
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const person = request.body;

  if (persons.find((p) => p.name === person.name)) {
    return response.status(400).json({
      error: "person already exist",
    });
  }

  if (!person.name) {
    return response.status(400).json({
      error: "person name field is missing",
    });
  }

  if (!person.number) {
    return response.status(400).json({
      error: "person number field is missing",
    });
  }

  const newId = Math.round(Math.random() * 1000000);
  person.id = newId;

  persons = persons.concat(person);

  response.json(person);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
