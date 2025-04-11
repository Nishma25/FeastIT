from flask import Flask
from dotenv import load_dotenv
from app.extensions import db
from app import create_app  # App factory pattern

load_dotenv()

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)


