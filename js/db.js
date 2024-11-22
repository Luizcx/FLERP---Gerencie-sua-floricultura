const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'flerp'
})

conexao.connect((err) => {
    if (err) {
      console.error('Erro de conexão: ' + err.stack);
      return;
    }
    console.log('Conectado ao banco de dados como ID ' + conexao.threadId);
  });
  
  module.exports = conexao;  