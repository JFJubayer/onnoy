import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'onnoy-secret-key-change-me')
    # Use the root of the project as the base
    PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    DATA_DIR     = os.path.join(PROJECT_ROOT, 'backend', 'data')
    IMPACT_FILE  = os.path.join(DATA_DIR, 'impact.json')
    REQUESTS_FILE = os.path.join(DATA_DIR, 'requests.json')
    FACTCHECKS_FILE = os.path.join(DATA_DIR, 'factchecks.json')
    DOWNLOADS_FILE = os.path.join(DATA_DIR, 'downloads.json')
    ADMIN_TOKEN  = os.environ.get('ADMIN_TOKEN', 'onnoy-admin-dev')

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config_by_name = {
    'dev': DevelopmentConfig,
    'prod': ProductionConfig
}
