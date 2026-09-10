from dotenv import load_dotenv

from app.core.exceptions import BadRequestError
load_dotenv()


import cloudinary
import cloudinary.uploader
from fastapi import File, UploadFile

config = cloudinary.config(secure=True)

# Log the configuration
MAX_FILE_SIZE = 1024 * 1024 * 5 #5mb
ALLOWED_IMAGE_TYPES =  [  'image/png','image/jpeg','image/jpg']


def upload_image(file:UploadFile = File(...)):
    
    if  file.size > MAX_FILE_SIZE:
         raise BadRequestError('Image is too large')
    if file.content_type.lower() not in ALLOWED_IMAGE_TYPES:
         raise BadRequestError('Image is too large')
        
    result = cloudinary.uploader.upload(file.file,use_filename=True,folder='portfolio')
    return {
        'image_url': result['secure_url'],
        'public_id': result['public_id'],
    }
    
    
def delete_image(public_id:str):
     return cloudinary.uploader.destroy(public_id)