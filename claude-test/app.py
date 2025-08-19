from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from werkzeug.utils import secure_filename
import PyPDF2
import docx
import json

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'doc', 'docx'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_file(filepath, filename):
    """Extract text content from uploaded files"""
    try:
        if filename.lower().endswith('.txt'):
            with open(filepath, 'r', encoding='utf-8') as file:
                return file.read()
        
        elif filename.lower().endswith('.pdf'):
            with open(filepath, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                return text
        
        elif filename.lower().endswith('.docx'):
            doc = docx.Document(filepath)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        
        else:
            return None
    except Exception as e:
        print(f"Error extracting text from {filename}: {str(e)}")
        return None

def generate_course_roadmap(content, api_key):
    """Generate course roadmap using Gemini API"""
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        Based on the following course content/syllabus, create a comprehensive study roadmap that includes:

        1. **Course Overview** - Brief summary of what this course covers
        2. **Learning Objectives** - Key goals and outcomes
        3. **Study Timeline** - Suggested timeline with phases
        4. **Detailed Roadmap** - Break down into weekly checkpoints with:
           - Topics to cover
           - Key concepts to understand
           - Practical exercises or assignments
           - Recommended study materials
        5. **Knowledge Check Quizzes** - For each major topic, include:
           - 3-5 multiple choice questions
           - 2-3 short answer questions
           - Answer key with explanations

        Format the response as structured JSON with the following structure:
        {{
            "course_overview": "string",
            "learning_objectives": ["objective1", "objective2", ...],
            "timeline": "string",
            "roadmap": [
                {{
                    "week": 1,
                    "title": "Week Title",
                    "topics": ["topic1", "topic2"],
                    "key_concepts": ["concept1", "concept2"],
                    "exercises": ["exercise1", "exercise2"],
                    "materials": ["material1", "material2"]
                }}
            ],
            "quizzes": [
                {{
                    "topic": "Topic Name",
                    "multiple_choice": [
                        {{
                            "question": "Question text",
                            "options": ["A", "B", "C", "D"],
                            "correct_answer": "A",
                            "explanation": "Why this is correct"
                        }}
                    ],
                    "short_answer": [
                        {{
                            "question": "Question text",
                            "sample_answer": "Sample answer",
                            "key_points": ["point1", "point2"]
                        }}
                    ]
                }}
            ]
        }}

        Course Content:
        {content}
        """
        
        response = model.generate_content(prompt)
        
        # Try to parse as JSON, fallback to text if not valid JSON
        try:
            # Clean up the response to extract JSON
            response_text = response.text
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1]
            
            return json.loads(response_text.strip())
        except json.JSONDecodeError:
            # Fallback to text format
            return {
                "course_overview": "Generated roadmap",
                "roadmap_text": response.text,
                "format": "text"
            }
            
    except Exception as e:
        return {"error": f"Failed to generate roadmap: {str(e)}"}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate-roadmap', methods=['POST'])
def generate_roadmap():
    try:
        api_key = request.form.get('api_key')
        if not api_key:
            return jsonify({"error": "API key is required"}), 400
        
        content = ""
        
        # Check if file was uploaded
        if 'file' in request.files and request.files['file'].filename != '':
            file = request.files['file']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                
                content = extract_text_from_file(filepath, filename)
                if not content:
                    return jsonify({"error": "Failed to extract text from file"}), 400
                
                # Clean up uploaded file
                os.remove(filepath)
            else:
                return jsonify({"error": "Invalid file type"}), 400
        
        # Check if text content was provided
        elif request.form.get('content'):
            content = request.form.get('content')
        
        else:
            return jsonify({"error": "No content provided"}), 400
        
        if len(content.strip()) == 0:
            return jsonify({"error": "Content is empty"}), 400
        
        # Generate roadmap using Gemini
        roadmap = generate_course_roadmap(content, api_key)
        
        if "error" in roadmap:
            return jsonify(roadmap), 500
        
        return jsonify({"success": True, "roadmap": roadmap})
        
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)