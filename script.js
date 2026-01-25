(function(){
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('hauptmenue');
  const header = document.querySelector('.site-header');

  const setHeaderH = ()=>{
    if(header) document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  };
  setHeaderH();
  window.addEventListener('resize', setHeaderH);

  const openNav = ()=>{
    if(!mainNav || !navToggle) return;
    mainNav.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  };

  const closeNav = ()=>{
    if(!mainNav || !navToggle) return;
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  if(navToggle && mainNav){
    navToggle.addEventListener('click', ()=>{
      const willOpen = !mainNav.classList.contains('open');
      if(willOpen) openNav(); else closeNav();
    });

    mainNav.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', ()=> closeNav());
    });

    document.addEventListener('click', (e)=>{
      if(!mainNav.classList.contains('open')) return;
      if(e.target.closest('.main-nav') || e.target.closest('.nav-toggle')) return;
      closeNav();
    });

    window.addEventListener('resize', ()=>{
      if(window.innerWidth > 860 && mainNav.classList.contains('open')) closeNav();
    });
  }

  const yearEl = document.getElementById('jahr');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  const toTop = document.querySelector('.to-top');
  if(toTop){
    window.addEventListener('scroll', ()=>{
      if(window.scrollY > 600){ toTop.classList.add('show'); } else { toTop.classList.remove('show'); }
    });
    toTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth')}));
  }

  const revealEls = document.querySelectorAll('.reveal');
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!prefersReduce && 'IntersectionObserver' in window){
    revealEls.forEach(el=>{
      el.style.opacity = 0;
      el.style.transform = 'translateY(12px)';
    });
    const io = new IntersectionObserver((entries, obs)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const el = entry.target;
          el.animate(
            [{ opacity:0, transform:'translateY(12px)' }, { opacity:1, transform:'translateY(0)' }],
            { duration:450, easing:'ease-out', fill:'forwards' }
          );
          obs.unobserve(el);
        }
      });
    }, { threshold:0.12 });
    revealEls.forEach(el=> io.observe(el));
  }

  const form = document.querySelector('.contact-form');
  if(form){
    form.addEventListener('submit', (e)=>{
      let valid = true;

      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const msg = form.querySelector('#nachricht');
      const privacy = form.querySelector('#privacy');
      const honey = form.querySelector('input[name="bot-field"]');

      const setErr = (field, text)=>{
        const wrap = field && field.closest ? field.closest('.form-field') : null;
        const small = wrap ? wrap.querySelector('.error') : null;
        if(small) small.textContent = text || '';
        if(text) valid = false;
      };

      if(honey && honey.value.trim().length){
        e.preventDefault();
        return;
      }

      setErr(name, name && name.value.trim().length ? '' : 'Bitte Namen angeben.');
      const emailOK = email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) : false;
      setErr(email, emailOK ? '' : 'Bitte eine gültige E-Mail eingeben.');
      setErr(msg, msg && msg.value.trim().length ? '' : 'Bitte eine Nachricht schreiben.');
      setErr(privacy, privacy && privacy.checked ? '' : 'Bitte Zustimmung erteilen.');

      if(!valid) e.preventDefault();
    });
  }

  const modal = document.getElementById('product-modal');
  const modalTitle = document.getElementById('product-modal-title');
  const modalText = document.getElementById('product-modal-text');
  const modalImage = document.getElementById('product-modal-image');
  const modalClose = modal ? modal.querySelector('.modal-close') : null;
  const modalInfoLink = modal ? modal.querySelector('.modal-actions a[href="#kontakt"]') : null;
  let lastFocusedElement = null;

  const productData = {
    smart4care: {
      title:'smart4care',
      text:'smart4care ist unsere modulare Cloud-Plattform für ambulante Pflegedienste. Der Kern ist eine Einsatz- und Tourenplanung, die in Minuten steht und bei Ausfällen oder Zusatzbesuchen sauber umplant. Weniger Dispo-Zeit, weniger Telefonketten, bessere Pünktlichkeit – und vor allem mehr echte Pflegezeit. DSGVO-konform in Deutschland betrieben, Updates und Wartung inklusive.',
      image:'assets/img/smart4care_logo.png',
      alt:'Tourenplaner für ambulante Pflegedienste'
    },
    route4care: {
      title:'route4care',
      text:'route4care ist die Tourenplanung im Büro & die Companion-App für das Team draußen. Tagespläne kommen direkt aufs Smartphone, Änderungen landen ohne Herumtelefonieren beim richtigen Menschen. Rückmeldungen aus dem Einsatz fließen zurück in die Disposition, damit der Plan realistisch bleibt – auch wenn der Tag anders läuft als gedacht. Schlank, alltagstauglich und so gebaut, dass es morgens um sechs genauso funktioniert wie kurz vor Feierabend.',
      image:'assets/img/route4care_website_modal.png',
      alt:'Mobile App für Mitarbeitende in der Pflege'
    },
    data4care: {
      title:'data4care',
      text:'data4care ist das Stammdaten-Cockpit, auf dem gute Planung steht. Klienten, Mitarbeitende, Qualifikationen, Zeitfenster, Prioritäten und Regeln werden zentral gepflegt, nachvollziehbar und rollenbasiert. Damit gibt es eine saubere Quelle für alle Module – statt doppelter Listen, Excel-Insellösungen und unnötiger Nacharbeit.',
      image:'assets/img/data4care_logo.png',
      alt:'Übersicht von Dokumenten im Gesundheitswesen'
    },
    invoice4care: {
      title:'invoice4care',
      text:'invoice4care sorgt dafür, dass erbrachte Leistungen auch sauber abgerechnet werden können. Leistungen werden strukturiert erfasst, plausibilisiert und so bereitgestellt, dass sie in bestehende Systeme passen – ohne Chaos und ohne verlorene Details. Das Ergebnis: weniger Nacharbeit, mehr Transparenz und eine Abrechnung, die zum Pflegealltag passt.',
      image:'assets/img/invoice4care_logo.png',
      alt:'Lernplattform für Schulungen'
    }
  };

  function openProductModal(key){
    if(!modal || !productData[key]) return;
    const data = productData[key];

    lastFocusedElement = document.activeElement;

    if(modalTitle) modalTitle.textContent = data.title;
    if(modalText) modalText.textContent = data.text;
    if(modalImage){
      modalImage.src = data.image;
      modalImage.alt = data.alt;
    }

    closeNav();

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    if(modalClose) modalClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal(restoreFocus){
    if(!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if(restoreFocus !== false && lastFocusedElement && typeof lastFocusedElement.focus === 'function'){
      lastFocusedElement.focus();
    }
  }

  if(modal){
    document.querySelectorAll('[data-product]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const key = btn.getAttribute('data-product');
        openProductModal(key);
      });
    });

    if(modalClose){
      modalClose.addEventListener('click', ()=> closeProductModal(true));
    }

    modal.addEventListener('click', (e)=>{
      if(e.target === modal) closeProductModal(true);
    });

    window.addEventListener('keydown', (e)=>{
      if(e.key !== 'Escape') return;

      if(modal.classList.contains('open')){
        closeProductModal(true);
        return;
      }
      if(mainNav && mainNav.classList.contains('open')){
        closeNav();
        return;
      }
    });

    if(modalInfoLink){
      modalInfoLink.addEventListener('click', (e)=>{
        e.preventDefault();
        closeProductModal(false);
        const target = document.getElementById('kontakt');
        if(target && typeof target.scrollIntoView === 'function'){
          target.scrollIntoView({ behavior: prefersReduce ? 'auto' : 'smooth' });
        }else{
          location.hash = '#kontakt';
        }
      });
    }
  }
})();
