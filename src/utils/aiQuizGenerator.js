/**
 * Utility for generating dynamic quizzes using the Google Gemini API.
 */

export async function generateDynamicQuiz(simulator) {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY || localStorage.getItem('GEMINI_API_KEY');
  
  if (!apiKey) {
    throw new Error('API Key missing. Please set REACT_APP_GEMINI_API_KEY in your .env or provide it in the UI.');
  }

  const prompt = `You are a math tutor. Create a multiple-choice question for a student using a mathematical visualizer.
Visualizer Name: ${simulator.title}
Visualizer Topic: ${simulator.category}
Description: ${simulator.description}

Generate a challenging but fair multiple-choice quiz question related to the mathematical concepts explored in this visualizer. 

Return ONLY a valid JSON object with the following exact structure:
{
  "examQuestion": "The text of the question",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "The exact string from options that is correct",
  "theory": "A brief 1-2 sentence explanation of why the answer is correct."
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to fetch from Gemini API');
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) {
    throw new Error('Invalid response format from AI');
  }

  try {
    const quizData = JSON.parse(text);
    if (!quizData.examQuestion || !quizData.options || !quizData.answer || !quizData.theory) {
      throw new Error('AI returned JSON missing required fields');
    }
    return quizData;
  } catch (e) {
    throw new Error('Failed to parse AI response as JSON');
  }
}
