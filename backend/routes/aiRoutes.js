import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { protect } from '../middleware/authMiddleware.js';
import Syllabus from '../models/Syllabus.js';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
let pdfParse = require('pdf-parse');
// Handle CommonJS/ESM interop issues
if (typeof pdfParse !== 'function' && pdfParse.default) {
  pdfParse = pdfParse.default;
}

dotenv.config();

console.log("AI Service: API Key loaded:", process.env.GEMINI_API_KEY ? "Yes (Starts with " + process.env.GEMINI_API_KEY.substring(0, 4) + ")" : "No");


const router = express.Router();
// Use multer for memory storage or temporary file
const upload = multer({ dest: 'uploads/' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat with AI
router.post('/chat', protect, async (req, res) => {
  try {
    const { message } = req.body;
    const user = req.user;

    // Fetch user's syllabus to provide context
    const syllabi = await Syllabus.find({ user: user._id });

    let context = "You are a helpful study assistant named SyLora AI. You help students plan their studies and understand their syllabus.\n\n";

    if (syllabi.length > 0) {
      context += "Here is the student's current syllabus context:\n";
      syllabi.forEach(syl => {
        context += `Syllabus Title: ${syl.title}\n`;
        syl.subjects.forEach(sub => {
          context += `Subject: ${sub.name}\nChapters:\n`;
          sub.chapters.forEach(chap => {
            context += `- ${chap.name} (${chap.completed ? 'Completed' : 'Pending'})\n`;
          });
        });
        context += "\n";
      });
    } else {
      context += "The student has not uploaded any syllabus yet. Encourage them to upload one so you can help better.\n";
    }

    context += `\nStudent's Question: ${message}\n\nAnswer concisely and helpfully.`;

    // FIX: Changed model to gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(context);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "Failed to generate response" });
  }
});

// PDF Parsing Route
router.post('/parse-pdf', protect, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded" });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    // Cleanup temp file
    fs.unlinkSync(req.file.path);

    // Prompt Gemini to structure the data
    const prompt = `
        Look at the following syllabus text extracted from a PDF. 
        Extract the Main Title (e.g. Course Name) and a list of subjects with their chapters.
        Return ONLY a valid JSON object in this format:
        {
            "title": "Course Title",
            "subjects": [
                {
                    "name": "Subject Name",
                    "chapters": ["Chapter 1", "Chapter 2"]
                }
            ]
        }
        
        Text content:
        ${text.substring(0, 30000)} // Limit context if needed
        `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();

    const structuredData = JSON.parse(jsonText);

    res.json(structuredData);

  } catch (error) {
    console.error("PDF Parse Error:", error);
    res.status(500).json({ message: "Failed to parse PDF" });
  }
});

export default router;
