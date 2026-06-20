export async function callAIService({ systemPrompt, messages, prompt, modelOverride }) {
  const settings = JSON.parse(localStorage.getItem('engineeros_settings') || '{}');
  const provider = settings.provider || 'Claude';
  const apiKey = settings.apiKey || '';
  const apiEndpoint = settings.apiEndpoint || '';

  if (!apiKey) {
    throw new Error("API Key missing! Settings page par key set karein.");
  }

  if (provider === 'Groq') {
    // Determine the Groq endpoint (default to official endpoint if settings is default)
    let endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    if (apiEndpoint && apiEndpoint !== 'https://api.anthropic.com') {
      endpoint = apiEndpoint;
    }

    const formattedMessages = [];
    if (systemPrompt) {
      formattedMessages.push({ role: 'system', content: systemPrompt });
    }
    if (messages) {
      messages.forEach(m => {
        // Map roles for OpenAI API format
        formattedMessages.push({ role: m.role, content: m.content });
      });
    } else if (prompt) {
      formattedMessages.push({ role: 'user', content: prompt });
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelOverride || "llama-3.3-70b-versatile",
        messages: formattedMessages,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      throw new Error("Invalid response format received from Groq.");
    }
  } else {
    // Default Claude Provider
    let endpoint = 'https://api.anthropic.com/v1/messages';
    if (apiEndpoint && apiEndpoint !== 'https://api.anthropic.com') {
      endpoint = `${apiEndpoint.replace(/\/$/, '')}/v1/messages`;
    }

    const formattedMessages = [];
    if (messages) {
      messages.forEach(m => {
        formattedMessages.push({ role: m.role, content: m.content });
      });
    } else if (prompt) {
      formattedMessages.push({ role: 'user', content: prompt });
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: modelOverride || "claude-3-5-sonnet-20241022",
        max_tokens: 4000,
        system: systemPrompt,
        messages: formattedMessages
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err || `Server responded with status ${response.status}`);
    }

    const data = await response.json();
    if (data.content && data.content[0] && data.content[0].text) {
      return data.content[0].text;
    } else {
      throw new Error("Invalid response format received from Anthropic.");
    }
  }
}
