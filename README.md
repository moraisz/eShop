# eShop

Ecommerce application with admin panel builded using Django

## Stacks

- Python 3.14
- Django 6.1
- PostgreSQL 18.4

## How to run

### Docker Compose (recommended)

1. Copy `.env.example` to `.env`
2. Change variables with `CHANGE-ME`
3. Run `docker compose up` to build and run Django application and PostgreSQL database
4. Access `localhost:8000` in browser

### UV Astral

1. Use the command `uv sync` to create `.venv` folder
2. Copy `.env.example` to `.env`
3. Change variables with `CHANGE-ME`
4. Run your PostgreSQL database
5. Run Django with `uv run manage.py runserver`
4. Access `localhost:8000` in browser

