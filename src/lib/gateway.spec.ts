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
