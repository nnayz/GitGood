import os
from openai import OpenAI

# Method 1: Set the API key directly
client = OpenAI(api_key='your_api_key_here')

# Method 2: Set it as an environment variable
# Run this in your terminal: export OPENAI_API_KEY='your_api_key_here'
# Then you can use it like this:
client = OpenAI()  # It will automatically use the OPENAI_API_KEY environment variable

# Example usage:
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
)

print(response.choices[0].message.content) 