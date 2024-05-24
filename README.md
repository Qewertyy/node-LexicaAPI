# LexicaAPI SDK
A Node.js package for interacting with [LexicaAPI](https://lexica.qewertyy.dev).

## Installation
Install the package

```bash
npm i lexica-api-sdk
```

## Usage
#### Upscale An Image

```js
const { LexicaAPI } = require('lexica-api-sdk');
const fs = require('fs');

async function main(url){
    const client = new LexicaAPI();
    const image = await client.upscale(url,"url");
    // const image = await client.upscale('path/to/image.png');
    fs.writeFileSync('upscaled.png', image);
};

main("https://graph.org/file/f101690e35767a7fe82b5.png");
```

#### Chat With AI
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

#### Image Search
```js
const { LexicaAPI } = require('lexica-api-sdk');

async function main(query){
    const client = new LexicaAPI();
    const images = await client.searchImages(query,0,"google");
    console.log(images);
};

main("akeno");
```

#### Reverse Image Search
```js
const { LexicaAPI } = require('lexica-api-sdk');

async function main(url){
    const client = new LexicaAPI();
    const images = await client.reverseImageSearch(url);
    console.log(images);
};

main("https://graph.org/file/f101690e35767a7fe82b5.png");
```

#### Social Media Downloader
```js
const { LexicaAPI } = require('lexica-api-sdk');

async function main(url){
    const client = new LexicaAPI();
    const media = await client.downloadMedia(url);
    console.log(media);
};

main("https://twitter.com/Starlink/status/1792678386353213567");
```

#### Translation
```js
const { LexicaAPI } = require('lexica-api-sdk');

async function main(text){
    const client = new LexicaAPI();
    const translation = await client.translate(text,"fr");
    console.log(translation);
};

main("Hello World");
```

### License
#### This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
---