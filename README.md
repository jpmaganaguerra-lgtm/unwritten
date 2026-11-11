# UNWRITTEN Homes & Villas · Investment & Partnership Overview

Presentación institucional interactiva para inversionistas (*Capital Partners*) y propietarios de activos (*Property Partners*). Sitio estático: HTML, CSS y JavaScript sin dependencias ni proceso de compilación.

> **Confidencial.** Material informativo y de discusión. No constituye una oferta pública o privada de valores ni asesoría financiera, fiscal o legal.

## Ver en local

No requiere instalación. Abra `index.html` en un navegador moderno, o sirva la carpeta:

```bash
python3 -m http.server 8080
# http://localhost:8080
```

## Pruebas del motor financiero

```bash
node tests/finance.test.js
```

Requiere Node.js 18 o superior. No tiene dependencias externas.

## Estructura

```
index.html                 Shell, metadatos, carga de scripts
assets/
  css/styles.css           Identidad visual, responsivo, impresión
  js/data.js               FUENTE ÚNICA: textos, cifras, supuestos, escenarios, fuentes
  js/finance.js            Motor financiero puro (sin DOM)
  js/app.js                Render, selector de audiencia, simuladores, exportación
  logo/unwritten-homes-villas.svg  Logotipo oficial (fuente: Mesa de trabajo 4.svg)
  logo/ellipsis-symbol.svg        THE ELLIPSIS, solo símbolo (favicon)
docs/
  formulas.md              Fórmulas, definiciones y limitaciones del modelo
  data-sources.md          Registro de fuentes, estado de verificación y supuestos
tests/
  finance.test.js          Pruebas del motor (incluye verificación del punto de equilibrio de 48 unidades)
```

## Cómo usar la presentación

- **Portada:** elija *Capital Partner* o *Property Partner*. La elección reordena capítulos, cambia el llamado a la acción y se recuerda en el navegador.
- **Simuladores (capítulo 16):**
  - *A · Modelo corporativo:* ingresos y EBITDA de la operadora según número de propiedades.
  - *B · Factibilidad de activo:* RevPAR, GOP, NOI del propietario, TIR, VPN, payback y matriz de sensibilidad.
  - Escenarios *Conservador / Base / Optimista* (ilustrativos) y edición libre de cualquier supuesto.
- **Exportar:** CSV de supuestos y resultados, JSON con fecha, versión y supuestos (para compartir un escenario), o *Imprimir* para PDF desde el navegador.
- **Presentar:** modo pantalla completa con navegación por flechas y `Esc` para salir.

## Dónde cambiar contenido

Todo el contenido vive en `assets/js/data.js`:

| Qué cambiar | Dónde |
|---|---|
| Nombre, descriptor, fecha, versión, contacto | `CONFIG` |
| Supuestos base del modelo | `BASE_ASSUMPTIONS` |
| Escenarios Conservador / Base / Optimista | `SCENARIOS` |
| Capítulos, textos, tablas, tarjetas | `CHAPTERS` |
| Fuentes citadas al pie | `SOURCES` |

Los colores están en variables CSS al inicio de `styles.css`. La paleta sigue el manual de marca (Deep Azzurro `#263B55`, Sky Celeste `#8CCCE5`, Pale Azure `#D9EBF2`, Ocean Blue `#477F9F`, Warm Ivory `#F2F0E9`, Silver Mist `#C9D0D5`).

## Estado de los datos

Cada dato se etiqueta con uno de estos estados: *Dato verificado*, *Supuesto de dirección*, *Estimación de mercado*, *Proyección*, *Escenario ilustrativo* o *Pending Validation*. Los datos marcados como *Pending Validation* no deben presentarse como definitivos.

Antes de compartir el documento con terceros, revise `docs/data-sources.md`.

## Pendientes conocidos

- **Tipografía del logotipo:** el SVG oficial contiene el texto con la fuente Adam Bold. Si la fuente no está instalada, el navegador usa una alterna. Pida al diseñador una versión con texto convertido a trazos (outlines) para producción.
- **Color del fondo del logotipo:** el SVG usa `#18364d`, distinto del Deep Azzurro `#263B55` del manual. Confirme cuál es el valor correcto.
- **Fotografía:** no hay material fotográfico. Los espacios reservados se indican como "fotografía pendiente". No se usan imágenes de personas mayores estereotipadas, conforme al brief.
- **Nombre de la operadora:** el documento de negocio usa el nombre de trabajo *Property Seniors*; la identidad elegida es UNWRITTEN Homes & Villas. Confirme la arquitectura de marca antes de publicar.
- **Legal:** cualquier oferta de valores requiere PPM y asesoría de abogados especializados en regulación financiera mexicana.
- **Valor terminal, reservas FF&E e impuestos** no están modelados en el simulador de activo.

## Privacidad y publicación

El repositorio está configurado como **privado**. Si en algún momento se publica, use únicamente la versión sin datos de inversionistas o propietarios reales, y no incluya credenciales ni correos personales en el código. La etiqueta `robots: noindex` evita indexación de la versión desplegada.

## Despliegue

Compatible con GitHub Pages (rama `main`, carpeta raíz), Netlify o cualquier hosting estático. No requiere variables de entorno.

## Licencia

Todos los derechos reservados. Uso restringido a UNWRITTEN Homes & Villas y a las personas autorizadas por la empresa.
