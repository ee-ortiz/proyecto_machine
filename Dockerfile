# Imagen base para el back-end
FROM python:3.9-slim as back-end

# Establecer el directorio de trabajo para el back-end
WORKDIR /app

# Copiar el archivo requirements.txt y instalar las dependencias
COPY futbol-ml-back/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del back-end
COPY futbol-ml-back .

# Exponer el puerto 5000 para el back-end
EXPOSE 5000

# Comando para ejecutar el backend con gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]

# Imagen base para el front-end
FROM node:14.17 as front-end

# Establecer el directorio de trabajo para el front-end
WORKDIR /app

# Copiar el código del front-end
COPY futbol-ml .

# Instalar las dependencias y construir la aplicación React
RUN npm install && npm run build

FROM ngix:1.21


# Exponer el puerto 8080 para el front-end
EXPOSE 8080

# Comando para ejecutar el servidor web de prodicción del front-end
CMD ["npm", "run", "serve"]