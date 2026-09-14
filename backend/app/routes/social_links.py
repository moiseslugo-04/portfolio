from fastapi import APIRouter, Depends
from app.services import social_links as social_links_services 
from app.schemas.social_links import SocialLinkPartialSchema, SocialLinkSchema
from app.auth.session import get_session
router = APIRouter(prefix='/social_links',tags=['Social_Links'])
@router.get('/')
def get_social_links():
    return social_links_services.get_all()

@router.get('/{user_id}')
def get_social_links_by_user_id(user_id):
    return social_links_services.get_by_user_id(user_id)

# POST
@router.post('/')
def create_social_link(data:SocialLinkSchema,session=Depends(get_session)):
    user_id = session['sub']
    return social_links_services.create(user_id,data)

#PATH
@router.patch('/{link_id}')
def update_social_link(
    link_id,
    data:SocialLinkPartialSchema,
    session=Depends(get_session)):
    user_id =session['sub']
    return social_links_services.update(user_id,link_id,data.model_dump(exclude_unset=True))

#DELETE 
@router.delete('/{link_id}')
def delete_social_link(link_id,session=Depends(get_session)):
    user_id = session['sub']
    print(link_id,user_id)
    return social_links_services.delete_by_id(link_id,user_id)