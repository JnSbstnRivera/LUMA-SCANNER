# LUMA SCANNER - Calculadora Solar Windmar Home

Analiza tu factura de LUMA Energy mediante Inteligencia Artificial para determinar la cantidad exacta de placas solares necesarias para tu hogar o negocio en Puerto Rico.

## 🚀 Características

- **Análisis de Factura con IA**: Carga tu factura de LUMA y deja que Gemini analice tu historial de consumo automáticamente.
- **Ingreso Manual**: Opción para ingresar los datos de consumo manualmente si no tienes la factura a mano.
- **Configuración Personalizada**: Ajusta si eres un cliente nuevo o si deseas expandir un sistema existente.
- **Resultados Precisos**: Cálculos basados en la metodología de Windmar Home (4.5 HSP y eficiencia del sistema).
- **Diseño Responsivo**: Optimizado para dispositivos móviles y escritorio.

## 🛠️ Tecnologías

- **React 19** + **Vite**
- **TypeScript**
- **Tailwind CSS**
- **Google Gemini API** (@google/genai)
- **Framer Motion** (Animaciones)
- **Recharts** (Gráficos de consumo)

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- Una API Key de Google Gemini (puedes obtenerla en [Google AI Studio](https://aistudio.google.com/))

## ⚙️ Instalación Local

1. Clona el repositorio:
   ```bash
   git clone <tu-url-de-github>
   cd calculadora-solar---luma-analizer
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   - Crea un archivo `.env` en la raíz del proyecto.
   - Agrega tu API Key:
     ```env
     GEMINI_API_KEY=tu_api_key_aqui
     ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 🌐 Despliegue en Vercel

Este proyecto está listo para ser desplegado en Vercel:

1. Sube tu código a un repositorio de GitHub.
2. Conecta tu repositorio en el dashboard de Vercel.
3. **IMPORTANTE**: En la configuración del proyecto en Vercel, ve a **Environment Variables** y agrega:
   - Key: `GEMINI_API_KEY`
   - Value: `tu_api_key_aqui`
4. Vercel detectará automáticamente que es un proyecto de Vite y realizará el despliegue.

## 📄 Licencia

Este proyecto es privado y propiedad de Windmar Home.
