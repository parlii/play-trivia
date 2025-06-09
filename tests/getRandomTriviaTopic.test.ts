import request from 'supertest';
import { createTestServer } from './testUtils';

jest.mock('langchain/chains', () => {
  return {
    LLMChain: jest.fn().mockImplementation(() => ({
      call: jest.fn().mockResolvedValue({ text: 'Topic' })
    }))
  };
});

jest.mock('langchain/llms/openai', () => ({ OpenAI: jest.fn() }));

jest.mock('@/utils/ratelimit', () => ({
  isRateLimitedAPI: jest.fn().mockResolvedValue(false)
}));

import handler from '../src/pages/api/getRandomTriviaTopic';

describe('getRandomTriviaTopic API', () => {
  it('returns 200 with text', async () => {
    const server = createTestServer(handler);
    await request(server)
      .get('/api/getRandomTriviaTopic?pastTopics=1')
      .expect(200)
      .expect(res => {
        expect(res.body).toBe('Topic');
      });
    server.close();
  });
});
