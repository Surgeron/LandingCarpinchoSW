(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     1. INTRO SPLASH ("CarpinchoSW presenta: NexoZafra")
     ========================================================= */
  const introEl = document.getElementById('intro-splash');
  const skipIntroBtn = document.getElementById('btn-skip-intro');
  const replayIntroBtn = document.getElementById('btn-replay-intro');

  let introAutoTimer = null;
  let introHideTimer = null;

  function clearIntroTimers() {
    if (introAutoTimer) {
      clearTimeout(introAutoTimer);
      introAutoTimer = null;
    }
    if (introHideTimer) {
      clearTimeout(introHideTimer);
      introHideTimer = null;
    }
  }

  function closeIntro(immediate = false) {
    if (!introEl || introEl.classList.contains('is-hidden')) {
      return;
    }
    clearIntroTimers();
    introEl.classList.remove('is-playing');
    introEl.classList.add('is-leaving');

    const exitDelay = immediate || prefersReducedMotion ? 160 : 720;
    introHideTimer = setTimeout(() => {
      introEl.classList.add('is-hidden');
      introEl.classList.remove('is-leaving');
      document.body.classList.remove('intro-active');
    }, exitDelay);
  }

  function playIntro() {
    if (!introEl) {
      return;
    }
    clearIntroTimers();
    document.body.classList.add('intro-active');
    introEl.classList.remove('is-hidden', 'is-leaving', 'is-playing');
    // Fuerza reflujo para reiniciar animaciones CSS al repetir
    void introEl.offsetWidth;
    introEl.classList.add('is-playing');

    const duration = prefersReducedMotion ? 1100 : 2550;
    introAutoTimer = setTimeout(() => {
      closeIntro(false);
    }, duration);
  }

  if (introEl) {
    playIntro();

    introEl.addEventListener('click', () => closeIntro(true));

    if (skipIntroBtn) {
      skipIntroBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        closeIntro(true);
      });
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !introEl.classList.contains('is-hidden')) {
        closeIntro(true);
      }
    });
  } else {
    document.body.classList.remove('intro-active');
  }

  if (replayIntroBtn) {
    replayIntroBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      playIntro();
    });
  }

  /* =========================================================
     2. NAVBAR SCROLL & COLAPSO EN MÓVIL
     ========================================================= */
  const mainNav = document.getElementById('main-nav');
  const navMenuEl = document.getElementById('navMenu');

  function updateNavbarScroll() {
    if (!mainNav) {
      return;
    }
    mainNav.classList.toggle('navbar-scrolled', window.scrollY > 32);
  }

  updateNavbarScroll();
  window.addEventListener('scroll', updateNavbarScroll, { passive: true });

  function closeMobileNav() {
    if (!navMenuEl || !window.bootstrap) {
      return;
    }
    const collapseInstance = window.bootstrap.Collapse.getInstance(navMenuEl);
    if (collapseInstance && navMenuEl.classList.contains('show')) {
      collapseInstance.hide();
    }
  }

  if (navMenuEl) {
    navMenuEl.querySelectorAll('a.nav-link').forEach((link) => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* =========================================================
     3. MOCKUP INTERACTIVO DEL HERO (SECO vs LLUVIA)
     ========================================================= */
  const heroMockup = document.getElementById('hero-mockup');
  const statusPill = document.getElementById('mockup-status-pill');
  const statusText = document.getElementById('mockup-status-text');
  const rainBanner = document.getElementById('mockup-rain-banner');
  const rankingList = document.getElementById('ranking-list');

  const btnModeDry = document.getElementById('btn-mode-dry');
  const btnModeRain = document.getElementById('btn-mode-rain');
  const btnHeroRain = document.getElementById('btn-hero-rain');
  const btnNavRain = document.getElementById('nav-sim-rain');
  const btnCierreRain = document.getElementById('btn-cierre-rain');

  const patioCarsValue = document.getElementById('patio-cars-value');
  const patioTonsValue = document.getElementById('patio-tons-value');
  const patioHoursValue = document.getElementById('patio-hours-value');
  const patioMudValue = document.getElementById('patio-mud-value');
  const patioProgressBar = document.getElementById('patio-progress-bar');
  const patioAlertBox = document.getElementById('patio-alert-box');

  const HERO_SCENARIOS = {
    dry: {
      statusClass: 'status-ok',
      statusIcon: 'bi-sun-fill',
      statusLabel: 'Escenario seco',
      showRainBanner: false,
      cars: '38 carros',
      tons: '1.064 t',
      hours: '~3,4 h',
      mud: '2 %',
      barWidth: '76%',
      barClass: 'fill-ok',
      alertClass: 'status-ok',
      alertIcon: 'bi-check-circle-fill',
      alertText: 'Patio cubierto por encima del mínimo operativo.',
      ranking: [
        {
          pos: 1,
          lot: 'Lote B-04',
          detail: 'Bien drenado · Madurez 19,4 °Bx',
          badgeClass: 'badge-ok',
          badgeIcon: 'bi-shield-check',
          badgeLabel: 'Riesgo Bajo',
          urgent: false,
        },
        {
          pos: 2,
          lot: 'Lote A-21',
          detail: 'Drenaje medio · Madurez 18,8 °Bx',
          badgeClass: 'badge-warn',
          badgeIcon: 'bi-exclamation-circle-fill',
          badgeLabel: 'Riesgo Medio',
          urgent: false,
        },
        {
          pos: 3,
          lot: 'Lote A-14',
          detail: 'Drenaje lento · Madurez 19,2 °Bx',
          badgeClass: 'badge-warn',
          badgeIcon: 'bi-exclamation-circle-fill',
          badgeLabel: 'Riesgo Medio',
          urgent: false,
        },
      ],
    },
    rain: {
      statusClass: 'status-rain',
      statusIcon: 'bi-cloud-rain-heavy-fill',
      statusLabel: 'Alerta de lluvia ≥ 70 %',
      showRainBanner: true,
      cars: '24 carros',
      tons: '619 t',
      hours: '~2,0 h',
      mud: '14 %',
      barWidth: '48%',
      barClass: 'fill-critical',
      alertClass: 'status-critical',
      alertIcon: 'bi-exclamation-triangle-fill',
      alertText: 'Alerta a Fábrica: reserva bajo 30 carros y mayor barro en envío.',
      ranking: [
        {
          pos: 1,
          lot: 'Lote A-14',
          detail: 'Drenaje lento · Madurez 19,2 °Bx',
          badgeClass: 'badge-critical',
          badgeIcon: 'bi-exclamation-octagon-fill',
          badgeLabel: 'Adelantar corte',
          urgent: true,
        },
        {
          pos: 2,
          lot: 'Lote C-08',
          detail: 'Drenaje lento · Madurez 18,7 °Bx',
          badgeClass: 'badge-critical',
          badgeIcon: 'bi-exclamation-octagon-fill',
          badgeLabel: 'Adelantar corte',
          urgent: true,
        },
        {
          pos: 3,
          lot: 'Lote B-04',
          detail: 'Bien drenado · Reserva habilitada',
          badgeClass: 'badge-ok',
          badgeIcon: 'bi-shield-check',
          badgeLabel: 'Escudo reserva',
          urgent: false,
        },
      ],
    },
  };

  let currentMode = 'dry';

  function renderRankingRows(rows) {
    if (!rankingList) {
      return;
    }
    rankingList.replaceChildren();

    rows.forEach((item) => {
      const row = document.createElement('div');
      row.className = `nz-ranking-row${item.urgent ? ' is-urgent' : ''}`;

      const left = document.createElement('div');
      left.className = 'd-flex align-items-center gap-2 min-w-0';

      const pos = document.createElement('span');
      pos.className = 'nz-rank-pos';
      pos.textContent = String(item.pos);

      const info = document.createElement('div');
      info.className = 'min-w-0';

      const title = document.createElement('div');
      title.className = 'nz-rank-title';
      title.textContent = item.lot;

      const sub = document.createElement('div');
      sub.className = 'nz-rank-sub text-truncate';
      sub.textContent = item.detail;

      info.append(title, sub);
      left.append(pos, info);

      const badge = document.createElement('span');
      badge.className = `nz-pill-badge ${item.badgeClass}`;
      const icon = document.createElement('i');
      icon.className = `bi ${item.badgeIcon}`;
      icon.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span');
      label.textContent = item.badgeLabel;
      badge.append(icon, label);

      row.append(left, badge);
      rankingList.append(row);
    });
  }

  function pulseMockup() {
    if (!heroMockup || prefersReducedMotion) {
      return;
    }
    heroMockup.classList.remove('pulse-highlight');
    void heroMockup.offsetWidth;
    heroMockup.classList.add('pulse-highlight');
  }

  function setHeroScenario(mode, shouldPulse = false) {
    const data = HERO_SCENARIOS[mode] || HERO_SCENARIOS.dry;
    currentMode = mode;

    if (heroMockup) {
      heroMockup.classList.toggle('is-rain', mode === 'rain');
    }

    if (statusPill && statusText) {
      statusPill.className = `nz-status-pill ${data.statusClass}`;
      const pillIcon = statusPill.querySelector('i');
      if (pillIcon) {
        pillIcon.className = `bi ${data.statusIcon}`;
      }
      statusText.textContent = data.statusLabel;
    }

    if (rainBanner) {
      rainBanner.classList.toggle('d-none', !data.showRainBanner);
    }

    if (btnModeDry && btnModeRain) {
      const isRain = mode === 'rain';
      btnModeDry.classList.toggle('active', !isRain);
      btnModeDry.setAttribute('aria-pressed', String(!isRain));
      btnModeRain.classList.toggle('active', isRain);
      btnModeRain.setAttribute('aria-pressed', String(isRain));
    }

    if (btnHeroRain) {
      const isRain = mode === 'rain';
      btnHeroRain.innerHTML = isRain
        ? '<i class="bi bi-brightness-high-fill me-2" aria-hidden="true"></i>Volver a escenario seco'
        : '<i class="bi bi-cloud-rain-heavy-fill me-2" aria-hidden="true"></i>Probar simulación de lluvia';
    }

    renderRankingRows(data.ranking);

    if (patioCarsValue) patioCarsValue.textContent = data.cars;
    if (patioTonsValue) patioTonsValue.textContent = data.tons;
    if (patioHoursValue) patioHoursValue.textContent = data.hours;
    if (patioMudValue) patioMudValue.textContent = data.mud;

    if (patioProgressBar) {
      patioProgressBar.style.width = data.barWidth;
      patioProgressBar.className = `nz-patio-fill ${data.barClass}`;
    }

    if (patioAlertBox) {
      patioAlertBox.className = `nz-patio-alert mt-2 ${data.alertClass}`;
      const alertIcon = patioAlertBox.querySelector('i');
      const alertSpan = patioAlertBox.querySelector('span');
      if (alertIcon) alertIcon.className = `bi ${data.alertIcon} me-2`;
      if (alertSpan) alertSpan.textContent = data.alertText;
    }

    if (shouldPulse) {
      pulseMockup();
    }
  }

  function focusAndSimulateRain() {
    closeMobileNav();
    setHeroScenario('rain', true);
    if (heroMockup) {
      heroMockup.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'center',
      });
    }
  }

  // Estado inicial del Hero
  setHeroScenario('dry', false);

  if (btnModeDry) {
    btnModeDry.addEventListener('click', () => setHeroScenario('dry', true));
  }
  if (btnModeRain) {
    btnModeRain.addEventListener('click', () => setHeroScenario('rain', true));
  }
  if (btnHeroRain) {
    btnHeroRain.addEventListener('click', () => {
      const nextMode = currentMode === 'rain' ? 'dry' : 'rain';
      setHeroScenario(nextMode, true);
    });
  }
  if (btnNavRain) {
    btnNavRain.addEventListener('click', focusAndSimulateRain);
  }
  if (btnCierreRain) {
    btnCierreRain.addEventListener('click', focusAndSimulateRain);
  }

  /* =========================================================
     4. TAB 2: MAPA INTERACTIVO DE LOTES Y RESERVA
     ========================================================= */
  const btnMapRisk = document.getElementById('btn-map-risk');
  const btnMapReserve = document.getElementById('btn-map-reserve');
  const lotMapSvg = document.getElementById('lot-map-svg');
  const mapFrame = lotMapSvg ? lotMapSvg.closest('.nz-map-frame') : null;
  const mapLegendText = document.getElementById('map-legend-text');
  const mapSelectedInfo = document.getElementById('map-selected-info');

  function setMapFilterMode(mode) {
    if (!mapFrame || !btnMapRisk || !btnMapReserve || !mapLegendText) {
      return;
    }
    const isReserve = mode === 'reserve';
    mapFrame.classList.toggle('mode-reserve', isReserve);
    btnMapRisk.classList.toggle('active', !isReserve);
    btnMapRisk.setAttribute('aria-pressed', String(!isReserve));
    btnMapReserve.classList.toggle('active', isReserve);
    btnMapReserve.setAttribute('aria-pressed', String(isReserve));

    if (isReserve) {
      mapLegendText.innerHTML =
        '<i class="bi bi-shield-fill-check text-success me-1" aria-hidden="true"></i> Reserva bien drenada activa para operar tras lluvias';
    } else {
      mapLegendText.innerHTML =
        '<i class="bi bi-circle-fill text-danger me-1" aria-hidden="true"></i> Riesgo Alto ' +
        '<i class="bi bi-circle-fill text-warning ms-2 me-1" aria-hidden="true"></i> Medio ' +
        '<i class="bi bi-circle-fill text-success ms-2 me-1" aria-hidden="true"></i> Bajo / Reserva';
    }
  }

  if (btnMapRisk) {
    btnMapRisk.addEventListener('click', () => setMapFilterMode('risk'));
  }
  if (btnMapReserve) {
    btnMapReserve.addEventListener('click', () => setMapFilterMode('reserve'));
  }

  if (lotMapSvg && mapSelectedInfo) {
    const lotPolygons = lotMapSvg.querySelectorAll('.map-lot');
    lotPolygons.forEach((poly) => {
      poly.addEventListener('click', () => {
        lotPolygons.forEach((item) => item.classList.remove('is-selected'));
        poly.classList.add('is-selected');
        const lotName = poly.getAttribute('data-lot') || 'Lote';
        const lotInfo = poly.getAttribute('data-info') || '';
        mapSelectedInfo.textContent = `${lotName}: ${lotInfo}`;
      });
    });
  }

  /* =========================================================
     5. TAB 4: MINI-SIMULADOR DE LLUVIA Y PEDIDO ORGÁNICO
     ========================================================= */
  const simRainSlider = document.getElementById('sim-rain-slider');
  const simRainMm = document.getElementById('sim-rain-mm');
  const simOrganicSwitch = document.getElementById('sim-organic-switch');
  const simAffectedLots = document.getElementById('sim-affected-lots');
  const simReserveHa = document.getElementById('sim-reserve-ha');
  const simCostPrevented = document.getElementById('sim-cost-prevented');
  const simScenarioNote = document.getElementById('sim-scenario-note');

  function formatNumberEs(value) {
    return value.toLocaleString('es-AR');
  }

  function updateSimulator() {
    if (!simRainSlider) {
      return;
    }
    const mm = Number(simRainSlider.value);
    const organicUrgent = Boolean(simOrganicSwitch && simOrganicSwitch.checked);

    const affectedLots = mm === 0 ? 0 : Math.min(92, Math.round(mm * 1.36));
    const baseReserveHa = Math.max(1120, Math.round(4140 - mm * 52));
    const reserveHa = organicUrgent ? Math.round(baseReserveHa * 0.64) : baseReserveHa;
    const hoursAtRisk = mm === 0 ? 0 : Math.max(1, Math.round(mm / 4.2));
    const costPrevented = hoursAtRisk * 1563;

    if (simRainMm) simRainMm.textContent = `${mm} mm`;
    if (simAffectedLots) simAffectedLots.textContent = `${affectedLots} lotes`;
    if (simReserveHa) simReserveHa.textContent = `${formatNumberEs(reserveHa)} ha`;
    if (simCostPrevented) simCostPrevented.textContent = `USD ${formatNumberEs(costPrevented)}`;

    if (simScenarioNote) {
      if (mm === 0) {
        simScenarioNote.textContent = organicUrgent
          ? 'Escenario seco: el ranking prioriza lotes orgánicos habilitados sin comprometer piso.'
          : 'Escenario seco: los 219 lotes mantienen piso operativo y la reserva bien drenada queda intacta.';
      } else if (mm < 25) {
        simScenarioNote.textContent = organicUrgent
          ? `Con ${mm} mm y pedido orgánico urgente, se reordena la cosecha hacia lotes orgánicos con buen drenaje.`
          : `Con ${mm} mm proyectados, conviene adelantar los lotes de drenaje lento antes de que pierdan piso.`;
      } else if (mm < 45) {
        simScenarioNote.textContent = organicUrgent
          ? `Con ${mm} mm y urgencia orgánica, se activa escudo de reserva para sostener molienda y cupo orgánico.`
          : `Con ${mm} mm proyectados, conviene mover cosechadoras hacia lotes bien drenados antes del frente de lluvia.`;
      } else {
        simScenarioNote.textContent = organicUrgent
          ? `Temporal de ${mm} mm: alerta temprana inmediata a Fábrica y operación restringida a reserva orgánica bien drenada.`
          : `Temporal de ${mm} mm: alerta temprana a Fábrica con ${hoursAtRisk} h críticas de molienda cubiertas por planificación.`;
      }
    }
  }

  if (simRainSlider) {
    simRainSlider.addEventListener('input', updateSimulator);
  }
  if (simOrganicSwitch) {
    simOrganicSwitch.addEventListener('change', updateSimulator);
  }
  updateSimulator();

  /* =========================================================
     6. ANIMACIÓN DE ENTRADA EN SCROLL (INTERSECTION OBSERVER)
     ========================================================= */
  const revealElements = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealElements.forEach((el) => observer.observe(el));
  }
})();
