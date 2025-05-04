import express from 'express';
import cors from 'cors';
import comentarioRoutes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // permite acesso às imagens
app.use('/comentario', comentarioRoutes);

export default app;
