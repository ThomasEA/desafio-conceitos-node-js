const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function checkUuid( request, response, next) {
  const { id } = request.params;

  if (!isUuid(id))
    return response.status(400).send({error: "Invalid UUID!"});

  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).send(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  
  repositories.push(newRepository);

  return response.status(200).send(newRepository);
});

app.put("/repositories/:id", checkUuid, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id);

  if (repositoryIndex < 0)
    return response.status(404).send("Repository not found!");

  const repository = repositories[repositoryIndex];

  repositories[repositoryIndex] = {...repository, title: title, url: url, techs: techs};

  return response.status(200).send(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", checkUuid, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id);

  if (repositoryIndex < 0)
    return response.status(404).send("Repository not found!");

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkUuid, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id);

  if (repositoryIndex < 0)
    return response.status(404).send("Repository not found!");

  const { likes } = repositories[repositoryIndex];

  repositories[repositoryIndex] = {...repositories[repositoryIndex], likes: likes + 1};

  return response.status(200).send(repositories[repositoryIndex]);
});

module.exports = app;
