# LexicaAPI SDK
A Node.js package for interacting with [LexicaAPI](https://lexica.qewertyy.dev).

## Installation
Install the package

```bash
npm i lexica-api-sdk
```

## Usage
#### Upscale An Image.

```js
const { LexicaAPI } = require('lexica-api-sdk');
const fs = require('fs');

async function main(){
    const client = new LexicaAPI();
    const image = await client.upscale('https://graph.org/file/f101690e35767a7fe82b5.png',"url");
    // const image = await client.upscale('path/to/image.png');
    // fs.writeFileSync('upscaled.png', image);
    console.log(image);
};

main();
```

#### Chat With AI.
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
```

### License 
#### This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
---