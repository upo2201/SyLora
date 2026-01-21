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
// Use multer for memory storage for robust PDF handling
const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chat with AI
router.post('/chat', protect, async (req, res) => {
  try {
    const { message } = req.body;
    const user = req.user;

    console.log(`AI Chat Request from user: ${user._id}`);

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

    // Use gemini-2.5-flash as available in API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    console.log("AI Chat: Generating content with gemini-2.5-flash...");
    const result = await model.generateContent(context);
    const response = await result.response;
    const text = response.text();

    console.log("AI Chat: Response success.");
    res.json({ reply: text });

  } catch (error) {
    console.error("AI CHAT ERROR DETAILS:", error);
    // Extract deeper error details if available
    let errorMessage = error.message;
    if (error.response && error.response.promptFeedback) {
      console.error("Prompt Feedback:", error.response.promptFeedback);
    }
    res.status(500).json({ message: "Failed to generate response", error: errorMessage });
  }
});

// PDF Parsing Route
router.post('/parse-pdf', protect, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      console.warn("PDF Parse: No file uploaded.");
      return res.status(400).json({ message: "No PDF file uploaded" });
    }

    console.log("PDF Upload received. Size:", req.file.size);

    // Use buffer directly from memory storage
    const dataBuffer = req.file.buffer;
    let text = "";
    try {
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
      console.log("PDF parsed successfully. Text length:", text.length);
    } catch (parseError) {
      console.error("PDF Parsing Library Error:", parseError);
      return res.status(500).json({ message: "Failed to read PDF file.", error: parseError.message });
    }

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

    // Use gemini-2.5-flash as available in API
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });

    console.log("AI PDF: Generating structure with gemini-2.5-flash...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();

    console.log("AI PDF: Response received.");

    let structuredData;
    try {
      structuredData = JSON.parse(jsonText);
    } catch (jsonError) {
      console.error("AI returned invalid JSON:", jsonText);
      return res.status(500).json({ message: "AI returned invalid structure", raw: jsonText });
    }

    res.json(structuredData);

  } catch (error) {
    console.error("PDF PARSE ROUTE ERROR:", error);
    res.status(500).json({ message: "Failed to parse PDF", error: error.message });
  }
});

export default router;
