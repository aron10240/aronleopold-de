// ─── Wave Animation ───────────────────────────────────────────
const WaveAnimation = {
  paths: [],
  waves: [],

  init() {
    this.paths = Config.waves.pathIds.map(id => document.getElementById(id));
    this.waves = this.paths.map(() => this._buildLayers());
    requestAnimationFrame(t => this._tick(t));
  },

  _buildLayers() {
    return Config.waves.layers.map(({ ampMin, ampMax, freqMin, freqMax }) => ({
      amp:   ampMin  + Math.random() * (ampMax  - ampMin),
      freq:  freqMin + Math.random() * (freqMax - freqMin),
      phase: Math.random() * Math.PI * 2,
    }));
  },

  _tick(t) {
    this.paths.forEach((path, i) => {
      const x = this.waves[i].reduce((s, w) => s + w.amp * Math.sin(w.freq * t + w.phase), 0);
      const y = this.waves[i].reduce((s, w) => s + w.amp * 0.3 * Math.cos(w.freq * 1.3 * t + w.phase), 0);
      path.style.transform = `translate(${x}px, ${y}px)`;
    });
    requestAnimationFrame(t => this._tick(t));
  },
};

// ─── Particle System ──────────────────────────────────────────
const ParticleSystem = {
  init() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < Config.particles.count; i++) {
      container.appendChild(this._createParticle());
    }
  },

  _createParticle() {
    const { minSize, maxSize } = Config.particles;
    const size = minSize + Math.random() * (maxSize - minSize);
    const el = document.createElement('span');
    el.className = 'particle';
    el.style.cssText = [
      `left:${Math.random() * 100}%`,
      `bottom:${Math.random() * 20}%`,
      `width:${size}px`,
      `height:${size}px`,
      `animation-duration:${Math.random() * 8 + 6}s`,
      `animation-delay:${Math.random() * 6}s`,
      `--op:${Math.random() * 0.4 + 0.1}`,
    ].join(';');
    return el;
  },
};

// ─── Contact Form ─────────────────────────────────────────────
const ContactForm = {
  form: null,
  btn:  null,

  init() {
    this.form = document.getElementById('contact-form');
    if (!this.form) return;
    this.btn = this.form.querySelector('.contact-form-btn');
    emailjs.init(Config.emailjs.publicKey);
    this.form.addEventListener('submit', e => this._onSubmit(e));
  },

  _onSubmit(e) {
    e.preventDefault();
    this._setBtn('Wird gesendet...', true);

    emailjs.sendForm(Config.emailjs.serviceId, Config.emailjs.templateId, this.form)
      .then(() => {
        this._setBtn('Gesendet!', true);
        this.form.reset();
        setTimeout(() => this._setBtn('Nachricht senden', false), 3000);
      })
      .catch(() => this._setBtn('Fehler – erneut versuchen', false));
  },

  _setBtn(text, disabled) {
    this.btn.textContent = text;
    this.btn.disabled = disabled;
  },
};

// ─── Pricing Links ───────────────────────────────────────────
const PricingLinks = {
  init() {
    document.querySelectorAll('.pricing-btn[data-plan]').forEach(btn => {
      btn.addEventListener('click', () => {
        const select = document.getElementById('contact-subject');
        if (select) select.value = btn.dataset.plan;
      });
    });
  },
};

// ─── Hero Animation ───────────────────────────────────────────
const HeroAnimation = {
  elements: [
    { selector: '.hero-greeting', direction: 'left',  delay:   0 },
    { selector: '.hero-name',     direction: 'left',  delay: 120 },
    { selector: '.hero-title',    direction: 'left',  delay: 220 },
    { selector: '.hero-desc',     direction: 'left',  delay: 320 },
    { selector: '.hero-actions',  direction: 'left',  delay: 420 },
    { selector: '.hero-image',    direction: 'right', delay: 150 },
  ],

  init() {
    this.elements.forEach(({ selector, direction, delay }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      const offset = direction === 'left' ? '-28px' : '28px';
      Object.assign(el.style, {
        opacity:    '0',
        transform:  `translateX(${offset})`,
        transition: 'opacity 0.65s ease, transform 0.65s ease',
      });
      setTimeout(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateX(0)';
      }, delay);
    });
  },
};

// ─── App ──────────────────────────────────────────────────────
const App = {
  init() {
    PricingLinks.init();
    HeroAnimation.init();
    WaveAnimation.init();
    ParticleSystem.init();
    ContactForm.init();
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
