import request from 'supertest';
import { createTestServer } from './testUtils';

jest.mock('langchain/chains', () => {
  return {
    LLMChain: jest.fn().mockImplementation(() => ({
      call: jest.fn().mockResolvedValue({
        text: JSON.stringify({
          correct: true,
          explanation: 'ok',
          correct_answer: 'a',
          confidence: 'high'
        })
      })
    }))
  };
});

jest.mock('langchain/llms/openai', () => ({ OpenAI: jest.fn() }));

jest.mock('@/utils/ratelimit', () => ({
  isRateLimitedAPI: jest.fn().mockResolvedValue(false)
}));

import handler from '../src/pages/api/checkAnswer';

describe('checkAnswer API', () => {
  it('returns 200 with answer schema', async () => {
    const server = createTestServer(handler);
    await request(server)
      .post('/api/checkAnswer?topic=t')
      .send({ question: 'Q', userSelectedOption: 'a' })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        expect(res.body).toEqual({
          correct: true,
          explanation: 'ok',
          correct_answer: 'a',
          confidence: 'high'
        });
      });
    server.close();
  });
});
