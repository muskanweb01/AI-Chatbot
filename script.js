async function sendMessage() {
    const input = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    if (!input || !chatBox) return;

    const userMessage = input.value.trim();

    if (!userMessage) return;

    chatBox.innerHTML += `<div class="user-message">${userMessage}</div>`;
    input.value = "";

    chatBox.innerHTML += `
        <div class="bot-message typing" id="typing">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;

    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: userMessage
            })
        });

        if (!response.ok) {
            throw new Error("Server error: " + response.status);
        }

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

        saveChat();

    } catch (error) {
        console.error("Chat Error:", error);

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


// Make sendMessage available to HTML onclick
window.sendMessage = sendMessage;


// Page ready hone ke baad buttons setup karein
document.addEventListener("DOMContentLoaded", function () {

    const input = document.getElementById("user-input");
    const clearChat = document.getElementById("clear-chat");
    const themeToggle = document.getElementById("theme-toggle");
    const historyBtn = document.getElementById("history-btn");

    // Load saved chat
    loadChat();


    // Enter key
    if (input) {
        input.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                sendMessage();
            }
        });
    }


    // Clear Chat
    if (clearChat) {
        clearChat.addEventListener("click", function () {

            const chatBox = document.getElementById("chat-box");

            if (chatBox) {
                chatBox.innerHTML = "";
                localStorage.removeItem("chatHistory");
            }
        });
    }


    // Dark / Light Mode
    if (themeToggle) {
        themeToggle.addEventListener("click", function () {

            document.body.classList.toggle("dark-mode");

            if (document.body.classList.contains("dark-mode")) {
                themeToggle.innerHTML = "☀️ Light Mode";
            } else {
                themeToggle.innerHTML = "🌙 Dark Mode";
            }
        });
    }


    // Chat History
    if (historyBtn) {
        historyBtn.addEventListener("click", function () {

            const savedChat = localStorage.getItem("chatHistory");
            const chatBox = document.getElementById("chat-box");

            if (savedChat && chatBox) {
                chatBox.innerHTML = savedChat;
            } else {
                alert("No chat history found.");
            }
        });
    }

});


// Copy AI Response
async function copyResponse(button) {

    const responseText = button.previousElementSibling.innerText;

    try {

        await navigator.clipboard.writeText(responseText);

        button.innerText = "✅ Copied!";

        setTimeout(function () {
            button.innerText = "📋 Copy";
        }, 1500);

    } catch (error) {
        console.error("Copy failed:", error);
    }
}

window.copyResponse = copyResponse;


// Save Chat
function saveChat() {

    const chatBox = document.getElementById("chat-box");

    if (!chatBox) return;

    localStorage.setItem(
        "chatHistory",
        chatBox.innerHTML
    );
}


// Load Chat
function loadChat() {

    const savedChat = localStorage.getItem("chatHistory");
    const chatBox = document.getElementById("chat-box");

    if (savedChat && chatBox) {
        chatBox.innerHTML = savedChat;
    }
}
