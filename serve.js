// Configurando o servidor 
const express = require('express')
const server = express()

// Configurando o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

// Habilitar body do formulário
server.use(express.urlencoded({ extended: true }))

// Configurando a conexão com o banco de dados
const Pool = require('pg').Pool
const DB = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: '5432',
    database: 'doe'
})

// Configurando a template engine
const nunjuks = require("nunjucks")
nunjuks.configure("./", {
    express: server,
    noCache: true,  // Pra não fazer cache
})



// Configurar a apresetação da página
server.get("/", function (req, res) {

    DB.query('SELECT * FROM donors', function (err, result) {
        if (err) res.send('Erro de Banco de dados')

        const donors = result.rows
        return res.render("index.html", { donors })
    })

})

// Pegar dados do formulário para apresentar em tela
server.post("/", function (req, res) {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == '' || email == '' || blood == '') {
        alert('OK')
    }



    // Coloca valores dentro do banco de dados
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`

    const values = [name, email, blood]


    DB.query(query, values, function (err) {
        // Fluxo de Erro
        if (err) return res.send('Erro no banco de Dados.')
        // Fluxo idela
        return res.redirect("/")
    })


})

// Ligar o Servidor e permitir o acesso na porta 3000
server.listen(3000, function () {
    console.log('Servidor Iniciado!');

})
