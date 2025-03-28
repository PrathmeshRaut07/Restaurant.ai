import smtplib
import asyncio
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os
load_dotenv()
def send_email(recipient_email: str, subject: str, body: str):
    sender_email = os.getenv("EMAIL_SENDER")
    sender_password =os.getenv("EMAIL_PASSWORD")
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = recipient_email
    message["Subject"] = subject

    message.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()  # Secure the connection
            server.login(sender_email, sender_password)  # Login to the server
            server.sendmail(sender_email, recipient_email, message.as_string())  # Send the email

        print(f"Email sent to {recipient_email}")
    except Exception as e:
        print(f"Failed to send email to {recipient_email}: {e}")

async def send_verification_email(recipient_email: str, token: str):
    """
    Constructs the verification email and sends it using send_email.
    """
    verification_link = f"http://localhost:8000/auth/verify?token={token}"
    subject = "Please Verify Your Email"
    body = f"Click the following link to verify your email: {verification_link}"
    
    # Run the synchronous send_email function in an executor
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, send_email, recipient_email, subject, body)
