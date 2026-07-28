// ---------- Ember particle field (hero) ----------
(function(){
  const canvas = document.getElementById('ember-canvas');
  const ctx = canvas.getContext('2d');
  const hero = document.getElementById('hero');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let particles = [];
  let w, h;

  function resize(){
    w = canvas.width = hero.offsetWidth;
    h = canvas.height = hero.offsetHeight;
  }
  function spawn(){
    return {
      x: Math.random()*w,
      y: h + 20,
      r: 1 + Math.random()*2.2,
      speed: 0.4 + Math.random()*1.1,
      drift: (Math.random()-0.5)*0.6,
      life: 0,
      maxLife: 300 + Math.random()*260,
      hue: Math.random() > 0.5 ? '255,90,31' : '255,193,69'
    };
  }
  function init(){
    resize();
    particles = Array.from({length: 46}, spawn);
  }
  function tick(){
    if(!reduced){
      ctx.clearRect(0,0,w,h);
      particles.forEach(p=>{
        p.y -= p.speed;
        p.x += p.drift;
        p.life++;
        const fade = 1 - (p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${p.hue},${Math.max(fade,0)*0.55})`;
        ctx.fill();
        if(p.life > p.maxLife || p.y < -20){
          Object.assign(p, spawn());
        }
      });
    }
    requestAnimationFrame(tick);
  }
  window.addEventListener('resize', resize);
  init();
  tick();
})();

// ---------- Scroll reveal ----------
(function(){
  const items = document.querySelectorAll('.reveal, .step');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el=>io.observe(el));
})();

// ---------- Nav active state on scroll ----------
(function(){
  const sections = ['why','boxes','serve','how'].map(id=>document.getElementById(id));
  const links = document.querySelectorAll('nav a[data-nav]');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        links.forEach(l=>l.classList.remove('active'));
        const match = document.querySelector(`nav a[href="#${en.target.id}"]`);
        if(match) match.classList.add('active');
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(s=>s && io.observe(s));
})();

// ---------- Segmented control ----------
(function(){
  const buttons = document.querySelectorAll('.segmented button');
  const thumb = document.getElementById('segThumb');
  const panels = document.querySelectorAll('.serve-panel');
  buttons.forEach((btn, i)=>{
    btn.addEventListener('click', ()=>{
      buttons.forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      thumb.style.transform = i === 0 ? 'translateX(0)' : 'translateX(100%)';
      const key = btn.getAttribute('data-seg');
      panels.forEach(p=>{
        p.classList.toggle('active', p.getAttribute('data-panel') === key);
      });
    });
  });
})();

// ---------- Step nodes light up on scroll ----------
(function(){
  const steps = document.querySelectorAll('.step');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('in'); });
  }, { threshold: 0.4 });
  steps.forEach(s=>io.observe(s));
})();

// ---------- Signup: loading -> skeleton -> success ----------
(function(){
  const form = document.getElementById('signupForm');
  const btn = document.getElementById('signupBtn');
  const spinner = document.getElementById('signupSpinner');
  const btnText = document.getElementById('signupBtnText');
  const confirmWrap = document.getElementById('confirmWrap');
  const skeleton = document.getElementById('skeletonCard');
  const success = document.getElementById('successCard');

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    btn.disabled = true;
    spinner.classList.add('on');
    btnText.textContent = 'Submitting…';
    confirmWrap.classList.add('show');
    skeleton.style.display = 'flex';
    success.classList.remove('show');

    setTimeout(()=>{
      skeleton.style.display = 'none';
      success.classList.add('show');
      spinner.classList.remove('on');
      btnText.textContent = 'Notify Me';
      btn.disabled = false;
      form.reset();
    }, 1100);
  });
})();

// ---------- Mobile nav toggle (simple scroll-to on click for now) ----------
document.querySelector('.nav-toggle').addEventListener('click', ()=>{
  document.getElementById('boxes').scrollIntoView({behavior:'smooth'});
});
