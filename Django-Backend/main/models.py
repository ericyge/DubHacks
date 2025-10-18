from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    cover_image = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title

class Branch(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="branches")
    parent_story_entry = models.ForeignKey(
        'StoryEntry', on_delete=models.SET_NULL, null=True, blank=True, related_name='child_branches'
    )
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.book.title} - {self.name}"

class StoryEntry(models.Model):
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name="entries")
    author = models.CharField(max_length=50, choices=[("AI","AI"),("KID","Kid")])
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author}: {self.text[:50]}"

class Image(models.Model):
    story_entry = models.OneToOneField(StoryEntry, on_delete=models.CASCADE, related_name="image")
    url = models.URLField()

    def __str__(self):
        return f"Image for {self.story_entry.id}"
