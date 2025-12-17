let currentSlide = 0;
const slides = document.querySelectorAll('.script-card');

function changeSlide(direction) {
  slides[currentSlide].classList.remove('active');
  currentSlide += direction;
  if (currentSlide >= slides.length) currentSlide = slides.length - 1;
  if (currentSlide < 0) currentSlide = 0;
  slides[currentSlide].classList.add('active');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') changeSlide(1);
  if (e.key === 'ArrowLeft') changeSlide(-1);
});

// AI CHAT LOGIC
function toggleAI() {
  const modal = document.getElementById('aiModal');
  modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function handleEnter(e) {
  if (e.key === 'Enter') sendMessage();
}

async function sendMessage() {
  const input = document.getElementById('aiInput');
  const text = input.value.trim();
  const chatBody = document.getElementById('chatBody');
  
  if (!text) return;
  
  chatBody.innerHTML += `<div class="message user">${text}</div>`;
  input.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;
  
  const loadingId = 'loading-' + Date.now();
  chatBody.innerHTML += `<div id="${loadingId}" class="message ai loading-dots">O'ylayapman</div>`;
  chatBody.scrollTop = chatBody.scrollHeight;
  
  // Current context from slide
  const currentSlideElement = document.querySelector('.script-card.active');
  const currentContext = currentSlideElement ? currentSlideElement.innerText : "Umumiy dars konteksti";
  
  try {
    const apiKey = ""; // API Key environmentdan olinadi
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Sen 10-15 yoshli bolalarga IT dars berayotgan mentorni yordamchisisan. Qisqa, aniq va o'zbek tilida javob ber. Hozirgi dars qismi: ${currentContext}. Savol: ${text}` }] }]
      })
    });
    
    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Kechirasiz, javob bera olmadim.";
    
    document.getElementById(loadingId).remove();
    
    // Format bold text
    const formattedReply = reply.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    
    chatBody.innerHTML += `<div class="message ai">${formattedReply}</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;
    
  } catch (error) {
    document.getElementById(loadingId).remove();
    chatBody.innerHTML += `<div class="message ai" style="color: #fca5a5;">Xatolik. Internetni tekshiring.</div>`;
  }
}
