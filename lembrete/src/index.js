const express = require("express");
const axios = require("axios");
//const bodyParser = require("body-parser");

const app = express();
//app.use(bodyParser.json());
app.use(express.json()); //pode ser assim

const lembretes = {};
contador = 0;

//método para obter os lembretes
app.get("/lembrete", (req, res) => {
  res.send(lembretes);
});

//método para inserir/criar um novo lembrete
app.put("/lembrete", async (req, res) => {
  contador++;
  const { texto } = req.body;
  lembretes[contador] = {
    contador,
    texto,
  };
  await axios.post("http://192.168.0.173:10000/eventos", {
    tipo: "LembreteCriado",
    dados: {
      contador,
      texto,
    },
  });
  res.status(201).send(lembretes[contador]);
});

app.post("/eventos", (req, res) => {
  console.log(req.body);
  res.status(200).send({ msg: "ok" });
});

//porta
app.listen(4000, () => {
  console.log("Lembretes. Porta 4000");
});
