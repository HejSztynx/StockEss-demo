tickers = ["CDR.WA", "PGE.WA", "PKN.WA", "KRU.WA", "KGH.WA", 
           "PZU.WA", "PKO.WA", "PEO.WA", "MBK.WA", "SPL.WA", 
           "ALR.WA", "OPL.WA", "ALE.WA", "DNP.WA", "JSW.WA", 
           "KTY.WA", "BDX.WA", "CCC.WA", "LPP.WA", "PCO.WA"]

candle_pattern_names = {
    "CDL2CROWS": "2 Crows",
    "CDL3BLACKCROWS": "3 Black Crows",
    "CDL3INSIDE": "3 Inside",
    "CDL3LINESTRIKE": "3 Line Strike",
    "CDL3OUTSIDE": "3 Outside",
    "CDL3STARSINSOUTH": "3 Stars In South",
    "CDL3WHITESOLDIERS": "3 White Soldiers",
    "CDLABANDONEDBABY": "Abandoned Baby",
    "CDLADVANCEBLOCK": "Advance Block",
    "CDLBELTHOLD": "Belt Hold",
    "CDLBREAKAWAY": "Breakaway",
    "CDLCLOSINGMARUBOZU": "Closing Marubozu",
    "CDLCONCEALBABYSWALL": "Concealing Baby Swallow",
    "CDLCOUNTERATTACK": "Counterattack",
    "CDLDARKCLOUDCOVER": "Dark Cloud Cover",
    "CDLDOJI": "Doji",
    "CDLDOJISTAR": "Doji Star",
    "CDLDRAGONFLYDOJI": "Dragonfly Doji",
    "CDLENGULFING": "Engulfing Pattern",
    "CDLEVENINGDOJISTAR": "Evening Doji Star",
    "CDLEVENINGSTAR": "Evening Star",
    "CDLGAPSIDESIDEWHITE": "Up/Down-gap Side-by-Side White Lines",
    "CDLGRAVESTONEDOJI": "Gravestone Doji",
    "CDLHAMMER": "Hammer",
    "CDLHANGINGMAN": "Hanging Man",
    "CDLHARAMI": "Harami Pattern",
    "CDLHARAMICROSS": "Harami Cross",
    "CDLHIGHWAVE": "High-Wave Candle",
    "CDLHIKKAKE": "Hikkake Pattern",
    "CDLHIKKAKEMOD": "Modified Hikkake Pattern",
    "CDLHOMINGPIGEON": "Homing Pigeon",
    "CDLIDENTICAL3CROWS": "Identical 3 Crows",
    "CDLINNECK": "In-Neck Pattern",
    "CDLINVERTEDHAMMER": "Inverted Hammer",
    "CDLKICKING": "Kicking",
    "CDLKICKINGBYLENGTH": "Kicking - Bull/Bear Determination",
    "CDLLADDERBOTTOM": "Ladder Bottom",
    "CDLLONGLEGGEDDOJI": "Long Legged Doji",
    "CDLLONGLINE": "Long Line Candle",
    "CDLMARUBOZU": "Marubozu",
    "CDLMATCHINGLOW": "Matching Low",
    "CDLMATHOLD": "Mat Hold",
    "CDLMORNINGDOJISTAR": "Morning Doji Star",
    "CDLMORNINGSTAR": "Morning Star",
    "CDLONNECK": "On-Neck Pattern",
    "CDLPIERCING": "Piercing Pattern",
    "CDLRICKSHAWMAN": "Rickshaw Man",
    "CDLRISEFALL3METHODS": "Rise/Fall 3 Methods",
    "CDLSEPARATINGLINES": "Separating Lines",
    "CDLSHOOTINGSTAR": "Shooting Star",
    "CDLSHORTLINE": "Short Line Candle",
    "CDLSPINNINGTOP": "Spinning Top",
    "CDLSTALLEDPATTERN": "Stalled Pattern",
    "CDLSTICKSANDWICH": "Stick Sandwich",
    "CDLTAKURI": "Takuri",
    "CDLTASUKIGAP": "Tasuki Gap",
    "CDLTHRUSTING": "Thrusting Pattern",
    "CDLTRISTAR": "Tristar Pattern",
    "CDLUNIQUE3RIVER": "Unique 3 River",
    "CDLUPSIDEGAP2CROWS": "Upside Gap Two Crows",
    "CDLXSIDEGAP3METHODS": "Upside/Downside Gap Three Methods",
}

PERIODS = ["1m", "3m", "6m", "1y"] # dodać tutaj 6m i 1y jak już będą wytrenowane modele i scalery do nich
FORECAST_PERIODS = {
    "1m": 22,
    "3m": 66,
    "6m": 132,
    "1y": 252
}
SEQUENCE_LENGTHS_FOR_PERIODS = {
    "1m": 261,
    "3m": 522,
    "6m": 600,
    "1y": 1260
}
# SEQUENCE_LENGTH = 261
RETRAINING_RATE = 20    # period every how many days do we do retraining
# FORECAST_STEPS = 22
models = None
raw_data = None
processed_data = None
scalers = None

