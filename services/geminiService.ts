
import { GoogleGenAI, Type } from "@google/genai";
import { Student, RecognitionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function recognizeFace(
  base64Image: string,
  students: Student[]
): Promise<RecognitionResult> {
  const studentListText = students
    .map(s => `ID: ${s.id}, Name: ${s.name}`)
    .join("\n");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(",")[1],
              },
            },
            {
              text: `Act as a facial recognition expert. Identify the person in the image from this known student list:
              ${studentListText}
              
              If the person matches one of the students, return their ID and a confidence score (0-1). 
              If no match is found, set studentId to null. 
              Always return the result in valid JSON format.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            studentId: { type: Type.STRING, nullable: true },
            confidence: { type: Type.NUMBER },
            message: { type: Type.STRING },
          },
          required: ["studentId", "confidence", "message"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return {
      studentId: result.studentId || null,
      confidence: result.confidence || 0,
      message: result.message || "Unknown error",
    };
  } catch (error) {
    console.error("Gemini Recognition Error:", error);
    return { studentId: null, confidence: 0, message: "AI Analysis failed." };
  }
}
