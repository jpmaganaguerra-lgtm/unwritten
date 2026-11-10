# Fórmulas del modelo

Todas las fórmulas están implementadas en `assets/js/finance.js` y cubiertas por `tests/finance.test.js`. Ninguna cifra vive fuera de `assets/js/data.js`.

## Definiciones (brief §7.2)

| Término | Definición |
|---|---|
| ADR | Ingreso de habitaciones ÷ habitaciones ocupadas |
| Occupancy | Habitaciones ocupadas ÷ habitaciones disponibles |
| RevPAR | Ingreso de habitaciones ÷ habitaciones disponibles |
| GOP | Ingresos operativos − gastos departamentales y no distribuidos. Versión simplificada: `costo operativo = ingreso de alojamiento × opexRatio` |
| EBITDA | Resultado antes de intereses, impuestos, depreciación y amortización |
| TIR (IRR) | Tasa que anula el VPN de los flujos del horizonte |
| VPN (NPV) | Suma de flujos descontados a la tasa indicada |
| Payback | Años hasta recuperar la inversión, con interpolación lineal |

## Simulador A · Modelo corporativo (mensual)

```
Unidades                    = propiedades × unidades por propiedad
Gross Booking Value (GBV)   = unidades × días × ocupación × ADR
Management Revenue          = GBV × management fee
Total Revenue recurrente    = Management Revenue + ancillary (unidades × ancillary por unidad)
Costos variables            = unidades × costo variable por unidad
Contribución                = Total Revenue − Costos variables
EBITDA                      = Contribución − costos fijos
Contribución por unidad     = Contribución ÷ unidades
Unidades para equilibrio    = ⌈ costos fijos ÷ contribución por unidad ⌉
Onboarding fees             = separados; no forman parte del EBITDA recurrente
```

Verificación con supuestos del documento de negocio (ADR $2,000, ocupación 50%, 30 días, fee 22%, costo variable $1,500, costos fijos $240,000):

- GBV por unidad = 30 × 0.50 × 2,000 = **$30,000**
- Management fee por unidad = 30,000 × 0.22 = **$6,600**
- Contribución por unidad = 6,600 − 1,500 = **$5,100**
- Equilibrio = ⌈240,000 ÷ 5,100⌉ = ⌈47.06⌉ = **48 unidades**

## Simulador B · Factibilidad de activo (anual)

```
Noches disponibles          = habitaciones × 365
Noches ocupadas             = noches disponibles × ocupación
Gross Accommodation Revenue = noches ocupadas × ADR
RevPAR                      = Gross Accommodation Revenue ÷ noches disponibles
Costo operativo             = Gross Accommodation Revenue × opexRatio
GOP                         = Gross Accommodation Revenue − costo operativo
Operator Revenue (año 1)    = Gross Accommodation Revenue × management fee
Owner NOI (año 1)           = GOP − Operator Revenue
Cash-on-cash                = Owner NOI año 1 ÷ CAPEX
CAPEX por unidad            = CAPEX ÷ habitaciones
Flujos                      = [−CAPEX, NOI, NOI(1+g), NOI(1+g)², …] hasta el horizonte
VPN                         = Σ flujo_t ÷ (1 + tasa)^t
TIR                         = r tal que VPN(r) = 0 (bisección en [−99%, 1000%])
Payback                     = primer t con flujo acumulado ≥ 0, con interpolación
```

## Limitaciones deliberadas

- No hay valor terminal. Los resultados son de flujo del horizonte.
- No hay reservas FF&E, impuestos, financiamiento ni depreciación en el simulador de activo. Deben añadirse en la versión con datos reales.
- El costo operativo es un ratio agregado. Debe reemplazarse por partidas (nómina, housekeeping, servicios) cuando existan cotizaciones.
- Todos los supuestos base son preliminares y están marcados como **Pending Validation** en la interfaz.

## Reglas de validación

- Porcentajes acotados entre 0% y 100%.
- Valores negativos se rechazan en la interfaz y se acotan en el motor.
- División entre cero devuelve 0 o `null` (equilibrio, TIR), mostrado como "Pending".
