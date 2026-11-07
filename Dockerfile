ARG UV_VERSION=0.13.6
ARG PYTHON_VERSION=3.14.10

FROM ghcr.io/astral-sh/uv:${UV_VERSION} AS uv

FROM python:${PYTHON_VERSION}-slim-trixie AS builder

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=uv /uv /uvx /bin/

WORKDIR /app

ENV UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1 \
    UV_PYTHON_DOWNLOADS=0

COPY pyproject.toml uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev --no-install-project

COPY ./ ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev

FROM python:${PYTHON_VERSION}-slim-trixie AS runtime

ARG UID=10001
ARG GID=10001

ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN groupadd --system --gid "${GID}" app \
    && useradd --system --uid "${UID}" --gid "${GID}" --create-home app

WORKDIR /app

COPY --from=builder /app/ ./

USER ${UID}:${GID}

EXPOSE 8000

CMD ["uv", "run", "manage.py", "runserver", "0.0.0.0:8000"]
