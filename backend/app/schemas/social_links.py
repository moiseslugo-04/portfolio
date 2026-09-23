from pydantic import BaseModel, field_validator

class SocialLinkSchema(BaseModel):
    url:str
    name:str
    
class SocialLinkUpdateSchema(BaseModel):
    url: str 
    @field_validator('url')
    @classmethod
    def validate_url(cls, value):
        if value is not None and not value.startswith('http'):
            raise ValueError('Invalid URL')
        return value
