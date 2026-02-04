# PROJETO API DJANGO E DRF PARA GERENCIAMENTO DE USUÁRIOS.

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
