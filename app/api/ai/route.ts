import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function generateMockResponse(action: string, data: any): string {
  if (action === 'generate_feedback') {
    const feedbacks = [
      `Great work on the "${data.assignmentTitle}" assignment, ${data.studentName}! Your implementation demonstrates a solid understanding of the core concepts. The submission shows careful attention to detail. To improve further, consider adding more comprehensive error handling and documentation to make your code more maintainable.`,
      `Excellent effort, ${data.studentName}! Your submission for "${data.assignmentTitle}" covers all the essential requirements. The logic is well-structured and easy to follow. For future improvements, focus on optimizing performance and adding unit tests to ensure code reliability.`,
      `Good job on completing "${data.assignmentTitle}", ${data.studentName}! Your approach to solving the problem is logical and well-organized. Consider refactoring some sections for better code reusability and adding input validation for a more robust solution.`,
      `Well done, ${data.studentName}! Your work on "${data.assignmentTitle}" shows strong understanding of the fundamentals. The code is clean and readable. To take it to the next level, consider implementing additional features and improving the user experience.`,
    ];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  }

  if (action === 'enhance_description') {
    return `${data.description} This ${data.difficulty}-level assignment is designed to strengthen your understanding of key programming concepts through hands-on practice. Students are expected to implement all required features with clean, well-documented code. Submit your completed project as a GitHub repository with a detailed README explaining your approach, technologies used, and any challenges you encountered during development.`;
  }

  if (action === 'improve_note') {
    return `I successfully completed all the required features for this assignment, implementing the core functionality with a focus on code quality and best practices. The main challenge I encountered was optimizing the data flow, which I resolved by restructuring the component architecture. Through this project, I gained valuable experience in problem-solving and learned important lessons about writing maintainable, scalable code.`;
  }

  return 'AI assistance completed successfully.';
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { action, data } = body;

    if (!action || !data) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const result = generateMockResponse(action, data);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 });
  }
}