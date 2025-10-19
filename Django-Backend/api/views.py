from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework.response import Response
from google import genai
from io import BytesIO
from PIL import Image
from django.conf import settings
from main.models import StoryEntry, Branch, Book
from django.core.files.base import ContentFile
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view
from google.genai import types
from django.http import JsonResponse

# Create your views here.
class ChoosePage(APIView):
    def post(self, request):
        data = request.data

        mode = data.get('mode')
        print(f"Chose mode: {mode}")

        return Response({
            "status": "success",
            "next": f"/story-editor?mode={mode}" 
        })

class ChoosePagePopup(APIView):
    def post(self, request):
        data = request.data
        book = Book.objects.create(title=data.get("title"))
        branch = book.branches.first()  # the signal already created it
        return Response({
            "status": "success",
            "book_id": book.pk,
            "branch_id": branch.pk  
        })
        
    

    
class StoryEditor(APIView):
    def post(self, request):
        branch_pk = request.GET.get("branch_id")

        data = request.data
        client = genai.Client(api_key = "AIzaSyCuE4wOYLY9P7QKKZdiZSG_UvUc2f8jQV8")

        image_prompt = f"""
        Create a detailed comic book-style illustration based on the following story description:

        "{data.get('Prompt')}"

        The image should look like a panel from a professional graphic novel — vibrant colors, bold outlines, dynamic composition, and expressive lighting. 
        Keep characters stylized (not photorealistic), and ensure the visual storytelling matches the mood and tone of the description. 
        Do not include text, captions, or speech bubbles — focus only on the scene itself.
        """


        text_prompt = f"""
        You are a creative comic book storyteller. 

        The user has written part of a story. Based on the following input, write a short continuation that fits the tone and setting of the story.

        User's input:
        "{data.get('Prompt')}"

        Your task:
        1. Write 1-2 short sentences continuing the story naturally, as if it's the next panel in a comic book. Do not add in panel descriptions. Simply continue the story in plain text only.
        2. Begin your response with a vivid description of the scene that could match an illustrated comic panel.
        3. Keep the tone consistent with the user's writing style.
        4. Make it imaginative and visually rich, but concise — like comic narration. Also keep the vocabulary simple enough for elementary schoolers to understand without trouble.
        5. Do not repeat the user's text verbatim.
        6. Avoid dialogue unless it adds to the pacing.

        Output only the new text continuation.
        """
        branch = Branch.objects.get(pk=branch_pk)

        response = client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=[image_prompt],
        )

        image_file = None
        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                try:
                    pil_image = Image.open(BytesIO(part.inline_data.data))

                    buffer = BytesIO()
                    pil_image.save(buffer, format='PNG')
                    buffer.seek(0)
                    image_file = ContentFile(buffer.read(), name="generated_image.png")
                    break             
                except Exception as e:
                    print(f"Error in getting image: {e}")
        
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[text_prompt],
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(thinking_budget=0) # Disables thinking
            ),
        )

        ai_text = response.text
        print(f"Here is the ai_text: {ai_text}")

        entry = StoryEntry.objects.create(
            branch = branch,
            text=data.get('Prompt'),
            ai_text=ai_text,
            image=image_file  # assign the ContentFile here
        )

        image_url = request.build_absolute_uri(entry.image.url)

        return Response({
            "status": "success",
            "image_url": image_url,
            "text": ai_text,
        })


@api_view(['GET'])
def get_book_title(request, branch_id):
    try:
        branch = Branch.objects.get(pk=branch_id)
        return Response({
            "book_title": branch.book.title
        })
    except Branch.DoesNotExist:
        return Response({"error": "Branch not found"}, status=404)
    

'''    
@api_view(['GET'])
def list_books(request):
    books = Book.objects.all().order_by('-created_at')
    data = [
        {
            "id": book.id,
            "title": book.title,
            "created_at": book.created_at,
        }
        for book in books
    ]
    return Response(data)
'''

@api_view(['GET'])
def list_books(request):
    books = Book.objects.all().order_by('-created_at')
    data = [
        {
            "id": book.id,
            "title": book.title,
            "created_at": book.created_at,
            "branches": [
                {"id": branch.id, "name": branch.name}
                for branch in book.branches.all()
            ],
        }
        for book in books
    ]
    return Response(data)

def book_original_branch(request, book_id):
    try:
        book = Book.objects.get(pk=book_id)
        # Get or create the original branch
        original_branch = book.branches.filter(name="Original").first()
        if not original_branch:
            original_branch = Branch.objects.create(book=book, name="Original")
        data = {
            "id": original_branch.id,
            "name": original_branch.name,
            "book_id": book.id,
            "book_title": book.title,
        }
        return JsonResponse(data)
    except Book.DoesNotExist:
        return JsonResponse({"error": "Book not found"}, status=404)
    

class StoryEntriesView(APIView):
    def get(self, request, branch_id):
        entries = StoryEntry.objects.filter(branch_id=branch_id).order_by("created_at")
        serialized = [
            {
                "id": entry.pk,
                "userText": entry.text,
                "userImage": request.build_absolute_uri(entry.image.url),
                "aiText": entry.ai_text,
            }
            for entry in entries
        ]
        return Response(serialized)
    

class CreateSideQuest(APIView):
    def post(self, request):
        data = request.data
        self.book = Book.objects.get(pk=data.get('book_id'))
        self.name = data.get("name")
        self.num_frames = data.get("frames_to_keep")

        self.create_new_sidequests()

        return Response({
            "status": "success"
        })
    
    def create_new_sidequests(self):
        new_branch = Branch.objects.create(
            book = self.book,
            name = self.name,
        )

        original_branch = Branch.objects.get(book=self.book, name="Original")

        if self.num_frames > original_branch.entries.count():
            self.num_frames = original_branch.entries.count()
        
        original_entries = (
            original_branch.entries.all().order_by("id")[:self.num_frames]
        )

        for entry in original_entries:
            StoryEntry.objects.create(
                branch=new_branch,
                text=entry.text,
                image=entry.image,
                ai_text=entry.ai_text,
                # Copy any other fields your StoryEntry model has:
                # e.g. "order", "choice_text", etc.
            )
