import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const question = await req.json();

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: question }],
            },
          ],
        }),
      }
    );
    const data = await res.json();

    return NextResponse.json(data.candidates[0].content.parts[0].text);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
};
