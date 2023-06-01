# Imagen base para el back-end
FROM python:3.9-slim as back-end

# Establecer el directorio de trabajo para el back-end
WORKDIR /app

# Copiar archivos
COPY . /app

# Instalar dependencias
RUN pip install --no-cache-dir -r requeriments.txt

# Exponer el puerto 5000 para el back-end
EXPOSE 5000

# Comando para ejecutar el backend con gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]