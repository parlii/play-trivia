import http from 'http';
import { parse } from 'url';
import { apiResolver } from 'next/dist/server/api-utils/node';

export function createTestServer(handler: any) {
  return http.createServer((req, res) => {
    const parsedUrl = parse(req.url || '', true);
    return apiResolver(
      req,
      res,
      parsedUrl.query,
      handler,
      {
        previewModeId: 'test',
        previewModeEncryptionKey: 'test',
        previewModeSigningKey: 'test'
      },
      true
    );
  });
}
