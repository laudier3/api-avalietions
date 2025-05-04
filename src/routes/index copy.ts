import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configura o multer para salvar os arquivos no diretório "uploads"
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

// Upload de múltiplas imagens
const uploadFields = upload.fields([
  { name: 'imgName', maxCount: 1 },
  { name: 'imageUm', maxCount: 1 },
  { name: 'imageDois', maxCount: 1 },
  { name: 'imageTres', maxCount: 1 },
  { name: 'imageQuatro', maxCount: 1 },
]);

router.delete('/:id', (req: any, res: any) => {
  const { id } = req.params;
  const filePath = path.join(__dirname, '../../data/comentarios.json');

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Arquivo de dados não encontrado.' });
  }

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const comentarios = JSON.parse(data);

    const index = comentarios.findIndex((c: any) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Comentário não encontrado.' });
    }

    const [removido] = comentarios.splice(index, 1);
    fs.writeFileSync(filePath, JSON.stringify(comentarios, null, 2), 'utf-8');

    // Opcional: deletar imagens associadas
    const imagens = [removido.imgName, ...removido.images];
    imagens.forEach((img) => {
      const imgPath = path.join(__dirname, '../../uploads', img);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    });

    res.json({ message: 'Comentário removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar comentário:', err);
    res.status(500).json({ error: 'Erro ao deletar o comentário.' });
  }
});

router.post('/', uploadFields, (req, res) => {
  const {
    name,
    estrela,
    message,
    idProduct
  } = req.body;

  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const response = {
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
    ].filter(Boolean), // remove undefined
    createdAt: new Date()
  };

  res.status(201).json(response);
});


export default router;
