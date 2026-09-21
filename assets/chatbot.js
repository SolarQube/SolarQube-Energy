// SolarQube Energy - Gemini Powered AI Solar Assistant & Lead Flow
// Designed for high conversion, multi-turn dialogue, quick chips, and EB bill attachment.

(function () {
  // Prevent duplicate initialization
  if (window.SolarQubeChatbotInitialized) return;
  window.SolarQubeChatbotInitialized = true;

  const STORAGE_KEY = "solarqube_chat_history_v1";
  const OPEN_STATE_KEY = "solarqube_chat_open_v1";

  // Initial welcome message and default options
  const WELCOME_MESSAGE = "👋 Hi! Welcome to SolarQube Energy. How can we help you?";
  const INITIAL_OPTIONS = [
    "☀️ Get Solar Quote",
    "💰 Check Subsidy",
    "📊 Calculate Solar Requirement",
    "🏠 Residential Solar",
    "🏢 Commercial Solar",
    "📞 Talk to an Expert",
  ];

  // In-memory lead tracking state
  let leadState = {
    step: null, // 'location', 'type', 'bill', 'timeline', 'eb_bill', 'name', 'phone', 'completed'
    location: "",
    propertyType: "",
    bill: "",
    timeline: "",
    ebBillAttached: false,
    name: "",
    phone: "",
  };

  let conversationHistory = [];
  let pendingAttachment = null; // { name, mimeType, data (base64) }

  // Load stored history
  try {
    const savedHistory = sessionStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      conversationHistory = JSON.parse(savedHistory);
    }
  } catch (e) {
    conversationHistory = [];
  }

  // Inject Styles for Chatbot
  const styleEl = document.createElement("style");
  styleEl.innerHTML = `
    #sq-chatbot-widget {
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      z-index: 99999;
    }
    .sq-chat-shadow {
      box-shadow: 0 20px 40px -15px rgba(0, 20, 48, 0.35), 0 0 1px 1px rgba(0, 20, 48, 0.08);
    }
    .sq-chip-btn {
      transition: all 0.18s ease;
    }
    .sq-chip-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 10px -2px rgba(41, 197, 240, 0.25);
    }
    .sq-bubble-bot {
      background: #f1f5f9;
      color: #0f172a;
      border-radius: 16px 16px 16px 4px;
    }
    .sq-bubble-user {
      background: linear-gradient(135deg, #001430 0%, #002855 100%);
      color: #ffffff;
      border-radius: 16px 16px 4px 16px;
    }
    .sq-pulse-ring {
      animation: sq-pulse 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes sq-pulse {
      0%, 100% { transform: scale(1); opacity: 0.7; }
      50% { transform: scale(1.15); opacity: 0.15; }
    }
    .sq-typing-dot {
      animation: sq-bounce 1.4s infinite ease-in-out both;
    }
    .sq-typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .sq-typing-dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes sq-bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
    .sq-custom-scrollbar::-webkit-scrollbar {
      width: 5px;
    }
    .sq-custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .sq-custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 9999px;
    }
  `;
  document.head.appendChild(styleEl);

  // Create Chatbot DOM Container
  const container = document.createElement("div");
  container.id = "sq-chatbot-widget";
  container.className = "fixed bottom-5 right-5 sm:bottom-6 sm:right-6 flex flex-col items-end pointer-events-none";

  container.innerHTML = `
    <!-- Floating Dialog Window -->
    <div id="sq-chat-window" class="pointer-events-auto hidden flex-col w-[92vw] sm:w-[400px] h-[580px] max-h-[84vh] bg-white rounded-2xl sq-chat-shadow border border-slate-200 overflow-hidden mb-4 transition-all duration-300 transform scale-95 opacity-0 origin-bottom-right">
      
      <!-- Chat Header -->
      <div class="bg-gradient-to-r from-[#001430] via-[#00224d] to-[#001430] text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-[#29C5F0]/20 relative">
        <div class="flex items-center gap-3">
          <div class="relative">
            <div class="w-10 h-10 rounded-full bg-[#29C5F0]/10 border border-[#29C5F0]/40 flex items-center justify-center text-[#29C5F0]">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#001430]"></span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-sm tracking-wide text-white">SolarQube AI Assistant</h3>
              <span class="px-1.5 py-0.5 text-[10px] font-semibold bg-[#29C5F0]/20 text-[#29C5F0] rounded border border-[#29C5F0]/30">Gemini</span>
            </div>
            <p class="text-[11px] text-slate-300 flex items-center gap-1">
              <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Online • Salem, Chennai, Coimbatore
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1 text-slate-300">
          <!-- Call Expert Action -->
          <a href="tel:+918883663001" title="Call Solar Expert" class="min-w-[44px] min-h-[44px] flex items-center justify-center hover:text-[#29C5F0] hover:bg-white/10 rounded-lg transition-colors" aria-label="Call SolarQube">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
          </a>

          <!-- Reset / Clear Chat -->
          <button id="sq-chat-reset" title="Restart Conversation" class="min-w-[44px] min-h-[44px] flex items-center justify-center hover:text-[#29C5F0] hover:bg-white/10 rounded-lg transition-colors" aria-label="Reset Chat">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>

          <!-- Minimize / Close -->
          <button id="sq-chat-close" title="Close Chat" class="min-w-[44px] min-h-[44px] flex items-center justify-center hover:text-white hover:bg-white/10 rounded-lg transition-colors" aria-label="Close Chat Window">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Quick Header Notice Banner -->
      <div class="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/60 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-amber-900">
        <div class="flex items-center gap-1.5">
          <span class="text-amber-600">⚡</span>
          <span>PM Surya Ghar Subsidy: Up to <strong>₹78,000</strong></span>
        </div>
        <a href="residential-solar.html" class="min-h-[44px] flex items-center text-amber-700 font-semibold hover:underline">Details &rarr;</a>
      </div>

      <!-- Messages Thread Area -->
      <div id="sq-messages-list" class="flex-1 overflow-y-auto p-4 space-y-3.5 sq-custom-scrollbar bg-slate-50/50">
        <!-- Messages dynamically appended here -->
      </div>

      <!-- Typing Indicator (Hidden by default) -->
      <div id="sq-typing-indicator" class="hidden px-4 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
        <div class="flex gap-1 items-center px-2 py-1.5 bg-slate-200/70 rounded-full">
          <div class="w-1.5 h-1.5 bg-slate-600 rounded-full sq-typing-dot"></div>
          <div class="w-1.5 h-1.5 bg-slate-600 rounded-full sq-typing-dot"></div>
          <div class="w-1.5 h-1.5 bg-slate-600 rounded-full sq-typing-dot"></div>
        </div>
        <span class="text-[11px] italic">SolarQube AI is preparing response...</span>
      </div>

      <!-- Attachment Preview Pill (Hidden by default) -->
      <div id="sq-attachment-preview" class="hidden px-3.5 py-1.5 bg-blue-50 border-t border-blue-100 flex items-center justify-between text-xs text-blue-900">
        <div class="flex items-center gap-2 truncate max-w-[80%]">
          <svg class="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
          </svg>
          <span id="sq-attachment-name" class="truncate font-medium">EB_Bill.pdf</span>
        </div>
        <button id="sq-remove-attachment" class="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors" title="Remove attachment" aria-label="Remove attachment">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Chat Input Form -->
      <div class="p-3 bg-white border-t border-slate-200">
        <form id="sq-chat-form" class="flex items-center gap-2">
          <!-- File upload button (Hidden file input) -->
          <input type="file" id="sq-file-input" accept="image/*,.pdf" class="hidden" />
          <button type="button" id="sq-file-trigger" title="Attach EB Bill (Image/PDF)" class="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-500 hover:text-[#001430] hover:bg-slate-100 rounded-xl transition-colors flex-shrink-0" aria-label="Upload EB Bill">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
            </svg>
          </button>

          <!-- Text Input -->
          <input
            type="text"
            id="sq-chat-input"
            placeholder="Type your message or ask a question..."
            class="flex-1 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 min-h-[44px] border border-transparent focus:border-[#29C5F0] focus:ring-1 focus:ring-[#29C5F0] outline-none transition-all"
            autocomplete="off"
          />

          <!-- Send Button -->
          <button
            type="submit"
            id="sq-chat-send"
            class="w-11 h-11 min-w-[44px] min-h-[44px] bg-[#001430] hover:bg-[#29C5F0] hover:text-[#001430] text-white rounded-xl transition-all shadow-sm flex items-center justify-center flex-shrink-0 disabled:opacity-50"
            aria-label="Send message"
          >
            <svg class="w-4 h-4 fill-current transform rotate-45 -translate-y-0.5 translate-x-0.5" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </form>

        <div class="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-400">
          <span class="flex items-center gap-1">
            <span>Powered by</span>
            <strong class="text-slate-600 font-semibold">Gemini 3.7 Flash</strong>
          </span>
          <a href="tel:+918883663001" class="min-h-[44px] text-[#001430] hover:text-[#29C5F0] font-semibold flex items-center gap-1" aria-label="Call +91 8883663001">
            <span>Direct Call:</span>
            <span>+91 8883663001</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Floating Trigger Launcher Button -->
    <div class="pointer-events-auto flex items-center gap-2 group">
      <!-- Tooltip Badge (Visible on desktop) -->
      <div id="sq-chat-tooltip" class="hidden sm:flex items-center gap-1.5 bg-[#001430] text-white text-xs font-semibold py-1.5 px-3.5 rounded-full shadow-lg border border-[#29C5F0]/30 transition-all duration-300">
        <span class="text-amber-400">☀️</span>
        <span>Get Solar Quote</span>
        <button id="sq-tooltip-close" class="text-slate-400 hover:text-white ml-1 text-sm font-bold">&times;</button>
      </div>

      <!-- Main Trigger Button -->
      <button
        id="sq-chat-trigger"
        class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#001430] via-[#00224d] to-[#001430] text-[#29C5F0] flex items-center justify-center shadow-2xl border-2 border-[#29C5F0]/80 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none"
        aria-label="Open SolarQube AI Chat"
      >
        <!-- Pulsing Ring -->
        <span class="sq-pulse-ring absolute inset-0 rounded-full bg-[#29C5F0] -z-10"></span>

        <!-- Bot Icon (Visible when closed) -->
        <div id="sq-trigger-icon-open" class="flex flex-col items-center justify-center">
          <svg class="w-7 h-7 text-[#29C5F0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
          </svg>
          <span class="text-[9px] font-bold tracking-tighter text-white uppercase -mt-0.5">AI Quote</span>
        </div>

        <!-- Close Icon (Visible when open) -->
        <div id="sq-trigger-icon-close" class="hidden">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>

        <!-- Notification Dot -->
        <span class="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></span>
      </button>
    </div>
  `;

  document.body.appendChild(container);

  // Element References
  const chatWindow = document.getElementById("sq-chat-window");
  const chatTrigger = document.getElementById("sq-chat-trigger");
  const iconOpen = document.getElementById("sq-trigger-icon-open");
  const iconClose = document.getElementById("sq-trigger-icon-close");
  const chatCloseBtn = document.getElementById("sq-chat-close");
  const chatResetBtn = document.getElementById("sq-chat-reset");
  const messagesList = document.getElementById("sq-messages-list");
  const chatForm = document.getElementById("sq-chat-form");
  const chatInput = document.getElementById("sq-chat-input");
  const typingIndicator = document.getElementById("sq-typing-indicator");
  const fileInput = document.getElementById("sq-file-input");
  const fileTrigger = document.getElementById("sq-file-trigger");
  const attachmentPreview = document.getElementById("sq-attachment-preview");
  const attachmentName = document.getElementById("sq-attachment-name");
  const removeAttachmentBtn = document.getElementById("sq-remove-attachment");
  const tooltip = document.getElementById("sq-chat-tooltip");
  const tooltipClose = document.getElementById("sq-tooltip-close");

  let isOpen = false;

  // Toggle Chat Window
  function toggleChat(open) {
    isOpen = open !== undefined ? open : !isOpen;
    if (isOpen) {
      chatWindow.classList.remove("hidden");
      setTimeout(() => {
        chatWindow.classList.remove("scale-95", "opacity-0");
        chatWindow.classList.add("scale-100", "opacity-100");
      }, 10);
      iconOpen.classList.add("hidden");
      iconClose.classList.remove("hidden");
      if (tooltip) tooltip.classList.add("hidden");
      sessionStorage.setItem(OPEN_STATE_KEY, "true");
      scrollToBottom();
      setTimeout(() => chatInput.focus(), 150);
    } else {
      chatWindow.classList.remove("scale-100", "opacity-100");
      chatWindow.classList.add("scale-95", "opacity-0");
      setTimeout(() => {
        chatWindow.classList.add("hidden");
      }, 250);
      iconOpen.classList.remove("hidden");
      iconClose.classList.add("hidden");
      sessionStorage.removeItem(OPEN_STATE_KEY);
    }
  }

  chatTrigger.addEventListener("click", () => toggleChat());
  chatCloseBtn.addEventListener("click", () => toggleChat(false));
  if (tooltipClose) {
    tooltipClose.addEventListener("click", (e) => {
      e.stopPropagation();
      if (tooltip) tooltip.classList.add("hidden");
    });
  }

  // Restore open state if user was chatting
  try {
    if (sessionStorage.getItem(OPEN_STATE_KEY) === "true") {
      toggleChat(true);
    }
  } catch (e) {}

  // File Upload Handlers
  fileTrigger.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit. Please upload a smaller photo or PDF of your bill.");
      fileInput.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      pendingAttachment = {
        name: file.name,
        mimeType: file.type || "application/octet-stream",
        data: event.target.result,
      };
      attachmentName.textContent = file.name;
      attachmentPreview.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });

  removeAttachmentBtn.addEventListener("click", () => {
    pendingAttachment = null;
    fileInput.value = "";
    attachmentPreview.classList.add("hidden");
  });

  // Reset / Clear Chat
  chatResetBtn.addEventListener("click", () => {
    if (confirm("Restart chat conversation?")) {
      conversationHistory = [];
      sessionStorage.removeItem(STORAGE_KEY);
      leadState = {
        step: null,
        location: "",
        propertyType: "",
        bill: "",
        timeline: "",
        ebBillAttached: false,
        name: "",
        phone: "",
      };
      renderInitialMessages();
    }
  });

  // Scroll to bottom helper - uses double requestAnimationFrame to guarantee
  // the browser has finished layout/paint for newly added content (including
  // dynamically-sized chip buttons) before measuring scrollHeight, which a
  // fixed setTimeout delay could miss.
  function scrollToBottom() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        messagesList.scrollTop = messagesList.scrollHeight;
      });
    });
  }

  // Safety net: auto-scroll whenever the messages list actually changes,
  // regardless of which code path triggered the change. This catches cases
  // where a new message, chip, or attachment preview is added without an
  // explicit scrollToBottom() call.
  if (typeof MutationObserver !== "undefined" && messagesList) {
    const scrollObserver = new MutationObserver(() => {
      scrollToBottom();
    });
    scrollObserver.observe(messagesList, { childList: true, subtree: true });
  }

  // Render Bot Message
  function appendBotMessage(text, options = []) {
    const msgWrapper = document.createElement("div");
    msgWrapper.className = "flex flex-col items-start gap-1 max-w-[88%]";

    const bubble = document.createElement("div");
    bubble.className = "sq-bubble-bot p-3.5 text-xs sm:text-sm leading-relaxed border border-slate-200/80 shadow-sm";
    
    // Parse formatting (bold, links, phone, linebreaks)
    let formattedText = escapeHtml(text)
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
    
    bubble.innerHTML = formattedText;
    msgWrapper.appendChild(bubble);

    // If quick options are provided, render as clickable chips
    if (options && options.length > 0) {
      const chipsContainer = document.createElement("div");
      chipsContainer.className = "flex flex-wrap gap-1.5 mt-2";

      options.forEach((opt) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "sq-chip-btn min-h-[40px] sm:min-h-[36px] inline-flex items-center justify-center text-[11px] sm:text-xs font-semibold py-2 px-3.5 rounded-full bg-white text-[#001430] border border-[#29C5F0]/60 hover:bg-[#001430] hover:text-[#29C5F0] hover:border-[#001430] active:scale-95 transition-all shadow-sm";
        chip.textContent = opt;

        chip.addEventListener("click", () => {
          handleUserOptionSelect(opt);
        });

        chipsContainer.appendChild(chip);
      });

      msgWrapper.appendChild(chipsContainer);
    }

    const time = document.createElement("span");
    time.className = "text-[10px] text-slate-400 pl-1";
    time.textContent = formatTime(new Date());
    msgWrapper.appendChild(time);

    messagesList.appendChild(msgWrapper);
    scrollToBottom();
  }

  // Render User Message
  function appendUserMessage(text, attachment = null) {
    const msgWrapper = document.createElement("div");
    msgWrapper.className = "flex flex-col items-end gap-1 max-w-[88%] ml-auto";

    const bubble = document.createElement("div");
    bubble.className = "sq-bubble-user p-3.5 text-xs sm:text-sm leading-relaxed shadow-md";

    let contentHtml = escapeHtml(text).replace(/\n/g, "<br/>");

    if (attachment) {
      contentHtml += `
        <div class="mt-2 pt-2 border-t border-white/20 flex items-center gap-1.5 text-[11px] text-sky-200">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
          <span class="truncate font-medium">${escapeHtml(attachment.name)}</span>
        </div>
      `;
    }

    bubble.innerHTML = contentHtml;
    msgWrapper.appendChild(bubble);

    const time = document.createElement("span");
    time.className = "text-[10px] text-slate-400 pr-1";
    time.textContent = formatTime(new Date());
    msgWrapper.appendChild(time);

    messagesList.appendChild(msgWrapper);
    scrollToBottom();
  }

  // Initial State Rendering
  function renderInitialMessages() {
    messagesList.innerHTML = "";

    if (conversationHistory.length === 0) {
      // Show Welcome message and Initial 6 options
      appendBotMessage(WELCOME_MESSAGE, INITIAL_OPTIONS);
      conversationHistory.push({
        role: "assistant",
        text: WELCOME_MESSAGE,
        options: INITIAL_OPTIONS,
      });
      saveHistory();
    } else {
      // Replay stored history
      conversationHistory.forEach((msg) => {
        if (msg.role === "user") {
          appendUserMessage(msg.text, msg.attachment);
        } else {
          appendBotMessage(msg.text, msg.options);
        }
      });
    }
  }

  // Handle Option Click
  function handleUserOptionSelect(optionText) {
    chatInput.value = "";
    processUserInput(optionText);
  }

  // Handle Chat Form Submit
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text && !pendingAttachment) return;

    const attachmentToSend = pendingAttachment;
    pendingAttachment = null;
    fileInput.value = "";
    attachmentPreview.classList.add("hidden");

    chatInput.value = "";
    processUserInput(text || (attachmentToSend ? `Uploaded ${attachmentToSend.name}` : ""), attachmentToSend);
  });

  // Process User Input (Coordinates Guided Lead Flow + Gemini AI Fallback)
  async function processUserInput(userText, attachment = null) {
    if (!userText && !attachment) return;

    // Display user message in UI
    appendUserMessage(userText, attachment);

    // Save to history
    conversationHistory.push({
      role: "user",
      text: userText,
      attachment: attachment ? { name: attachment.name } : null,
    });
    saveHistory();

    // Check for Deterministic Local Flows (Quote Flow / Calculator / Subsidy / Expert)
    const lowerText = userText.toLowerCase().trim();

    // Trigger Quote Flow
    if (lowerText.includes("get solar quote") || lowerText === "☀️ get solar quote") {
      leadState.step = "location";
      saveHistory();
      setTimeout(() => {
        const reply = "1. **Where is your property located?** 📍 (e.g. Salem, Chennai, Coimbatore, Erode, etc.)";
        const options = ["Salem", "Chennai", "Coimbatore", "Erode", "Tirupur", "Other City"];
        appendBotMessage(reply, options);
        conversationHistory.push({ role: "assistant", text: reply, options });
        saveHistory();
      }, 350);
      return;
    }

    // Step 1: Location answered -> Step 2: Property Type
    if (leadState.step === "location") {
      leadState.location = userText;
      leadState.step = "type";
      saveHistory();
      setTimeout(() => {
        const reply = "2. **Is this for Residential or Commercial/Industrial?**";
        const options = ["Residential 🏠", "Commercial / Industrial 🏢"];
        appendBotMessage(reply, options);
        conversationHistory.push({ role: "assistant", text: reply, options });
        saveHistory();
      }, 350);
      return;
    }

    // Step 2: Property Type answered -> Step 3: Monthly Bill
    if (leadState.step === "type") {
      leadState.propertyType = userText;
      leadState.step = "bill";
      saveHistory();
      setTimeout(() => {
        const reply = "3. **What is your average monthly electricity bill?** 💡";
        const options = ["₹1,500 - ₹3,000", "₹3,000 - ₹6,000", "₹6,000 - ₹12,000", "Above ₹15,000 / HT"];
        appendBotMessage(reply, options);
        conversationHistory.push({ role: "assistant", text: reply, options });
        saveHistory();
      }, 350);
      return;
    }

    // Step 3: Monthly Bill answered -> Step 4: Installation Timeline
    if (leadState.step === "bill") {
      leadState.bill = userText;
      leadState.step = "timeline";
      saveHistory();
      setTimeout(() => {
        const reply = "4. **When are you planning to install solar?**";
        const options = ["Immediately", "Within 1 month", "1–3 months", "Just exploring"];
        appendBotMessage(reply, options);
        conversationHistory.push({ role: "assistant", text: reply, options });
        saveHistory();
      }, 350);
      return;
    }

    // Step 4: Timeline answered -> Step 5: EB Bill Upload (Optional)
    if (leadState.step === "timeline") {
      leadState.timeline = userText;
      leadState.step = "eb_bill";
      saveHistory();
      setTimeout(() => {
        const reply = "5. **Do you have your latest EB bill?** 📄\n(You can upload an image/PDF using the paperclip icon 📎, or click Skip below)";
        const options = ["📎 I have it / Uploading", "⏭️ Skip EB Bill"];
        appendBotMessage(reply, options);
        conversationHistory.push({ role: "assistant", text: reply, options });
        saveHistory();
      }, 350);
      return;
    }

    // Step 5: EB Bill answered -> Step 6: Name
    if (leadState.step === "eb_bill") {
      leadState.ebBillAttached = attachment ? true : lowerText.includes("upload") || !lowerText.includes("skip");
      leadState.step = "name";
      saveHistory();
      setTimeout(() => {
        const reply = "6. **May I know your Name?** 👤";
        appendBotMessage(reply, []);
        conversationHistory.push({ role: "assistant", text: reply, options: [] });
        saveHistory();
      }, 350);
      return;
    }

    // Step 6: Name answered -> Step 7: Phone Number
    if (leadState.step === "name") {
      leadState.name = userText;
      leadState.step = "phone";
      saveHistory();
      setTimeout(() => {
        const reply = "7. **What is your 10-digit Phone / WhatsApp number?** 📞 (Our engineer will send your quote & solar layout estimate here)";
        appendBotMessage(reply, []);
        conversationHistory.push({ role: "assistant", text: reply, options: [] });
        saveHistory();
      }, 350);
      return;
    }

    // Step 7: Phone Number answered -> Lead Completion!
    if (leadState.step === "phone") {
      leadState.phone = userText;
      leadState.step = "completed";
      saveHistory();

      // Submit lead to backend
      submitLeadData(leadState);

      setTimeout(() => {
        const reply = `✅ **Thank you, ${leadState.name || "Customer"}!**\nOur SolarQube expert will contact you shortly at **${leadState.phone}** with a suitable solar recommendation and customized proposal.`;
        const options = [
          "📞 Call SolarQube (+91 8883663001)",
          "💬 WhatsApp Us",
          "📊 Calculate Solar Requirement",
          "🏠 Explore Projects",
        ];
        appendBotMessage(reply, options);
        conversationHistory.push({ role: "assistant", text: reply, options });
        saveHistory();
      }, 400);
      return;
    }

    // Quick Option: Check Subsidy
    if (lowerText.includes("check subsidy") || lowerText === "💰 check subsidy") {
      setTimeout(() => {
        const reply = `💰 **PM Surya Ghar: Muft Bijli Yojana Central Subsidy Breakdown:**\n\n• **1 kW System:** ₹30,000 Central Subsidy\n• **2 kW System:** ₹60,000 Central Subsidy\n• **3 kW to 10 kW:** ₹78,000 Central Subsidy (Capped)\n\nSolarQube handles 100% of the TANGEDCO net-metering approvals and subsidy documentation for you in Salem, Chennai & Coimbatore!`;
        const options = ["☀️ Get Solar Quote", "📊 Calculate Solar Requirement", "📞 Talk to an Expert"];
        appendBotMessage(reply, options);
        conversationHistory.push({ role: "assistant", text: reply, options });
        saveHistory();
      }, 350);
      return;
    }

    // Quick Option: Calculate Solar Requirement
    if (lowerText.includes("calculate solar requirement") || lowerText === "📊 calculate solar requirement") {
      setTimeout(() => {
        const reply = `📊 **Quick Solar Sizing Rule of Thumb (Tamil Nadu):**\n\n• **Monthly Bill ₹2,000 - ₹3,000:** ~2 kW to 3 kW system (~250-375 units/mo, ~200 sq.ft roof area).\n• **Monthly Bill ₹4,000 - ₹7,000:** ~4 kW to 6 kW system (~500-750 units/mo, ~400 sq.ft roof area).\n• **Commercial ₹15,000+:** 10 kW - 100 kW+ bespoke turnkey plant.\n\nWould you like a customized quote calculated for your exact electricity bill?`;
        const options = ["☀️ Get Solar Quote", "🏠 Residential Solar", "🏢 Commercial Solar"];
        appendBotMessage(reply, options);
        conversationHistory.push({ role: "assistant", text: reply, options });
        saveHistory();
      }, 350);
      return;
    }

    // Quick Option: Talk to an Expert / Call / WhatsApp
    if (lowerText.includes("talk to an expert") || lowerText === "📞 talk to an expert" || lowerText.includes("whatsapp us")) {
      if (lowerText.includes("whatsapp")) {
        window.open("https://wa.me/918883663001?text=Hi%20SolarQube,%20I%20would%20like%20to%20get%20a%20Solar%20Quote%20and%20consultancy.", "_blank");
      }
      setTimeout(() => {
        const reply = `📞 **Connect Directly with SolarQube Engineers:**\n\n• **Phone:** [+91 8883663001](tel:+918883663001)\n• **Email:** [info@solarqubeenergy.in](mailto:info@solarqubeenergy.in)\n• **Head Office:** 58/15-57-1, Bus stand Road, Salem - 636501\n• **Regional Support:** Salem • Chennai • Coimbatore\n\nFeel free to call us anytime or click 'Get Solar Quote' to share your details!`;
        const options = ["☀️ Get Solar Quote", "💰 Check Subsidy", "💬 WhatsApp Us"];
        appendBotMessage(reply, options);
        conversationHistory.push({ role: "assistant", text: reply, options });
        saveHistory();
      }, 350);
      return;
    }

    // For all other open-ended queries -> Query Gemini AI Server API
    showTypingIndicator(true);

    try {
      // Format messages history for Gemini API
      const formattedMessages = conversationHistory
        .filter((m) => m.text)
        .map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          text: m.text,
        }));

      const payload = {
        message: userText,
        messages: formattedMessages,
        attachments: attachment ? [attachment] : [],
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      showTypingIndicator(false);

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.reply || "Thank you for reaching out to SolarQube Energy. Would you like to get a solar quote or calculate your requirement?";
      const quickReplies = data.quickReplies || ["☀️ Get Solar Quote", "💰 Check Subsidy", "📞 Talk to an Expert"];

      appendBotMessage(botReply, quickReplies);
      conversationHistory.push({
        role: "assistant",
        text: botReply,
        options: quickReplies,
      });
      saveHistory();
    } catch (err) {
      console.error("Chat API error:", err);
      showTypingIndicator(false);

      const fallbackReply = "Thank you for your message! SolarQube Energy provides complete turnkey Solar EPC solutions across Salem, Chennai & Coimbatore. For immediate assistance or a free site survey, please call our engineering desk at +91 8883663001 or click below to start a solar quote.";
      const options = ["☀️ Get Solar Quote", "💰 Check Subsidy", "📞 Talk to an Expert"];

      appendBotMessage(fallbackReply, options);
      conversationHistory.push({
        role: "assistant",
        text: fallbackReply,
        options,
      });
      saveHistory();
    }
  }

  // Submit Lead to Backend Server
  async function submitLeadData(lead) {
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
    } catch (e) {
      console.warn("Lead save offline:", e);
    }
  }

  function showTypingIndicator(show) {
    if (show) {
      typingIndicator.classList.remove("hidden");
    } else {
      typingIndicator.classList.add("hidden");
    }
    scrollToBottom();
  }

  function saveHistory() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(conversationHistory));
    } catch (e) {}
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Initialize Messages List
  renderInitialMessages();

  // Expose global open helper so any button on the site with `data-open-chat` or `openSolarQubeChat()` can launch it
  window.openSolarQubeChat = function (initialTopic) {
    toggleChat(true);
    if (initialTopic) {
      setTimeout(() => {
        handleUserOptionSelect(initialTopic);
      }, 300);
    }
  };

  // Attach listener to any element with data-open-chat
  document.querySelectorAll("[data-open-chat]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const topic = btn.getAttribute("data-open-chat") || "☀️ Get Solar Quote";
      window.openSolarQubeChat(topic);
    });
  });
})();
