import test from 'ava';

import BotRequest from './botRequest';
import BotResponse from './botResponse';
import Gateway from './gateway';
const bot = new Gateway('https://beuthbot.ziemers.de');

test('apiquery', async (t) => {
  const response = await bot.query(
    new BotRequest({
      text: 'Wie wird das Wetter',
    })
  );
  t.assert(response instanceof BotResponse, 'BotResponse typecast');
  t.assert(
    response.answer !== null &&
      response.answer !== undefined &&
      response.answer.content !== null &&
      response.answer.content !== undefined &&
      response.answer.content !== '',
    'Answer contains content'
  );
});

test('websocket', async (t) => {
  try {
    const sock = await bot.connectWebSocket();
    // console.log(sock);

    sock
      .onMessage((message) => {
        console.log('socket message', message);
      })
      .onError((error) => {
        console.log('socket error', error);
        t.assert(false, 'No errors should be received');
      })
      .onFile((file) => {
        console.log('socket file', file);
      });

    //keep open for some time
    await new Promise((resolve) => {
      setTimeout(resolve, 1000 * 5);
      t.pass('websocket was up without errors');
    });
  } catch (e) {
    console.log('exception in test', e);
  }
});
