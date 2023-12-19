fetch("https://openrouter.ai/api/v1/chat/completions", {
 method: "POST",
 headers: {
   "Authorization": `Bearer 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`,
   "Content-Type": "application/json"
 },
 body: JSON.stringify({
   "model": "mistralai/mixtral-8x7b-instruct", // Optional (user controls the default),
   "messages": [
     {"role": "user", "content": "What is the meaning of life?"},
   ]
 })
})
.then(response => response.json())
.then(data => console.log(data.choices[0]))
.catch(error => console.error('Error:', error));
