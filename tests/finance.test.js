/* Pruebas del motor financiero. Ejecutar: node tests/finance.test.js */
'use strict';
const assert = require('assert');
const F = require('../assets/js/finance.js');

const close = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) <= eps, `esperado ${b}, obtenido ${a}`);

/* Modelo corporativo: cifras del documento de negocio */
const unit = F.corporate({
  properties: 1, unitsPerProperty: 1, daysPerMonth: 30, occupancy: 0.5, adr: 2000,
  fee: 0.22, ancillaryPerUnit: 0, variableCostPerUnit: 1500, fixedMonthly: 240000
});
assert.strictEqual(unit.gbv, 30000, 'GBV por unidad');
assert.strictEqual(unit.mgmtRevenue, 6600, 'Management fee 22% de 30,000');
assert.strictEqual(unit.contributionPerUnit, 5100, 'Contribución unitaria');

const forty8 = F.corporate({
  properties: 12, unitsPerProperty: 4, daysPerMonth: 30, occupancy: 0.5, adr: 2000,
  fee: 0.22, variableCostPerUnit: 1500, fixedMonthly: 240000
});
assert.strictEqual(forty8.units, 48);
assert.strictEqual(forty8.breakEvenUnits, 48, 'Punto de equilibrio de 48 unidades');

const at47 = F.corporate({
  properties: 47, unitsPerProperty: 1, daysPerMonth: 30, occupancy: 0.5, adr: 2000,
  fee: 0.22, variableCostPerUnit: 1500, fixedMonthly: 240000
});
assert.ok(at47.ebitda < 0, '47 unidades aún no alcanzan equilibrio');

/* Entradas inválidas no producen NaN */
const bad = F.corporate({ properties: -3, occupancy: 9, adr: 'x', fee: 2, fixedMonthly: 1000 });
assert.ok(Number.isFinite(bad.ebitda), 'entradas inválidas deben quedar acotadas');

/* Activo: valor presente y TIR sobre flujos conocidos */
assert.strictEqual(F.npv(0.1, [-100, 110]).toFixed(6), (110 / 1.1 - 100).toFixed(6));
const r = F.irr([-100, 110]);
close(r, 0.1, 1e-5);
assert.strictEqual(F.irr([100, 10]), null, 'sin inversión inicial no hay TIR');

/* Payback con interpolación */
close(F.payback([-100, 50, 50, 50]), 2, 1e-9);
assert.strictEqual(F.payback([-100, 10, 10]), null, 'sin recuperación devuelve null');

/* Activo: consistencia de GOP y fee */
const a = F.asset({
  keys: 30, adr: 2000, occupancy: 0.5, fee: 0.22, opexRatio: 0.6,
  capex: 6000000, growth: 0, years: 10, discountRate: 0.14
});
close(a.roomRevenue, 30 * 365 * 0.5 * 2000, 1e-3);
close(a.gop, a.roomRevenue * 0.4, 1e-3);
close(a.ownerNoi, a.gop - a.mgmtFee, 1e-3);
assert.strictEqual(a.cashFlows.length, 11, 'inversión inicial más 10 años');

const grid = F.sensitivity({ keys: 30, fee: 0.22, opexRatio: 0.6, capex: 6e6, growth: 0, years: 10, discountRate: 0.14 },
  [0.35, 0.5], [1500, 2000]);
assert.strictEqual(grid.length, 2);
assert.strictEqual(grid[0].length, 2);
assert.ok(grid[1][1] > grid[0][0], 'mayor ocupación y ADR producen mayor NOI');

console.log('OK: todas las pruebas del motor financiero pasaron.');
