from django.urls import path
from .views import ChoosePage, StoryEditor, ChoosePagePopup, get_book_title

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
        path('api/book-title/<int:branch_id>/', get_book_title),

]