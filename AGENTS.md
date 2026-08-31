# AGENTS.md

Instrucciones para agentes AI trabajando en este proyecto.

---

## Roles

### Code Agent

Escribir, refactorizar y optimizar código de la aplicación.

Responsabilidades:
* Crear componentes React Native limpios y reutilizables.
* Escribir estilos con StyleSheet mantenibles y organizados.
* Corregir bugs e implementar funcionalidades solicitadas.
* Seguir la arquitectura y estándares del proyecto.
* Minimizar el alcance de los cambios.

### Documentation Agent

Mantener la documentación del proyecto precisa y actualizada.

Responsabilidades:
* Actualizar README.md cuando cambien features, dependencias o arquitectura.
* Mantener la lista de features sincronizada con la implementación.
* Actualizar instrucciones de instalación y uso cuando cambie la funcionalidad.
* Documentar dependencias recién añadidas.
* Asegurar que el README refleje siempre el estado actual del proyecto.

---

## Technology Stack

Seguir este stack a menos que se indique explícitamente lo contrario:

* React Native (Expo SDK 57)
* Expo Router para navegación basada en archivos
* JavaScript (ES6+)
* StyleSheet (estilos nativos)
* npm (gestor de dependencias)

### Restricciones
* No usar TypeScript a menos que se solicite explícitamente.
* No introducir frameworks de UI nativos (NativeBase, React Native Paper, etc.) a menos que se solicite.
* No usar soluciones de estilos como Styled Components o NativeWind a menos que se solicite.

---

## UI & Design Rules

### Icons
* No usar emojis en la interfaz, documentación, comentarios, mensajes de commit ni contenido generado.
* Solo añadir iconos cuando el usuario lo solicite explícitamente.
* Para React Native, usar `@expo/vector-icons` exclusivamente (ya incluido con Expo).
* Preferir consistencia usando iconos de un mismo set (MaterialIcons, Ionicons, FontAwesome, etc.).

### Footer
* Si el usuario solicita un componente footer, incluir información de contacto:
  * Email: irenealcainealvarez@gmail.com
  * LinkedIn: https://www.linkedin.com/in/irenealcaine/
  * GitHub: https://github.com/irenealcaine

---

## Project Architecture

Usar separación clara de responsabilidades.

Estructura preferida:

```text
src/
├── components/       # Componentes reutilizables
├── screens/          # Pantallas de la app
├── navigation/       # Configuración de navegación
├── hooks/            # Custom hooks
├── services/         # Comunicación con APIs
├── utils/            # Funciones de utilidad
├── contexts/         # Context providers (estado global)
├── assets/           # Imágenes, fuentes, etc.
├── styles/           # Temas, colores globales, variables
└── constants/        # Constantes de la app
```

Si el proyecto ya sigue una estructura diferente, respetar la organización existente a menos que se indique lo contrario.

### Guidelines
* Los componentes deben ser pequeños y enfocados.
* Usar únicamente componentes funcionales y hooks.
* Extraer lógica reutilizable en custom hooks.
* La comunicación con APIs va en `services/`.
* Las funciones de utilidad van en `utils/`.
* Un componente por archivo.

---

## Code Style

### JavaScript
* Usar módulos ES modernos.
* Preferir componentes funcionales y hooks.
* Usar comillas dobles (`"`).
* No añadir punto y coma al final de las líneas a menos que sea necesario.
* Mantener el código conciso y legible.

Convenciones de nombres:
* Componentes: `PascalCase`
* Archivos de componente: `ComponentName.jsx`
* Funciones: `camelCase`
* Variables: `camelCase`
* Contexts: `NombreContext.jsx` con `NombreProvider` y `useNombre`
* Hooks personalizados: `useNombre.js`

### Styles (StyleSheet)
* Usar StyleSheet.create() para todos los estilos.
* Organizar estilos de forma clara.
* Seguir enfoque mobile-first.
* Por defecto usar tema oscuro a menos que se especifique lo contrario.
* Cada componente debe tener sus estilos al final del mismo archivo.
* Mantener un archivo `src/styles/theme.js` con colores, spacing, typography globales.
* Usar constantes del tema en lugar de valores hardcodeados.

---

## State Management

### Context API + useReducer
* Usar React Context + useReducer para estado global compartido.
* Crear un context por dominio (ej: ThemeContext, AuthContext, SettingsContext).
* Mantener los providers en `src/contexts/`.
* Mantener la lógica de estado en reducers separados cuando sea compleja.
* No crear un único context monolítico.

---

## Testing

### Testing Library + Jest
* Jest viene integrado con Expo (no necesita instalación adicional).
* Para tests de componentes, instalar `@testing-library/react-native` cuando se solicite.
* Tests de integración y unitarios siguen el patrón:
  * `render(<Componente />)`
  * `getByText()`, `getByTestId()`, `fireEvent.press()`
* No crear tests除非 el usuario lo solicite explícitamente.
* No introducir frameworks de testing除非 el usuario lo solicite.

---

## Dependencies

Instalar librerías ampliamente adoptadas y bien establecidas sin preguntar:

* `@react-navigation/native` + drawers, tabs, stacks
* `axios`
* `zustand`
* `@tanstack/react-query`
* `react-hook-form`
* `zod`
* `react-native-reanimated`
* `react-native-gesture-handler`

Antes de instalar cualquier dependencia niche, experimental, pesada o poco común:

1. Explicar por qué se necesita.
2. Pedir aprobación.

Reglas adicionales:
* Comprobar si ya existe una dependencia similar en el proyecto.
* Preferir APIs nativas cuando sea práctico.
* Preferir menos dependencias siempre que sea posible.

---

## File Modification Policy

Modificar solo archivos directamente relacionados con la tarea solicitada.

No hacer:
* Refactors no relacionados.
* Renombrar archivos innecesariamente.
* Reorganizar carpetas sin aprobación.
* Modificar código funcional sin razón clara.
* Añadir archivos no requeridos.
* Tocar partes no relacionadas del codebase.

Siempre minimizar el alcance de los cambios.

---

## Approval Workflow

### Cambios Pequeños
Ejemplos:
* Corrección de bugs.
* Actualizaciones menores de UI.
* Features pequeñas e aisladas.

Estos pueden implementarse directamente.

### Cambios Medianos o Grandes
Antes de implementar:
1. Explicar brevemente el enfoque propuesto.
2. Describir áreas afectadas del proyecto.
3. Esperar aprobación del usuario cuando:
   * Se modificarán múltiples archivos.
   * La arquitectura puede cambiar.
   * Se requieren dependencias nuevas.
   * Hay refactoring significativo.

---

## Documentation & Language

### Código
Debe estar escrito en inglés:
* Variables
* Funciones
* Componentes
* Archivos
* Carpetas

### Documentación
Debe estar escrita en español a menos que se solicite lo contrario.

### Comunicación con el usuario
Las explicaciones deben escribirse en español.

### Cambios Pequeños
* Mantener explicaciones mínimas.
* Centrarse en el resultado.

### Cambios Significativos
Explicar brevemente:
* Qué cambió.
* Por qué cambió.
* Consideraciones o trade-offs importantes.

---

## Comments

Evitar comentarios siempre que sea posible.

Solo añadir comentarios cuando:
* La lógica es genuinamente difícil de entender.
* Hay contexto importante que no puede expresarse mediante la estructura del código.

No añadir comentarios decorativos o redundantes.

---

## Performance

La performance debe considerarse por defecto.

Prioridades:
* Evitar re-renders innecesarios.
* Lazy load cuando sea apropiado.
* Memoize solo cuando sea beneficioso.
* Optimizar bundle size.
* Evitar dependencias innecesarias.
* Usar `React.memo()` solo cuando sea necesario.
* Prefetch de datos cuando sea posible.

---

## Error Handling

* Manejar errores de APIs con mensajes amigables al usuario.
* Usar bloques try/catch para operaciones async.
* Logear errores apropiadamente para debugging.
* No exponer detalles internos de errores al usuario.

---

## Environment Variables

* No commitear archivos `.env` ni secretos en el control de versiones.
* Usar `.env.example` para documentar variables requeridas.
* Mantener configuración sensible fuera del codebase.
* Usar `expo-constants` para acceder a variables de entorno en Expo.

---

## PWA & Metadata

Configurar como Progressive Web App (PWA) por defecto (cuando aplique para web):

* Incluir un `app.json` válido con configuración completa.
* Incluir iconos de aplicación referenciados en la configuración.
* Usar iconos de placeholder si no hay assets de branding finales.
* Configurar la app para que pueda instalarse en dispositivos compatibles.
* Asegurar que los valores del `app.json` estén alineados con el proyecto actual.

Requisitos de metadata (app.json):
* Definir título apropiado de la app.
* Definir descripción meta significativa.
* Configurar metadata SEO relevante.
* Configurar metadata Open Graph cuando aplique.
* Configurar splash screen y iconos.
* Mantener toda la metadata consistente con el propósito de la app.

---

## Responsive Design

Todas las interfaces deben funcionar correctamente en:
* Móvil
* Tablet
* Web (si aplica)

Construir responsividad desde el principio en lugar de retrofitting después.

---

## Git Configuration

El `.gitignore` siempre debe incluir:
* Archivos `.env`
* `node_modules/`
* `.expo/`
* Archivos de build
* `.DS_Store` (macOS)

### Commits
* El usuario realiza commits manualmente.
* Si se solicita escribir mensajes de commit, usar convención descriptiva en español.
* No hacer commits, pushes, ni crear PRs sin que el usuario lo solicite explícitamente.

---

## Documentation Maintenance

README.md es un documento vivo y debe actualizarse siempre que la aplicación cambie.

---

## Decision Making

Cuando existan múltiples soluciones válidas:
1. Elegir la solución más simple.
2. Preferir legibilidad sobre ingenio.
3. Preferir menos dependencias.
4. Preferir consistencia con el codebase existente.
5. Pedir clarificación cuando los requisitos sean ambiguos.

No inventar requisitos.

---

## Workflow

1. Recibir la tarea.
2. Analizar el código existente antes de hacer cambios.
3. Proponer un enfoque si la tarea es mediana o grande.
4. Implementar los cambios mínimos necesarios.
5. Actualizar documentación si se requiere.
6. Explicar cambios significativos.
7. Esperar revisión del usuario cuando se requiera aprobación.
