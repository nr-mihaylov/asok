import unittest
import ast
from app.core import create_app

class AppTest(unittest.TestCase):

    def setUp(self):

        self.coreApp = create_app()

        self.coreApp.config['TESTING'] = True
        self.app = self.coreApp.test_client()

        self.id = None
        self.title = "My Test Location"
        self.newTitle = "My Edited Test Location"
        self.description = "The description"
        self.latitude = 56.155109
        self.longitude = 10.206227

    def tearDown(self):
        pass

    def test_index_doctype_html(self):
        result = self.app.get('/')

        assert b'<!DOCTYPE html>' in result.data
    
    def test_location_crud(self):

        # Get all locations

        result = self.app.get('/api/locations')
        assert result.status_code == 200

        # Create a new location

        result = self.app.post(
            '/api/location', 
            data='title=' + self.title + '&description=' + self.description + '&latitude=' + str(self.latitude) + '&longitude=' + str(self.longitude), 
            content_type='application/x-www-form-urlencoded'
        )
        resultStr = result.data.decode('utf-8')
        resultDic = ast.literal_eval(resultStr)
        newLocDic = resultDic['location']
        self.id = newLocDic['id'];

        assert b'"message": "Location created"' in result.data
        assert result.status_code == 201

        # Retrieve the newly created location

        result = self.app.get('/api/location/' + str(self.id))
        assert result.status_code == 200 or result.status_code == 404

        # Update the newly created location

        result = self.app.put(
            '/api/location', 
            data='id=' + str(self.id) + '&title=' + self.newTitle, 
            content_type='application/x-www-form-urlencoded'
        )
        assert bytes(self.newTitle, 'utf-8') in result.data

        # Delete the updated location

        result = self.app.delete('/api/location/' + str(self.id))
        assert b'Location deleted' in result.data


if __name__ == '__main__':
    unittest.main()