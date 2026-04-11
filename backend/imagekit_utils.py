import os
from imagekitio import ImageKit
from dotenv import load_dotenv

load_dotenv()

imagekit = ImageKit(
    private_key=os.getenv('IMAGEKIT_PRIVATE_KEY', '')
)

def upload_to_imagekit(file_path, filename):
    """ Uploads file to ImageKit and returns the public URL. """
    try:
        with open(file_path, "rb") as file:
            upload = imagekit.files.upload(
                file=file,
                file_name=filename,
                use_unique_file_name=True,
                folder="/sprinter_analysis/",
                public_key=os.getenv('IMAGEKIT_PUBLIC_KEY', '')
            )
            return upload.url
    except Exception as e:
        print(f"ImageKit Upload Error: {e}")
        return None
