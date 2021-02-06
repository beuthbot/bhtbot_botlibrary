# BHT Chat-Bot Library

## Purpose

This library is meant to kickstart new BHT-Bot Chat-Client Applications and reduce redundancy

You can setup a new Client in just a few lines of code. All you have to care about is the implementation of your specific Chat-Protocol, while Gateway Communication and Types are offered by the library.

The library contains CommonJS and ES-Modules bundles.

This Library does target NodeJS Bot Applications in first place. Some functions might break for Browser Applications or need some additional Polyfills. Feel free to open pull requests regarding any compatibility improvements.

## Get in touch

- A typescript implementation can be found for [Discord Bot](https://github.com/beuthbot/discord-bot) 
- A legacy NodeJS Bot can be found at [Telegram Bot](https://github.com/beuthbot/telegram-bot)
- Some Features can be seen in [Test Cases](./src/lib/gateway.spec.ts)
- Generated technical documentation can be found at: [https://beuthbot.github.io/bhtbot_botlibrary/](https://beuthbot.github.io/bhtbot_botlibrary/)

## Usage

### Install

Add to your projects dependencies like you typically do
```
npm i @bhtbot/bhtbot 
 # or
yarn add @bhtbot/bhtbot
```

### Init

On instantiating the Gateway Connection you need to pass url + name of the service. 
The name of service will be passed to the gateway for uniquely identifying your users. Every Bot Client must use a unique service Id for this purpose.

```
import BHTBot from '@bhtbot/bhtbot';
const {Gateway, BotRequest} = BHTBot;
const bot = new Gateway('http://localhost:3000', 'nameOfService');
```

### Example Basic Request

Basic Communication with the BHT Bot Gateway is done by calling it with a POST request. You can call the gateway by building a BotRequest instance and passing it to the gateway.

```
async function queryBot(userId, message){
    const message = new BotRequest({
        text: message,
        serviceUserId: userId,
    });
    return await bot.query(message);
}

const response = await queryBot(333, 'Wie wird das Wetter morgen?');
console.log(response);
```

### Websocket Connection

Some features of BHT-Bot are performed asynchronously, which requires the Chat Bot Service to be callable at any time.
This is implemented by having a Websocket connection to the gateway, listening for those events.

Your Chatbot will be registered with the serviceId given at initializing the Gateway - it must be unique, otherwise you will be disconnected.

```
async function configureSocket(gateway: Gateway) {
    const sock = await gateway.connectWebSocket()

    sock.onMessage(async request => {
        const {userId, message} = request;
        //todo send message to client with user-id == userId
    })

    sock.onFile(async file=>{
        const {binary, userId, fileName} = file;
        //todo send file to client with user-id == userId
    })
}

configureSocket(bot);
```


## Contribution

Since this is a university project which will be passed to new students every semester with their own philosophies and goals, this framework is subject of heavy (breaking) changes.

To keep everybody in sync, any rules and changes made to the project must be visible within this repository.

All rules and pipelines must be implemented as a script withing [package.json](./package.json)

### Building

For development you can use convenient watchers that will rebuild on file change

```
$ npm watch:build
$ npm watch:test
```

Release builds are triggered by
```
$ npm build:main
$ npm build:module
```

### Lint & beautify

Some code cleanup is done by `fix` scripts and validated by `test` scripts

```
$npm run fix:prettier
$npm run fix:lint
$npm run test:prettier
$npm run test:lint
$npm run test:spelling
```

### Test

There are unit tests as well as coverage checks
```
$ npm run test: unit
$ npm run cov
```

### Releasing

#### Deployment
The final release script combines all the steps into a single pipeline which also heightens the build version in package.json and commits the version as a tag for the repository.

This will also generate the docs with `npm run doc` which will be published to [github pages](https://beuthbot.github.io/bhtbot_serviceframework)
```
$ # npm run reset-hard # BEWARE: this will clear your working tree. make sure every changes you want to publish are commited
$ npm run prepare-release
```

#### Publishing
After the build pipeline is finished, you will be provided with information about how to publish, which essentially means pushing your code to the git repository and publishing the build to npmjs

```
$ git push --tags
$ npm publish
```

#### Versioning / Changelog
The Patch-Versioning is done automagically by the prepare-release script. 
Feature and Major releases can be set manually or with help of `npm run standard-version`
You should also consider adding notes to the [CHANGELOG.md](./CHANGELOG.md)

### Credits 
Credits to Bitjson for providing a mature Typescript starter template https://github.com/bitjson/typescript-starter

Initial Work by Dennis Walz
