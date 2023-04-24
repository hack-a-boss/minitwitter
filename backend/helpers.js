const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const { nanoid } = require('nanoid');

const generateError = (message, status) => {
  const error = new Error(message);
  error.httpStatus = status;
  return error;
};

const createPathIfNotExists = async (path) => {
  try {
    await fs.access(path);
  } catch {
    await fs.mkdir(path);
  }
};

const deleteUploadedFile = async (name) => {
  const uploadsDir = path.join(__dirname, '../uploads');

  await fs.unlink(path.join(uploadsDir, name));
};

const uploadImage = async (imageData) => {
  // Creo el path del directorio uploads
  const uploadsDir = path.join(__dirname, '../uploads');

  // Creo el directorio si no existe
  await createPathIfNotExists(uploadsDir);

  // Procesar la imagen
  const image = sharp(imageData);
  image.resize(500);

  // Guardo la imagen con un nombre aleatorio en el directorio uploads
  const imageFileName = `${nanoid(24)}.jpg`;

  await image.toFile(path.join(uploadsDir, imageFileName));

  return imageFileName;
};

module.exports = {
  generateError,
  createPathIfNotExists,
  uploadImage,
  deleteUploadedFile,
};
