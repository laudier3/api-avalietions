export interface Data {
    id: string;
    nome: string;
    imagenome: string;
    images: string[]; // Pode ser URL ou base64
    star: number;
    message: string;
    createdAt: Date;
  }
  