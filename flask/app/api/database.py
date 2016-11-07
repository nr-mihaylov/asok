import json
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, Float, String

engine = create_engine('sqlite:///D:\\Projects\\asok\\lstorage.db', convert_unicode=True)
session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
Base = declarative_base()
Base.query = session.query_property()

def init_db():
    Base.metadata.create_all(bind=engine)

class Location(Base):
    __tablename__ = 'location'
    id = Column(Integer, primary_key=True)
    title = Column(String(100))
    description = Column(String(500))
    latitude = Column(String(100))
    longitude = Column(String(100))

    def __init__(self, title=None, description="", latitude=None, longitude=None):
        self.title = title
        self.description = description
        self.latitude = latitude
        self.longitude = longitude

    @property
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'latitude': self.latitude,
            'longitude': self.longitude
        }