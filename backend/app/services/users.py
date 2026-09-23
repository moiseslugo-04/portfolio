from fastapi import UploadFile
from  app.core.database import execute_query, get_connection
from app.schemas.users import UserCreateSchema, UserResponseSchema,UserUpdateSchema,UserUpdatePasswordSchema 
from app.core.exceptions import NotFoundError,ConflictError
from app.media import cloudinary as cloudinary_services
from app.repositories import users as user_repository
from app.auth.auth import hash_password
   
#Create User
def create_user(data:UserCreateSchema) -> UserCreateSchema:
    existing_username = user_repository.get_by_username(data.username) 
    existing_email = user_repository.get_by_email(data.email) 
    data.password =hash_password(data.password)
    if(existing_email):
        raise ConflictError({'field':"email",'message':"Email already existing"})
    
    if(existing_username):
        raise ConflictError({'field':"username",'message':"Username already existing"})
    
    result = user_repository.create(data)
    return {'user':result}
    
def get_by_id(user_id:str):
    result = user_repository.get_by_id(user_id)
    if not result :
        raise NotFoundError("User not Found")
    return result

     
#Delete user by Id
def delete_user(user_id):
    result = user_repository.delete(user_id)
    print(result)
    return result
            
def get_by_identifier(identifier:str):
    result = user_repository.get_by_identifier(identifier)
    if not result:
            raise NotFoundError("User not found")
    return result


#Update User
def update_user(user_id:str,data:UserUpdateSchema):
    fields = list(data.keys())
    values = list(data.values())
    set_clause = ', '.join([f"{field} =%s" for field in fields])
    key_values = ', '.join(fields)
    
    query = f"UPDATE users SET {set_clause} WHERE id=%s RETURNING {key_values} "
    return execute_query(query,(*values,user_id),fetchone=True)

def upload_user_avatar(user_id: str, file: UploadFile, alt: str):

    previous_avatar = user_repository.get_avatar_by_user_id(user_id)
    
    image = cloudinary_services.upload_image(file)
    
    
    data = {
        'public_id':image['public_id'],
        'image_url':image['image_url'],
        'alt':alt
        }
    
    result = user_repository.upload_avatar( user_id=user_id,data=data)
    if result and previous_avatar:
        cloudinary_services.delete_image(previous_avatar['public_id'])

    return {'image_url': image['image_url']}

