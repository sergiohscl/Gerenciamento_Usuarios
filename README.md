# PROJETO FullStack GERENCIAMENTO DE USUÁRIOS.

# Backend (Django APIS)

# Clone o Repositorio no github:
    link repositório - https://github.com/sergiohscl/Gerenciamento_Usuarios
```bash
git clone
```

## Criar ambinete virtual venv
```bash
# 1. Linux
python3 -m venv venv
    . venv/bin/activate

# 2. windows
python3 -m venv venv
    . venv/Scripts/activate
```

## Criar e instalar as dependências no projeto
```bash
pip freeze > requirements.txt

pip install -r requirements.txt
```
## Criar as .env e rodar database
```bash
python manage.py makemigrations

python manage.py migrate
```
## Criar Super Usuario
```bash
python manage.py createsuperuser
```
## Rodar o sistema e acessar o admin
```bash
python manage.py runserver
```



# Rodando projeto em Docker
```bash
# 1. docker compose
docker compose up -d --build

# 2. parar tudo
docker compose down

# 3. Para e remove volumes (resetar banco)
docker compose down -v

# 4. Ver containers rodando
docker ps
```
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
