from flask import Flask, request, jsonify
from flask_cors import CORS  
import pyodbc
import joblib
from xgboost import XGBRegressor
import pandas as pd

app = Flask(__name__)
CORS(app)

db_config = {
    'server': 'localhost',
    'database': 'KrediHesaplama',
    'trusted_connection': 'yes',
    'driver': 'ODBC Driver 17 for SQL Server',
}

model = joblib.load("trained_model.pkl")

def authenticate_user(username, password, userType):
    try:
        conn = pyodbc.connect(**db_config)
        cursor = conn.cursor()

        query = f"SELECT Id, Username FROM Users WHERE Username=? AND Password=? AND UserType=?"
        cursor.execute(query, (username, password, userType))
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        return user if user else None
    except Exception as e:
        print("Database error:", e)
        return None

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    userType = data.get('userType')

    if username and password:
        user_info = authenticate_user(username, password, userType)
        if user_info is not None:
            user_id, fetched_username = user_info
            return jsonify({"authenticated": True, "userType": userType, "userId": user_id, "username": fetched_username})
        else:
            return jsonify({"authenticated": False, "userType": None, "userId": None, "username": None})
    
    return jsonify({"error": "Missing credentials"}), 400

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if username and password:
        try:
            conn = pyodbc.connect(**db_config)
            cursor = conn.cursor()

            cursor.execute("SELECT COUNT(*) FROM Users WHERE Username=?", (username,))
            existing_user_count = cursor.fetchone()[0]

            if existing_user_count > 0:
                return jsonify({"error": "Username already exists"}), 400

            cursor.execute("INSERT INTO Users (Username, Password, UserType) VALUES (?, ?, 'user')", (username, password))
            conn.commit()

            cursor.close()
            conn.close()

            return jsonify({"message": "User registered successfully"})
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Missing credentials"}), 400

@app.route('/insert_loan_data', methods=['POST'])
def insert_loan_data():
    try:
        data = request.get_json()
        user_id = data['UserID']  

        conn = pyodbc.connect(**db_config)
        cursor = conn.cursor()

        query = """
            INSERT INTO LoanData (UserID, KrediMiktarı, KrediVadesi, FaizOranı, AylıkTaksit, ToplamKrediMaliyeti,
            ToplamFaiz, YıllıkMaliyetOranı, BankaTahsisÜcreti, EkspertizÜcreti, İpotekÜcreti)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """

        cursor.execute(query, (
            user_id, data['KrediMiktarı'], data['KrediVadesi'], data['FaizOranı'], data['AylıkTaksit'],
            data['ToplamKrediMaliyeti'], data['ToplamFaiz'], data['YıllıkMaliyetOranı'],
            data['BankaTahsisÜcreti'], data['EkspertizÜcreti'], data['İpotekÜcreti']
        ))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Loan data inserted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/get_loan_data', methods=['GET'])
def get_loan_data():
    try:
        user_id = request.args.get('userId')  
        conn = pyodbc.connect(**db_config)
        cursor = conn.cursor()

        if user_id is not None:
            query = "SELECT * FROM LoanData WHERE UserID = ?"
            cursor.execute(query, (user_id,))
        else:
            query = "SELECT * FROM LoanData"
            cursor.execute(query)

        data = cursor.fetchall()

        cursor.close()
        conn.close()

        loan_data = []
        for row in data:
            loan_data.append({
                'ID': row[0],
                'KrediMiktarı': row[1],
                'KrediVadesi': row[2],
                'FaizOranı': row[3],
                'AylıkTaksit': row[4],
                'ToplamKrediMaliyeti': row[5],
                'ToplamFaiz': row[6],
                'YıllıkMaliyetOranı': row[7],
                'BankaTahsisÜcreti': row[8],
                'EkspertizÜcreti': row[9],
                'İpotekÜcreti': row[10],
                'UserID': row[11],
                'KrediDurumu': row[12]
            })

        return jsonify(loan_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/delete_loan_data/<int:data_id>', methods=['DELETE'])
def delete_loan_data(data_id):
    try:
        conn = pyodbc.connect(**db_config)
        cursor = conn.cursor()

        query = "DELETE FROM LoanData WHERE ID = ?"
        cursor.execute(query, (data_id,))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Loan data deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/accept_loan_application/<int:data_id>', methods=['POST'])
def accept_loan_application(data_id):
    try:
        conn = pyodbc.connect(**db_config)
        cursor = conn.cursor()

        query = "UPDATE LoanData SET KrediDurumu = 1 WHERE ID = ?"
        cursor.execute(query, (data_id,))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Loan application accepted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/update_interest_rate', methods=['POST'])
def update_interest_rate():
    try:
        data = request.get_json()
        new_interest_rate = data.get('interestRate')

        conn = pyodbc.connect(**db_config)
        cursor = conn.cursor()

        query = "UPDATE InterestRates SET Value = ? WHERE Name = 'main'"
        cursor.execute(query, (new_interest_rate,))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"message": "Interest rate updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/get_interest_rate', methods=['GET'])
def get_interest_rate():
    try:
        conn = pyodbc.connect(**db_config)
        cursor = conn.cursor()

        query = "SELECT Value FROM InterestRates WHERE Name = 'main'"
        cursor.execute(query)
        interest_rate = cursor.fetchone()[0]

        cursor.close()
        conn.close()

        return jsonify({"interestRate": interest_rate})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/model', methods=['POST'])
def predict():
    try:
        data = request.json
        brut = float(data['brut'])
        yas = int(data['yas'])
        kat1 = int(data['kat1'])
        net = float(data['net'])
        oda = int(data['oda'])
        kat2 = int(data['kat2'])
        isitma = int(data['isitma'])

        yeni_veri = pd.DataFrame({
            "brut_metrekare": [brut],
            "binanin_yasi": [yas],
            "binanin_kat_sayisi": [kat1],
            "net_metrekare": [net],
            "oda_sayisi": [oda],
            "bulundugu_kat": [kat2],
            "isitma_tipi": [isitma]
        })

        pred = model.predict(yeni_veri)

        if pred < 0:
            pred = -1 * pred

        pred = int(pred[0])
        para_birimi = "TL"
        pred_with_para_birimi = str(pred) + " " + para_birimi

        return jsonify({'prediction': pred_with_para_birimi})
    except Exception as e:
        return jsonify({'error': 'Prediction failed. ' + str(e)})

if __name__ == '__main__':
    app.run(debug=True)

