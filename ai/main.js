const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const modelSelector = document.getElementById("model-selector");

async function sendMessage() {
  const message = userInput.value.trim();
  const selectedModel = modelSelector.value;
  if (!message) return;

  appendMessage("user", message);
  userInput.value = "";

  try {
    const response = await fetch("http://121.124.194.242:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: selectedModel,
        prompt: message,
        stream: false
      })
    });

    const data = await response.json();
    const reply = data.response || "AI 응답 오류입니다.";
    appendMessage("bot", reply);

  } catch (error) {
    appendMessage("bot", "⚠️ 오류가 발생했습니다: " + error.message);
  }
}

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = `chat-message ${sender}`;
  msg.innerHTML = (sender === "user" ? "🧑‍💻 " : "🤖 ") + parseMarkdown(text);
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function parseMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // 굵게
    .replace(/^# (.*$)/gim, "<h2>$1</h2>")             // # 제목
    .replace(/^- (.*$)/gim, "<li>$1</li>")             // - 목록
    .replace(/\n/g, "<br>");                           // 줄바꿈
}
