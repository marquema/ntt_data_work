# DevIA · La torre de control del desarrollo de software

Scrollytelling (storytelling de datos, estructura *Martini Glass* — Segel & Heer) sobre los
**3 casos de uso de IA Generativa de DevIA** para Iberdrola, presentados en el
**Sector Day Utilities & DE (jun. 2026)** de NTT DATA GDN-e.

La narrativa: pasar de *estimar software a ojo* a una **torre de control** medible y trazable,
con tres instrumentos sobre un mismo ciclo de proyecto.

| Instrumento | Caso de uso | Qué hace |
|---|---|---|
| **Estimar** | Estimador IFPUG Fase III | Desde la HU, separa requisitos funcionales/no funcionales y aplica Punto Función + SNAP (incluye SNAP UX / Interface Design). |
| **Estimar** | Estimador COCOMO II | Desde el código entregado, calcula KLOC y estima esfuerzo, duración, equipo y coste (factores COCOMO detectados por IA). |
| **Construir** | Spec-Driven Development (IA agéntica) | Spec primero → agentes generan épicas/arquitectura/código/tests → human-in-the-loop → iterar acotado. |
| **Validar** | Validador de código entregado | Desde HU + código, devuelve el % de cumplimiento de los requisitos, con justificación. |

## Estructura

- `index.html` — escenas + panel sticky.
- `main.js` — driver de scroll (IntersectionObserver) + control-tower en SVG (D3 v7) que ilumina cada instrumento; en las escenas de cada CU intercambia el SVG por la captura real del software.
- `assets/` — capturas del software DevIA (extraídas del deck del Sector Day).

## Ver online

GitHub Pages: **https://marquema.github.io/ntt_data_work/**

## Tecnología

D3 v7 (CDN), sin build. Estático, desplegable en GitHub Pages tal cual.

---
NTT DATA · GDN-e · Utilities & DE · Marcos Marqués · UOC Visualización de Datos.
