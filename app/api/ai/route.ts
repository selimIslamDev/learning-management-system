import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    return generateMockResponse(prompt);
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!response.ok) {
  const errorData = await response.json();
  throw new Error(`Gemini API call failed: ${JSON.stringify(errorData)}`);
}
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

function generateMockResponse(prompt: string): string {
  if (prompt.includes('feedback')) {
    const feedbacks = [
      'Great effort on this submission! Your implementation shows a solid understanding of the core concepts. The code structure is clean and readable. Consider adding more edge case handling and improving error messages for a more robust solution.',
      'This submission covers the essential requirements well. To improve further: add comprehensive comments, consider performance optimizations, and ensure all edge cases are handled properly. Good foundation to build upon!',
      'Your submission demonstrates understanding of the fundamentals. For improvement: focus on code reusability, add input validation, and consider writing unit tests. Keep up the good work!',
    ];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  }

  if (prompt.includes('description') || prompt.includes('improve')) {
    return 'Enhanced description with clear learning objectives, step-by-step requirements, and expected deliverables. Students should demonstrate their understanding by implementing all required features, writing clean and documented code, and submitting a GitHub repository with a comprehensive README.';
  }

  return 'AI assistance is available. Please provide more context for a detailed response.';
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { action, data } = body;

    let prompt = '';
    let result = '';

    if (action === 'generate_feedback') {
      const { studentName, assignmentTitle, submissionNote, submissionUrl } = data;
      prompt = `You are a programming instructor at Programming Hero. Generate constructive, encouraging feedback for a student submission.

Student: ${studentName}
Assignment: ${assignmentTitle}
Student's Note: ${submissionNote}
Submission URL: ${submissionUrl}

Write 2-3 sentences of professional, specific feedback that acknowledges their work, highlights what they did well based on their note, and suggests one clear area for improvement. Be encouraging and educational. Do not use markdown formatting.`;

      result = await callGemini(prompt);
    } else if (action === 'enhance_description') {
      const { title, description, difficulty } = data;
      prompt = `You are a programming instructor. Improve and enhance this assignment description to be clearer, more structured, and better for students.

Assignment Title: ${title}
Current Description: ${description}
Difficulty Level: ${difficulty}

Rewrite the description to be more comprehensive. Include: clear objectives, specific requirements, what to submit, and any helpful hints. Keep it concise but complete (3-4 sentences max). Do not use markdown, bullet points, or special formatting. Write as plain paragraph text.`;

      result = await callGemini(prompt);
    } else if (action === 'improve_note') {
      const { note, assignmentTitle } = data;
      prompt = `You are helping a student improve their submission note for an assignment.

Assignment: ${assignmentTitle}
Student's Original Note: ${note}

Rewrite this note to be more professional, clear, and descriptive. Explain what was implemented, any challenges faced, and what they learned. Keep it to 2-3 sentences. Do not use markdown formatting.`;

      result = await callGemini(prompt);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 });
  }
}