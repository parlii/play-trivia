import request from 'supertest';
import { createTestServer } from './testUtils';

jest.mock('langchain/chains', () => {
  return {
    LLMChain: jest.fn().mockImplementation(() => ({
      call: jest.fn().mockResolvedValue({
        text: JSON.stringify({ question: 'Q', options: ['a', 'b', 'c', 'd'] })
      })
    }))
  };
});

jest.mock('langchain/llms/openai', () => ({ OpenAI: jest.fn() }));

jest.mock('@/utils/ratelimit', () => ({
  isRateLimitedAPI: jest.fn().mockResolvedValue(false)
}));

import handler from '../src/pages/api/generateQuestion';

jest.mock('@/utils/ratelimit', () => ({
  isRateLimitedAPI: jest.fn().mockResolvedValue(false)
}));

describe('generateQuestion API', () => {
  it('returns 200 with question schema', async () => {
    const server = createTestServer(handler);
    await request(server)
      .post('/api/generateQuestion')
      .send({ topic: 't', pastQuestions: [], difficulty: 'easy', language: 'en' })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        expect(res.body).toEqual({ question: 'Q', options: ['a', 'b', 'c', 'd'] });
      });
    server.close();
  });
});
