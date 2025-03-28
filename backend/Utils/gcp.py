import os
import base64
from uuid import uuid4
from google.cloud import storage
from dotenv import load_dotenv
from google.oauth2 import service_account

load_dotenv()

GCP_BUCKET_NAME = os.getenv("GCP_BUCKET_NAME")

def get_gcs_client():
    credentials_dict = {
        "type": os.getenv("type", "service_account"),
        "project_id": os.getenv("project_id"),
        "private_key_id": os.getenv("private_key_id"),
        "private_key": os.getenv("private_key").replace("\\n", "\n"),
        "client_email": os.getenv("client_email"),
        "client_id": os.getenv("client_id"),
        "auth_uri": os.getenv("auth_uri"),
        "token_uri": os.getenv("token_uri"),
        "auth_provider_x509_cert_url": os.getenv("auth_provider_x509_cert_url"),
        "client_x509_cert_url": os.getenv("client_x509_cert_url"),
        "universe_domain": os.getenv("universe_domain", "googleapis.com")
    }
    credentials = service_account.Credentials.from_service_account_info(credentials_dict)
    return storage.Client(credentials=credentials, project=credentials_dict["project_id"])

def upload_image_to_gcp(file, user_id, destination_blob_name=None):
    """
    Uploads a file (UploadFile) to a GCP bucket under a folder named after the user_id.
    Returns a permanent URL (which we store in MongoDB) in the format:
    https://storage.googleapis.com/<bucket_name>/<destination_blob_name>
    """
    if not destination_blob_name:
        destination_blob_name = f"{user_id}/{uuid4()}-{file.filename}"

    client = get_gcs_client()
    bucket = client.bucket(GCP_BUCKET_NAME)
    blob = bucket.blob(destination_blob_name)
    
    # Upload the file content
    blob.upload_from_file(file.file, content_type=file.content_type)
    
    public_url = f"https://storage.googleapis.com/{GCP_BUCKET_NAME}/{destination_blob_name}"
    return public_url

def download_image_and_encode_base64_from_url(public_url):
    """
    Given a public URL in the format:
      https://storage.googleapis.com/<bucket_name>/<blob_name>
    this function:
      - Extracts the blob name,
      - Downloads the file from GCP into a local "uploads" folder,
      - Encodes its contents to Base64,
      - Deletes the temporary file,
      - Returns the Base64 encoded string.
    """
    # Extract blob name from URL
    # Example: "https://storage.googleapis.com/my-bucket/user123/unique-file.jpg"
    try:
        blob_name = public_url.split(f"https://storage.googleapis.com/{GCP_BUCKET_NAME}/")[-1]
    except Exception as e:
        raise Exception("Unable to extract blob name from URL") from e

    client = get_gcs_client()
    bucket = client.bucket(GCP_BUCKET_NAME)
    blob = bucket.blob(blob_name)
    
    # Ensure the 'uploads' folder exists
    uploads_dir = "uploads"
    os.makedirs(uploads_dir, exist_ok=True)
    
    # Define a local temporary file path
    local_file_path = os.path.join(uploads_dir, os.path.basename(blob_name))
    
    # Download the blob to the local file
    blob.download_to_filename(local_file_path)
    
    # Read the file and encode to base64
    with open(local_file_path, "rb") as f:
        encoded_bytes = base64.b64encode(f.read())
        encoded_str = encoded_bytes.decode("utf-8")
    
    # Optionally remove the local file after reading
    os.remove(local_file_path)
    print(encoded_str)
    
    return encoded_str
