# Javascript-ServerChProject
## Express MongoDB Image API
This project is an Express.js application with MongoDB integration, designed for handling image data through RESTful API endpoints.
Setup
Install dependencies:
npm install express body-parser mongoose mongodb
Run the application:
node app.js
API Endpoints
1. Upload Image Data
Endpoint: /api_chproject/post/images
Method: POST
Description: Uploads image data to MongoDB. Expects base64-encoded image data and associated metadata.
2. Retrieve Data (Without Files)
Endpoint: /api_chproject/get/data
Method: GET
Description: Retrieves image data from MongoDB, excluding the base64-encoded image files.
3. Retrieve Image File (Base64 Format)
Endpoint: /api_chproject/get/file/:fileName
Method: GET
Description: Retrieves a specific image file in base64 format by providing the filename.
4. Delete Image by FileName
Endpoint: /api_chproject/delete/image/:fileName
Method: DELETE
Description: Deletes an image from MongoDB by providing the filename.
Notes
The application uses MongoDB Atlas for database storage.
Ensure to replace the MongoDB Atlas URI in the code with your own connection string.
The server runs on port 3000 by default.
Feel free to modify and enhance this project based on your specific requirements.
