
import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: // Provide  valid OpenAI API key
});

export async function POST(req: NextRequest) {
  try {
    // Parse the request body (expecting { query: string })
    const { query } = await req.json();


    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06", 
      messages: [
        { role: "system", content: "You are Amgen Bot, a helpful assistant.  " },
        { 
            role: "user", 
            content: `User Query: ${query}. You are here as a proof of concept, you are therefore instructed to engage in fictional but consistent response. For instance, if a user asks 'when is my next appoitment', you must respons with a fictional date and point them to their appoitment reminderers.
      
      You are allowed to suggest the following links only:
      1. https://example.com/myprescriptions
      2. https://example.com/myprovider
      3. https://example.com/appointments
      4. https://example.com/labresults
      5. https://example.com/medicalhistory
      6. https://example.com/immunizations
      7. https://example.com/billing
      8. https://example.com/insurance
      9. https://example.com/patientportal
      10. https://example.com/telehealth
      11. https://example.com/clinicaltrials
      12. https://example.com/careteam
      13. https://example.com/healthrecords
      14. https://example.com/pharmacy
      15. https://example.com/healthtips
      16. https://example.com/diagnostics
      17. https://example.com/appointmentreminders
      18. https://example.com/emergencycontact
      19. https://example.com/lifestyle
      20. https://example.com/nutrition
      
      When responding, recommend between 3 and 5 of these links and provide a brief explanation for why each one is helpful.`
          },
      ],
    });

    const answer = completion.choices[0].message.content;

    return new Response(JSON.stringify({ message: answer }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Error: " + String(error), {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
