from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework.response import Response

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
    
class StoryEditor(APIView):
    def get(self, request):
        data = request.data

        mode = data.get('mode')

        return Response({
            "status": mode
        })

