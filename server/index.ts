import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

interface IdentifyRequestBody {
  imageBase64: string;
}

app.post('/api/identify', async (req: Request<{}, {}, IdentifyRequestBody>, res: Response) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Không có ảnh được gửi lên' });
    }

    const base64Data = imageBase64.split(',')[1] || imageBase64;
    
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg",
      },
    };

    const prompt = "Đây là Pokemon nào? Hãy trả về duy nhất tên tiếng Anh viết thường, không có dấu câu, không giải thích gì thêm. Nếu không phải Pokemon, trả về 'unknown'.";

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();
    
    const pokemonName = responseText.trim().toLowerCase();

    res.json({ 
      success: true, 
      pokemonName: pokemonName 
    });

  } catch (error) {
    console.error("Lỗi AI:", error);
    res.status(500).json({ success: false, error: 'Lỗi khi nhận diện ảnh' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend đang chạy tại http://localhost:${PORT}`);
});