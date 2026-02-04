#!/usr/bin/env sh
set -e

echo "Aguardando banco de dados..."
until pg_isready -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}" >/dev/null 2>&1; do
  sleep 1
done

echo "Aplicando migrations..."
python manage.py migrate --noinput

echo "Coletando static..."
python manage.py collectstatic --noinput || true

# cria superuser automaticamente (opcional)
echo "Criando superuser (se não existir)..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
import os
User = get_user_model()
u=os.getenv('DJANGO_SUPERUSER_USERNAME')
e=os.getenv('DJANGO_SUPERUSER_EMAIL')
p=os.getenv('DJANGO_SUPERUSER_PASSWORD')
if u and e and p and not User.objects.filter(username=u).exists():
    User.objects.create_superuser(username=u, email=e, password=p)
    print('Superuser criado:', u)
else:
    print('Superuser já existe ou env não definido.')
" || true

echo "Subindo servidor..."
python manage.py runserver 0.0.0.0:8000
