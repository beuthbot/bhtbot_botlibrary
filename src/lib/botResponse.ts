import Intent from './botIntent';
import BotUser from './botUser';

export default class BotResponse {
  readonly text: string;
  readonly user?: BotUser;
  readonly answer?: {
    readonly history: readonly string[];
    readonly content?: string;
    readonly error?: string;
  };
  readonly intent?: Intent;
  readonly entities: readonly [];
  readonly intent_ranking?: readonly Intent[];
  readonly clientLanguage?: string = 'de';
}
