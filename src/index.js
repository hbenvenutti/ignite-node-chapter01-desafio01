const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find((user) => user.username === username)

  if (!user) return responde.status(404).json({error: "Mensagem de erro"})

  request.user = user;

  next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username} = request.body;
  
  const userAlreadyExists = users.some((user) => user.username === username)

  if (userAlreadyExists) return response.status(400).json({error: "Mensagem de erro"})
  
  const user = {
    id: uuidv4(),
    name, 
    username,
    todos: []
  }

  users.push(user)

  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request

  return response.status(201).json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;
  
  const todo = {
    id: uuidv4(),
    title,
    deadline: new Date(deadline),
    created_at: new Date(),
    done: false
  }

  user.todos.push(todo);

  users.map(storedUser => {
    if (storedUser.username === user.username) {
      storedUser = user
    }
  })

  return response.status(201).json(todo)

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;  

  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({error: "Mensagem de erro"});
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(201).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {id} = request.params;
  const { user } = request;
  
  const todo = user.todos.find(todo => todo.id === id);

  if (!todo) return response.status(404).json({error: "Mensagem de erro"});

  todo.done = true

  return response.status(201).json(todo);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {id} = request.params;
  const { user } = request;

  const todoIndex = user.todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return response.status(404).json({error: "Mensagem de erro"});
  }

  user.todos.splice(todoIndex, 1)

  return response.status(204).json()

});

module.exports = app;