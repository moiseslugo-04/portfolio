from app.schemas.auth import AuthLoginSchema
from app.services.users import get_by_identifier
from app.auth.auth import verify_password
from app.core.exceptions import NotFoundError,UnauthorizedError 

def  user_login(data:AuthLoginSchema):
    user = get_by_identifier(data.identifier)
    if not verify_password(data.password,user['password_hash']):
        raise UnauthorizedError("Invalid password")
    return user['id']
