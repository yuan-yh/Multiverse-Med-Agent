import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { imageData, imageType, patientNotes, specialistType } = await request.json();

    try {
        // OpenRouter API call
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
                "HTTP-Referer": process.env.YOUR_SITE_URL || "http://localhost:3000",
                "X-Title": "Medical Image Analysis",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-3.2-11b-vision-instruct:free",
                "messages": [
                    {
                        "role": "system",
                        "content": `You are an expert ${specialistType} analyzing medical imaging. Provide a structured analysis including:
                        1. Image quality and technical adequacy
                        2. Key findings and abnormalities (be specific about location, size, characteristics)
                        3. Areas requiring special attention or further evaluation
                        4. Preliminary differential diagnoses based on imaging findings
                        5. Recommendations for additional imaging or clinical correlation
                        
                        Be precise, use medical terminology appropriately, and maintain a professional tone.`
                    },
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": `Patient background: ${patientNotes}\n\nPlease provide a detailed analysis of this medical image:`
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": `data:${imageType};base64,${imageData}`
                                }
                            }
                        ]
                    }
                ],
                "max_tokens": 1500,
                "temperature": 0.3
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('OpenRouter API error:', errorData);
            throw new Error(`OpenRouter API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Image analysis completed');
        console.log(data.choices[0].message.content);
        console.log('---');

        return NextResponse.json({
            analysis: data.choices[0].message.content,
            success: true
        });
    } catch (error) {
        console.error('Image analysis error:', error);
        return NextResponse.json(
            {
                error: 'Analysis failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}