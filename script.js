// ── CURSOR GLOW TRAIL ──
const canvas = document.getElementById('cursor-trail');
const ctx = canvas.getContext('2d');
let W, H, mouse = {x:0, y:0};
const dots = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  dots.push({x: e.clientX, y: e.clientY, r: 6, alpha: 0.6, life: 1});
});

function animTrail() {
  ctx.clearRect(0, 0, W, H);
  for (let i = dots.length - 1; i >= 0; i--) {
    const d = dots[i];
    d.life -= 0.04;
    d.r *= 0.97;
    d.alpha = d.life * 0.5;
    if (d.life <= 0) { dots.splice(i, 1); continue; }
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(124, 58, 237, ${d.alpha})`;
    ctx.fill();
  }
  requestAnimationFrame(animTrail);
}
animTrail();

// ── NAV SCROLL ──
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// ── MARQUEE ──
const mItems = ['Custom Web Design','Responsive Design','SEO Optimized','Google Business','Fast Loading','Built to Convert','Domain Setup','WhatsApp Ready','Pretoria SA'];
let mHTML = '';
for(let i=0;i<3;i++) mItems.forEach(t => { mHTML += `<span>${t}</span><span class="dot">✦</span>`; });
document.getElementById('mq').innerHTML = mHTML;

// ── SERVICE CARD MOUSE GLOW ──
document.querySelectorAll('[data-svc]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
    const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

// ── INTERACTIVE PRICING BUILDER ──
const services = [
  { id:'basic', name:'Basic Website (up to 5 pages)', price:1800, includes:['Responsive design','Contact form','2 revisions'] },
  { id:'ecom', name:'E-Commerce Store', price:4500, includes:['Product listings','Shopping cart','Payment setup'] },
  { id:'seo', name:'SEO Optimization Package', price:800, includes:['On-page SEO','Meta tags','Speed boost'] },
  { id:'google', name:'Google Business Profile Setup', price:500, includes:['Maps listing','Photos & info','Review setup'] },
  { id:'domain', name:'Domain Name Registration', price:350, includes:['1-year registration','.co.za or .com','DNS setup'] },
  { id:'maint', name:'Monthly Maintenance', price:600, includes:['Updates & backups','Security','Priority support'] },
];

let selected = new Set();

function renderPricing() {
  const container = document.getElementById('pricingOptions');
  container.innerHTML = '';
  services.forEach(svc => {
    const sel = selected.has(svc.id);
    const div = document.createElement('div');
    div.className = 'p-option' + (sel ? ' selected' : '');
    div.innerHTML = `
      <div class="p-check">
        <svg class="p-check-tick" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="p-info">
        <div class="p-name">${svc.name}</div>
        <div class="p-price">from R${svc.price.toLocaleString()}</div>
      </div>`;
    div.onclick = () => {
      if(selected.has(svc.id)) selected.delete(svc.id);
      else selected.add(svc.id);
      renderPricing();
    };
    container.appendChild(div);
  });

  const total = services.filter(s => selected.has(s.id)).reduce((a,s) => a + s.price, 0);
  const totalEl = document.getElementById('priceTotal');
  totalEl.textContent = total > 0 ? 'R' + total.toLocaleString() : 'R0';

  const note = document.getElementById('priceNote');
  note.textContent = total > 0 ? `Estimated total for ${selected.size} service${selected.size>1?'s':''}. Final pricing confirmed after consultation.` : 'Select services above to build your quote.';

  const inc = document.getElementById('priceIncludes');
  const list = document.getElementById('includesList');
  if(total > 0) {
    inc.style.display = 'block';
    list.innerHTML = '';
    services.filter(s => selected.has(s.id)).forEach(s => {
      s.includes.forEach(item => {
        const el = document.createElement('div');
        el.className = 'include-item';
        el.innerHTML = `<span class="include-dot"></span>${item}`;
        list.appendChild(el);
      });
    });
  } else {
    inc.style.display = 'none';
  }

  // update quote button
  const btn = document.getElementById('priceQuoteBtn');
  if(total > 0) {
    const svcs = services.filter(s => selected.has(s.id)).map(s => s.name).join(', ');
    btn.onclick = (e) => {
      e.preventDefault();
      const text = `*QUOTE REQUEST — Star Web Studio*\n\nEstimated Total: R${total.toLocaleString()}\nServices Selected:\n${services.filter(s=>selected.has(s.id)).map(s=>`- ${s.name} (R${s.price.toLocaleString()})`).join('\n')}\n\nI'd like to discuss this quote, please!`;
      window.open('https://wa.me/27760397854?text=' + encodeURIComponent(text), '_blank');
    };
  }
}
renderPricing();

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── WHATSAPP FORM ──
function sendToWhatsApp() {
  const name = document.getElementById('fname').value.trim();
  const phone = document.getElementById('fphone').value.trim();
  const email = document.getElementById('femail').value.trim();
  const business = document.getElementById('fbusiness').value.trim();
  const service = document.getElementById('fservice').value;
  const budget = document.getElementById('fbudget').value;
  const msg = document.getElementById('fmessage').value.trim();

  if (!name || !phone || !business || !service) {
    alert('Please fill in your name, phone, business name, and service.');
    return;
  }

  const text = `*NEW BOOKING — Star Web Design Studio*\n\nName: ${name}\nPhone: ${phone}${email?'\nEmail: '+email:''}\nBusiness: ${business}\nService: ${service}${budget?'\nBudget: '+budget:''}${msg?'\nMessage: '+msg:''}\n\nSent from the Star Web booking form`;

  window.open('https://wa.me/27760397854?text=' + encodeURIComponent(text), '_blank');
}