const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Тек POST сұраныстарын қабылдаймыз
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: "Method Not Allowed" }) 
    };
  }

  try {
    const body = JSON.parse(event.body);
    
    // Anthropic API-ге сұраныс жіберу
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY, // Кілтіңіз Netlify-де жасырулы тұрады
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620', // Жаңартылған тұрақты модель
        max_tokens: 400,
        messages: [{ role: 'user', content: body.prompt }]
      })
    });

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.toString() }) 
    };
  }
};