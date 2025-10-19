from django.urls import path
from .views import ChoosePage, StoryEditor, ChoosePagePopup

urlpatterns = [
    path(
        "choose-page/",
        ChoosePage.as_view(),
        name="choosepage"
    ),
    path(
        "choose-page-popup/",
        ChoosePagePopup.as_view(),
        name="choosepagepopup"
    ),
    path(
        "story-editor/",
        StoryEditor.as_view(),
        name="storyeditor"
    ),
]