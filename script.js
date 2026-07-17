const header = document.querySelector('.site-header');
const menu = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');
const heroVideo = document.querySelector('#hero-video');
const audioButton = document.querySelector('#hero-audio');

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 30);
});

menu?.addEventListener('click', () => {
  const open = nav?.classList.toggle('open') ?? false;
  menu.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('#site-nav a').forEach((link) => {
  link.addEventListener('click', () => nav?.classList.remove('open'));
});

audioButton?.addEventListener('click', async () => {
  if (!heroVideo) return;
  heroVideo.muted = !heroVideo.muted;
  if (!heroVideo.muted) {
    try { await heroVideo.play(); } catch (_) {}
  }
  audioButton.textContent = heroVideo.muted ? 'Play with sound' : 'Mute sound';
  audioButton.setAttribute('aria-pressed', String(!heroVideo.muted));
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const INITIAL_REVIEW_COUNT = 8;
const FEATURED_REVIEW_COUNT = 4;

function attributionMarkup(review) {
  const details = [review.title, review.location].filter(Boolean).join(' · ');
  return `
    <p class="review-attribution">
      <strong>${escapeHtml(review.name)}</strong>
      ${details ? `<span>${escapeHtml(details)}</span>` : ''}
    </p>`;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);
}

function reviewText(value = '') {
  return escapeHtml(value).replace(/\n\n/g, '<br><br>');
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function featureLengthClass(review) {
  const length = String(review.review || '').length;
  if (length > 650) return 'review-feature--extra-long';
  if (length > 430) return 'review-feature--long';
  if (length < 110) return 'review-feature--short';
  return '';
}

async function loadTestimonials() {
  const featuredContainer = document.getElementById('featured-reviews');
  const listContainer = document.getElementById('review-list');
  const toggle = document.querySelector('.review-toggle');
  const status = document.getElementById('review-status');
  if (!featuredContainer || !listContainer || !toggle || !status) return;

  try {
    const response = await fetch('content/testimonials.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Unable to load testimonials (${response.status})`);

    const testimonials = await response.json();
    const randomized = shuffle(testimonials);
    const featured = randomized.slice(0, FEATURED_REVIEW_COUNT);
    const remaining = randomized.slice(FEATURED_REVIEW_COUNT);

    featuredContainer.innerHTML = featured.map((review) => `
      <article class="review-feature ${featureLengthClass(review)}">
        <blockquote>“${reviewText(review.review)}”</blockquote>
        ${attributionMarkup(review)}
      </article>`).join('');

    listContainer.innerHTML = remaining.map((review, index) => `
      <article class="${index < INITIAL_REVIEW_COUNT ? 'is-visible' : ''}">
        ${attributionMarkup(review)}
        <blockquote>“${reviewText(review.review)}”</blockquote>
      </article>`).join('');

    const hasHidden = remaining.length > INITIAL_REVIEW_COUNT;
    toggle.hidden = !hasHidden;
    status.textContent = `${testimonials.length} client recommendations`;

    if (hasHidden) {
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        listContainer.querySelectorAll('article').forEach((article, index) => {
          article.classList.toggle('is-visible', expanded ? index < INITIAL_REVIEW_COUNT : true);
        });
        toggle.setAttribute('aria-expanded', String(!expanded));
        toggle.textContent = expanded ? 'View all recommendations' : 'Show fewer recommendations';
      });
    }
  } catch (error) {
    console.error(error);
    status.textContent = 'Recommendations could not be loaded. Please refresh the page.';
  }
}

loadTestimonials();
