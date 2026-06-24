const express = require('express');
const exphbs = require('express-handlebars')
const app = express();
const sequelize = require('./config/db');
const Video = require('./models/tiktok.model');

app.engine('handlebars', exphbs.engine({defaultLayout:false}));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/videos', async (req, res) => {
    const videos = await Video.findAll({ raw: true });

    res.render('videos', { videos });
});

app.get('/videos/novo', (req, res) => {
    res.render('videonovo');
});

app.post('/videos', async (req, res) => {
    const { titulo, descricao, url } = req.body;

    await Video.create({
        titulo,
        descricao,
        url
    });

    res.redirect('/videos');
});

app.get('/videos/editar/:id', async (req, res) => {
    const video = await Video.findByPk(req.params.id);

    if (!video) {
        return res.send('Vídeo não encontrado');
    }

    res.render('editarVideo', {
        video: video.get({ plain: true })
    });
});

app.post('/videos/editar/:id', async (req, res) => {
    const video = await Video.findByPk(req.params.id);

    if (!video) {
        return res.send('Vídeo não encontrado');
    }

    const {
        titulo,
        criador,
        descricao,
        visualizacoes,
        curtidas,
        hashtag,
        urlVideo,
        thumbnail
    } = req.body;

    video.titulo = titulo;
    video.criador = criador;
    video.descricao = descricao;
    video.visualizacoes = visualizacoes;
    video.curtidas = curtidas;
    video.hashtag = hashtag;
    video.urlVideo = urlVideo;
    video.thumbnail = thumbnail;

    await video.save();

    res.redirect('/videos');
});

app.post('/videos/deletar/:id', async (req, res) => {
    const video = await Video.findByPk(req.params.id);

    if (video) {
        await video.destroy();
    }

    res.redirect('/videos');
});

async function conectarBD() {
    try {   
        await sequelize.sync();
        console.log('Conexão com o banco estabelecida!');
    } catch (erro) {
        console.error(erro);
    }
}
conectarBD();

app.listen(
    5000, 
    () => console.log('Servidor do tiktok')
);  
