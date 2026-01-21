import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from "openai";
import { protect } from '../middleware/authMiddleware.js';
import Syllabus from '../models/Syllabus.js';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
let pdfParse = require('pdf-parse');
if (typeof pdfParse !== 'function' && pdfParse.default) {
  pdfParse = pdfParse.default;
}

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// --- Dynamic AI Provider Setup ---
const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.OPEN_API_KEY;
const isOpenAI = apiKey && apiKey.startsWith('sk-');
const providerName = isOpenAI ? "OpenAI" : "Gemini";

console.log(`AI Service: Detected Provider: ${providerName}`);

let openai = null;
let genAI = null;

if (isOpenAI) {
  openai = new OpenAI({ apiKey: apiKey });
} else {
  // Default to Gemini if not sk- key (or if mistyped, Gemini SDK will throw sensible error)
  genAI = new GoogleGenerativeAI(apiKey);
}

// Helper: Chat Completion
async function generateChatResponse(message, context) {
  if (isOpenAI) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // or gpt-3.5-turbo
      messages: [
        { role: "system", content: context },
        { role: "user", content: message }
      ]
    });
    return response.choices[0].message.content;
  } else {
    // Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(context + `\n\nUser Message: ${message}`);
    const response = await result.response;
    return response.text();
  }
}

// Helper: JSON Generation (for PDF)
async function generateJsonFromPrompt(prompt, text) {
  if (isOpenAI) {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant that extracts structured JSON data from text." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content);
  } else {
    // Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  }
}


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

    // Call Helper
    const reply = await generateChatResponse(message, context);
    res.json({ reply });

  } catch (error) {
    console.error(`AI Chat Error (${providerName}):`, error);
    res.status(500).json({ message: "Failed to generate response", error: error.message });
  }
});

// PDF Parsing Route
router.post('/parse-pdf', protect, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded" });
    }

    console.log("PDF Upload received. Size:", req.file.size);
    const dataBuffer = req.file.buffer;
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;
    console.log("PDF parsed successfully. Text length:", text.length);

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
        ${text.substring(0, 30000)}
        `;

    // Call Helper
    const structuredData = await generateJsonFromPrompt(prompt, text);
    res.json(structuredData);

  } catch (error) {
    console.error(`PDF Parse Error (${providerName}):`, error);
    res.status(500).json({ message: "Failed to parse PDF", error: error.message });
  }
});

export default router;
