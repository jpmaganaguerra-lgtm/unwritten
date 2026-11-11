/* ==========================================================================
   UNWRITTEN Homes & Villas — Ruta "Explore the Idea"
   Sección alternativa centrada en la idea de marca. No incluye modelo de
   negocio, cifras, simuladores ni oferta de inversión. Textos derivados del
   MASTER BRAND BOOK (secciones 1–3, 7, 10, 13, 18).
   ========================================================================== */
(function (root) {
  'use strict';

  const NAV = {
    'i-idea': 'Idea',
    'i-travelers': 'Viajeros',
    'i-experience': 'Experiencia',
    'i-ellipsis': 'Símbolo',
    'i-manifesto': 'Manifiesto',
    'i-close': 'Contacto'
  };

  const CHAPTERS = [
    {
      id: 'i-idea', num: '01', title: 'Una idea sencilla', nav: 'Idea', group: 'Idea',
      kicker: 'Brand Foundation',
      lead: 'UNWRITTEN Homes & Villas nace de una idea sencilla: la vida no tiene por qué seguir un guion establecido.',
      blocks: [
        { type: 'cards', items: [
          { t: 'Propósito', d: 'Ayudar a las personas a seguir descubriendo el mundo, con independencia, comodidad y tranquilidad.' },
          { t: 'Visión', d: 'Ser una referencia de hospitalidad para viajeros independientes que quieren seguir explorando, sin que la edad determine sus posibilidades.' },
          { t: 'Misión', d: 'Seleccionar, adaptar y cuidar lugares donde cada estancia sea memorable.' }
        ]},
        { type: 'list', title: 'Lo que no somos', items: [
          'Una residencia para adultos mayores.',
          'Una institución de asistencia.',
          'Una agencia tradicional de viajes.',
          'Una plataforma de alquiler vacacional.',
          'Una empresa de servicios médicos.'
        ]},
        { type: 'callout', text: 'Somos una marca de hospitalidad con una especialización operativa concreta.' }
      ]
    },
    {
      id: 'i-belief', num: '02', title: 'Nuestra creencia', nav: 'Creencia', group: 'Idea',
      kicker: 'Brand Belief',
      lead: 'No se trata de vender juventud, ni de negar el paso del tiempo. Se trata de reconocer que la edad no debería limitar las posibilidades de vivir nuevas experiencias.',
      blocks: [
        { type: 'hero', big: 'Age is a number. Living is a choice.', label: 'Creencia de marca',
          promise: ['More freedom to explore.', 'More comfort to enjoy.', 'More confidence to go.'],
          promiseLabel: 'Promesa de marca' }
      ]
    },
    {
      id: 'i-manifesto', num: '03', title: 'El manifiesto', nav: 'Manifiesto', group: 'Manifesto',
      kicker: 'The Unwritten Manifesto',
      lead: 'Lo que creemos, en nuestras propias palabras.',
      blocks: [
        { type: 'manifesto', paragraphs: [
          'We believe life was never meant to follow a script.',
          'That curiosity has no expiration date.',
          'That there are still roads to take, places to discover, people to meet, tables to gather around and memories to make.',
          'We believe comfort should never mean compromise.',
          'That independence matters.',
          'And that the right place can make all the difference.',
          "We don't believe in slowing down just because the world expects you to.",
          "We believe in making room for what's next.",
          "Because your story isn't finished."
        ], sign: "It's unwritten." }
      ]
    },
    {
      id: 'i-personality', num: '04', title: 'Personalidad', nav: 'Personalidad', group: 'Idea',
      kicker: 'Brand Personality',
      lead: 'Una marca vital, independiente, sofisticada y cercana.',
      blocks: [
        { type: 'pillars', items: [
          { t: 'Bold', d: 'Segura de sí misma. No teme cuestionar las convenciones sobre la edad y la manera de viajar.' },
          { t: 'Curious', d: 'Siempre abierta a descubrir. La curiosidad es una actitud, no una etapa de la vida.' },
          { t: 'Optimistic', d: 'Positiva, sin discursos artificiales de felicidad ni de juventud eterna.' },
          { t: 'Thoughtful', d: 'Cuidadosa con los detalles. La comodidad, la accesibilidad y la confianza son parte esencial de una buena experiencia.' },
          { t: 'Independent', d: 'Respeta la autonomía de las personas. Facilita, acompaña y resuelve sin imponer.' }
        ]},
        { type: 'list', title: 'Así se siente la marca', items: [
          'Inspiradora, no cursi.',
          'Sofisticada, no pretenciosa.',
          'Joven de espíritu, no adolescente.',
          'Cálida, no paternalista.',
          'Segura, no arrogante.',
          'Moderna, no fría.',
          'Accesible, no institucional.'
        ]}
      ]
    },
    {
      id: 'i-travelers', num: '05', title: 'Viajeros', nav: 'Viajeros', group: 'Idea',
      kicker: 'Who We Travel With',
      lead: 'Personas que siguen queriendo ver, comer, caminar y convivir. Cada una con su propio ritmo.',
      blocks: [
        { type: 'cards', items: [
          { t: 'Viajeros independientes', d: 'Llegan con su plan y buscan un lugar que lo haga más fácil.', tag: 'Explorer' },
          { t: 'Parejas', d: 'Viajan juntas, con tiempo para descubrir y tiempo para descansar.', tag: 'Compañía' },
          { t: 'Estancias largas', d: 'Semanas en un mismo lugar, con una casa lejos de casa.', tag: 'Slow travel' },
          { t: 'Familias de varias generaciones', d: 'Abuelos, padres e hijos en un mismo viaje, con espacios pensados para todos.', tag: 'Convivencia' },
          { t: 'Quienes planean por alguien', d: 'Hijos que buscan para sus padres un lugar cómodo, claro y de confianza.', tag: 'Confianza' }
        ]},
        { type: 'callout', text: 'No definimos a nuestros viajeros por su edad, su fragilidad ni su dependencia.' }
      ]
    },
    {
      id: 'i-life', num: '06', title: 'Life is still unwritten.', nav: 'Fotografía', group: 'Idea',
      kicker: 'Photography Direction',
      lead: 'Mostramos posibilidades reales: viaje, descubrimiento y convivencia. Nada de fotografías de residencias ni imágenes artificiales de turismo.',
      blocks: [
        { type: 'photos', items: [
          { t: 'Personas reales en movimiento', d: 'Caminando una ciudad, cenando en una terraza, descubriendo un mercado. Expresiones naturales y luz natural.' },
          { t: 'Propiedades honestas', d: 'Habitaciones, baños, accesos y áreas comunes tal como son. Ningún encuadre oculta limitaciones.' },
          { t: 'Destinos con carácter', d: 'Arquitectura, paisaje y cultura local como parte de la experiencia.' }
        ]}
      ]
    },
    {
      id: 'i-ellipsis', num: '07', title: 'THE ELLIPSIS', nav: 'Símbolo', group: 'Idea',
      kicker: 'Our Symbol',
      lead: 'Tres puntos que representan una historia que continúa. La vida no termina en un capítulo concreto: siempre hay algo más por descubrir.',
      blocks: [
        { type: 'symbol', caption: 'Continuidad, curiosidad y posibilidades futuras.' },
        { type: 'cards', items: [
          { t: 'THE OPEN PAGE', d: 'Recurso gráfico alternativo para campañas y comunicación editorial. Diseño pendiente.', tag: 'Diseño pendiente' }
        ]}
      ]
    },
    {
      id: 'i-experience', num: '08', title: 'La experiencia', nav: 'Experiencia', group: 'Idea',
      kicker: 'Brand Experience',
      lead: 'La promesa se sostiene en lo que ocurre dentro de cada propiedad: el lugar, la atención y la comodidad.',
      blocks: [
        { type: 'cards', items: [
          { t: 'Adapted Living', d: 'Lugares seleccionados y preparados para facilitar comodidad, accesibilidad y funcionalidad.' },
          { t: 'Thoughtful Hospitality', d: 'Atención humana, procesos sencillos y una operación que se repite bien.' },
          { t: 'Independent Experiences', d: 'Libertad para descubrir a su propio ritmo, con apoyo cuando lo necesite.' }
        ]},
        { type: 'list', title: 'Principios', items: [
          'Facilitar sin imponer.',
          'Acompañar sin infantilizar.',
          'Resolver antes de que el problema crezca.',
          'Comunicar con claridad.',
          'Respetar la autonomía.',
          'Ser transparentes sobre cada propiedad.'
        ]},
        { type: 'callout', text: 'Prometemos solo lo que podemos cumplir. No comunicamos servicios médicos ni asistencia especializada sin los recursos, protocolos y personal para ofrecerlos.' }
      ]
    },
    {
      id: 'i-voice', num: '09', title: 'Cómo hablamos', nav: 'Lenguaje', group: 'Idea',
      kicker: 'Brand Language',
      lead: 'Palabras que nos describen y frases que usamos con moderación.',
      blocks: [
        { type: 'chips', title: 'Palabras de marca', items: [
          'Unwritten', 'Living', 'Explore', 'Alive', 'Curious', 'Freedom', 'Discover',
          'Beyond', 'Independent', 'Journey', 'Possibility', 'Experience', 'Belong'
        ]},
        { type: 'list', title: 'Mensajes de apoyo', items: [
          "There's More to Life.",
          'Keep Living Unwritten.',
          'Never Done Discovering.',
          "Life Doesn't Follow a Script.",
          'More Life. Less Limits.',
          'Stay Curious. Live Unwritten.',
          'The Next Chapter Is Yours.'
        ]}
      ]
    },
    {
      id: 'i-close', num: '10', title: 'Su historia no ha terminado', nav: 'Contacto', group: 'Idea',
      kicker: 'The Next Chapter',
      lead: 'Your story is far from over.',
      blocks: [
        { type: 'cta' },
        { type: 'contact' }
      ]
    }
  ];

  const ORDER = ['cover', 'i-idea', 'i-belief', 'i-manifesto', 'i-personality', 'i-travelers', 'i-life', 'i-ellipsis', 'i-experience', 'i-voice', 'i-close'];

  root.UL_IDEA = { CHAPTERS, NAV, ORDER };
})(typeof window !== 'undefined' ? window : globalThis);
