/* ==========================================================================
   UNWRITTEN LIVING — Fuente única de datos (brief §9.3)
   Todas las cifras, textos y supuestos viven aquí. Nada se duplica en la UI.
   Estado de cada dato: VERIFIED | ASSUMPTION | ESTIMATE | PROJECTION | SCENARIO | PENDING
   ========================================================================== */
(function (root) {
  'use strict';

  const STATUS = {
    VERIFIED:   { label: 'Dato verificado',        cls: 'st-verified' },
    ASSUMPTION: { label: 'Supuesto de dirección',  cls: 'st-assumption' },
    ESTIMATE:   { label: 'Estimación de mercado',  cls: 'st-estimate' },
    PROJECTION: { label: 'Proyección',             cls: 'st-projection' },
    SCENARIO:   { label: 'Escenario ilustrativo',  cls: 'st-scenario' },
    PENDING:    { label: 'Pending Validation',     cls: 'st-pending' }
  };

  const CONFIG = {
    operatorName: 'UNWRITTEN LIVING',
    descriptor: 'INDEPENDENT HOSPITALITY',
    tagline: 'YOUR STORY IS FAR FROM OVER.',
    deckTitle: 'Investment & Property Partnership Overview',
    version: '1.0',
    date: 'Noviembre 2026',
    market: 'México',
    currency: 'MXN',
    confidentialNote: 'Documento confidencial. Material informativo y de discusión. No constituye una oferta de valores.',
    contact: {
      name: '[Nombre del responsable]',
      email: '[correo@dominio]',
      phone: '[+52 00 0000 0000]',
      web: '[dominio pendiente]'
    }
  };

  /* Supuestos base del modelo. Todos editables en la UI. */
  const BASE_ASSUMPTIONS = {
    corporate: {
      properties: 10,
      unitsPerProperty: 4,
      daysPerMonth: 30,
      occupancy: 0.50,
      adr: 2000,
      fee: 0.22,
      ancillaryPerUnit: 0,
      variableCostPerUnit: 1500,
      fixedMonthly: 240000,
      onboardingFeePerProperty: 0,
      onboardingFeeAmount: 25000
    },
    asset: {
      keys: 30,
      adr: 2000,
      occupancy: 0.50,
      fee: 0.22,
      opexRatio: 0.60,
      capex: 6000000,
      growth: 0.04,
      years: 10,
      discountRate: 0.14
    }
  };

  /* Escenarios preconfigurados. Ilustrativos; no son resultados esperados. */
  const SCENARIOS = {
    conservative: {
      label: 'Conservador',
      corporate: { occupancy: 0.35, adr: 1500, fee: 0.20, variableCostPerUnit: 1800 },
      asset:     { occupancy: 0.35, adr: 1500, fee: 0.20, opexRatio: 0.66, capex: 7500000, growth: 0.03 }
    },
    base: {
      label: 'Base',
      corporate: {},
      asset: {}
    },
    upside: {
      label: 'Optimista',
      corporate: { occupancy: 0.65, adr: 2500, fee: 0.25, variableCostPerUnit: 1300 },
      asset:     { occupancy: 0.65, adr: 2500, fee: 0.25, opexRatio: 0.55, capex: 5500000, growth: 0.05 }
    }
  };

  /* Capítulos. Cada bloque tiene un tipo que la UI sabe renderizar. */
  const CHAPTERS = [
    {
      id: 'cover', num: '01', title: 'Cover', nav: 'Inicio', group: 'Overview',
      blocks: []
    },
    {
      id: 'summary', num: '02', title: 'Resumen ejecutivo', nav: 'Resumen', group: 'Overview',
      kicker: 'Executive Summary',
      lead: 'UNWRITTEN LIVING es un operador especializado de hospitalidad. Selecciona, adapta y opera alojamientos existentes para viajeros mayores de 55 años que quieren seguir viajando con independencia, comodidad y confianza.',
      blocks: [
        { type: 'indicators', items: [
          { k: 'Target Market', v: 'Viajeros independientes 55+ y sus familias' },
          { k: 'Business Model', v: 'Full Management · asset-light · comisión sobre ingresos de alojamiento' },
          { k: 'Asset Strategy', v: 'Edificios completos, hoteles y apartahoteles existentes' },
          { k: 'Geographic Focus', v: 'México · un destino piloto, luego expansión por concentración' }
        ]},
        { type: 'list', title: 'Qué busca la compañía', items: [
          'Incorporar activos concentrados mediante contratos de administración integral.',
          'Capturar una prima de confianza y servicio sin adquirir inmuebles.',
          'Construir un estándar propio de adaptación y verificación.',
          'Escalar por unidades operativas, no por acumulación de propiedades.'
        ]}
      ]
    },
    {
      id: 'thesis', num: '03', title: 'La tesis de inversión', nav: 'Tesis', group: 'Strategy',
      kicker: 'The Investment Thesis',
      lead: 'La oportunidad no es solo demográfica. Está en la desconexión entre el alojamiento turístico tradicional, la accesibilidad funcional y un viajero que sigue queriendo viajar.',
      blocks: [
        { type: 'pillars', items: [
          { t: 'Demographic Shift', d: 'Crecimiento sostenido de la población de 60 años o más en México.', st: 'ESTIMATE' },
          { t: 'Hospitality Market Gap', d: 'Un alojamiento de cinco estrellas puede ser inadecuado para movilidad reducida.', st: 'ASSUMPTION' },
          { t: 'Existing Asset Opportunity', d: 'Activos existentes pueden adaptarse sin construir desde cero.', st: 'ASSUMPTION' },
          { t: 'Specialized Operating Platform', d: 'Un estándar operativo replicable es la verdadera barrera de entrada.', st: 'ASSUMPTION' }
        ]},
        { type: 'callout', text: 'Tesis a validar: existe una oportunidad para construir un operador especializado que agregue inventario adaptado, capture una prima de confianza y servicio, y genere ingresos recurrentes sin adquirir activos inmobiliarios.' }
      ]
    },
    {
      id: 'market', num: '04', title: 'La oportunidad de mercado', nav: 'Mercado', group: 'Market',
      kicker: 'The Market Opportunity',
      lead: 'El tamaño de la población senior no equivale al mercado turístico senior. El mercado se calcula con viajeros y noches potenciales, no con población total.',
      blocks: [
        { type: 'stats', items: [
          { v: '17.7 M', k: 'Personas de 60+ en México (2024)', src: 'INEGI, ENASEM 2024 · por verificar', st: 'VERIFIED' },
          { v: '14.96%', k: 'Peso de 60+ en la población (2030)', src: 'CONAPO · proyección · por verificar', st: 'PROJECTION' },
          { v: '45 M', k: 'Turistas internacionales (2024)', src: 'OCDE Tourism Trends 2026', st: 'VERIFIED' },
          { v: '108.1 M', k: 'Viajes domésticos con pernocta (2024)', src: 'OCDE Tourism Trends 2026', st: 'VERIFIED' }
        ]},
        { type: 'table', title: 'Referencia de mercado STR México (no es proyección)', head: ['Indicador', 'Referencia', 'Fuente'], rows: [
          ['Ocupación media', '47.38%', 'Airbtics, 60 mercados, 2025'],
          ['ADR medio', '$1,434 MXN', 'Airbtics, 60 mercados, 2025'],
          ['Ingreso anual medio', '$245,210 MXN', 'Airbtics, 60 mercados, 2025'],
          ['Crecimiento anual de oferta', '21.45%', 'Airbtics, 60 mercados, 2025']
        ], note: 'Promedios de referencia. No se usan como proyección del inventario especializado.' },
        { type: 'callout', text: 'Referencia internacional: AARP (EE. UU.) reporta que 29% de los viajeros de 50+ viaja con alguna condición que dificulta viajar, y que 55% cambió su manera de viajar por ello. No extrapolar directamente a México.', st: 'ESTIMATE' }
      ]
    },
    {
      id: 'gap', num: '05', title: 'La brecha en la oferta', nav: 'Brecha', group: 'Market',
      kicker: 'Market Gap',
      lead: 'Los alojamientos tradicionales no siempre responden a las necesidades funcionales del viajero mayor. Reconocemos que existen competidores y que no todo el mercado está desatendido.',
      blocks: [
        { type: 'table', head: ['Variable', 'Hospitalidad tradicional', 'Hospitalidad especializada'], rows: [
          ['Accesibilidad', 'Variable, no verificada', 'Auditoría física de 100 puntos'],
          ['Seguridad', 'Estándar general', 'Protocolos de emergencia y contacto operativo'],
          ['Servicio', 'Según la propiedad', 'Atención humana, no infantilizada'],
          ['Información', 'Fotografías y descripción genérica', 'Ficha técnica con medidas reales'],
          ['Atención humana', 'Limitada fuera de recepción', 'Canal directo y resolución rápida'],
          ['Adaptabilidad', 'Baja', 'Inventario seleccionado y adecuado'],
          ['Estancias prolongadas', 'Tarifas y condiciones no pensadas', 'Productos Long Stay con condiciones propias']
        ]}
      ]
    },
    {
      id: 'segments', num: '06', title: 'Segmentos de clientes', nav: 'Segmentos', group: 'Market',
      kicker: 'Customer Segments',
      lead: 'Distinguimos entre quien viaja, quien organiza y quien paga. En muchos casos son personas distintas.',
      blocks: [
        { type: 'cards', items: [
          { t: 'Independent Senior Travelers', d: 'Parejas de 60–72 años, autónomas, que buscan comodidad sin lujo ostentoso.', tag: 'Prioridad inicial' },
          { t: 'Mature Couples', d: 'Parejas que viajan con acompañante y valoran seguridad y facilidad.', tag: 'Prioridad inicial' },
          { t: 'Adult Children as Decision Makers', d: 'Hijos de 35–55 años que organizan, pagan y buscan confianza verificable.', tag: 'Canal estratégico' },
          { t: 'Extended Stay Seniors', d: 'Estancias de 30–90 días en clima templado o con familiares.', tag: 'Fase 2' },
          { t: 'Assisted Mobility Travelers', d: 'Viajeros que usan bastón, andadera o silla de ruedas.', tag: 'Fase 3 · requiere protocolos' },
          { t: 'Multigenerational Families', d: 'Familias con abuelos, padres e hijos. Unidades contiguas o casas completas.', tag: 'Fase 2' }
        ]},
        { type: 'callout', text: 'Usuario, comprador y pagador: el viajero se hospeda, el hijo organiza y compra, y la reserva puede pagarla un tercero. El mensaje debe hablar a los tres.' }
      ]
    },
    {
      id: 'solution', num: '07', title: 'La solución', nav: 'Solución', group: 'Strategy',
      kicker: 'The UNWRITTEN Solution',
      lead: 'Un sistema operativo de hospitalidad, no una página web. Cinco pilares y un proceso que cubre desde la selección del activo hasta la recompra.',
      blocks: [
        { type: 'pillars', items: [
          { t: 'Verified Properties', d: 'Ninguna propiedad entra sin auditoría física y operativa.' },
          { t: 'Senior-Friendly Design', d: 'Adaptación funcional con criterios medibles, sin estética clínica.' },
          { t: 'Full-Service Operations', d: 'Control de reservas, housekeeping, mantenimiento y calidad.' },
          { t: 'Human-Centered Hospitality', d: 'Atención clara, respetuosa y resolutiva.' },
          { t: 'Specialized Distribution', d: 'Canales directos y alianzas B2B, además de OTAs.' }
        ]},
        { type: 'flow', items: ['Asset Selection', 'Property Adaptation', 'Operational Setup', 'Distribution', 'Guest Experience', 'Revenue Optimization'] }
      ]
    },
    {
      id: 'standards', num: '08', title: 'Estándares del producto', nav: 'Estándares', group: 'Strategy',
      kicker: 'Product & Property Standards',
      lead: 'La clasificación es un estándar privado de UNWRITTEN LIVING. No es una certificación gubernamental ni una garantía universal de accesibilidad.',
      blocks: [
        { type: 'table', head: ['Categoría', 'Puntuación', 'Perfil de huésped'], rows: [
          ['Senior Adapted Plus', '90–100', 'Movilidad reducida con condiciones verificadas'],
          ['Senior Adapted', '80–89', 'Mejoras específicas de accesibilidad'],
          ['Senior Friendly', '70–79', 'Persona autónoma, seguridad básica'],
          ['No aceptada', 'Menos de 70', '—']
        ], note: 'Senior Assisted (con proveedores independientes) se evalúa aparte. Una deficiencia crítica no se compensa con puntos.' },
        { type: 'table', title: 'Auditoría de 100 puntos', head: ['Área', 'Peso'], rows: [
          ['Accesos y circulación', '20'], ['Baños', '20'], ['Seguridad física', '20'],
          ['Dormitorio y mobiliario', '15'], ['Iluminación y señalización', '10'],
          ['Entorno y ubicación', '10'], ['Servicios y asistencia', '5']
        ]}
      ]
    },
    {
      id: 'assets', num: '09', title: 'La estrategia de activos', nav: 'Activos', group: 'Asset Strategy',
      kicker: 'The Asset Strategy',
      lead: 'No crecemos administrando apartamentos dispersos. La prioridad son activos concentrados, donde cada operación gana escala.',
      blocks: [
        { type: 'cards', items: [
          { t: 'A. Full Building Partnership', d: 'Administración integral de un edificio completo.', tag: 'Concentración alta' },
          { t: 'B. Hotel Conversion & Operation', d: 'Adaptación funcional y operación especializada de un hotel existente.', tag: 'Activo subutilizado' },
          { t: 'C. Portfolio Management', d: 'Varias propiedades bajo un mismo propietario o grupo patrimonial.', tag: 'Escala por propietario' }
        ]},
        { type: 'list', title: 'Beneficios de la concentración', items: [
          'Menor costo operativo por unidad.', 'Mayor eficiencia de housekeeping.', 'Atención y control de calidad centralizados.',
          'Menor dispersión geográfica.', 'Mayor capacidad de negociación con proveedores y OTAs.'
        ]}
      ]
    },
    {
      id: 'target', num: '10', title: 'Perfil del activo buscado', nav: 'Perfil del activo', group: 'Asset Strategy',
      kicker: 'Target Property Profile',
      lead: 'Parámetros iniciales de prospección. Son criterios de búsqueda sujetos a validación, no requisitos definitivos.',
      blocks: [
        { type: 'table', head: ['Variable', 'Objetivo inicial'], rows: [
          ['Tipo', 'Hotel, apartahotel, edificio'], ['Tamaño prioritario', '20–100 unidades'],
          ['Tamaño secundario', '10–20 unidades'], ['Configuración', 'Habitaciones y apartamentos de 1–2 recámaras'],
          ['Estado', 'Operativo o subutilizado'], ['Ubicación', 'Destinos turísticos o urbanos'],
          ['Accesibilidad', 'Potencial de adaptación'], ['Propiedad', 'Terceros'], ['Operación', 'Full Management']
        ]},
        { type: 'list', title: 'Criterios de rechazo', items: [
          'Problemas estructurales', 'Limitaciones de accesibilidad no solucionables', 'Situación legal irregular',
          'Ausencia de permisos', 'CAPEX desproporcionado', 'Ubicación inadecuada', 'Inviabilidad financiera'
        ]}
      ]
    },
    {
      id: 'business', num: '11', title: 'Modelo de negocio', nav: 'Modelo', group: 'Business Model',
      kicker: 'Business Model',
      lead: 'El propietario aporta el activo. UNWRITTEN LIVING aporta la plataforma operativa. Cada peso de ingreso se asigna a su entidad económica.',
      blocks: [
        { type: 'flow', items: ['Property Owner provides the asset', 'PSS provides the operating platform', 'Guest generates accommodation revenue', 'Operator earns management and service fees'] },
        { type: 'table', head: ['Fuente de ingreso', 'Tipo', 'Cómo se cobra'], rows: [
          ['Management Fee', 'Recurrente', '% de ingresos de alojamiento (hipótesis 22%)'],
          ['Onboarding Fee', 'No recurrente', 'Pago inicial de incorporación'],
          ['Adaptation Project Management', 'No recurrente', 'Honorarios por coordinar adecuaciones'],
          ['Property Verification', 'No recurrente', 'Evaluación técnica del activo'],
          ['Guest Services', 'Recurrente variable', 'Margen o comisión sobre servicios adicionales'],
          ['Extended Stay Management', 'Recurrente', 'Administración de estancias largas'],
          ['B2B Partnerships', 'Futuro', 'Convenios con empresas y desarrolladores']
        ]},
        { type: 'callout', text: 'Comisión sobre ingreso de alojamiento: el contrato define la base exacta (excluye impuestos, cargos de plataforma, limpieza cobrada y reembolsos). Hipótesis: 22%, por validar.', st: 'PENDING' }
      ]
    },
    {
      id: 'operating', num: '12', title: 'Modelo operativo', nav: 'Operación', group: 'Operations',
      kicker: 'Operating Model · Full Management',
      lead: 'Una pequeña compañía hotelera distribuida. Equipo central y proveedores locales coordinados, sin estructura completa en cada propiedad.',
      blocks: [
        { type: 'table', head: ['Área', 'Responsabilidad'], rows: [
          ['Property Acquisition', 'Captación y evaluación de activos'], ['Property Audit', 'Auditoría física y operativa'],
          ['Revenue Management', 'Tarifas, canales y ocupación'], ['Reservations', 'Reservas y atención previa a llegada'],
          ['Distribution', 'OTAs, canal directo, B2B'], ['Guest Experience', 'Check-in, estancia y check-out'],
          ['Housekeeping & Maintenance', 'Coordinación con proveedores locales'], ['Quality Control', 'Checklists, incidencias, revalidación'],
          ['Financial Reporting', 'Reportes mensuales al propietario']
        ]}
      ]
    },
    {
      id: 'tech', num: '13', title: 'Tecnología y distribución', nav: 'Tecnología', group: 'Operations',
      kicker: 'Technology & Distribution',
      lead: 'Usamos herramientas de terceros al inicio. No afirmamos software propietario hasta que exista.',
      blocks: [
        { type: 'table', head: ['Función', 'Herramienta propuesta'], rows: [
          ['PMS y Channel Manager', 'Octorate, Cloudbeds o Guesty (por evaluar)'], ['Revenue Management', 'Herramienta externa (por evaluar)'],
          ['CRM', 'HubSpot'], ['Web y motor de reservas', 'Webflow o WordPress + integración PMS'],
          ['Atención', 'WhatsApp Business'], ['Automatización', 'Make'], ['Dashboards', 'Looker Studio']
        ], note: 'La selección final depende de costo por unidad, integración y soporte a estancias largas.' },
        { type: 'list', title: 'Canales de distribución', items: [
          'OTAs: Airbnb, Booking.com, Expedia, Vrbo', 'Canal directo: web, WhatsApp, email, teléfono',
          'B2B: asociaciones, clubes sociales, aseguradoras, agencias', 'Institucional: desarrolladores y operadores turísticos'
        ]}
      ]
    },
    {
      id: 'gtm', num: '14', title: 'Estrategia de entrada al mercado', nav: 'Entrada', group: 'Strategy',
      kicker: 'Go-to-Market',
      lead: 'Lanzamos un destino con una oferta limitada y verificable. Cada fase tiene criterios de avance medibles.',
      blocks: [
        { type: 'timeline', items: [
          { t: 'Fase 1 · Pilot Market', d: 'Un destino, 8–10 propiedades concentradas.', gate: 'Contratos firmados, auditorías aprobadas, primeras reservas pagadas.' },
          { t: 'Fase 2 · Regional Expansion', d: 'Nuevos edificios y hoteles en la misma región.', gate: 'Contribución positiva por unidad durante 6 meses.' },
          { t: 'Fase 3 · Multi-Destination', d: 'Expansión nacional por destinos.', gate: 'SOPs replicables y proveedores homologados en cada destino.' },
          { t: 'Fase 4 · Institutional Partnerships', d: 'Alianzas con grupos hoteleros y propietarios institucionales.', gate: 'Operación estable y canal directo medido.' }
        ]}
      ]
    },
    {
      id: 'competitive', num: '15', title: 'Posicionamiento competitivo', nav: 'Competencia', group: 'Strategy',
      kicker: 'Competitive Positioning',
      lead: 'No afirmamos que no existe competencia. La diferenciación está en el modelo operativo integrado.',
      blocks: [
        { type: 'table', head: ['Dimensión', 'Hotel tradicional', 'STR manager', 'OTA', 'Senior travel co.', 'UNWRITTEN LIVING'], rows: [
          ['Control operativo', 'Alto', 'Medio', 'Bajo', 'Bajo', 'Alto'],
          ['Especialización senior', 'Baja', 'Baja', 'Baja', 'Alta', 'Alta'],
          ['Adaptación física', 'Variable', 'Baja', 'Baja', 'Variable', 'Verificada'],
          ['Distribución', 'Media', 'Alta', 'Muy alta', 'Media', 'Directa + OTA + B2B'],
          ['Atención humana', 'Alta', 'Baja', 'Baja', 'Alta', 'Alta'],
          ['Gestión de activos', 'Propia', 'Limitada', 'No', 'No', 'Por contrato'],
          ['Escalabilidad', 'Baja', 'Alta', 'Muy alta', 'Media', 'Por unidades operativas']
        ], note: 'Valoración cualitativa de dirección. Ver nota de validación en el capítulo de riesgos.' }
      ]
    },
    {
      id: 'financials', num: '16', title: 'Modelo financiero', nav: 'Financiero', group: 'Financials',
      kicker: 'Interactive Financial Feasibility Engine',
      lead: 'Dos simuladores con la misma lógica financiera. Modifique cualquier supuesto y observe el resultado de inmediato. Las cifras base son supuestos preliminares, no resultados comprobados.',
      blocks: [
        { type: 'simulators' }
      ]
    },
    {
      id: 'capital', num: '17', title: 'Oportunidad para capital', nav: 'Capital', group: 'Investment',
      kicker: 'Capital Partners',
      audience: 'capital',
      lead: 'Invertir en la construcción de una plataforma operativa de hospitalidad especializada.',
      blocks: [
        { type: 'table', head: ['Concepto', 'Estado'], rows: [
          ['Capital requerido', 'Pending Validation · rango de planeación $475,000–$800,000 MXN (documento de negocio)'],
          ['Valuación y participación', 'Pending Validation · variables de negociación, no definidas'],
          ['Rendimiento prometido', 'No se presenta. Ningún retorno está garantizado'],
          ['Opciones de salida', 'Pending Validation · por definir con asesoría legal y financiera']
        ]},
        { type: 'table', title: 'Uso de fondos de referencia (plan de trabajo, no cotizado)', head: ['Concepto', 'MXN'], rows: [
          ['Constitución y legal', '35,000'], ['Branding y web', '65,000'], ['Tecnología inicial', '40,000'],
          ['Equipo y nómina inicial', '180,000'], ['Marketing y adquisición', '70,000'],
          ['Auditorías y desplazamientos', '35,000'], ['Capital de trabajo y contingencia', '150,000'], ['Total de referencia', '575,000']
        ], note: 'Excluye adecuaciones estructurales, que se financian con capital del propietario.' },
        { type: 'timeline', items: [
          { t: 'Validación', d: 'Mercado, inventario, demanda verificable.', gate: 'Gate 1' },
          { t: 'Diseño y constitución', d: 'Manuales, contratos, marca, plataforma.', gate: 'Gate 2' },
          { t: 'Captación y lanzamiento', d: '8–10 propiedades y primeras reservas.', gate: 'Gate 3' },
          { t: 'Validación económica', d: 'Meses 4–6: ADR, ocupación, contribución.', gate: 'Decisión: escalar, ajustar o detener' }
        ]}
      ]
    },
    {
      id: 'partnership', num: '18', title: 'Oportunidad para propietarios', nav: 'Propietarios', group: 'Investment',
      kicker: 'Property Partners',
      audience: 'property',
      lead: 'Monetizar y diferenciar un activo existente mediante una operación especializada. El propietario conserva la propiedad del activo.',
      blocks: [
        { type: 'table', head: ['Qué aporta el propietario', 'Qué aporta UNWRITTEN LIVING'], rows: [
          ['El inmueble y su titularidad', 'Auditoría, selección y adecuación'],
          ['Inversión estructural y mejoras mayores', 'Comercialización y revenue management'],
          ['Autorizaciones de gastos acordados', 'Reservas, atención y check-in'],
          ['Cumplimiento de obligaciones contractuales', 'Housekeeping, mantenimiento y reportes']
        ]},
        { type: 'list', title: '¿Qué pasa si el inmueble no funciona?', items: [
          'Antes de firmar: la auditoría define si el activo es viable. Si no lo es, no se incorpora.',
          'Durante el contrato: la terminación anticipada y el manejo de depósitos están definidos.',
          'Si la demanda no responde, el plan de ajuste revisa tarifa, canal o segmento antes de decidir.'
        ]},
        { type: 'callout', text: 'Ninguna cifra de esta sección es una promesa. El simulador de activo muestra escenarios con supuestos editables.', st: 'SCENARIO' }
      ]
    },
    {
      id: 'growth', num: '19', title: 'Hoja de ruta de crecimiento', nav: 'Crecimiento', group: 'Investment',
      kicker: 'Growth Roadmap',
      lead: 'Crecimiento basado en activos incorporados. Diferenciamos lo proyectado de lo contratado.',
      blocks: [
        { type: 'table', head: ['Escala', 'Unidades bajo administración', 'Estado'], rows: [
          ['Etapa 1', '0–10 propiedades', 'Proof of concept'], ['Etapa 2', '10–30', 'Product-market fit'],
          ['Etapa 3', '30–60', 'Operación regional'], ['Etapa 4', '60–150', 'Operador nacional'],
          ['Etapa 5', '150+', 'Plataforma de hospitalidad senior']
        ]},
        { type: 'callout', text: 'Unidades contratadas: 0 hasta firmar el primer contrato de administración. Las etapas siguientes son proyecciones.', st: 'PENDING' }
      ]
    },
    {
      id: 'risks', num: '20', title: 'Gestión de riesgos', nav: 'Riesgos', group: 'Risk',
      kicker: 'Risk Management',
      lead: 'Los riesgos se presentan sin suavizar. Cada uno tiene un mitigante concreto.',
      blocks: [
        { type: 'table', head: ['Riesgo', 'Severidad', 'Mitigante'], rows: [
          ['Demanda dispuesta a pagar insuficiente', 'Alta', 'Validación comercial con reservas, no solo entrevistas'],
          ['Propietarios que no aceptan la comisión', 'Alta', 'Demostrar valor económico con auditoría y proyección'],
          ['Costo de adaptación elevado', 'Alta', 'Auditoría y presupuesto antes de firmar'],
          ['Responsabilidad por accidentes', 'Muy alta', 'Seguros, protocolos y verificación rigurosa'],
          ['Costo de atención humana', 'Alta', 'Segmentación y automatización de procesos'],
          ['Dependencia de OTAs', 'Media-alta', 'Construcción de canal directo'],
          ['Proveedores poco confiables', 'Alta', 'Red homologada y evaluada'],
          ['Expansión demasiado rápida', 'Alta', 'Gates de crecimiento'],
          ['Regulación local', 'Alta', 'Due diligence por destino y tipo de inmueble']
        ]}
      ]
    },
    {
      id: 'team', num: '21', title: 'Gestión y ejecución', nav: 'Equipo', group: 'Risk',
      kicker: 'Management & Execution',
      lead: 'Las posiciones aún no cubiertas se muestran como incorporaciones futuras. No se atribuyen credenciales no verificadas.',
      blocks: [
        { type: 'cards', items: [
          { t: 'Fundador / CEO', d: '[Biografía y experiencia verificable pendiente]', tag: 'Estrategia, ventas y alianzas' },
          { t: 'Operations Manager', d: '[Pendiente de incorporación]', tag: 'Por cubrir' },
          { t: 'Revenue & Distribution', d: '[Pendiente de incorporación]', tag: 'Por cubrir' },
          { t: 'Quality & Accessibility', d: '[Pendiente de incorporación]', tag: 'Por cubrir' }
        ]}
      ]
    },
    {
      id: 'close', num: '22', title: 'Hablemos', nav: 'Contacto', group: 'Partnership',
      kicker: 'The Partnership',
      blocks: [
        { type: 'cta' },
        { type: 'contact' },
        { type: 'disclaimer' }
      ]
    }
  ];

  const SOURCES = [
    { id: 'INEGI', name: 'INEGI — Encuesta Nacional sobre Salud y Envejecimiento 2024', use: 'Población 60+', status: 'Verificar publicación original' },
    { id: 'CONAPO', name: 'CONAPO — Proyecciones demográficas', use: 'Proyección de envejecimiento', status: 'Verificar' },
    { id: 'OCDE', name: 'OECD — Tourism Trends and Policies 2026', use: 'Turismo nacional e internacional', status: 'Verificar' },
    { id: 'AARP', name: 'AARP Research — Travel Trends 2026', use: 'Referencia internacional (EE. UU.)', status: 'Verificar; no extrapolar' },
    { id: 'AirDNA', name: 'AirDNA — Mexico Short-Term Rental Market', use: 'Oferta STR por mercado', status: 'Licencia y fecha pendientes' },
    { id: 'Airbtics', name: 'Airbtics — Mexico STR Market Review', use: 'Referencias de ADR y ocupación', status: 'Verificar muestra y fecha' },
    { id: 'Banxico', name: 'Banco de México — EconLab', use: 'Contexto macroeconómico', status: 'Pendiente' },
    { id: 'SECTUR', name: 'Secretaría de Turismo — Registro Nacional de Turismo', use: 'Registro de prestadores', status: 'Pendiente' }
  ];

  root.UL = { STATUS, CONFIG, BASE_ASSUMPTIONS, SCENARIOS, CHAPTERS, SOURCES };
})(typeof window !== 'undefined' ? window : globalThis);
