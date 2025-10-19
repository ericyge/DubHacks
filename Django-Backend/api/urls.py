from django.urls import path
from . import views
from .views import ChoosePage, StoryEditor, ChoosePagePopup, StoryEntriesView, CreateSideQuest, get_book_title, list_books

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
    path('book-title/<int:branch_id>/', get_book_title, name="get_book_title"
    ),
    path(
        "books/", views.list_books, name="list_books"
    ),
    path(
    "books/<int:book_id>/original/", 
    views.book_original_branch, 
    name="book-original"
    ),
    path("story-entries/<int:branch_id>/", StoryEntriesView.as_view(), name="story_entries"),
    path("create-sidequest/",CreateSideQuest.as_view(), name="createsidequests")

]