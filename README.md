# LexicaAPI SDK
A Node.js package for interacting with [LexicaAPI](https://lexica.qewertyy.dev).

## Installation
Install the package

```bash
npm i lexica-api-sdk
```

## Examples

### Upscale an image
```js
const { LexicaAPI } = require('lexica-api-sdk');
const fs = require('fs');

async function main(image){
    const client = new LexicaAPI();
    const image = await client.upscale(image);
    fs.writeFileSync('upscaled.png', image);
};

// path of an image or a valid HTTP image URL.
main("https://graph.org/file/f101690e35767a7fe82b5.png");
```

### Chat with ai
```js
const { LexicaAPI } = require('lexica-api-sdk');

async function main(prompt){
    const messages = [
        {
            role:'system',
            content:'You are a helpful assistant.'
        },
        {
            role:'user',
            content:prompt
        }
    ]
    const client = new LexicaAPI();
    const response = await client.chatCompletion(5,messages)
    console.log(response);
};

main("What is the capital of France?");
```

### Image search
```js
const { LexicaAPI } = require('lexica-api-sdk');

async function main(query){
    const client = new LexicaAPI();
    const images = await client.searchImages(query,0,"google");
    console.log(images);
};

main("akeno");
```

### Reverse image search
```js
const { LexicaAPI } = require('lexica-api-sdk');

async function main(url){
    const client = new LexicaAPI();
    const images = await client.reverseImageSearch(url);
    console.log(images);
};

main("https://graph.org/file/f101690e35767a7fe82b5.png");
```

### Social media downloader
```js
const { LexicaAPI } = require('lexica-api-sdk');

async function main(url){
    const client = new LexicaAPI();
    const media = await client.downloadMedia(url);
    console.log(media);
};

main("https://twitter.com/Starlink/status/1792678386353213567");
```

### Translation
```js
const { LexicaAPI } = require('lexica-api-sdk');

async function main(text){
    const client = new LexicaAPI();
    const translation = await client.translate(text,"fr");
    console.log(translation);
};

main("Hello World");
```

### Free games
#### on various platforms such as Epic Games, Steam, etc.
```js
const { LexicaAPI } = require('lexica-api-sdk');

async function main(){
    const client = new LexicaAPI();
    const games = await client.getFreegames();
    console.log(games);
};

main();
```

### Web screenshot
```js
const { LexicaAPI } = require('lexica-api-sdk');
const fs = require('fs');

async function main(url){
    const client = new LexicaAPI();
    const ss = await client.webss(url);
    fs.writeFileSync('screenshot.png', ss);
};

main("https://github.com/Qewertyy");
```

### Anti-NSFW
```js
const { LexicaAPI } = require('lexica-api-sdk');

async function main(image){
    const client = new LexicaAPI();
    const results = await client.antinsfw(image);
    console.log(results)
};
// path of an image or a valid HTTP image URL.
main("f101690e35767a7fe82b5.png");
```

### News
```js
const { LexicaAPI } = require('lexica-api-sdk');

async function main(){
    const client = new LexicaAPI();
    const trendingNews = await client.trendingNews();
    const news = await client.news('Anime');
    console.log(trendingNews,news);
};

main();
```

### License
#### This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
---