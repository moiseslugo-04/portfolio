from fastapi import UploadFile
from  app.core.database import execute_query, get_connection
from app.schemas.users import UserCreateSchema, UserResponseSchema,UserUpdateSchema,UserUpdatePasswordSchema 
from app.core.exceptions import NotFoundError,ConflictError
from app.media import cloudinary as cloudinary_services

# get all records
def get_all():
    return execute_query('SELECT id,name,username,email FROM users',fetchAll=True)       

## get  user by email or username 
def get_by_identifier(identifier):
    return execute_query('SELECT * FROM users WHERE email=%s OR username=%s',(identifier,identifier,),fetchone=True)


# Get user by email
def get_by_email(user_email):
    return execute_query('SELECT id,name,username,email FROM users WHERE email=%s',(user_email,),fetchone=True)


# Get user by username 
def get_by_username(username):
    return execute_query("SELECT id,name,username,email FROM users WHERE username=%s",(username,),fetchone=True)

## get user by id
def get_by_id(user_id:str):
        return execute_query('SELECT id,name,username,email FROM users WHERE id=%s',(user_id,),fetchone=True) 
    
def get_profile(user_id: str):
    
    query ='''SELECT
    u.id,
    u.name,
    u.username,
    u.email,
    u.bio,
    u.job_title,
    u.created_at,
    u.updated_at,

    a.id AS avatar_id,
    a.image_url AS avatar_url,
    a.alt AS avatar_alt,

    COALESCE(
        (
            SELECT json_agg(
                json_build_object(
                    'id', s.id,
                    'platform_name', s.platform_name,
                    'platform_url', s.platform_url
                )
            )
            FROM social_links s
            WHERE s.user_id = u.id
        ),
        '[]'::json
    ) AS social_links

FROM users u

LEFT JOIN user_avatars a
    ON a.user_id = u.id

WHERE u.id = %s;'''



    return execute_query(
        query,
        (user_id,),
        fetchone=True
    )
    
#Delete user by Id
def delete_by_id(user_id):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute('DELETE FROM users WHERE id=%s ',(user_id,))
            message  = {'message':"User successfully Deleted"} if cursor.rowcount != 0 else  {'message':'User not found'}
            return message
            
#Create User
def create_user(data:UserCreateSchema) -> UserResponseSchema:
  record =  execute_query('SELECT * FROM users WHERE email=%s OR username=%s',(data.email,data.username),fetchone=True)
  if record:
      raise ConflictError("User already exists")

  return execute_query('INSERT INTO users (name,username,email,password) VALUES (%s,%s,%s,%s) RETURNING id,name,username,email',
                      (data.name,data.username,data.email,data.password),fetchone=True)  
  
#Update User
def update_user(user_id:str,data:UserUpdateSchema):
    fields = list(data.keys())
    values = list(data.values())
    set_clause = ', '.join([f"{field} =%s" for field in fields])
    key_values = ', '.join(fields)
    
    query = f"UPDATE users SET {set_clause} WHERE id=%s RETURNING {key_values} "
    return execute_query(query,(*values,user_id),fetchone=True)

#upload user avatar
# upload user avatar

def upload_user_avatar(user_id: str, file: UploadFile, alt: str):


    query = '''
        INSERT INTO user_avatars
            (user_id, image_url, public_id, alt)
        VALUES
            (%s, %s, %s, %s)
        ON CONFLICT (user_id)
        DO UPDATE SET
            image_url = EXCLUDED.image_url,
            public_id = EXCLUDED.public_id,
            alt = EXCLUDED.alt
        RETURNING id, image_url, public_id, alt
    '''


    response = execute_query(
        'SELECT public_id FROM user_avatars WHERE user_id=%s',
        (user_id,),
        fetchone=True
    )


    image = cloudinary_services.upload_image(file)


    result = execute_query(
        query,
        (
            user_id,
            image['image_url'],
            image['public_id'],
            alt
        ),
        fetchone=True
    )


    if result and response:
        cloudinary_services.delete_image(response['public_id'])

    return {
        'image_url': image['image_url'],
    }
#upload user avatar
def update_user_avatar(user_id:str,image_url:str,alt:str):
    query = '''UPDATE user_avatars SET image_url=%s, alt=%s WHERE user_id=%s RETURNING id,image_url,alt'''
    return execute_query(query,(image_url,alt,user_id),fetchone=True)


def delete_user_avatar(user_id:str):
    query = '''DELETE FROM user_avatars WHERE user_id=%s'''
    return execute_query(query,(user_id,),fetchone=True)