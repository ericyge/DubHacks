from django.urls import path
<<<<<<< Updated upstream
from .views import ChoosePage, StoryEditor, ChoosePagePopup
=======
from .views import ChoosePage, StoryEditor, get_book_title
>>>>>>> Stashed changes

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