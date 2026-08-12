async function sendMessage() {
    const input = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    const userMessage = input.value.trim();

    if (!userMessage) return;

    chatBox.innerHTML += `<div class="user-message">${userMessage}</div>`;

saveChat();
    input.value = "";

    chatBox.innerHTML += `
        <div class="bot-message typing" id="typing">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

    try {
        const response = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: userMessage
            })
        });

        const data = await response.json();

        const typing = document.getElementById("typing");
        if (typing) typing.remove();
chatBox.innerHTML += `
    <div class="bot-message">
        <div class="bot-header">
            <span class="bot-avatar">🤖</span>
            <span class="bot-name">AI Assistant</span>
        </div>

        <div class="bot-text">${data.reply}</div>

        <button class="copy-btn" onclick="copyResponse(this)">
            📋 Copy
        </button>
    </div>
`;

        // Save chat after AI response
        saveChat();

    } catch (error) {
        console.error(error);

        const typing = document.getElementById("typing");
        if (typing) typing.remove();

        chatBox.innerHTML += `
            <div class="bot-message">
                Error connecting to server.
            </div>
        `;

        saveChat();
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}


// Enter key
const input = document.getElementById("user-input");

input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});


// Clear Chat
const clearChat = document.getElementById("clear-chat");

clearChat.addEventListener("click", function() {
    document.getElementById("chat-box").innerHTML = "";
});


// Dark / Light Mode
const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.innerHTML = "☀️ Light Mode";
    } else {
        themeToggle.innerHTML = "🌙 Dark Mode";
    }
});


// Copy AI Response
async function copyResponse(button) {
    const responseText = button.previousElementSibling.innerText;

    await navigator.clipboard.writeText(responseText);

    button.innerText = "✅ Copied!";

    setTimeout(() => {
        button.innerText = "📋 Copy";
    }, 1500);
}


// Save Chat
function saveChat() {
    const chatBox=
    document.getElementById("chat-box");

    localStorage.setItem("chatHistory",
    chatBox.innerHTML);
    console.log("chat saved");
    
}


// Load Chat
function loadChat() {
    const savedChat = localStorage.getItem("chatHistory");

    if (savedChat) {
        document.getElementById("chat-box").innerHTML = savedChat;
    }
}


// Load saved chat when page opens
loadChat();


// Chat History Button
const historyBtn = document.getElementById("history-btn");

historyBtn.addEventListener("click", function() {
    const savedChat = localStorage.getItem("chatHistory");

    if (savedChat) {
        document.getElementById("chat-box").innerHTML = savedChat;
    } else {
        alert("No chat history found.");
    }
});