import os
from datetime import timedelta

class Config:
    SECRET_KEY = 'dev-secret-key-change-this'
    JWT_SECRET_KEY = 'jwt-secret-key-change-this'
    
    SQLALCHEMY_DATABASE_URI = 'sqlite:///site.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)