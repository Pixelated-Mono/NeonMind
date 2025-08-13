from flask import Flask, request, jsonify, render_template, session
import google.generativeai as genai
import os
import PyPDF2
import subprocess

app = Flask(__name__)

# IMPORTANT: Set a secret key for session management.
# In a production environment, this should be a random, complex string.
app.secret_key = 'your_very_secret_and_complex_key_here'

# Load API key from an environment variable for security
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=GEMINI_API_KEY)

# Load the Gemini model
model = genai.GenerativeModel("gemini-1.5-flash")

def extract_text_from_pdf(file_stream):
    reader = PyPDF2.PdfReader(file_stream)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def get_transcript_with_ytdlp(video_url):
    try:
        command = [
            "yt-dlp",
            "--skip-download",
            "--write-sub",
            "--sub-langs", "en",
            "--output", "transcript.%(ext)s",
            video_url
        ]
        
        subprocess.run(command, check=True, text=True, capture_output=True)

        transcript_file = "transcript.en.vtt" 
        if not os.path.exists(transcript_file):
            transcript_file = "transcript.en.srt"
        
        if os.path.exists(transcript_file):
            with open(transcript_file, "r", encoding="utf-8") as f:
                transcript_content = f.read()
            
            os.remove(transcript_file)
            return transcript_content
        else:
            return "Error: Subtitle file not found."

    except subprocess.CalledProcessError as e:
        return f"Error from yt-dlp: {e.stderr}"
    except FileNotFoundError:
        return "Error: yt-dlp is not installed or not in your system's PATH. Please install it with 'pip install yt-dlp'."
    except Exception as e:
        return f"An unexpected error occurred: {e}"

@app.route("/")
def home():
    # Initialize chat history if it doesn't exist
    if 'chat_history' not in session:
        session['chat_history'] = []
    return render_template("index.html", chat_history=session['chat_history'])

@app.route("/ask", methods=["POST"])
def ask_ai():
    user_message = request.form.get("message", "")
    pdf_file = request.files.get("file")
    youtube_url = request.form.get("youtube_url")
    
    # Get the current chat history
    chat_history = session.get('chat_history', [])
    
    # Combine the chat history into a single prompt for context
    full_prompt = "\n".join(chat_history)
    
    # Append the new user message and context
    combined_prompt = user_message
    if pdf_file:
        try:
            pdf_text = extract_text_from_pdf(pdf_file.stream)
            combined_prompt += f"\n\n---\n\nContent from PDF:\n{pdf_text}"
        except Exception as e:
            return jsonify({"reply": f"Error reading PDF: {str(e)}"})
    
    if youtube_url:
        try:
            transcript = get_transcript_with_ytdlp(youtube_url)
            if "Error" in transcript:
                return jsonify({"reply": transcript})
            combined_prompt += f"\n\n---\n\nTranscript from YouTube video:\n{transcript}"
        except Exception as e:
            return jsonify({"reply": f"Error during YouTube transcription: {str(e)}"})

    full_prompt += f"\n\nUser: {combined_prompt}"
    
    try:
        response = model.generate_content(full_prompt)
        ai_reply = response.text
        
        # Append the new messages to the session history
        chat_history.append(f"User: {combined_prompt}")
        chat_history.append(f"Bot: {ai_reply}")
        session['chat_history'] = chat_history # Save the modified history
        
    except Exception as e:
        ai_reply = f"Error from AI model: {str(e)}"
        
    return jsonify({"reply": ai_reply})

@app.route("/clear", methods=["POST"])
def clear_chat():
    session.pop('chat_history', None)
    return jsonify({"status": "Chat history cleared"})

if __name__ == "__main__":
    app.run(debug=True)