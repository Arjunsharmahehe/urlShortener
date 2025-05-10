from pydantic import BaseModel

class URLBase(BaseModel):
    original_url: str
    short_url: str

class URLCreate(URLBase):
    short_url: str = ''
    original_url: str

class URLResponse(URLBase):
    id: int

    class Config:
        orm_mode = True

class DeleteItemBody(BaseModel):
    id: int

    class Config:
        orm_mode = True
