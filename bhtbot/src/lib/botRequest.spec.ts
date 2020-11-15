import test, { ExecutionContext } from 'ava';

import BotRequest from './botRequest';

const testServiceId = 'TestServiceID';
const testUserId = 'ab87scf';
const testMessage = 'Wie wird das Wetter';
const testFirstname = 'Anon';
const testLanguage = 'en';
const testTime = 9999;

function assertRequestEqualsTest(t: ExecutionContext, req: BotRequest) {
  t.assert(req.payload.text === testMessage);
  t.assert(req.payload.firstName === testFirstname);
  t.assert(req.payload.serviceUserId === testUserId);
  t.assert(req.payload.serviceName === testServiceId);
  t.assert(req.payload.clientDate === testTime);
  t.assert(req.payload.clientLanguage === testLanguage);
}

test('botrequest from payload', (t) => {
  BotRequest.serviceId = testServiceId;
  const req = new BotRequest({
    text: testMessage,
    serviceUserId: testUserId,
    firstName: testFirstname,
    serviceName: 'wrongSERVICE',
    clientLanguage: testLanguage,
    clientDate: testTime,
  });
  assertRequestEqualsTest(t, req);
});

test('botrequest without message', (t) => {
  t.throws(() => new BotRequest({ text: undefined }));
});

test('botrequest from setters', (t) => {
  BotRequest.serviceId = testServiceId;
  const req = new BotRequest({
    text: 'wrongMESSAGE',
  });

  req
    .setText(testMessage)
    .setUserFirstname(testFirstname)
    .setUserId(testUserId)
    .setClientLanguage(testLanguage)
    .setUserTime(testTime);
  assertRequestEqualsTest(t, req);

  req.setUserId(testUserId + '@' + testServiceId);
  assertRequestEqualsTest(t, req);
});
