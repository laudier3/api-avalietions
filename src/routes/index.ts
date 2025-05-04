import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const uploadFields = upload.fields([
  { name: 'imgName', maxCount: 1 },
  { name: 'imageUm', maxCount: 1 },
  { name: 'imageDois', maxCount: 1 },
  { name: 'imageTres', maxCount: 1 },
  { name: 'imageQuatro', maxCount: 1 },
]);

router.post('/', uploadFields, (req, res) => {
  const { name, estrela, message, idProduct } = req.body;
  const files = req.files as { [key: string]: Express.Multer.File[] };

  const comentario = {
    id: Date.now().toString(),
    name,
    estrela: parseInt(estrela),
    message,
    idProduct,
    imgName: files?.imgName?.[0]?.filename || null,
    images: [
      files?.imageUm?.[0]?.filename,
      files?.imageDois?.[0]?.filename,
      files?.imageTres?.[0]?.filename,
      files?.imageQuatro?.[0]?.filename
    ].filter(Boolean),
    createdAt: new Date()
  };

  const filePath = path.join(__dirname, '../../data/comentarios.json');
  const fileData = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    : [];

  fileData.push(comentario);

  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf-8');

  res.status(201).json(comentario);
});

router.get('/', (req: any, res: any) => {
    const filePath = path.join(__dirname, '../../data/comentarios.json');

    // Se o arquivo não existe, retorna lista vazia
    if (!fs.existsSync(filePath)) {
        return res.json([]);
    }

    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const comentarios = JSON.parse(data);
        res.json(comentarios);
    } catch (err) {
        console.error('Erro ao ler o arquivo:', err);
        res.status(500).json({ error: 'Erro ao ler os dados.' });
    }
});
  

router.get('/', (req: any, res: any) => {
  const filePath = path.join(__dirname, '../../data/comentarios.json');
  if (!fs.existsSync(filePath)) {
    return res.json([]);
  }

  const data = fs.readFileSync(filePath, 'utf-8');
  res.json(JSON.parse(data));
});

export default router;
