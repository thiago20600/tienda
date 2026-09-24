# Certificados ARCA (ex AFIP)

Esta carpeta contiene las credenciales para firmar la autenticación con los
Web Services de ARCA. **El contenido de esta carpeta NO se versiona** (ver
`.gitignore`): el certificado es público pero la clave privada es secreta.

## Qué archivos esperá acá el servicio

| Archivo | Descripción |
|---|---|
| `certificado.crt` | Certificado X.509 emitido por ARCA (formato PEM) |
| `clave.key` | Clave privada correspondiente al certificado (formato PEM, SIN passphrase) |

Los nombres son los que trae por defecto el `.env.example`
(`AFIP_CERT_PATH=certs/certificado.crt`, `AFIP_KEY_PATH=certs/clave.key`).
Si usás otros nombres, actualizá esas variables en tu `.env`.

> Importante: el servicio lee el **contenido** de ambos archivos (el SDK
> `afip.py` 1.2.0 los envía dentro del request a `app.afipsdk.com`), no las
> rutas. Por eso deben ser archivos PEM reales y legibles desde el contenedor
> (la carpeta está montada dentro de `/code/certs/` por docker-compose).

## Cómo obtener el certificado (pasos resumidos)

1. Entrar a ARCA con CUIT y clave fiscal, o directamente:
   <https://www.afip.gob.ar/ws/> → "Administrador de Relaciones de Clave".
2. Crear la **clave privada** y pedir la CSR (también podés generarla local:
   `openssl req -new -newkey rsa:2048 -nodes -keyout clave.key -out csr.csr -subj "/CN=nombre-empresa"`)
3. En "Administrador de Relaciones de Clave" → "Certificados", emitir el
   certificado pegando la CSR (certificado X.509 v1, 2 años de vigencia).
4. Descargar el `certificado.crt` y guardar `clave.key` en esta carpeta.
5. Darle permiso al **Web Service Facturación Electrónica (WSFE)** al
   certificado, desde el menú "Administrador de Relaciones de Clave" →
   "Adherir Web Services".
6. Completar en `facturacion/.env`:
   - `AFIP_CUIT` (tu CUIT, sin guiones)
   - `AFIP_AMBIENTE=homologacion` para pruebas / `produccion` para facturar en serio
   - `AFIP_PUNTO_VENTA` (el punto de venta habilitado para FE en tu CUIT)
   - `AFIP_ACCESS_TOKEN`: token de la app creada en <https://app.afipsdk.com>
     (el SDK 1.2.0 resuelve el TA y las llamadas SOAP a través de ese proxy)

## Verificación rápida

```bash
# El certificado debe imprimir texto PEM (-----BEGIN CERTIFICATE-----)
python -c "print(open('certs/certificado.crt').read()[:30])"

# La clave debe imprimir PEM y NO debe pedir passphrase
python -c "print(open('certs/clave.key').read()[:30])"
```

Con los archivos en su lugar, levantar el servicio y verificar el `/health`;
la primera emisión de prueba va contra el ambiente de homologación de ARCA.
