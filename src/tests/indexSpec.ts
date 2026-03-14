import supertest from 'supertest';
import app from '../index';

const request = supertest(app);

describe('API Endpoint Tests', () => {
  describe('GET /', () => {
    it('should redirect to /api/images with 302', async () => {
      const response = await request.get('/');
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/api/images/');
    });
  });

  describe('GET /api', () => {
    it('should redirect to /api/images with 302', async () => {
      const response = await request.get('/api');
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/api/images/');
    });
  });

  describe('GET /api/images', () => {
    it('should return 400 if filename is missing', async () => {
      const response = await request.get('/api/images');
      expect(response.status).toBe(400);
    });

    it('should return 200 with valid image', async () => {
      const response = await request.get(
        '/api/images?filename=encenadaport&width=200&height=200',
      );
      expect(response.status).toBe(200);
    });

    it('should return 404 for not found image', async () => {
      const response = await request.get(
        '/api/images?filename=test&width=200&height=200',
      );
      expect(response.status).toBe(404);
    });
  });
});
