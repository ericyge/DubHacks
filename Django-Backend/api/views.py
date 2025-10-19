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

@method_decorator(csrf_exempt, name='dispatch')
class ChoosePagePopup(APIView):
    def post(self, request):
        data = request.data
        
        book = Book.objects.create(title=data.get("title"))
        branch = Branch.objects.create(book=book)
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

        prompt = data.get('Prompt')
        branch = Branch.objects.get(pk=branch_pk)

        response = client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=[prompt],
        )

        image_file = None
        for part in response.candidates[0].content.parts:
            try:
                pil_image = Image.open(BytesIO(part.inline_data.data))

                buffer = BytesIO()
                pil_image.save(buffer, format='PNG')
                buffer.seek(0)
                image_file = ContentFile(buffer.read(), name="generated_image.png")
                break             
            except Exception as e:
                print(f"Error in getting image: {e}")
        
        entry = StoryEntry.objects.create(
            branch = branch,
            text=prompt,
            image=image_file  # assign the ContentFile here
        )

        image_url = request.build_absolute_uri(entry.image.url)

        return Response({
            "status": "success",
            "image_url": entry.image.url,
        })

