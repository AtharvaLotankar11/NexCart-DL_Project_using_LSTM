import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Embedding, Dropout
from sklearn.model_selection import train_test_split
import pickle
import os
import json

def train_nexcart_lstm():
    # 1. Load Data
    data_path = 'data/user_interactions.csv'
    if not os.path.exists(data_path):
        print("Data not found. Please run generate_synthetic_data.py first.")
        return
    
    df = pd.read_csv(data_path)
    
    # 2. Tokenize Products
    # Ensure product_ids are consistently mapped to indices (1 to num_products)
    # We reserve 0 for padding
    product_ids = sorted(df['product_id'].unique())
    id_to_idx = {pid: i + 1 for i, pid in enumerate(product_ids)}
    idx_to_id = {i + 1: pid for i, pid in enumerate(product_ids)}
    
    num_products = len(product_ids)
    vocab_size = num_products + 1 # +1 for padding index 0
    
    # 3. Create Sequences
    sequence_length = 10
    sequences = []
    targets = []
    
    # Group by user and create rolling windows
    for user_id, group in df.groupby('user_id'):
        user_history = [id_to_idx[pid] for pid in group['product_id'].tolist()]
        
        if len(user_history) < sequence_length + 1:
            continue
            
        for i in range(len(user_history) - sequence_length):
            sequences.append(user_history[i:i + sequence_length])
            targets.append(user_history[i + sequence_length])
            
    X = np.array(sequences)
    y = np.array(targets)
    
    print(f"Dataset prepared: {len(X)} samples for training.")
    
    # 4. Build Stacked LSTM Architecture
    model = Sequential([
        Embedding(input_dim=vocab_size, output_dim=64, input_length=sequence_length, mask_zero=True),
        LSTM(128, return_sequences=True),
        Dropout(0.2),
        LSTM(128),
        Dropout(0.2),
        Dense(64, activation='relu'),
        Dense(vocab_size, activation='softmax')
    ])
    
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    
    # 5. Train
    print("Commencing Deep Learning pulse training...")
    model.fit(X, y, epochs=15, batch_size=32, validation_split=0.1, verbose=1)
    
    # 6. Save Artifacts
    os.makedirs('models', exist_ok=True)
    
    # Save Model
    model.save('models/nexcart_lstm.h5')
    
    # Save Mappings (needed for inference)
    mappings = {
        'id_to_idx': {int(k): int(v) for k, v in id_to_idx.items()},
        'idx_to_id': {int(k): int(v) for k, v in idx_to_id.items()},
        'num_products': num_products,
        'vocab_size': vocab_size,
        'sequence_length': sequence_length
    }
    
    with open('models/mappings.json', 'w') as f:
        json.dump(mappings, f)
        
    print("Phase 8 Model Training Successful. Artifacts saved in ml-model/models/")

if __name__ == "__main__":
    train_nexcart_lstm()
