// Vanilla JavaScript client for the Sinatra + EventMachine chat demo.
// No framework dependencies — just the WebSocket API and DOM.

(function () {
  "use strict";

  const wsUrl =
    window.location.protocol === "https:"
      ? "wss://" + window.location.hostname + ":8080"
      : "ws://" + window.location.hostname + ":8080";

  const ws = new WebSocket(wsUrl);

  const chatBody = document.querySelector("#chat tbody");
  const form = document.querySelector("#chat-form");
  const msgInput = document.querySelector("#msg");
  const clearBtn = document.querySelector("#clear");

  function appendMessage(text) {
    if (!text) return;
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.textContent = text;
    row.appendChild(cell);
    // Newest message on top
    if (chatBody.firstChild) {
      chatBody.insertBefore(row, chatBody.firstChild);
    } else {
      chatBody.appendChild(row);
    }
  }

  ws.addEventListener("message", (event) => appendMessage(event.data));
  ws.addEventListener("open", () => ws.send("Join the chat"));
  ws.addEventListener("close", () => appendMessage("[disconnected]"));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = msgInput.value.trim();
    if (value.length > 0) {
      ws.send(value);
      msgInput.value = "";
      msgInput.focus();
    }
  });

  clearBtn.addEventListener("click", () => {
    chatBody.replaceChildren();
  });
})();
