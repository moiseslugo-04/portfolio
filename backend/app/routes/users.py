from fastapi import APIRouter, Depends, File, Form, UploadFile
from app.services import users as users_services
from app.schemas.users import  UserAvatarSchema, UserCreateSchema,UserUpdateSchema
from app.auth.session import get_session
import asyncio
router = APIRouter(prefix='/users',tags=['Users'])

## GET
@router.get('/')
def get_users_route():
    return users_services.get_all()


# Get User 
@router.get('/me')
def get_user_me(session=Depends(get_session)):
    user_id = session['sub']
    return users_services.get_profile(user_id)

@router.get('/by-identifier')
def get_user_by_identifier_route(identifier):
    return users_services.get_by_identifier(identifier)


# upload user avatar

@router.post('/me/avatar')
async def upload_user_avatar(
    file: UploadFile = File(...),
    alt: str = Form(...),
    session=Depends(get_session)
):
    try:

        user_id = session['sub']
        result = users_services.upload_user_avatar(
            user_id,
            file,
            alt
        )


        return result

    except Exception as e:
        import traceback

        print('ROUTE ERROR - Avatar upload failed')
        traceback.print_exc()

        return {
            'error': str(e),
            'type': type(e).__name__
        }

# update user avatar 
@router.put('/me/avatar')
def update_user_avatar(file:UploadFile,alt:str ,session=Depends(get_session)):
    user_id = session['sub']
    return users_services.update_user_avatar(user_id, file, alt)


# Delete user avatar 
@router.delete('/me/avatar')
def delete_user_avatar(session=Depends(get_session)):
    user_id = session['sub']
    return users_services.delete_user_avatar(user_id)



@router.get('/{user_id}')
def get_user_by_id_route(user_id):
    return users_services.get_by_id(user_id)

## POST
@router.post('')
def create_user(data_user:UserCreateSchema):
    return {"message":f"User {data_user} create with success"}


#PATCH
@router.patch("/")
def update_partial_user( data:UserUpdateSchema,session=Depends(get_session)):
    user_id = session['sub']
    return users_services.update_user(user_id,data.model_dump(exclude_unset=True))
 
## DELETE 
@router.delete('/{user_id}')
def delete_user(user_id:str):
    return users_services.delete_by_id(user_id)
