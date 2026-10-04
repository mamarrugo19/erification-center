# Verification Center

Página estática de un solo documento. No usa dependencias, no requiere npm y no tiene backend.

## Abrir

Abre `index.html` en el navegador. También puedes servir la carpeta con cualquier servidor estático:

```bash
python3 -m http.server 8742
```

Sirve para GitHub Pages desde la raíz del repositorio (Settings → Pages → branch principal, carpeta `/`).

## Archivos

| Ruta | Uso |
| --- | --- |
| `index.html` | Estructura de la página |
| `styles.css` | Presentación y movimiento |
| `script.js` | Interacción y secuencia |
| `assets/media.jpg` | Imagen principal |
| `assets/music.mp3` | Audio opcional |

## Cambiar medios

En la parte superior de `script.js`:

- `MEDIA_IMAGE_URL` — ruta local o URL de la imagen que se muestra.
- `MEDIA_IMAGE_SOURCE` — URL de respaldo si la ruta local no carga.
- `AUDIO_SRC` — ruta del audio. Por defecto `assets/music.mp3`.

El audio no se reproduce al cargar. Empieza después del primer botón. Si el archivo no existe, la página sigue funcionando.

Hay un control flotante para silenciar o volver a activar el sonido.
