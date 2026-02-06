# PROJETO FullStack GERENCIAMENTO DE USUÁRIOS.

# Backend (Django APIS)

## Criar venv e instalar Django e DRF

    python3 -m venv venv
    . venv/bin/activate # Linux
    . venv/Scripts/activate # Windows

    pip install django
    pip install djangorestframework
    pip install flake8
    pip install Pillow
    pip install drf-yasg
    pip install django-filter
    pip install dotenv
    pip install psycopg2-binary

## Criar e inicializar projeto Django

    django-admin startproject core .
    python manage.py migrate
    python manage.py createsuperuser

## Criar e instalar as dependências no projeto

    pip freeze > requirements.txt
    pip install -r requirements.txt

## Rodar o sistema e acessar o admin

    python manage.py runserver

## Criar app de accounts

    python manage.py startapp accounts

## Autenticação por JWT. ( https://django-rest-framework-simplejwt.readthedocs.io/en/latest/getting_started.html )

    pip install djangorestframework-simplejwt

## CORS permite que seus recursos sejam acessados ​​em outros domínios. ( https://pypi.org/project/django-cors-headers/ )

    pip install django-cors-headers

# Rodando projeto em Docker

## Rodar o docker-compose
    docker compose up -d --build

## Ver containers rodando
    docker ps

## Parar tudo
    docker compose down

## Para e remover volumes (resetar banco)
    docker compose down -v

## Acessar projeto
    localhost:8000/admin (usuario: admin senha: admin123)
    localhost:8000/swagger

## Rodar todos os testes (dentro do Docker)
    docker compose exec web python manage.py test

## Rodar teste apenas em um arquivo especifico(ex: test_models)
    docker compose exec web python manage.py test apps.accounts.tests.[nome do arquivo]

# Frontend ( React Vite, Typescript, Tailwindcss, Shadcn)

Dentro da pasta `frontend/`:

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em modo dev (Vite)
npm run dev
```

Por padrão, o Vite sobe em `http://localhost:5173`.

## Rodar no docker

```bash
# 1. docker compose
docker compose up -d --build

# 2. parar tudo
docker compose down
```
## Tele Login
    email: admin@admin.com
    senha: admin123

—
👨‍💻 Desenvolvido por Sergio Henrique  
🚀 React • Django • JWT • Docker
