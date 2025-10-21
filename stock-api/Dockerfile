FROM python:3.10

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    wget \
    build-essential \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

RUN wget https://github.com/TA-Lib/ta-lib/releases/download/v0.6.3/ta-lib-0.6.3-src.tar.gz \
    && tar -xvf ta-lib-0.6.3-src.tar.gz \
    && cd ta-lib-0.6.3 \
    && ./configure --prefix=/usr --build=`/bin/arch`-unknown-linux-gnu\
    && make \
    && make install \
    && pip install --no-cache-dir TA-Lib


WORKDIR /app
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED=1
CMD pip install --no-cache-dir -U yfinance && python run.py
