*Tauri App not ready*

## Install

```
# configure .env
docker run -d --restart always --env-file .env -p 3025:3000 jimchen2/vercel-bedrock:latest
```

## Build

```
# add Dockerfile
docker build --no-cache -t jimchen2/vercel-bedrock .
```

## All in One Command

```
docker build --no-cache -t jimchen2/vercel-bedrock . && docker push jimchen2/vercel-bedrock && docker run -d --restart always --env-file .env -p 3210:3000 jimchen2/vercel-bedrock:latest && docker system prune -af
```

## Tauri

```
npm run build-tauri
```

## Previous Example


```
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Explain the concept of quantum entanglement"},
      {"role": "assistant", "content": "Quantum entanglement is a phenomenon in quantum physics where two or more particles become interconnected in such a way that the quantum state of each particle cannot be described independently, even when separated by a large distance. This means that measuring the state of one particle instantly influences the state of its entangled partner, regardless of how far apart they are."},
      {"role": "user", "content": "Can you give an example of how quantum entanglement might be used in technology?"},
      {"role": "assistant", "content": "Certainly! One of the most promising applications of quantum entanglement in technology is in the field of quantum cryptography, specifically in quantum key distribution (QKD). QKD uses the principles of quantum entanglement to create ultra-secure communication channels. Here'\''s how it works:\n\n1. A sender creates a pair of entangled particles.\n2. One particle is sent to the receiver, while the sender keeps the other.\n3. Both parties measure their particles, which due to entanglement, should yield correlated results.\n4. These correlated measurements are used to generate a shared encryption key.\n\nThe beauty of this system is that any attempt to intercept or measure the particles during transmission would break the entanglement and be detected, making it theoretically impossible to eavesdrop without being noticed. This technology is already being implemented in some high-security applications and is expected to become more widespread as quantum computing advances."},
      {"role": "user", "content": "That'\''s fascinating! Are there any limitations or challenges to implementing quantum entanglement in real-world applications?"}
    ],
    "model": "bedrock",
    "modelName": "meta.llama3-70b-instruct-v1:0",
    "system": "You are a helpful AI assistant specializing in physics.",
    "maxTokens": 200,
    "temperature": 0.7,
    "topP": 0.9
  }'
```