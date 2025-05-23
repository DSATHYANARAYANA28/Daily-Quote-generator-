
const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Don’t let yesterday take up too much of today.", author: "Will Rogers" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", author: "Vince Lombardi" },
  { text: "If you are working on something exciting, it will keep you motivated.", author: "Unknown" },
  { text: "Success is not in what you have, but who you are.", author: "Bo Bennett" },
  { text: "The harder you work for something, the greater you’ll feel when you achieve it.", author: "" },
  { text: "Dream bigger. Do bigger.", author: "" },
  { text: "Don’t watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Great things never come from comfort zones.", author: "" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "" }
];

// Select DOM elements
const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('author');
const nextQuoteBtn = document.getElementById('next-quote');
const favoriteBtn = document.getElementById('favorite-quote');
const toggleThemeBtn = document.getElementById('toggle-theme');
const shareTwitterBtn = document.getElementById('share-twitter');
const shareFacebookBtn = document.getElementById('share-facebook');

let currentQuoteIndex = -1;
let autoRefreshInterval = null;
const AUTO_REFRESH_TIME = 30000; // 30 seconds

// Sound effect for quote change
const audio = new Audio('https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg');

// Load favorites from localStorage
let favorites = JSON.parse(localStorage.getItem('favoriteQuotes')) || [];

// Function to get a random quote index different from current
function getRandomQuoteIndex() {
  let index;
  do {
    index = Math.floor(Math.random() * quotes.length);
  } while (index === currentQuoteIndex);
  return index;
}

// Typing animation helper
function typeText(element, text) {
  element.textContent = '';
  element.classList.add('typing');
  let i = 0;
  const interval = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      element.classList.remove('typing');
    }
  }, 40);
}

// Display quote with fade and typing animation
function displayQuote(index) {
  if (index < 0 || index >= quotes.length) return;
  currentQuoteIndex = index;

  // Play sound effect
  audio.currentTime = 0;
  audio.play().catch(() => {});

  // Fade out quote and author
  quoteElement.classList.add('fade-out');
  authorElement.classList.add('fade-out');

  setTimeout(() => {
    // Update quote and author with typing animation
    typeText(quoteElement, quotes[index].text);
    authorElement.textContent = quotes[index].author ? `— ${quotes[index].author}` : '';
    quoteElement.classList.remove('fade-out');
    authorElement.classList.remove('fade-out');

    // Change background color randomly
    changeBackgroundColor();

    // Update favorite button state
    updateFavoriteButton();
  }, 500);
}

// Change background color randomly from a palette
const bgColors = [
  '#667eea', '#764ba2', '#ff6f61', '#6a0572', '#009688', '#f57c00', '#3f51b5', '#e91e63', '#0097a7', '#4caf50'
];
function changeBackgroundColor() {
  const color = bgColors[Math.floor(Math.random() * bgColors.length)];
  document.body.style.background = `linear-gradient(135deg, ${color}, #000000)`;
}

// Update favorite button text based on current quote
function updateFavoriteButton() {
  if (favorites.includes(currentQuoteIndex)) {
    favoriteBtn.textContent = '❤ Favorited';
  } else {
    favoriteBtn.textContent = '❤ Favorite';
  }
}

// Toggle favorite for current quote
function toggleFavorite() {
  if (favorites.includes(currentQuoteIndex)) {
    favorites = favorites.filter(i => i !== currentQuoteIndex);
  } else {
    favorites.push(currentQuoteIndex);
  }
  localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
  updateFavoriteButton();
}

// Toggle dark/light theme
function toggleTheme() {
  document.body.classList.toggle('dark');
}

// Share quote on Twitter
function shareOnTwitter() {
  const quote = quotes[currentQuoteIndex];
  const text = encodeURIComponent(`"${quote.text}" — ${quote.author || 'Unknown'}`);
  const url = `https://twitter.com/intent/tweet?text=${text}`;
  window.open(url, '_blank');
}

// Share quote on Facebook
function shareOnFacebook() {
  const quote = quotes[currentQuoteIndex];
  const text = encodeURIComponent(`"${quote.text}" — ${quote.author || 'Unknown'}`);
  const url = `https://www.facebook.com/sharer/sharer.php?u=&quote=${text}`;
  window.open(url, '_blank');
}

// Auto refresh quotes every 30 seconds
function startAutoRefresh() {
  if (autoRefreshInterval) clearInterval(autoRefreshInterval);
  autoRefreshInterval = setInterval(() => {
    const newIndex = getRandomQuoteIndex();
    displayQuote(newIndex);
  }, AUTO_REFRESH_TIME);
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const initialIndex = getRandomQuoteIndex();
  displayQuote(initialIndex);
  startAutoRefresh();
});

// Event listeners
nextQuoteBtn.addEventListener('click', () => {
  const newIndex = getRandomQuoteIndex();
  displayQuote(newIndex);
});

favoriteBtn.addEventListener('click', () => {
  toggleFavorite();
});

toggleThemeBtn.addEventListener('click', () => {
  toggleTheme();
});

shareTwitterBtn.addEventListener('click', () => {
  shareOnTwitter();
});

shareFacebookBtn.addEventListener('click', () => {
  shareOnFacebook();
});

const shareInstagramBtn = document.getElementById('share-instagram');
shareInstagramBtn.addEventListener('click', () => {
  shareOnInstagram();
});

// Share quote on Instagram (copy to clipboard with alert)
function shareOnInstagram() {
  const quote = quotes[currentQuoteIndex];
  const text = `"${quote.text}" — ${quote.author || 'Unknown'}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Quote copied to clipboard! You can now paste it in your Instagram story or post.');
    }, () => {
      alert('Failed to copy quote to clipboard.');
    });
  } else {
    alert('Clipboard API not supported. Please copy the quote manually:\n' + text);
  }
}
