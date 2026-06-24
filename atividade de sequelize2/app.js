const express = require("express");
const app = express();
const sequelize = require("./db");
const Produto = require("./models/produto");
const Usuario = require("./models/usuario");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const exphbs = require("express-handlebars");

async function conectarBanco() {
    try {
        await sequelize.sync();
        console.log("Conexão realizada com sucesso!");
    } catch (erro) {
        console.log("Erro ao conectar");
        console.log(erro);
    }
}

app.get("/exercicio4", async (req, res) => {

    await Produto.create({
        nome: "Mouse",
        preco: 50
    });
    await Produto.create({
        nome: "Teclado",
        preco: 100
    });
    await Produto.create({
        nome: "Monitor",
        preco: 800
    });

    const produtos = await Produto.findAll();
    console.log(produtos);
    res.send("Exercício 4 executado com sucesso!");

});

app.get("/exercicio5", async (req, res) => {

    const produto = await Produto.findByPk(1);
    console.log("Nome:", produto.nome);
    console.log("Preço:", produto.preco);
    res.send("Exercício 5 executado!");

});

app.get("/exercicio6", async (req, res) => {

    const produto = await Produto.findByPk(1);
    produto.preco = 75;
    await produto.save();
    console.log("Produto atualizado!");
    console.log(produto);
    res.send("Exercício 6 executado!");

});

app.get("/exercicio7", async (req, res) => {

    const produto = await Produto.findByPk(1);
    await produto.destroy();
    const produtos = await Produto.findAll();
    console.log(produtos);
    res.send("Exercício 7 executado!");

});

app.get("/produtos", async (req, res) => {

    const produtos = await Produto.findAll();
    res.json(produtos);

});

app.post("/produtos", async (req, res) => {

    const nome = req.body.nome;
    const preco = req.body.preco;
    await Produto.create({
        nome: nome,
        preco: preco
    });
    res.send("Produto cadastrado com sucesso!");

});

app.get("/produtos/deletar/:id", async (req, res) => {

    const id = req.params.id;
    const produto = await Produto.findByPk(id);

    if (!produto) {
        return res.send("Produto não encontrado!");
    }
    await produto.destroy();
    res.send("Produto removido com sucesso!");

});

app.engine(
    "handlebars",
    exphbs.engine({
        defaultLayout: false
    })
);

app.set("view engine", "handlebars");

app.get("/usuarios", async (req, res) => {

    const usuarios = await Usuario.findAll({
        raw: true
    });
    res.render("usuarios", {
        usuarios
    });

});

app.get("/usuarios/cadastrar", (req, res) => {

    res.render("cadastrarUsuario");

});

app.post("/usuarios", async (req, res) => {

    const nome = req.body.nome;
    const email = req.body.email;
    const idade = req.body.idade;

    await Usuario.create({
        nome: nome,
        email: email,
        idade: idade
    });

    res.redirect("/usuarios");

});

conectarBanco();

app.listen(3000, () => {
    console.log("Servidor executando");
});