const path = require('path');
require('dotenv').config({ path: './bob/.env' });
const fs = require('fs');
const csv = require('csv-parser');
const Reddit = require('reddit');
const dirPath = path.join(__dirname, './CSV/');

const reddit = new Reddit({
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
    appId: process.env.REDDIT_APP_ID,
    appSecret: process.env.REDDIT_APP_SECRET,
    userAgent: 'AutomationPost'
})

count = 0;

fs.readdir(dirPath, async function (err, files) {
    if (err) console.log('Error: ' + err);
    for (const file of files) {
        await new Promise(resolve => {
            fs.createReadStream(dirPath + file)
                .pipe(csv())
                .on('data', function (data) {
                    count++;
                    result = data;
                    reddit.post('/api/submit', {
                        sr: data.CHANNEL,
                        kind: 'self',
                        title: data.TITLE,
                        text: data.TEXT
                    })
                    console.log('SubReddit: ' + data.CHANNEL + ' Titel: ' + data.TITLE + ' Text: ' + data.TEXT + '\nPost nummer: ' + count + '\n');
                })
                .on('end', () => {
                    console.log(`Alle ${count} posts blev slået op uden fejl!`)
                    resolve(result);
                });
        })
    }
});