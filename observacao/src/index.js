const express = require("express");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
//const bodyParser = require("body-parser");

const app = express();
//app.use(bodyParser.json());
app.use(express.json());

const observacoesPorLembreteId = {};

const funcoes = {
  ObservacaoClassificada: (observacao) => {
    const observacoes = observacoesPorLembreteId[observacao.lembreteId];
    const obsParaAtualizar = observacoes.find((o) => o.id === observacao.id);
    obsParaAtualizar.status = observacao.status;
    axios.post("http://192.168.0.173:10000/eventos", {
      tipo: "ObservacaoAtualizada",
      dados: {
        id: observacao.id,
        texto: observacao.texto,
        lembreteId: observacao.lembreteId,
        status: observacao.status,
      },
    });
  },
};

app.get("/lembrete/:id/observacao", (req, res) => {
  res.send(observacoesPorLembreteId[req.params.id] || []);
});

//:id é um placeholder
app.put("/lembrete/:id/observacao", async (req, res) => {
  const idObs = uuidv4();
  const { texto } = req.body;
  //req.params dá acesso à lista de parâmetros da URL
  const observacoesDoLembrete = observacoesPorLembreteId[req.params.id] || [];
  //observacoesDoLembrete.push({ id: idObs, texto }); - antes
  observacoesDoLembrete.push({ id: idObs, texto, status: "aguardando" }); //atualização referente ao microsserviço de classificação
  observacoesPorLembreteId[req.params.id] = observacoesDoLembrete;
  await axios.post("http://192.168.0.173:10000/eventos", {
    tipo: "ObservacaoCriada",
    dados: {
      id: idObs,
      texto,
      lembreteId: req.params.id,
      status: "aguardando",
    },
  });
  res.status(201).send(observacoesDoLembrete);
});

app.post("/eventos", (req, res) => {
  //console.log(req.body);
  //funcoes[req.body.tipo](req.body.dados);
  //res.status(200).send({ msg: "ok" });

  try {
    funcoes[req.body.tipo](req.body.dados);
  } catch (err) {}
  res.status(200).send({ msg: "ok" });
});

app.listen(5000, () => {
  console.log("Lembretes. Porta 5000");
});
