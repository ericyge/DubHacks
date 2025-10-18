from django.urls import path
from .views import ChoosePage

urlpatterns = [
    path(
        "choose-page/",
        ChoosePage.as_view(),
        name="choosepage"
    )
]