/* ==========================================================================
   UNWRITTEN Homes & Villas — Motor financiero (puro, sin DOM)
   Fórmulas documentadas en docs/formulas.md. Probado en tests/finance.test.js.
   ========================================================================== */
(function (root) {
  'use strict';

  const DAYS_YEAR = 365;

  function num(v, fallback) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  /* Simulador A — Modelo corporativo (mensual) */
  function corporate(a) {
    const properties = Math.max(0, num(a.properties, 0));
    const unitsPerProperty = Math.max(0, num(a.unitsPerProperty, 0));
    const units = properties * unitsPerProperty;
    const days = num(a.daysPerMonth, 30);
    const occ = clamp01(num(a.occupancy, 0));
    const adr = Math.max(0, num(a.adr, 0));
    const fee = clamp01(num(a.fee, 0));
    const ancillaryPerUnit = Math.max(0, num(a.ancillaryPerUnit, 0));
    const varCost = Math.max(0, num(a.variableCostPerUnit, 0));
    const fixed = Math.max(0, num(a.fixedMonthly, 0));

    const gbv = units * days * occ * adr;                 // Gross Booking Value
    const mgmtRevenue = gbv * fee;                        // Management Revenue
    const ancillary = units * ancillaryPerUnit;           // Ancillary Revenue
    const totalRevenue = mgmtRevenue + ancillary;         // Total Company Revenue (recurrente)
    const variableCosts = units * varCost;
    const contribution = totalRevenue - variableCosts;
    const ebitda = contribution - fixed;
    const contributionPerUnit = units > 0 ? contribution / units : 0;
    const breakEvenUnits = contributionPerUnit > 0 ? Math.ceil(fixed / contributionPerUnit) : null;
    const ebitdaMargin = totalRevenue > 0 ? ebitda / totalRevenue : 0;
    const onboarding = properties * num(a.onboardingFeePerProperty, 0); // no recurrente, separado

    return {
      units, gbv, mgmtRevenue, ancillary, totalRevenue, variableCosts, contribution,
      fixed, ebitda, ebitdaMargin, contributionPerUnit, breakEvenUnits,
      onboardingOneOff: onboarding,
      unitRevenue: units > 0 ? totalRevenue / units : 0
    };
  }

  /* Simulador B — Factibilidad de activo (anual, con proyección) */
  function asset(a) {
    const keys = Math.max(0, num(a.keys, 0));
    const occ = clamp01(num(a.occupancy, 0));
    const adr = Math.max(0, num(a.adr, 0));
    const fee = clamp01(num(a.fee, 0));
    const opexRatio = clamp01(num(a.opexRatio, 0));
    const capex = Math.max(0, num(a.capex, 0));
    const growth = num(a.growth, 0);
    const years = Math.max(1, Math.round(num(a.years, 10)));
    const rate = num(a.discountRate, 0);

    const availableNights = keys * DAYS_YEAR;
    const occupiedNights = availableNights * occ;
    const roomRevenue = occupiedNights * adr;             // Gross Accommodation Revenue
    const revpar = availableNights > 0 ? roomRevenue / availableNights : 0;
    const opex = roomRevenue * opexRatio;                 // Departamentales y no distribuidos
    const gop = roomRevenue - opex;                       // GOP (simplificado)
    const gopMargin = roomRevenue > 0 ? gop / roomRevenue : 0;
    const mgmtFee = roomRevenue * fee;                    // Ingreso del operador
    const ownerNoi = gop - mgmtFee;                       // Owner NOI
    const cashOnCash = capex > 0 ? ownerNoi / capex : 0;
    const capexPerKey = keys > 0 ? capex / keys : 0;

    const flows = [];
    for (let t = 1; t <= years; t++) flows.push(ownerNoi * Math.pow(1 + growth, t - 1));
    const cfs = [-capex].concat(flows);

    return {
      availableNights, occupiedNights, roomRevenue, revpar, opex, gop, gopMargin,
      mgmtFee, ownerNoi, cashOnCash, capexPerKey,
      operatorRevenueYear1: mgmtFee,
      cashFlows: cfs,
      npv: npv(rate, cfs),
      irr: irr(cfs),
      paybackYears: payback(cfs),
      investmentMultiple: capex > 0 ? flows.reduce((s, x) => s + x, 0) / capex : 0
    };
  }

  /* Valor presente neto. cfs[0] ocurre en t=0. */
  function npv(rate, cfs) {
    return cfs.reduce((s, cf, t) => s + cf / Math.pow(1 + rate, t), 0);
  }

  /* TIR por bisección. Devuelve null si no hay cambio de signo. */
  function irr(cfs) {
    if (!cfs.length || cfs[0] >= 0) return null;
    const f = r => cfs.reduce((s, cf, t) => s + cf / Math.pow(1 + r, t), 0);
    let lo = -0.99, hi = 10;
    let fl = f(lo), fh = f(hi);
    if (fl * fh > 0) return null;
    for (let i = 0; i < 200; i++) {
      const mid = (lo + hi) / 2;
      const fm = f(mid);
      if (Math.abs(fm) < 1e-7) return mid;
      if (fl * fm < 0) { hi = mid; fh = fm; } else { lo = mid; fl = fm; }
    }
    return (lo + hi) / 2;
  }

  /* Payback simple en años, con interpolación. null si no recupera. */
  function payback(cfs) {
    let cum = cfs[0];
    if (cum >= 0) return 0;
    for (let t = 1; t < cfs.length; t++) {
      const prev = cum;
      cum += cfs[t];
      if (cum >= 0) return (t - 1) + (-prev / cfs[t]);
    }
    return null;
  }

  /* Matriz de sensibilidad: NOI anual del activo por ocupación × ADR */
  function sensitivity(base, occupancies, adrs) {
    return occupancies.map(o => adrs.map(p => asset(Object.assign({}, base, { occupancy: o, adr: p })).ownerNoi));
  }

  function clamp01(x) { return Math.min(1, Math.max(0, x)); }

  const api = { corporate, asset, npv, irr, payback, sensitivity };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.Finance = api;
})(typeof window !== 'undefined' ? window : globalThis);
