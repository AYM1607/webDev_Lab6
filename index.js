const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const uuid = require("uuid");

const app = express();
app.use(express.static("public"));
app.use(morgan("dev"));

let comments = [
  {
    id: "eed2392f-0c53-4925-b6e7-4d115178f273",
    titulo: "A random comment",
    contenido: "This is a random comment",
    autor: "Mariano Uvalle",
    fecha: new Date().getTime()
  },
  {
    id: "b028b1b6-e19e-421b-a2ee-0f421e3256aa",
    titulo: "Another random comment",
    contenido: "This is another random comment",
    autor: "Jose Uvalle",
    fecha: new Date().getTime()
  },
  {
    id: "9214904f-2b1e-48a2-86bf-00597eccc2ad",
    titulo: "Last random comment",
    contenido: "This is the last random comment",
    autor: "Abby Uvalle",
    fecha: new Date().getTime()
  }
];

app.get("/blog-api/comentarios", (_req, res) => {
  return res.status(200).json(comments);
});

app.get("/blog-api/comentarios-por-autor", (req, res) => {
  const { autor } = req.query;

  if (!autor) {
    res.statusMessage = "El parametro autor es requerido";
    return res.status(406).send();
  }
  const authorComments = comments.filter(comment => comment.autor === autor);
  if (authorComments.length === 0) {
    res.statusMessage = "El autor proporcionado no tienen ningun comentario";
    return res.status(404).send();
  }
  return res.status(200).json(authorComments);
});

app.post("/blog-api/nuevo-comentario", jsonParser, (req, res) => {
  const { titulo, contenido, autor } = req.body;
  if (!(titulo && contenido && autor)) {
    res.statusMessage =
      "Los parametros titulo, contenido y autor son requeridos en el cuerpo.";
    return res.status(406).send();
  }
  const newComment = {
    titulo,
    contenido,
    autor,
    id: uuid.v4(),
    fecha: new Date().getTime()
  };
  comments.push(newComment);
  return res.status(200).json(newComment);
});

app.delete("/blog-api/remover-comentario/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  const commentIndex = comments.findIndex(comment => comment.id === id);
  console.log(commentIndex);
  if (commentIndex === -1) {
    res.statusMessage = "No existe un comentario con el id especificado.";
    return res.status(404).send();
  }
  comments.splice(commentIndex, 1);
  return res.status(204).json({});
});

app.put("/blog-api/actualizar-comentario/:id", jsonParser, (req, res) => {
  const paramId = req.params.id;
  const { id, titulo, contenido, autor, fecha } = req.body;
  if (!id) {
    res.statusMessage = "El parametro id es requerido en el cuerpo";
    return res.status(406).send();
  }
  if (id !== paramId) {
    res.statusMessage =
      "El id proporcionado en el cuerpo y en el url no coinciden";
    return res.status(409).send();
  }
  if (!(titulo || contenido || autor || fecha)) {
    res.statusMessage =
      "Al menos uno de los parametros titulo, contenido, autor o fecha deben ser proporcionados";
    return res.status(406).send();
  }
  const commentIndex = comments.findIndex(comment => comment.id === id);
  if (commentIndex === -1) {
    res.statusMessage = "No existe un comentario con el id especificado.";
    return res.status(404).send();
  }
  comments[commentIndex] = {
    ...comments[commentIndex],
    ...(titulo && { titulo }),
    ...(contenido && { contenido }),
    ...(autor && { autor }),
    ...(fecha && { fecha })
  };
  return res.status(202).json(comments[commentIndex]);
});

app.listen(8080, () => {
  console.log("App is running on port 8080");
});
