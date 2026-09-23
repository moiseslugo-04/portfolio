from app.core.database import execute_query
from app.schemas.social_links import SocialLinkSchema


def create(user_id,data:SocialLinkSchema):
    query = """
            INSERT INTO social_links (user_id, platform_name, platform_url)
            VALUES (%s, %s, %s) 
            RETURNING id, user_id, platform_name, platform_url;
        """
    return execute_query(query, (user_id, data.name, str(data.url)))

def get_by_name(user_id,name):
    query = 'SELECT id FROM social_links WHERE user_id = %s AND platform_name = %s'
    return execute_query(query,(user_id, name),fetchone=True)

def get_by_id(user_id,id):
    query = """SELECT id, user_id, platform_name, platform_url FROM social_links WHERE user_id = %s AND id = %s"""
    return  execute_query(query,(user_id, id),fetchone=True)


def get_by_user(user_id):
      query = """
            SELECT id, user_id, platform_name, platform_url 
            FROM social_links 
            WHERE user_id = %s;
        """
      return execute_query(query, (user_id,), fetchAll=True)

def update(link_id,url):
    query = '''
            UPDATE social_links
            SET platform_url=%s
            WHERE id = %s 
            RETURNING id, user_id, platform_name, platform_url;
        '''
    return execute_query(query, (url,link_id), fetchone=True)
        
def  delete(id):
   query = 'DELETE FROM social_links WHERE id=%s RETURNING id'
   return execute_query(query,(id,),fetchone=True)