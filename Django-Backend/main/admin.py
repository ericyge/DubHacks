from django.contrib import admin
from .models import (Book, Branch, StoryEntry)
# Register your models here.
admin.site.register(Book)
admin.site.register(Branch)
admin.site.register(StoryEntry)