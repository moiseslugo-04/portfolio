from  app.core.database import execute_query
from app.schemas.users import UserAvatarSchema, UserCreateSchema
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
    
    
def create(data:UserCreateSchema):
    print(data)
    query = """
            INSERT INTO users (name,username,email,password_hash) 
            VALUES (%s,%s,%s,%s) RETURNING id,name,username,email;"""
        
    return execute_query(query,(data.name,data.username,data.email,data.password),fetchone=True)  
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

    
def upload_avatar(user_id,data :UserAvatarSchema):
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
    return execute_query(query,
        (user_id,data.image_url,data.public_id,data.alt),
        fetchone=True)
    
def get_avatar_by_user_id(user_id):
    return execute_query(
        'SELECT public_id,image_url,alt FROM user_avatars WHERE user_id=%s',
        (user_id,),
        fetchone=True
    )

def delete_avatar(user_id:str):
    query = '''DELETE FROM user_avatars WHERE user_id=%s'''
    print(user_id)
    return execute_query(query,(user_id,),fetchone=True)

def delete(user_id):
   return  execute_query('DELETE FROM users WHERE id=%s RETURNING id',(user_id,),fetchone=True)