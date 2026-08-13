from fastapi import BackgroundTasks
from fastapi.responses import JSONResponse
from auth.auth import create_access_token
from models.mail import EmailSchema
from fastapi_mail import FastMail, MessageSchema
from config import conf

async def send_mail_innactive_account(
        background_tasks: BackgroundTasks,
        email: EmailSchema
) -> JSONResponse:
    token = create_access_token(email.model_dump().get('email')[0])
    message = MessageSchema(
        subject='Activar cuenta',
        recipients=email.model_dump().get('email'),
        #OJITOOOOOOOO
        body=f'http://localhost:8001/activate_account/{token}',
        subtype='html'
    )

    fm = FastMail(conf)

    background_tasks.add_task(fm.send_message, message)
    return JSONResponse(status_code=200, content={'message': 'email enviado'})