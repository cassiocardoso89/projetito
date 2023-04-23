const express = require("express");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./public/projetito.sqlite");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

//#region Cadastro de Conteudo
// app.post("/api/conteudoCad", (req, res) => {
//   const { materia, password, tipo } = req.body;
//   if (!materia || !password || !tipo) {
//     res
//       .status(400)
//       .send(
//         "Preencha todos os campos." + username + " | " + password + " | " + tipo
//       );
//     return;
//   }

//   const sql = "INSERT INTO conteudos (username, password, tipo) VALUES (?, ?, ?)";
//   db.run(sql, [username, password, tipo], (err) => {
//     if (err) {
//       res.status(500).send("Erro ao cadastrar conteúdo.");
//       return;
//     }
//     res.send("Conteúdo cadastrado com sucesso.");
//   });
// });
//#endregion

//#region Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send("Preencha todos os campos.");
    return;
  }

  const sql =
    "SELECT username, password, tipo_id FROM users WHERE username = ? and password = ?";
  db.get(sql, [username, password], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erro no servidor.");
    } else if (row) {
      const { username, tipo_id } = row;
      if (tipo_id === 1) {
        res.sendFile(__dirname + "/public/html/admin.html");
        // res.redirect(`/admin.html?username=${username}`);
      } else if (tipo_id === 2) {
        res.sendFile(__dirname + "/public/html/professor.html");
        // res.redirect(`/professor.html?username=${username}`);
      } else if (tipo_id === 3) {
        res.sendFile(__dirname + "/public/html/aluno.html");
        // res.redirect(`/aluno.html?username=${username}`);
      } else if (tipo_id === null) {
        res.status(401).send("Acesso negado.");
      } else {
        res.status(401).send("Erro ao carregar o TIPO de usuário.");
      }
    } else {
      res
        .status(401)
        .send("Falha na autenticação. Verifique o nome de usuário e senha.");
    }
  });
});


//#endregion

//#region Cadastro de Novo Usuario
app.post("/api/userCad", (req, res) => {
  const { username, email, password, passwordConfirm, tipo_id } =
    req.body;
  if (!username || !email || !password || !passwordConfirm || !tipo_id) {
    res.status(400).send("Preencha todos os campos.");
    return;
  }

  const sql =
    "INSERT INTO users (username, password, email, tipo_id) VALUES (?, ?, ?, ?)";
  db.run(sql, [username, password, email, tipo_id], (err) => {
    if (err) {
      res.status(500).send("Erro ao cadastrar usuário: "+err);
      return;
    }
    res.send("Usuário cadastrado com sucesso.");
  });
});
//#endregion

//#region redirecionar para a pagina principal
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/login.html");
});
//#endregion

//#region IniciarServer
//isso nao deve sair nunca, provavelmente
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
//#endregion
