from typing import List

from fastapi import FastAPI, HTTPException, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware 

import models, schemas, database

import random
import string

DEFAULT_SHORT_CODE_LENGTH = 6  # You can adjust the length
MAX_RETRIES_FOR_SHORT_CODE_GENERATION = 10 # To prevent infinite loops

origins = ["http://127.0.0.1:5173", "http://localhost:5173", "http://localhost:8000", "http://localhost:3000"]

def generate_unique_short_code(db: Session, length: int = DEFAULT_SHORT_CODE_LENGTH) -> str:
    """
    Generates a unique random string of specified length for the shortened URL.
    Checks the database to ensure uniqueness.
    """
    characters = string.ascii_letters + string.digits 
    for _ in range(MAX_RETRIES_FOR_SHORT_CODE_GENERATION):
        short_code = "".join(random.choices(characters, k=length))
        # Check if this short_code already exists in the database
        exists = db.query(models.URL).filter(models.URL.short_url == short_code).first()
        if not exists:
            return short_code
        
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Could not generate a unique short code after multiple retries. Try increasing length or check DB."
    )


models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="URL Shortener API",
    description="API to manage shortened URLs with FastAPI and SQLite",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         # List of origins that are allowed to make requests
    allow_credentials=True,        # Allow cookies to be included in requests
    allow_methods=["POST", "GET", "DELETE"],           # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],           # Allow all headers
)

    


@app.post("/urls/", response_model=schemas.URLResponse, status_code=status.HTTP_201_CREATED, tags=["URLs"])
def create_new_url(url: schemas.URLCreate, db: Session = Depends(database.get_db)):
    """
    Create a new shortened URL entry.
    - **shortenedURL**: The short code or path for the URL.
    - **baseURL**: The original, long URL to redirect to.
    """

    if url.original_url.strip() == "":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Original URL cannot be empty")

    existing_url_for_base = db.query(models.URL).filter(models.URL.original_url == url.original_url).first()
    if existing_url_for_base is not None:
        return existing_url_for_base
    
    short_code = generate_unique_short_code(db)

    db_url = models.URL(original_url=url.original_url, short_url=short_code)
    db.add(db_url)
    try:
        db.commit()
        db.refresh(db_url)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not create URL entry")
        
    return db_url


@app.get("/urls/", response_model=List[schemas.URLResponse], tags=["URLs"])
def get_all_urls(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    """
    Retrieve a list of all shortened URL entries.
    Supports pagination with `skip` and `limit`.
    """
    urls = db.query(models.URL).offset(skip).limit(limit).all()
    return urls

@app.delete("/urls/delete")
def delete_short_code(item: schemas.DeleteItemBody, db: Session = Depends(database.get_db)):
    """Delete a shortened URL entry by its ID.
    - **id**: The ID of the URL entry to delete."""
    
    try:
        rows_affected = db.query(models.URL).filter(models.URL.id == item.id).delete(synchronize_session=False)
        db.commit()

        if rows_affected == 0:
            # If no rows were deleted, the item was not found
            raise HTTPException(status_code=404, detail=f"Item with id {item.id} not found")

        # Success response
        return {"message": f"Item with id {item.id} deleted successfully"}
    
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not delete URL entry")

@app.get("/{short_code}", tags=["Redirect"], include_in_schema=False)
def redirect_to_original_url(short_code: str, db: Session = Depends(database.get_db)):
    """
    Redirect to the original URL using the short code.
    """
    url = db.query(models.URL).filter(models.URL.short_url == short_code).first()
    if not url:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="URL not found")
    
    return RedirectResponse(url.original_url)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)




# def create_url_entry(db: Session, url: schemas.URLCreate) -> models.URL:

#     db_url = models.URL(original_url=url.original_url, short_url=url.short_url)
#     db.add(db_url)
#     try:
#         db.commit()
#         db.refresh(db_url)
#     except IntegrityError:
#         db.rollback()
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="URL already exists")
#     return db_url