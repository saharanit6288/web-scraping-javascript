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

const PORT = process.env.PORT || 1337;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


