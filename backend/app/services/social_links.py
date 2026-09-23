
from app.schemas.social_links import  SocialLinkSchema, SocialLinkUpdateSchema
from app.core.database import execute_query
from app.core.exceptions import ConflictError, NotFoundError
from app.services import users as users_services 
from app.repositories import social_links as social_links_repository
def create(user_id, data: SocialLinkSchema):
    existing_social_link = social_links_repository.get_by_name(user_id,data.name)
    if existing_social_link:
        raise ConflictError(f"Social link for platform '{data.name}' already exists for user '{user_id}'")
    return  social_links_repository.create(user_id,data)


def get_by_id(user_id,social_link_id):
    result = social_links_repository.get_by_id(user_id,social_link_id)
    if not result:
        message = f"Social link with ID '{social_link_id}' not found for user '{user_id}'"
        raise NotFoundError(message)
    return result

def update(user_id, link_id, data:SocialLinkUpdateSchema):
    print(data)
    get_by_id(user_id,link_id)
    return social_links_repository.update(link_id,data.url)
    


def get_by_user_id(user_id: str):
    social_links = social_links_repository.get_by_user(user_id)
    if not social_links:
        raise NotFoundError(f"Social links for user with ID '{user_id}' not found")
    return social_links



def delete_by_id(link_id):
   deleted_id  = social_links_repository.delete(link_id)
   if not  deleted_id:
    raise NotFoundError('Social Link not found') 
   return {'message':'Social link deleted successfully'}