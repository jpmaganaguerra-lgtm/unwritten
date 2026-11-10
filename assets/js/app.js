/* ==========================================================================
   UNWRITTEN LIVING — Aplicación de presentación
   Renderiza desde data.js y calcula con finance.js. Sin dependencias externas.
   ========================================================================== */
(function () {
  'use strict';

  const { STATUS, CONFIG, BASE_ASSUMPTIONS, SCENARIOS, CHAPTERS, SOURCES } = window.UL;
  const F = window.Finance;

  const NAV_IDS = ['summary', 'market', 'assets', 'business', 'financials', 'capital', 'partnership', 'close'];
  const ORDER = {
    capital:  ['cover','summary','thesis','market','gap','segments','solution','standards','assets','target','business','operating','tech','gtm','competitive','financials','capital','partnership','growth','risks','team','close'],
    property: ['cover','summary','assets','target','standards','solution','segments','market','gap','thesis','business','operating','tech','gtm','competitive','partnership','financials','capital','growth','risks','team','close']
  };
  const CTA = {
    capital:  { title: 'Let’s Build the Next Hospitality Platform.', body: 'Conversemos sobre la plataforma, el plan de validación y los términos de una eventual participación. Los términos se definen por escrito y sujetos a due diligence.', btn: 'Solicitar reunión · Capital' },
    property: { title: 'Let’s Transform Existing Assets into the Next Generation of Senior Hospitality.', body: 'Evaluamos su inmueble con la auditoría de 100 puntos y le entregamos un diagnóstico con escenarios editables. Si el activo no es viable, se lo diremos.', btn: 'Solicitar auditoría · Propietario' },
    default:  { title: 'Let’s Talk.', body: 'Elija su ruta en la portada para ver el contenido priorizado para su perfil.', btn: 'Solicitar reunión' }
  };

  const fmtMoney = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
  const fmtNum = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });
  const fmtDec = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 1 });
  const money = v => (v === null || v === undefined || !Number.isFinite(v)) ? 'Pending' : fmtMoney.format(v);
  const pct = v => (v === null || !Number.isFinite(v)) ? 'Pending' : (v * 100).toFixed(1) + '%';
  const years = v => (v === null || !Number.isFinite(v)) ? 'No recupera' : fmtDec.format(v) + ' años';
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const state = { audience: null, sim: 'corporate', corp: clone(BASE_ASSUMPTIONS.corporate), asset: clone(BASE_ASSUMPTIONS.asset), scenario: 'base' };
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ---------- Marca ---------- */
  const ellipsisSVG = (cls, size) => `<svg class="${cls || ''}" viewBox="0 0 120 40" width="${size || 120}" aria-hidden="true" focusable="false"><circle cx="20" cy="20" r="12" fill="currentColor"/><circle cx="60" cy="20" r="12" fill="currentColor"/><circle cx="100" cy="20" r="12" fill="currentColor"/></svg>`;

  /* ---------- Render de bloques ---------- */
  function tagFor(st) {
    if (!st || !STATUS[st]) return '';
    return `<span class="tag ${STATUS[st].cls}">${STATUS[st].label}</span>`;
  }

  function renderTable(b) {
    const head = b.head.map(h => `<th scope="col">${esc(h)}</th>`).join('');
    const rows = b.rows.map(r => `<tr>${r.map((c, i) => `<td${i === 0 ? ' data-label="' + esc(b.head[0]) + '"' : ''}>${esc(c)}</td>`).join('')}</tr>`).join('');
    return `${b.title ? `<h3>${esc(b.title)}</h3>` : ''}<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>${b.note ? `<p class="note">${esc(b.note)}</p>` : ''}`;
  }

  function renderBlock(b) {
    switch (b.type) {
      case 'indicators':
        return `<div class="block indicators">${b.items.map(i => `<div><span class="k">${esc(i.k)}</span><span class="v">${esc(i.v)}</span></div>`).join('')}</div>`;
      case 'list':
        return `<div class="block">${b.title ? `<h3>${esc(b.title)}</h3>` : ''}<ul class="list">${b.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`;
      case 'pillars':
        return `<div class="block pillars">${b.items.map((p, i) => `<article class="pillar"><span class="n">${String(i + 1).padStart(2, '0')}</span><h4>${esc(p.t)}</h4><p>${esc(p.d)}</p>${tagFor(p.st)}</article>`).join('')}</div>`;
      case 'stats':
        return `<div class="block stats">${b.items.map(s => `<div class="stat"><span class="v">${esc(s.v)}</span><span class="k">${esc(s.k)}</span><span class="src">${esc(s.src)}</span>${tagFor(s.st)}</div>`).join('')}</div>`;
      case 'table':
        return `<div class="block">${renderTable(b)}</div>`;
      case 'callout':
        return `<div class="block"><blockquote class="callout" style="margin:0">${tagFor(b.st)}<span>${esc(b.text)}</span></blockquote></div>`;
      case 'cards':
        return `<div class="block cards">${b.items.map(c => `<article class="card"><h4>${esc(c.t)}</h4><p>${esc(c.d)}</p>${c.tag ? `<span class="tag">${esc(c.tag)}</span>` : ''}</article>`).join('')}</div>`;
      case 'flow':
        return `<div class="block flow" role="list">${b.items.map((s, i) => `<div role="listitem"><span class="i">${i + 1}</span>${esc(s)}</div>`).join('')}</div>`;
      case 'timeline':
        return `<div class="block timeline">${b.items.map(s => `<div class="step"><h4>${esc(s.t)}</h4><p>${esc(s.d)}</p><span class="gate">${esc(s.gate)}</span></div>`).join('')}</div>`;
      case 'simulators':
        return `<div class="block" id="simulators">${renderSimulatorShell()}</div>`;
      case 'cta':
        return `<div class="block cta-block" id="cta"><p class="eyebrow" style="margin:0;color:var(--sky)">Siguiente paso</p><h3 class="big" id="cta-title" style="color:var(--ivory);text-transform:none;letter-spacing:0;font:400 clamp(32px,4.4vw,52px)/1.05 var(--serif)"></h3><p id="cta-body"></p><div><a class="btn" id="cta-btn" href="#contact">Solicitar reunión</a></div></div>`;
      case 'contact':
        return `<div class="block" id="contact"><h3>Contacto</h3><div class="contact-grid">
          <div><span class="k">Responsable</span><span class="v">${esc(CONFIG.contact.name)}</span></div>
          <div><span class="k">Correo</span><span class="v">${esc(CONFIG.contact.email)}</span></div>
          <div><span class="k">Teléfono</span><span class="v">${esc(CONFIG.contact.phone)}</span></div>
          <div><span class="k">Sitio</span><span class="v">${esc(CONFIG.contact.web)}</span></div></div>
          <p class="note">Datos de contacto pendientes de confirmar antes de compartir el documento.</p></div>`;
      case 'disclaimer':
        return `<div class="disclaimer" role="note"><strong>Aviso importante.</strong> ${esc(CONFIG.confidentialNote)} Las proyecciones dependen de supuestos. Los resultados pasados no garantizan resultados futuros. No existe garantía de ocupación, rentabilidad ni recuperación de inversión. Las oportunidades están sujetas a due diligence y los términos de cualquier inversión deberán formalizarse mediante documentación legal independiente. No constituye asesoría financiera, fiscal ni legal, ni una oferta pública o privada de valores.
          <ul><li>Cifras de mercado: verificar fuente y fecha antes de citar.</li><li>Estimaciones propias y supuestos de dirección no son cifras oficiales.</li><li>Cualquier oferta privada de valores requiere documentación y asesoría legal especializada.</li></ul></div>`;
      default:
        return '';
    }
  }

  function renderChapter(c) {
    if (c.id === 'cover') return '';
    const audienceNote = c.audience ? `<p class="note" style="margin:-24px 0 32px">Ruta: ${c.audience === 'capital' ? 'Capital Partners' : 'Property Partners'}</p>` : '';
    return `<section class="chapter" id="ch-${c.id}" aria-labelledby="h-${c.id}" data-id="${c.id}">
      <div class="chapter-inner">
        <header class="chap-head">
          <div class="chap-num" aria-hidden="true">${c.num}</div>
          <div>${c.kicker ? `<span class="kicker">${esc(c.kicker)}</span>` : ''}<h2 id="h-${c.id}">${esc(c.title)}</h2></div>
        </header>
        ${c.lead ? `<p class="lead">${esc(c.lead)}</p>` : ''}
        ${audienceNote}
        ${c.blocks.map(renderBlock).join('')}
      </div>
    </section>`;
  }

  /* ---------- Portada, navegación ---------- */
  function renderCover() {
    return `<section class="cover" id="ch-cover" aria-labelledby="h-cover">
      ${ellipsisSVG('ellipsis-hero', 380)}
      <div class="cover-inner">
        <span class="eyebrow">${esc(CONFIG.descriptor)} · ${esc(CONFIG.date)}</span>
        <h1 id="h-cover">UNWRITTEN <span class="live">LIVING</span></h1>
        <p class="lede">The Next Evolution of Hospitality.</p>
        <p class="meta">${esc(CONFIG.deckTitle)} · ${esc(CONFIG.market)} · Versión ${esc(CONFIG.version)} · Confidencial</p>
      </div>
      <div class="selector" role="group" aria-label="Seleccione su ruta de lectura">
        <button type="button" data-audience="capital" aria-pressed="false">
          <span class="k">Ruta 01</span><span class="t">Explore as Capital Partner</span>
          <span class="d">Plataforma, modelo financiero, uso de fondos y hoja de ruta.</span></button>
        <button type="button" data-audience="property" aria-pressed="false">
          <span class="k">Ruta 02</span><span class="t">Explore as Property Partner</span>
          <span class="d">Perfil del activo, estándar de auditoría, simulador de factibilidad.</span></button>
      </div>
    </section>`;
  }

  function renderNav() {
    const nav = document.getElementById('navlinks');
    const ids = state.audience === 'property' ? ['assets', 'standards', 'financials', 'partnership', 'market', 'close'] : NAV_IDS;
    const label = { summary: 'Resumen', market: 'Mercado', assets: 'Activos', business: 'Modelo', financials: 'Financiero', capital: 'Capital', partnership: 'Propietarios', close: 'Contacto', standards: 'Estándares' };
    nav.innerHTML = ids.map(id => `<a href="#ch-${id}" data-nav="${id}">${label[id]}</a>`).join('');
  }

  function applyAudience(a) {
    state.audience = a;
    document.body.dataset.audience = a || '';
    document.querySelectorAll('[data-audience]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.audience === a)));
    const order = ORDER[a] || ORDER.capital;
    const map = Object.fromEntries(CHAPTERS.map(c => [c.id, c]));
    const main = document.getElementById('deck');
    main.innerHTML = renderCover() + order.filter(id => id !== 'cover').map(id => renderChapter(map[id])).join('');
    const cta = CTA[a] || CTA.default;
    const t = document.getElementById('cta-title'), bd = document.getElementById('cta-body'), bt = document.getElementById('cta-btn');
    if (t) { t.textContent = cta.title; bd.textContent = cta.body; bt.textContent = cta.btn; }
    main.querySelectorAll('[data-audience]').forEach(b => b.addEventListener('click', () => choose(b.dataset.audience)));
    renderNav();
    initSimulators();
    renderSimulatorTabs();
    refreshSimulator();
    try { localStorage.setItem('ul-audience', a || ''); } catch (e) { /* almacenamiento opcional */ }
    if (a) document.getElementById('ch-summary').scrollIntoView({ behavior: 'smooth' });
  }

  function choose(a) {
    applyAudience(a);
    history.replaceState(null, '', '#ch-summary');
  }

  /* ---------- Simuladores ---------- */
  const CORP_INPUTS = [
    { g: 'Portafolio', k: 'properties', label: 'Propiedades', min: 1, max: 200, step: 1, fmt: fmtNum.format, hint: 'Número de activos bajo administración' },
    { g: 'Portafolio', k: 'unitsPerProperty', label: 'Unidades por propiedad', min: 1, max: 100, step: 1, fmt: fmtNum.format },
    { g: 'Operación', k: 'occupancy', label: 'Ocupación', min: 0, max: 1, step: 0.01, fmt: pct },
    { g: 'Operación', k: 'adr', label: 'ADR (MXN)', min: 500, max: 6000, step: 50, fmt: money },
    { g: 'Operación', k: 'daysPerMonth', label: 'Días por mes', min: 28, max: 31, step: 1, fmt: fmtNum.format },
    { g: 'Operación', k: 'fee', label: 'Management Fee', min: 0, max: 0.35, step: 0.005, fmt: pct, hint: 'Sobre ingreso de alojamiento' },
    { g: 'Costos', k: 'variableCostPerUnit', label: 'Costo variable por unidad (MXN/mes)', min: 0, max: 5000, step: 50, fmt: money, hint: 'Supuesto agregado, por validar' },
    { g: 'Costos', k: 'ancillaryPerUnit', label: 'Ingreso ancillary por unidad (MXN/mes)', min: 0, max: 5000, step: 50, fmt: money },
    { g: 'Costos', k: 'fixedMonthly', label: 'Costos fijos corporativos (MXN/mes)', min: 0, max: 1000000, step: 5000, fmt: money, hint: 'Nómina, tecnología, marketing, seguros' }
  ];
  const ASSET_INPUTS = [
    { g: 'Activo', k: 'keys', label: 'Habitaciones / unidades', min: 1, max: 300, step: 1, fmt: fmtNum.format },
    { g: 'Operación', k: 'occupancy', label: 'Ocupación estabilizada', min: 0, max: 1, step: 0.01, fmt: pct },
    { g: 'Operación', k: 'adr', label: 'ADR estabilizado (MXN)', min: 500, max: 6000, step: 50, fmt: money },
    { g: 'Operación', k: 'opexRatio', label: 'Costo operativo (% ingreso de alojamiento)', min: 0, max: 1, step: 0.01, fmt: pct, hint: 'Departamental y no distribuido. Por validar' },
    { g: 'Operación', k: 'fee', label: 'Management Fee', min: 0, max: 0.35, step: 0.005, fmt: pct },
    { g: 'Inversión', k: 'capex', label: 'CAPEX total (MXN)', min: 0, max: 100000000, step: 100000, fmt: money, hint: 'Adecuaciones; normalmente financiadas por el propietario' },
    { g: 'Proyección', k: 'growth', label: 'Crecimiento anual del NOI', min: -0.1, max: 0.15, step: 0.005, fmt: pct },
    { g: 'Proyección', k: 'years', label: 'Horizonte (años)', min: 1, max: 20, step: 1, fmt: fmtNum.format },
    { g: 'Proyección', k: 'discountRate', label: 'Tasa de descuento', min: 0, max: 0.4, step: 0.005, fmt: pct }
  ];

  function renderSimulatorShell() {
    return `<div class="sim-tabs" role="tablist" aria-label="Simuladores">
        <button type="button" role="tab" id="tab-corp" aria-controls="sim-panel" data-sim="corporate" aria-selected="true">A · Modelo corporativo</button>
        <button type="button" role="tab" id="tab-asset" aria-controls="sim-panel" data-sim="asset" aria-selected="false">B · Factibilidad de activo</button>
      </div>
      <div id="sim-panel" role="tabpanel" aria-labelledby="tab-corp"></div>`;
  }

  function renderSimulatorTabs() {
    document.querySelectorAll('.sim-tabs [data-sim]').forEach(b => {
      b.setAttribute('aria-selected', String(b.dataset.sim === state.sim));
      b.onclick = () => { state.sim = b.dataset.sim; renderSimulatorTabs(); refreshSimulator(); };
    });
  }

  function initSimulators() { /* estado ya inicializado; reservado para extensiones */ }

  function inputsHTML(defs, values, prefix) {
    let g = '', html = '';
    defs.forEach(d => {
      if (d.g !== g) { if (g) html += ''; g = d.g; html += `<div class="group-title">${esc(d.g)}</div>`; }
      const v = values[d.k];
      const id = `${prefix}-${d.k}`;
      html += `<div class="field" data-key="${d.k}">
        <div class="field-head"><label for="${id}">${esc(d.label)}</label><output for="${id}" id="${id}-out">${d.fmt(v)}</output></div>
        <input type="range" id="${id}-r" min="${d.min}" max="${d.max}" step="${d.step}" value="${v}" aria-label="${esc(d.label)} (deslizador)">
        <input type="number" id="${id}" min="${d.min}" max="${d.max}" step="${d.step}" value="${v}" inputmode="decimal">
        ${d.hint ? `<span class="hint">${esc(d.hint)}</span>` : ''}
        <span class="err" role="alert">Valor fuera del rango permitido (${d.fmt(d.min)} – ${d.fmt(d.max)}).</span>
      </div>`;
    });
    return html;
  }

  function bindInputs(defs, obj, prefix, onChange) {
    defs.forEach(d => {
      const id = `${prefix}-${d.k}`;
      const num = document.getElementById(id), rng = document.getElementById(`${id}-r`), out = document.getElementById(`${id}-out`);
      const wrap = num.closest('.field');
      const set = raw => {
        const v = Number(raw);
        const bad = raw === '' || !Number.isFinite(v) || v < d.min || v > d.max;
        wrap.classList.toggle('invalid', bad);
        if (!bad) { obj[d.k] = v; rng.value = v; out.textContent = d.fmt(v); }
        else if (raw !== '') { obj[d.k] = Math.min(d.max, Math.max(d.min, Number.isFinite(v) ? v : obj[d.k])); }
        onChange();
      };
      num.addEventListener('input', e => set(e.target.value));
      rng.addEventListener('input', e => { num.value = e.target.value; set(e.target.value); });
    });
  }

  function setScenario(key) {
    state.scenario = key;
    const s = SCENARIOS[key];
    Object.assign(state.corp, BASE_ASSUMPTIONS.corporate, s.corporate);
    Object.assign(state.asset, BASE_ASSUMPTIONS.asset, s.asset);
    refreshSimulator();
  }

  function refreshSimulator() {
    const panel = document.getElementById('sim-panel');
    if (!panel) return;
    const isCorp = state.sim === 'corporate';
    const defs = isCorp ? CORP_INPUTS : ASSET_INPUTS;
    const vals = isCorp ? state.corp : state.asset;
    const prefix = isCorp ? 'c' : 'a';
    const scen = Object.keys(SCENARIOS).map(k => `<button type="button" data-scen="${k}" aria-pressed="${state.scenario === k}">${SCENARIOS[k].label}</button>`).join('');
    const notice = `<div class="notice">Los supuestos base son preliminares y deben validarse con el piloto. Los escenarios son ilustrativos; ninguno es un resultado garantizado.</div>`;

    panel.innerHTML = `<div class="sim">
      <aside class="panel" aria-label="Supuestos">
        <h4>Supuestos</h4>
        <div class="scen" role="group" aria-label="Escenario">${scen}</div>
        ${inputsHTML(defs, vals, prefix)}
        <div class="sim-actions">
          <button class="btn" type="button" id="btn-reset">Restablecer base</button>
          <button class="btn" type="button" id="btn-csv">Exportar CSV</button>
          <button class="btn" type="button" id="btn-json">Descargar JSON</button>
          <button class="btn" type="button" id="btn-print">Imprimir</button>
        </div>
      </aside>
      <div>
        ${notice}
        <div id="results"></div>
        <div id="charts" style="margin-top:20px"></div>
      </div>
    </div>`;

    panel.querySelectorAll('[data-scen]').forEach(b => b.addEventListener('click', () => setScenario(b.dataset.scen)));
    bindInputs(defs, vals, prefix, () => { state.scenario = 'custom'; renderResults(); });
    document.getElementById('btn-reset').onclick = () => { state.scenario = 'base'; setScenario('base'); };
    document.getElementById('btn-csv').onclick = exportCSV;
    document.getElementById('btn-json').onclick = exportJSON;
    document.getElementById('btn-print').onclick = () => window.print();
    renderResults();
  }

  function kpi(k, v, s, cls, hero) {
    return `<div class="kpi${hero ? ' hero' : ''}"><span class="k">${esc(k)}</span><span class="v ${cls || ''}">${v}</span>${s ? `<span class="s">${esc(s)}</span>` : ''}</div>`;
  }

  function renderResults() {
    const out = document.getElementById('results');
    if (!out) return;
    if (state.sim === 'corporate') {
      const r = F.corporate(state.corp);
      const be = r.breakEvenUnits;
      out.innerHTML = `<div class="kpis">
        ${kpi('Unidades gestionadas', fmtNum.format(r.units), 'Propiedades × unidades')}
        ${kpi('Gross Booking Value', money(r.gbv), 'Ingreso bruto de alojamiento / mes')}
        ${kpi('Management Revenue', money(r.mgmtRevenue), 'Ingreso del operador / mes', '', true)}
        ${kpi('Contribución', money(r.contribution), 'Ingreso recurrente − costo variable', r.contribution < 0 ? 'neg' : '')}
        ${kpi('EBITDA mensual', money(r.ebitda), `Margen ${pct(r.ebitdaMargin)}`, r.ebitda < 0 ? 'neg' : '')}
        ${kpi('Unidades para equilibrio', be === null ? 'Pending' : fmtNum.format(be), 'Costos fijos / contribución unitaria')}
      </div>
      <div class="table-wrap"><table class="table-compact"><thead><tr><th>Concepto</th><th class="num">MXN / mes</th></tr></thead><tbody>
        <tr><td>Gross Booking Value</td><td class="num">${money(r.gbv)}</td></tr>
        <tr><td>Management Revenue</td><td class="num">${money(r.mgmtRevenue)}</td></tr>
        <tr><td>Ancillary Revenue</td><td class="num">${money(r.ancillary)}</td></tr>
        <tr><td>Total Revenue recurrente</td><td class="num">${money(r.totalRevenue)}</td></tr>
        <tr><td>Costos variables</td><td class="num">−${money(r.variableCosts)}</td></tr>
        <tr><td>Contribución</td><td class="num">${money(r.contribution)}</td></tr>
        <tr><td>Costos fijos</td><td class="num">−${money(r.fixed)}</td></tr>
        <tr><td><strong>EBITDA</strong></td><td class="num"><strong>${money(r.ebitda)}</strong></td></tr>
        <tr><td>Onboarding fees (no recurrentes, fuera del EBITDA)</td><td class="num">${money(r.onboardingOneOff)}</td></tr>
      </tbody></table></div>
      <p class="note">Ingreso del propietario = Gross Booking Value − Management Revenue (no se muestra como ingreso de la operadora). Impuestos, IVA y financiamiento no incluidos.</p>`;
      renderCorpChart();
    } else {
      const r = F.asset(state.asset);
      out.innerHTML = `<div class="kpis">
        ${kpi('RevPAR', money(r.revpar), 'Ingreso por habitación disponible / año')}
        ${kpi('Gross Accommodation Revenue', money(r.roomRevenue), 'Anual')}
        ${kpi('GOP', money(r.gop), `Margen ${pct(r.gopMargin)}`, r.gop < 0 ? 'neg' : '')}
        ${kpi('Operator Revenue', money(r.operatorRevenueYear1), 'Management fee, año 1', '', true)}
        ${kpi('Owner NOI', money(r.ownerNoi), 'GOP − management fee', r.ownerNoi < 0 ? 'neg' : '')}
        ${kpi('CAPEX por unidad', money(r.capexPerKey), 'CAPEX / habitaciones')}
        ${kpi('Cash-on-cash', pct(r.cashOnCash), 'Owner NOI año 1 / CAPEX')}
        ${kpi('Payback', years(r.paybackYears), 'Simple, con interpolación')}
        ${kpi('TIR (IRR)', r.irr === null ? 'Pending' : pct(r.irr), 'Sobre flujos del horizonte')}
        ${kpi('VPN (NPV)', money(r.npv), 'A la tasa de descuento')}
        ${kpi('Múltiplo', r.investmentMultiple ? r.investmentMultiple.toFixed(2) + '×' : 'Pending', 'Flujos acumulados / CAPEX')}
      </div>
      <p class="note">Ingreso del operador = management fee. Ingreso del propietario = Owner NOI antes de reservas FF&E, impuestos y financiamiento. TIR y VPN son ilustrativos y no incluyen valor terminal.</p>
      ${renderScenarioTable()}
      ${renderHeat()}`;
      renderCumChart(r);
    }
  }

  function renderScenarioTable() {
    const keys = ['conservative', 'base', 'upside'];
    const rows = keys.map(k => {
      const merged = Object.assign({}, BASE_ASSUMPTIONS.asset, SCENARIOS[k].asset);
      const a = F.asset(merged);
      const c = F.corporate(Object.assign({}, BASE_ASSUMPTIONS.corporate, SCENARIOS[k].corporate, { properties: 10, unitsPerProperty: 4 }));
      return { label: SCENARIOS[k].label, a, c };
    });
    const line = (name, f) => `<tr><td>${name}</td>${rows.map(r => `<td class="num">${f(r)}</td>`).join('')}</tr>`;
    return `<h3 style="margin:28px 0 12px;font:600 12px/1.2 var(--sans);letter-spacing:.16em;text-transform:uppercase;color:var(--ocean)">Comparación de escenarios (activo de referencia)</h3>
      <div class="table-wrap"><table class="table-compact"><thead><tr><th>Métrica</th>${rows.map(r => `<th class="num">${r.label}</th>`).join('')}</tr></thead><tbody>
      ${line('Gross Revenue anual', r => money(r.a.roomRevenue))}
      ${line('GOP', r => money(r.a.gop))}
      ${line('EBITDA corporativo (10 propiedades, mensual)', r => money(r.c.ebitda))}
      ${line('CAPEX', r => money(F.asset(Object.assign({}, BASE_ASSUMPTIONS.asset, SCENARIOS[keys[rows.indexOf(r)]].asset)).cashFlows[0] * -1))}
      ${line('Payback', r => years(r.a.paybackYears))}
      ${line('TIR', r => r.a.irr === null ? 'Pending' : pct(r.a.irr))}
      ${line('VPN', r => money(r.a.npv))}
      ${line('Owner Cash Flow anual', r => money(r.a.ownerNoi))}
      ${line('Operator Revenue anual', r => money(r.a.mgmtFee))}
      </tbody></table></div>
      <p class="note">Los tres escenarios son ilustrativos. El escenario optimista no es un resultado esperado.</p>`;
  }

  function renderHeat() {
    const occs = [0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70];
    const adrs = [1200, 1500, 1800, 2000, 2300, 2500, 3000];
    const grid = F.sensitivity(state.asset, occs, adrs);
    const flat = grid.flat();
    const max = Math.max(...flat, 1), min = Math.min(...flat, 0);
    const color = v => {
      if (v < 0) return `rgba(142,47,47,${Math.min(.55, Math.abs(v) / Math.max(1, Math.abs(min)) * .55 + .1)})`;
      return `rgba(71,127,159,${(0.08 + (v / max) * 0.6).toFixed(2)})`;
    };
    const head = adrs.map(a => `<th class="num">${money(a)}</th>`).join('');
    const body = occs.map((o, i) => `<tr><th scope="row" class="num">${pct(o)}</th>${grid[i].map(v => `<td style="background:${color(v)}" title="${money(v)}">${fmtNum.format(v / 1000)}k</td>`).join('')}</tr>`).join('');
    return `<h3 style="margin:28px 0 12px;font:600 12px/1.2 var(--sans);letter-spacing:.16em;text-transform:uppercase;color:var(--ocean)">Sensibilidad · Owner NOI anual (miles MXN)</h3>
      <div class="table-wrap"><table class="heat"><thead><tr><th>Ocupación ↓ / ADR →</th>${head}</tr></thead><tbody>${body}</tbody></table></div>
      <p class="legend">Celdas en azul: NOI positivo; en rojo: negativo. Otros supuestos según el panel.</p>`;
  }

  function svgBars(points, labelFn, valueFn, w, h) {
    const vals = points.map(valueFn);
    const max = Math.max(...vals, 1), min = Math.min(...vals, 0);
    const range = max - min || 1;
    const bw = (w - 60) / points.length;
    const y0 = 20 + (h - 50) * (max / range);
    const bars = points.map((p, i) => {
      const v = valueFn(p);
      const top = 20 + (h - 50) * ((max - Math.max(v, 0)) / range);
      const bottom = 20 + (h - 50) * ((max - Math.min(v, 0)) / range);
      const x = 50 + i * bw + bw * 0.15;
      return `<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${(bw * 0.7).toFixed(1)}" height="${Math.max(1, bottom - top).toFixed(1)}" fill="${v < 0 ? '#8E2F2F' : '#263B55'}" opacity=".88"><title>${labelFn(p)}: ${money(v)}</title></rect>`;
    }).join('');
    const zeroY = y0 + 0 ;
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Gráfica de barras">
      <line class="axis" x1="50" x2="${w - 10}" y1="${(20 + (h - 50) * (max / range)).toFixed(1)}" y2="${(20 + (h - 50) * (max / range)).toFixed(1)}"/>
      ${bars}
      ${points.filter((_, i) => i % 4 === 0).map((p) => { const i = points.indexOf(p); return `<text x="${(50 + i * bw).toFixed(1)}" y="${h - 8}">${labelFn(p)}</text>`; }).join('')}
    </svg>`;
  }

  function renderCorpChart() {
    const pts = [];
    for (let u = 2; u <= 100; u += 2) {
      const p = Math.ceil(u / state.corp.unitsPerProperty);
      const r = F.corporate(Object.assign({}, state.corp, { properties: p }));
      pts.push({ units: r.units, ebitda: r.ebitda });
    }
    document.getElementById('charts').innerHTML = `<div class="panel"><h4>EBITDA mensual por número de unidades</h4>
      ${svgBars(pts, p => fmtNum.format(p.units), p => p.ebitda, 640, 260)}
      <p class="legend">Con los supuestos actuales. Positivo a partir del punto de equilibrio.</p></div>`;
  }

  function renderCumChart(r) {
    const cum = []; let acc = 0;
    r.cashFlows.forEach((cf, t) => { acc += cf; cum.push({ t, v: acc }); });
    const max = Math.max(...cum.map(c => c.v), 1), min = Math.min(...cum.map(c => c.v), 0);
    const w = 640, h = 240, range = max - min || 1;
    const x = i => 50 + (i / Math.max(1, cum.length - 1)) * (w - 70);
    const y = v => 20 + (h - 50) * ((max - v) / range);
    const path = cum.map((c, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(c.v).toFixed(1)}`).join(' ');
    const dots = cum.map((c, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(c.v).toFixed(1)}" r="3" fill="#263B55"><title>Año ${c.t}: ${money(c.v)}</title></circle>`).join('');
    document.getElementById('charts').innerHTML = `<div class="panel"><h4>Flujo acumulado del propietario</h4>
      <svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Flujo acumulado">
        <line class="axis" x1="50" x2="${w - 10}" y1="${y(0).toFixed(1)}" y2="${y(0).toFixed(1)}"/>
        <path d="${path}" fill="none" stroke="#477F9F" stroke-width="2"/>${dots}
        ${cum.filter((_, i) => i % 2 === 0).map(c => `<text x="${x(c.t).toFixed(1)}" y="${h - 8}">A${c.t}</text>`).join('')}
      </svg>
      <p class="legend">Año 0 = inversión inicial. Sin valor terminal ni reservas de reposición.</p></div>`;
  }

  /* ---------- Exportación ---------- */
  function download(name, content, type) {
    const blob = new Blob([content], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function snapshot() {
    const corp = F.corporate(state.corp), asset = F.asset(state.asset);
    return {
      document: `${CONFIG.operatorName} · ${CONFIG.deckTitle}`,
      version: CONFIG.version, date: CONFIG.date, scenario: state.scenario,
      status: 'Escenario ilustrativo. No constituye proyección garantizada.',
      assumptions: { corporate: state.corp, asset: state.asset },
      results: { corporate: corp, asset: { ...asset, cashFlows: asset.cashFlows.map(v => Math.round(v)) } }
    };
  }

  function exportCSV() {
    const s = snapshot();
    const rows = [['seccion', 'clave', 'valor']];
    const flat = (prefix, o) => Object.entries(o).forEach(([k, v]) => {
      if (Array.isArray(v)) rows.push([prefix, k, v.map(x => Math.round(x)).join(' | ')]);
      else if (v && typeof v === 'object') flat(prefix + '.' + k, v);
      else rows.push([prefix, k, v === null ? 'Pending' : v]);
    });
    flat('supuestos.corporativo', s.assumptions.corporate);
    flat('supuestos.activo', s.assumptions.asset);
    flat('resultados.corporativo', s.results.corporate);
    flat('resultados.activo', s.results.asset);
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    download(`unwritten-escenario-${state.scenario}.csv`, '﻿' + csv, 'text/csv;charset=utf-8');
  }

  function exportJSON() {
    download(`unwritten-escenario-${state.scenario}.json`, JSON.stringify(snapshot(), null, 2), 'application/json');
  }

  /* ---------- Chrome: progreso, presentación, teclado ---------- */
  function initChrome() {
    const bar = document.getElementById('progress');
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
      const cur = [...document.querySelectorAll('section[data-id], section#ch-cover')].reverse().find(s => s.getBoundingClientRect().top < innerHeight * 0.4);
      if (cur) document.querySelectorAll('[data-nav]').forEach(a => a.setAttribute('aria-current', String(a.dataset.nav === cur.dataset.id)));
    };
    addEventListener('scroll', onScroll, { passive: true });
    document.getElementById('btn-present').addEventListener('click', togglePresent);
    document.getElementById('btn-top').addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
    document.addEventListener('keydown', e => {
      if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
      const secs = [...document.querySelectorAll('section.chapter, section.cover')];
      const idx = secs.findIndex(s => s.getBoundingClientRect().top >= -10 && s.getBoundingClientRect().top < innerHeight / 2);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') { if (document.body.classList.contains('presenting')) { e.preventDefault(); secs[Math.min(secs.length - 1, idx + 1)]?.scrollIntoView({ behavior: 'smooth' }); } }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') { if (document.body.classList.contains('presenting')) { e.preventDefault(); secs[Math.max(0, idx - 1)]?.scrollIntoView({ behavior: 'smooth' }); } }
      if (e.key === 'Escape' && document.body.classList.contains('presenting')) togglePresent();
    });
    onScroll();
  }

  function togglePresent() {
    const on = document.body.classList.toggle('presenting');
    document.getElementById('btn-present').setAttribute('aria-pressed', String(on));
    document.getElementById('btn-present').textContent = on ? 'Salir' : 'Presentar';
  }

  /* ---------- Arranque ---------- */
  function boot() {
    document.getElementById('brand-ellipsis').innerHTML = ellipsisSVG('ellipsis', 46);
    initChrome();
    let saved = null;
    try { saved = localStorage.getItem('ul-audience'); } catch (e) { /* sin almacenamiento */ }
    const hashAud = new URLSearchParams(location.search).get('ruta');
    const start = (hashAud === 'capital' || hashAud === 'property') ? hashAud : (saved === 'capital' || saved === 'property' ? saved : null);
    applyAudience(start);
    if (!start) document.body.dataset.audience = '';
    document.getElementById('footer-version').textContent = `Versión ${CONFIG.version} · ${CONFIG.date}`;
    document.getElementById('sources-list').innerHTML = SOURCES.map(s => `<li><strong>${esc(s.id)}</strong> — ${esc(s.name)}. <em>${esc(s.use)}.</em> Estado: ${esc(s.status)}.</li>`).join('');
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
