FROM python:3.9-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update --fix-missing && \
    apt-get install -y netcat-openbsd gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*


WORKDIR /app

COPY ./SPA/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./SPA /app
