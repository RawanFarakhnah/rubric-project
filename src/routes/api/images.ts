import express from 'express';
const images = express.Router();

interface ImageQuery {
  filename: string;
  width: string;
  height: string;
}

images.get('/', (req, res) => {
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

  if (isNaN(widthNum) || isNaN(heightNum)) {
    return res.status(400).send('width and height must be numbers');
  }

  res.status(200).json({
    filename,
    width: widthNum,
    height: heightNum,
    message: 'Image processing in progress',
  });
});

export default images;
