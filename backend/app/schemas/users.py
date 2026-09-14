from pydantic import BaseModel,field_validator,FilePath,ValidationInfo
from app.validators.user import validate_email, validate_string,validate_password,validate_bio,avatar_url_validator

class UserCreateSchema(BaseModel):
    name:str
    email:str
    username:str
    bio:str
    password:str
    
    @field_validator('email')
    @classmethod
    def email_validator(cls, value):
        return validate_email(value)
    
    @field_validator('username','name')
    def string_validator(cls, value,info: ValidationInfo):
        return validate_string(value, info.field_name)
    
    @field_validator('password')
    @classmethod
    def password_validator(cls, value):
        return validate_password(value)
    
    @field_validator('bio')
    @classmethod
    def bio_validator(cls, value):
        return validate_bio(value)

class UserResponseSchema(BaseModel):
    username:str
    name:str
    email:str
class UserUpdateSchema(BaseModel):
    name:str = None
    email:str  = None
    username:str  = None
    bio:str  = None
    job_title:str = None 
    @field_validator('email')
    @classmethod
    def validate_email(cls, value,info: ValidationInfo):
        return validate_email(value)
    
    @field_validator('username','name')
    @classmethod
    def validate_string(cls, value,info: ValidationInfo):
        return validate_string(value, info.field_name)
    
    @field_validator('bio')
    @classmethod
    def bio_validator(cls, value):
        return validate_bio(value)

class UserUpdatePasswordSchema(BaseModel):
    password:str
    @field_validator('password')
    @classmethod
    def password_validator(cls, value):
        return validate_password(value)
    
    
class UserAvatarSchema(BaseModel):
    image_url:str
    public_id:str
    alt:str
    
    @field_validator('image_url')
    @classmethod
    def validate_avatar_url(cls, value):
        return avatar_url_validator(value)
    
    @field_validator('alt', 'public_id')
    @classmethod
    def validate_avatar_alt(cls, value):
        return validate_string(value)    
    
