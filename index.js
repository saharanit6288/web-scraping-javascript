const express = require('express');
const path = require('path');
const video = require('./videoplay');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    const _videoUrl = await video.scrapeSiteData();
    //console.log('video url', _videoUrl);
    const data = {
        videoUrl : _videoUrl
    };
    res.render('pages/index', data);
});

app.listen(1337, () => {
    console.log('server is running');
});

