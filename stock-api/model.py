import os
import yfinance as yf
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
import torch
import torch.nn as nn
import torch.optim as optim
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from datetime import datetime
import json
from datetime import datetime, timedelta
import joblib
from collections import defaultdict


INPUT_SIZE = 4
OUTPUT_SIZE = 4
DROPOUT = 0.3
HIDDEN_SIZE = 256
NUM_LAYERS = 3
# FORECAST_STEPS = 22
FORECAST_STEPS = 252
NUM_EPOCHS = 15
LEARNING_RATE = 0.001
BATCH_SIZE = 16
# SEQUENCE_LENGTH = 261
SEQUENCE_LENGTH = 300
SEQUENCE_LENGTHS_FOR_PERIODS = {
    "1m": 261,
    "3m": 522,
    "6m": 600,
    "1y": 1260
}
START_DATE = "2010-01-01"
END_DATE = datetime.today().strftime("%Y-%m-%d")
# END_DATE = "2023-12-31"



device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Używane urządzenie:", device)

def get_data(tickers, start_date=START_DATE, end_date=END_DATE):
    stock_data = {}
    for ticker in tickers:
        data = yf.Ticker(ticker).history(start=start_date, end=end_date)
        data = data[data['Volume'] != 0]
        data.index = data.index.strftime("%Y-%m-%d")
        stock_data[ticker] = data
    return stock_data


# def preprocess_data_percentage(stock_data, existing_scalers=None):
#     processed_data = {}
#     for ticker in tickers:
#         processed_data[ticker] = {}

#     scalers = {} if existing_scalers is None else existing_scalers

#     if len(scalers) == 0:
#         for ticker in tickers:
#             scalers[ticker] = {}

#     for ticker, data in stock_data.items():
#         prices = data[['Open', 'High', 'Low', 'Close']].copy()
#         pct_change = prices.pct_change().dropna()

#         for period in periods:
#             if existing_scalers and ticker in existing_scalers:
#                 scaler = existing_scalers[ticker][period]
#                 print(existing_scalers)
#                 print(scaler)
#                 scaled_pct = scaler.transform(pct_change)
#             else:
#                 scaler = MinMaxScaler(feature_range=(-1, 1))
#                 scaled_pct = scaler.fit_transform(pct_change)
#                 scalers[ticker][period] = scaler

#             processed_data[ticker][period] = scaled_pct

#     return processed_data, scalers

def preprocess_data_percentage(stock_data, existing_scalers=None):
    processed_data = {}
    for ticker in tickers:
        processed_data[ticker] = {}

    scalers = {} if existing_scalers is None else existing_scalers

    for ticker, data in stock_data.items():
        prices = data[['Open', 'High', 'Low', 'Close']].copy()
        pct_change = prices.pct_change().dropna()

        for period in periods:
            if existing_scalers:
                scaler = existing_scalers[ticker]
                scaled_pct = scaler.transform(pct_change)
            else:
                scaler = MinMaxScaler(feature_range=(-1, 1))
                scaled_pct = scaler.fit_transform(pct_change)
                scalers[ticker] = scaler

            processed_data[ticker][period] = scaled_pct

    return processed_data, scalers


def save_scalers(scalers, folder_path="scalers"):
    os.makedirs(folder_path, exist_ok=True)
    for ticker, scaler in scalers.items():
        path = os.path.join(folder_path, f"{ticker}_scaler.pkl")
        joblib.dump(scaler, path)
        print(f"Scaler for {ticker} saved to {path}")


def load_scaler(ticker, folder_path="scalers"):
    path = os.path.join(folder_path, f"{ticker}_scaler.pkl")
    if os.path.exists(path):
        return joblib.load(path)
    else:
        raise FileNotFoundError(f"No scaler found for {ticker} at {path}")


# def load_all_scalers(folder_path="scalers"):
#     scalers = {}
    
#     for ticker in tickers:
#         scalers[ticker] = {}

#     for period in periods:
#         period_path = os.path.join(folder_path, period)
        
#         for filename in os.listdir(period_path):
#             if filename.endswith("_scaler.pkl"):
#                 ticker = filename.replace("_scaler.pkl", "")
#                 path = os.path.join(period_path, filename).replace("\\", "/")
#                 try:
#                     scaler = joblib.load(path)
#                     scalers[ticker][period] = scaler
#                     print(f"Wczytano scaler dla {ticker} ({period}) z {path}")
#                 except Exception as e:
#                     print(f"Błąd podczas wczytywania scaler dla {ticker}: {e}")
#     return scalers

def load_all_scalers(folder_path="models/scalers/1m"):
    scalers = {}

    for filename in os.listdir(folder_path):
        if filename.endswith("_scaler.pkl"):
            ticker = filename.replace("_scaler.pkl", "")
            path = os.path.join(folder_path, filename).replace("\\", "/")
            try:
                scaler = joblib.load(path)
                scalers[ticker] = scaler
                print(f"Wczytano scaler dla {ticker} z {path}")
            except Exception as e:
                print(f"Błąd podczas wczytywania scaler dla {ticker}: {e}")

    return scalers


# Funkcja do tworzenia zbioru danych dla prognozowania multi-step
def create_multistep_data(ticker_data, sequence_length, forecast_steps):
    X, y = [], []
    for i in range(sequence_length, len(ticker_data) - forecast_steps + 1):
        X.append(ticker_data[i-sequence_length:i])
        y.append(ticker_data[i:i+forecast_steps])
    X, y = np.array(X), np.array(y)
    return X, y


# Model seq2seq z użyciem LSTM
class Seq2SeqLSTM(nn.Module):
    def __init__(self, input_size=INPUT_SIZE, hidden_size=HIDDEN_SIZE, num_layers=NUM_LAYERS, forecast_steps=FORECAST_STEPS, output_size=OUTPUT_SIZE, dropout=DROPOUT):
        super(Seq2SeqLSTM, self).__init__()
        self.encoder = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, dropout=dropout)
        self.decoder = nn.LSTM(output_size, hidden_size, num_layers, batch_first=True, dropout=dropout)
        self.fc = nn.Linear(hidden_size, output_size)
        self.forecast_steps = forecast_steps

    def forward(self, encoder_inputs, decoder_inputs):
        # encoder_inputs: (batch, seq_len, input_size)
        encoder_output, (hidden, cell) = self.encoder(encoder_inputs)
        # decoder_inputs: (batch, forecast_steps, output_size)
        decoder_output, _ = self.decoder(decoder_inputs, (hidden, cell))
        output = self.fc(decoder_output)
        return output


# Funkcja treningowa z teacher forcing
def train_seq2seq_model(ticker_data, sequence_length, forecast_steps, num_epochs=NUM_EPOCHS, batch_size=BATCH_SIZE, lr=LEARNING_RATE):
    # Przygotowanie danych
    X, y = create_multistep_data(ticker_data, sequence_length, forecast_steps)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    X_train_tensor = torch.tensor(X_train, dtype=torch.float32).to(device)
    y_train_tensor = torch.tensor(y_train, dtype=torch.float32).to(device)
    X_test_tensor = torch.tensor(X_test, dtype=torch.float32).to(device)
    y_test_tensor = torch.tensor(y_test, dtype=torch.float32).to(device)

    # Przygotowanie danych do dekodera – teacher forcing:
    decoder_input_train = torch.zeros_like(y_train_tensor).to(device)
    decoder_input_train[:, 0, :] = X_train_tensor[:, -1, :]
    decoder_input_train[:, 1:, :] = y_train_tensor[:, :-1, :]
    decoder_input_train = decoder_input_train.detach()

    model = Seq2SeqLSTM().to(device)
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=lr)

    train_losses = []
    val_losses = []

    for epoch in range(num_epochs):
        model.train()
        epoch_loss = 0

        # Mieszanie próbek treningowych co epokę
        perm = torch.randperm(X_train_tensor.size(0))
        X_train_shuffled = X_train_tensor[perm]
        y_train_shuffled = y_train_tensor[perm]
        decoder_input_train_shuffled = decoder_input_train[perm]

        num_batches = int(np.ceil(X_train_shuffled.size(0) / batch_size))

        for i in range(num_batches):
            start_idx = i * batch_size
            end_idx = start_idx + batch_size

            batch_X = X_train_shuffled[start_idx:end_idx]
            batch_y = y_train_shuffled[start_idx:end_idx]
            batch_decoder_inputs = decoder_input_train_shuffled[start_idx:end_idx]

            optimizer.zero_grad()
            output = model(batch_X, batch_decoder_inputs)
            loss = criterion(output, batch_y)

            # Kontrola NaN i Inf
            if not torch.isfinite(loss):
                print(f"Non-finite loss at epoch {epoch+1}, batch {i+1}: {loss.item()}")
                torch.cuda.empty_cache()
                continue

            loss.backward()
            optimizer.step()
            epoch_loss += loss.item()

        avg_loss = epoch_loss / num_batches if num_batches > 0 else float('inf')

        # Walidacja
        model.eval()
        with torch.no_grad():
            decoder_input_val = torch.zeros_like(y_test_tensor).to(device)
            decoder_input_val[:, 0, :] = X_test_tensor[:, -1, :]
            decoder_input_val[:, 1:, :] = y_test_tensor[:, :-1, :]
            decoder_input_val = decoder_input_val.detach()

            val_output = model(X_test_tensor, decoder_input_val)
            val_loss = criterion(val_output, y_test_tensor)

        train_losses.append(avg_loss)
        val_losses.append(val_loss.item())
        print(f"Epoch {epoch+1}/{num_epochs} - Loss: {avg_loss:.4f}, Val Loss: {val_loss.item():.4f}")

    history = {'loss': train_losses, 'val_loss': val_losses}
    return model, history, (X_test_tensor, y_test_tensor)


# Funkcja prognozowania dla modelu seq2seq
def predict_future_seq2seq(model, scaler, original_data, ticker_data_pct, sequence_length, forecast_steps):
    model.eval()
    # Przygotowanie sekwencji wejściowej
    encoder_input = torch.tensor(ticker_data_pct[-sequence_length:].reshape(1, sequence_length, -1),
                                    dtype=torch.float32).to(device)
    # Inicjalizacja dekodera – pierwszy krok to ostatni element sekwencji wejściowej
    decoder_input = torch.zeros((1, forecast_steps, 4), dtype=torch.float32).to(device)
    decoder_input[0,0,:] = torch.tensor(ticker_data_pct[-1], dtype=torch.float32)
    outputs = []
    # Kodowanie
    encoder_output, (hidden, cell) = model.encoder(encoder_input)
    decoder_input_step = decoder_input[:,0,:].unsqueeze(1)  # kształt (1,1,4)
    # Iteracyjna dekodacja
    for t in range(forecast_steps):
        decoder_output, (hidden, cell) = model.decoder(decoder_input_step, (hidden, cell))
        pred = model.fc(decoder_output)  # kształt (1,1,4)
        outputs.append(pred.squeeze(1).cpu().detach().numpy())  # teraz pred ma kształt (1,4)
        decoder_input_step = pred  # używamy predykcji jako kolejnego wejścia
    outputs = np.array(outputs)  # kształt (forecast_steps, 1, 4)
    outputs = np.squeeze(outputs, axis=1)  # kształt (forecast_steps, 4)
        
    # Odwrócenie skalowania – zmiany procentowe w oryginalnych wartościach
    predictions_pct = scaler.inverse_transform(outputs)

    # Poprawa niespójności (np. Low nie większe od min(Open,Close), High nie mniejsze od max(Open,Close))
    predictions_pct = enforce_constraints(predictions_pct)
        
    # Wyliczenie przewidywanych cen według nowych reguł:
    # Używamy poprzedniego dnia 'Open' jako podstawy dla obliczeń High, Low i (opcjonalnie) Close.
    prev_open = original_data[['Open']].values[-1][0]
    prev_close = original_data[['Close']].values[-1][0]

    predicted_prices = []
    for pct_change in predictions_pct:
        # Załóżmy, że pct_change = [open_change, high_change, low_change, close_change]
        new_open  = prev_close
        new_high = new_open * (1 + pct_change[1])  
        new_low  = new_open * (1 - pct_change[2])
        new_close = new_open * (1 + pct_change[3])
        predicted_prices.append([new_open, new_high, new_low, new_close])
        # Aktualizujemy prev_open tylko dla wyliczenia kolejnego dnia (na podstawie new_open)
        prev_open = new_close
        prev_close = new_close
    return np.array(predicted_prices), predictions_pct


# Funkcja korygująca prognozowane zmiany procentowe, by zachować zależności między parametrami
def enforce_constraints(predictions_pct):
    corrected = []
    for day in predictions_pct:
        pred_open, pred_high, pred_low, pred_close = day
        # Upewnij się, że Low nie przekracza minimalnej wartości między Open i Close
        corrected_low = min(pred_low, pred_open, pred_close)
        # Upewnij się, że High jest co najmniej równy maksymalnej wartości między Open i Close
        corrected_high = max(pred_high, pred_open, pred_close)
        corrected.append([pred_open, corrected_high, corrected_low, pred_close])
    return np.array(corrected)

# Wykres historii treningu
def plot_training_history(history, ticker):
    plt.figure(figsize=(10, 5))
    plt.plot(history['loss'], label='Train Loss')
    plt.plot(history['val_loss'], label='Validation Loss')
    plt.title(f'Loss vs Validation Loss – {ticker}')
    plt.xlabel('Epochy')
    plt.ylabel('Loss')
    plt.legend()
    plt.grid(True)
    plt.show()

# Ewaluacja modelu
def evaluate_model_seq2seq(model, X_test, y_test, scaler):
    model.eval()
    with torch.no_grad():
        decoder_input_test = torch.zeros(y_test.shape, dtype=torch.float32).to(device)
        decoder_input_test[:,0,:] = X_test[:,-1,:]
        decoder_input_test[:,1:,:] = y_test[:,:-1,:]
        y_pred = model(X_test, decoder_input_test).cpu().numpy()
    # Odwrócenie skalowania oraz spłaszczenie macierzy (połączenie wymiarów: próbki i forecast_steps)
    y_pred_inv = scaler.inverse_transform(y_pred.reshape(-1, 4)).reshape(y_pred.shape)
    y_test_inv = scaler.inverse_transform(y_test.cpu().numpy().reshape(-1, 4)).reshape(y_test.cpu().numpy().shape)
    
    # Spłaszczamy dane do kształtu (n_samples * forecast_steps, 4) aby metryki działały prawidłowo
    y_pred_flat = y_pred_inv.reshape(-1, 4)
    y_test_flat = y_test_inv.reshape(-1, 4)
    
    mae = mean_absolute_error(y_test_flat, y_pred_flat)
    rmse = np.sqrt(mean_squared_error(y_test_flat, y_pred_flat))
    r2 = r2_score(y_test_flat, y_pred_flat)
    print(f"MAE: {mae:.4f}")
    print(f"RMSE: {rmse:.4f}")
    print(f"R²: {r2:.4f}")

import matplotlib.pyplot as plt

def plot_prices(predictions, title):
    # Pobieramy dane rzeczywiste
    real_data = get_data(tickers=[title], start_date='2024-01-01', end_date='2024-12-31')
    
    # Zakładamy, że real_data to słownik, gdzie kluczem jest ticker
    df = real_data[title]
    
    # Filtrujemy dni, gdzie Volume != 0 oraz wybieramy pierwsze 70 obserwacji
    df_filtered = df[df['Volume'] != 0].head(FORECAST_STEPS)
    
    # Pobieramy ceny zamknięcia z rzeczywistych danych
    real_close_prices = df_filtered['Close'].values
    
    # Pobieramy z macierzy predykcji tylko kolumnę odpowiadającą wartościom Close (indeks 3)
    predicted_close_prices = predictions[:, 3]
    
    # Rysujemy wykres
    plt.figure(figsize=(10, 5))
    plt.plot(predicted_close_prices, marker='o', linestyle='-', color='b', label='Predicted Price')
    plt.plot(real_close_prices, marker='o', linestyle='-', color='r', label='Real Price')
    plt.title(f'Predykcja ceny dla {title}')
    plt.xlabel('Dzień')
    plt.ylabel('Cena')
    plt.legend()
    plt.grid(True)
    plt.show()

    real_change_pct = ((real_close_prices[-1] - real_close_prices[0]) / real_close_prices[0]) * 100
    
    predicted_change_pct = ((predicted_close_prices[-1] - real_close_prices[0]) / real_close_prices[0]) * 100

    difference = abs(real_change_pct - predicted_change_pct)
    
    return difference


def load_model(ticker, input_size=INPUT_SIZE, hidden_size=HIDDEN_SIZE, num_layers=NUM_LAYERS, forecast_steps=FORECAST_STEPS, output_size=OUTPUT_SIZE, dropout=DROPOUT, period="1m"):
    model = Seq2SeqLSTM(input_size=input_size,
                        hidden_size=hidden_size,
                        num_layers=num_layers,
                        forecast_steps=forecast_steps,
                        output_size=output_size,
                        dropout=dropout).to(device)
    model_path = f"models/trained_models/{period}/{ticker}_seq2seq_model.pth"
    
    state_dict = torch.load(model_path, map_location=device, weights_only=True)
    model.load_state_dict(state_dict)

    model.eval()
    return model


FORECAST_STEPS_FOR_PERIOD = {"1m": 22, "3m": 66, "6m": 132, "1y": 252}
periods = ["1m", "3m", "6m", "1y"]
tickers = ["CDR.WA", "PGE.WA", "PKN.WA", "KRU.WA", "KGH.WA",
           "PZU.WA", "PKO.WA", "PEO.WA", "MBK.WA", "SPL.WA", 
           "ALR.WA", "OPL.WA", "ALE.WA", "DNP.WA", "JSW.WA", 
           "KTY.WA", "BDX.WA", "CCC.WA", "LPP.WA", "PCO.WA"]


def load_models(tickers=tickers):
    models = {}
    for ticker in tickers:
        models[ticker] = {}
        for period in periods:
            model = load_model(ticker, input_size=INPUT_SIZE, forecast_steps=FORECAST_STEPS_FOR_PERIOD[period], period=period)
            models[ticker][period] = model
    return models


def retrain_model(ticker: str, date_str: str, new_data, period):
    print(f"TRENING MODELU DLA {ticker} {period}")

    with open("models/last_training.json", "r") as f:
        training_log = json.load(f)
    
    epochs = 7

    X, y = create_multistep_data(new_data, SEQUENCE_LENGTHS_FOR_PERIODS[period], FORECAST_STEPS_FOR_PERIOD[period])
    
    print("Ilosc próbek: ", len(X), "siema: ", len(y))

    if len(X) == 0 or len(y) == 0:
        print(f"Za mało danych do dotrenowania modelu dla {ticker}. Pomijam.")
        return

    X_tensor = torch.tensor(X, dtype=torch.float32).to(device)
    y_tensor = torch.tensor(y, dtype=torch.float32).to(device)

    decoder_input = torch.zeros_like(y_tensor).to(device)
    decoder_input[:, 0, :] = X_tensor[:, -1, :]
    decoder_input[:, 1:, :] = y_tensor[:, :-1, :]

    model_path = f"models/trained_models/{period}/{ticker}_seq2seq_model.pth"

    model = Seq2SeqLSTM(input_size=X.shape[2]).to(device)
    state_dict = torch.load(model_path, map_location=device, weights_only=True)
    model.load_state_dict(state_dict)

    model.train()
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE*0.1)

    num_batches = int(np.ceil(X_tensor.shape[0] / BATCH_SIZE))

    for epoch in range(epochs):
        total_loss = 0
        for i in range(num_batches):
            start = i * BATCH_SIZE
            end = start + BATCH_SIZE
            batch_X = X_tensor[start:end]
            batch_y = y_tensor[start:end]
            batch_decoder = decoder_input[start:end]

            optimizer.zero_grad()
            output = model(batch_X, batch_decoder)
            loss = criterion(output, batch_y)
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

        avg_loss = total_loss / num_batches
        print(f"[{ticker}] Epoch {epoch+1}/{epochs} - Loss: {avg_loss:.4f}")

    torch.save(model.state_dict(), model_path)
    print(f"Model for {ticker} saved to {model_path}")

    training_log[ticker] = date_str
    with open("models/last_training.json", "w") as f:
        json.dump(training_log, f)


# ---------------------------------------------------------------------------------------------------------------------
# curr_period = "1y"
# tickers = ["DNP.WA", "PCO.WA", "ALE.WA"]
# tickers = ["JSW.WA", "ALR.WA", "KTY.WA", "BDX.WA", "CCC.WA", "LPP.WA"]
# tickers = ["CDR.WA", "PGE.WA", "PKN.WA", "KRU.WA", "KGH.WA", 
#            "PZU.WA", "PKO.WA", "PEO.WA", "MBK.WA", "SPL.WA", 
#            "OPL.WA", "JSW.WA", "ALR.WA",
#            "KTY.WA", "BDX.WA", "CCC.WA", "LPP.WA", "DNP.WA", "PCO.WA", "ALE.WA"]
# data = get_data(tickers)
# processed_data, scalers = preprocess_data_percentage(data)
# save_scalers(scalers, folder_path="scalers_1y")

# models = {}

# # Trenowanie modeli
# for ticker, normalized_data in processed_data.items():
#     model, history, (X_test, y_test) = train_seq2seq_model(normalized_data[curr_period], SEQUENCE_LENGTH, FORECAST_STEPS)
#     models[ticker] = model
#     print(f"SAVING MODEL FOR: {ticker}")
#     torch.save(model.state_dict(), f"{ticker}_seq2seq_model.pth")

# # Ładowanie wytrenowanych modeli
# # models = load_models(tickers)

# total_diff = 0
# for ticker, model in models.items():
#     original_data = data[ticker]
#     ticker_data_pct = processed_data[ticker][curr_period]
#     scaler = scalers[ticker][curr_period]
#     predicted_prices, predictions_pct = predict_future_seq2seq(model, scaler, original_data, ticker_data_pct, SEQUENCE_LENGTH, FORECAST_STEPS)
#     print(f"Predykcja cen dla {ticker} na {FORECAST_STEPS} dni:")
#     print(predicted_prices)
#     diff = plot_prices(predicted_prices, ticker)
#     print(f"RÓŻNICA: {diff}")
#     total_diff += diff

# print(f"TOTAL DIFF: {total_diff}")

# avg_diff = total_diff / 20
# print(f"ŚREDNI BŁĄD: {avg_diff}")