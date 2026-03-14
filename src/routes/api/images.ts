import express from 'express';
import imageUtils from '../../utilities/images';

const images = express.Router();

interface ImageQuery {
  filename: string;
  width: string;
  height: string;
}

images.get('/', async (req, res) => {
  const { filename, width, height } = req.query as unknown as ImageQuery;

  if (!filename) {
    return res.status(400).send('filename is required');
  }

  if (!width) {
    return res.status(400).send('width is required');
  }

  if (!height) {
    return res.status(400).send('height is required');
  }

  const widthNum = parseInt(width);
  const heightNum = parseInt(height);

  if (isNaN(widthNum) || isNaN(heightNum) || widthNum <= 0 || heightNum <= 0) {
    return res
      .status(400)
      .send('width and height are required and must be positive numbers');
  }

  try {
    const thumbImage = await imageUtils.resizingImage(
      filename,
      widthNum,
      heightNum,
    );

    return res.status(200).sendFile(thumbImage);
  } catch {
    return res.status(404).send('image not found');
  }
});

export default images;
