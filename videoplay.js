const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');

let iframeUrl = '';

async function scrapeSite() {
	const url = `https://jhanakk.com/?s=taarak`;
	const { data } = await axios.get(url);
	const $ = cheerio.load(data);
	const results = [];
	$('article.item-list').each((i, elem) => {
		const videoFileUrl = $(elem).find('a').attr('href');
		const title = $(elem).find('h2.post-box-title').text();
		results.push({ title, videoFileUrl });
        //console.log(results);
	});

    let todayDate = moment().format("Do MMMM YYYY");
    let dayNumber = moment().day(); // Sunday = 0 & Saturday = 6
    let yesterdayDate = moment().subtract(1, "days").format("Do MMMM YYYY");
    let currentVideoDate = dayNumber == 0 ? yesterdayDate : todayDate;
    //console.log('today yesterday daynumber current', todayDate, yesterdayDate, dayNumber, currentVideoDate);

    const todayVideoItem = results.filter((item) => {
        return item.title.includes(currentVideoDate);
    });

    await getSingleItem(todayVideoItem[0].videoFileUrl)
        .then(result => {
            const $ = cheerio.load(result);
            //iframeUrl = $('div.single-post-video > iframe').attr('src');
            let items = [...$("div.single-post-video iframe")].map(elem =>
                $(elem).attr('src')
            );
            iframeUrl = items.find((item) => {
                return item.includes('vkspeed');
            });
            //console.log('iframe url----', iframeUrl);
        })
        .catch(err => console.log(err));

    return iframeUrl;
}

async function getSingleItem(videoUrl) {
	const { data } = await axios.get(videoUrl);
	return data;
}

const scrapeSiteData = async function() {
    let urlPath = '';

    await scrapeSite()
        .then(result => {
            //console.log(result);
            urlPath = result;
        })
        .catch(err => console.log(err));  

    return urlPath;  
};

module.exports = {
    scrapeSiteData
};