import google.generativeai as genai

# Configure API key
genai.configure(api_key="")

# Use correct model name (check API docs or list_models())
model = genai.GenerativeModel("gemini-1.5-flash")  # or gemini-1.5-pro

prompt = "hi."

response = model.generate_content(prompt)

print(response.text)

#This is a test script to check if the Gemini API is working correctly.
#No need to run this script in production, just for testing purposes.

