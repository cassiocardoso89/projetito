const express = require('express')
const app = express()
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./public/projetito.sqlite')
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(express.json());


app.post('/api/cadastro', (req, res) => {
    const { username, password, tipo } = req.body;
    if (!username || !password || !tipo) {
      res.status(400).send('Preencha todos os campos.' + username +' | '+ password +' | '+ tipo);
      return;
    }
  
    const sql = 'INSERT INTO users (username, password, tipo) VALUES (?, ?, ?)';
    db.run(sql, [username, password, tipo], (err) => {
      if (err) {
        res.status(500).send('Erro ao cadastrar usuário.');
        return;
      }
      res.send('Usuário cadastrado com sucesso.');
    });
  });

//isso nao deve sair nunca, provavelmente
app.listen(3000, () => {
  console.log('Server started on port 3000')
})
