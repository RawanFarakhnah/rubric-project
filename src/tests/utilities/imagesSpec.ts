import imagesUtils from '../../utilities/images';
import assert from 'node:assert';

describe('Images Utilities Tests', () => {
  describe('First Access', () => {
    it('function resizingImage expect not empty filename input parameters', async () => {
      await assert.rejects(() => imagesUtils.resizingImage('', 200, 200), {
        message: 'filename is required',
      });
      await assert.rejects(
        () =>
          imagesUtils.resizingImage(undefined as unknown as string, 200, 200),
        { message: 'filename is required' },
      );
    });

    it('function resizingImage expect truthy value for height/width inputs parameters', async () => {
      await assert.rejects(
        () => imagesUtils.resizingImage('encenadaport', 0, 200),
        {
          message: 'width and height are required and must be positive numbers',
        },
      );
    });

    it('function resizingImage expect exist file path', async () => {
      await assert.rejects(
        () => imagesUtils.resizingImage('nonexistent-file', 100, 200),
        { message: 'image not found' },
      );
    });

    it('applay sharp without throwing errors', async () => {
      const resultPath = await imagesUtils.resizingImage(
        'encenadaport',
        200,
        200,
      );
      assert.ok(resultPath.includes('encenadaport_thumb200x200.jpg'));
    });

    it('for first access re-create new image with filename_thumb sharp without throwing errors', async () => {
      const firstPath = await imagesUtils.resizingImage(
        'encenadaport',
        200,
        200,
      );
      assert.ok(firstPath.endsWith('encenadaport_thumb200x200.jpg'));
    });

    it('serve and place images into frontend with the size set', async () => {
      const firstPath = await imagesUtils.resizingImage(
        'encenadaport',
        200,
        200,
      );
      const secondPath = await imagesUtils.resizingImage(
        'encenadaport',
        200,
        200,
      );
      expect(firstPath).toEqual(secondPath);
    });
  });

  describe('Subsequent Access', () => {
    const filename = 'encenadaport';
    const width = 200;
    const height = 200;

    it('stored resized image under designated folder for caching', async () => {
      const thumbPath = await imagesUtils.resizingImage(
        filename,
        width,
        height,
      );

      assert.ok(
        thumbPath.includes('assets\\thumb') ||
          thumbPath.includes('assets/thumb'),
      );
      assert.ok(thumbPath.endsWith('encenadaport_thumb200x200.jpg'));

      const exists = await imagesUtils.isImageFileExiste(thumbPath);
      assert.strictEqual(exists, true);
    });

    it('expect no multiple copies of the same dimention image', async () => {
      const firstPath = await imagesUtils.resizingImage(
        filename,
        width,
        height,
      );
      const secondPath = await imagesUtils.resizingImage(
        filename,
        width,
        height,
      );

      assert.strictEqual(firstPath, secondPath);
      const exists = await imagesUtils.isImageFileExiste(firstPath);
      assert.strictEqual(exists, true);
    });
    it('return the same image whenever relode page with same values', async () => {
      const pathOnFirstLoad = await imagesUtils.resizingImage(
        filename,
        width,
        height,
      );
      const pathOnReload = await imagesUtils.resizingImage(
        filename,
        width,
        height,
      );
      assert.strictEqual(pathOnFirstLoad, pathOnReload);
    });
  });

  afterAll(async () => {
    await imagesUtils.removeThumbImages();
  });
});
