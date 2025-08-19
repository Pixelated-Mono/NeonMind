# Course Roadmap Generator

A web application that generates personalized study roadmaps from course syllabi using Google's Gemini API.

## Features

- **File Upload Support**: Upload syllabus files in TXT, PDF, or DOCX format
- **Text Input**: Enter course content directly in a text area
- **AI-Powered Generation**: Uses Gemini API to create comprehensive study roadmaps
- **Structured Output**: Generates organized roadmaps with:
  - Course overview and learning objectives
  - Weekly study timeline with checkpoints
  - Knowledge check quizzes with answers
  - Study materials and exercises

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Get Gemini API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Keep it secure for use in the application

3. **Run the Application**:
   ```bash
   python app.py
   ```

4. **Access the Website**:
   - Open your browser and go to `http://localhost:5000`

## Usage

1. Enter your Gemini API key in the provided field
2. Either:
   - Upload a syllabus file (TXT, PDF, or DOCX), OR
   - Enter course content directly in the text area
3. Click "Generate Roadmap"
4. View your personalized study roadmap with checkpoints and quizzes

## File Structure

```
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # HTML template
├── static/
│   ├── styles.css        # CSS styling
│   └── script.js         # Frontend JavaScript
└── uploads/              # Temporary file uploads (auto-created)
```

## Dependencies

- Flask: Web framework
- Flask-CORS: Cross-origin resource sharing
- google-generativeai: Gemini API integration
- PyPDF2: PDF text extraction
- python-docx: DOCX text extraction
- Werkzeug: File handling utilities

## Security Notes

- API keys are handled client-side and not stored
- Uploaded files are temporarily processed and immediately deleted
- File size limit: 16MB
- Supported file types: TXT, PDF, DOCX only