from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):

    DB_URL: str
    SECRET_KEY_JWT: str
    ALGORITHM: str
    API_KEY_CLOUDINARY: str
    API_SECRET_CLOUDINARY: str
    CLOUDINARY_CLOUD_NAME: str
    MP_ACCESS_TOKEN: str
    POSTGRES_USER: str
    POSTGRES_DB: str
    POSTGRES_PASSWORD: str


    model_config = SettingsConfigDict(env_file='.env')



settings = Settings()