from app.schemas.social_links import SocialLinkPartialSchema, SocialLinkSchema
from app.core.database import execute_query
from app.core.exceptions import ConflictError, NotFoundError
from app.services import users as users_services 
def create(user_id, data: SocialLinkSchema):
    query = """
        INSERT INTO social_links (user_id, platform_name, platform_url)
        VALUES (%s, %s, %s) 
        RETURNING id, user_id, platform_name, platform_url;
    """
    user  = users_services.get_by_id(user_id)
    if not user:
        raise  NotFoundError(f"User with ID {user_id} NOT found")
    
    existing_social_link = execute_query(
        "SELECT id FROM social_links WHERE user_id = %s AND platform_name = %s",
        (user_id, data.name),fetchone=True)
    if existing_social_link:
        raise ConflictError(f"Social link for platform '{data.name}' already exists for user '{user_id}'")
    
    result = execute_query(query, (user_id, data.name, str(data.url)))
    return result



def update(user_id, link_id, data: dict):

    existing_social_link = execute_query(
        '''
        SELECT id
        FROM social_links
        WHERE user_id = %s AND id = %s 
        ''',
        (user_id, link_id),
        fetchone=True
    )

    if not existing_social_link:
        raise NotFoundError(
            f"Social link with ID '{link_id}' not found for user '{user_id}'"
        )

    if 'name' in data:
        social_link_with_same_name = execute_query(
            '''
            SELECT id
            FROM social_links
            WHERE user_id = %s
              AND platform_name = %s
              AND id != %s
            ''',
            (user_id, data['name'], link_id),
            fetchone=True
        )

        if social_link_with_same_name:
            raise ConflictError(
                f"Social link for platform '{data['name']}' already exists"
            )

    fields = []
    params = []

    if 'name' in data:
        fields.append('platform_name = %s')
        params.append(data['name'])

    if 'url' in data:
        fields.append('platform_url = %s')
        params.append(str(data['url']))

    params.extend([link_id, user_id])

    query = f'''
        UPDATE social_links
        SET {', '.join(fields)}
        WHERE id = %s AND user_id = %s
        RETURNING id, user_id, platform_name, platform_url;
    '''

    return execute_query(query, params, fetchone=True)
    
    
def get_all():
    query = "SELECT id, user_id, platform_name, platform_url FROM social_links;"
    result = execute_query(query, fetchAll=True)
    return result if result else []
   


def get_by_id(social_link_id: int):
    query = """
        SELECT id, user_id, platform_name, platform_url 
        FROM social_links 
        WHERE id = %s;
    """
    social_link = execute_query(query, (social_link_id,), fetchone=True)
        
    if not social_link:
        raise NotFoundError(f"Social link with ID '{social_link_id}' not found")
  
    return social_link

def get_by_user_id(user_id: str):
    query = """
        SELECT id, user_id, platform_name, platform_url 
        FROM social_links 
        WHERE user_id = %s;
    """
    social_link = execute_query(query, (user_id,), fetchAll=True)
    if not social_link:
        raise NotFoundError(f"Social links for user with ID '{user_id}' not found")
    return social_link

def delete_by_id(link_id,user_id):
   query = 'DELETE FROM social_links WHERE id=%s AND user_id=%s RETURNING id'
   deleted = execute_query(query,(link_id,user_id),fetchone=True)
   if not deleted:
    raise NotFoundError('Social Link not found')