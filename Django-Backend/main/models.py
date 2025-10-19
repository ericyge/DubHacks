from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    cover_image = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title

class Branch(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="branches")
    name = models.CharField(max_length=200, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.book.title} - {self.name}"
    
    def save(self, *args, **kwargs):
        # Only set default if no name is provided
        if not self.name:
            # If this is the first branch for the book, set name to "Original"
            if self.book.branches.count() == 0:
                self.name = "Original"
        super().save(*args, **kwargs)


class StoryEntry(models.Model):
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name="entries")
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    node = models.IntegerField(blank=True, null=True)
    image = models.ImageField(upload_to='story_images/', blank=True, null=True)

    def save(self, *args, **kwargs):
        # Only assign if node not manually set
        if self.node is None:
            last_entry = StoryEntry.objects.filter(branch=self.branch).order_by('-node').first()
            if last_entry:
                self.node = last_entry.node + 1
            else:
                self.node = 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.branch} - Node {self.node}"
    
@receiver(post_save, sender=Book)
def create_original_branch(sender, instance, created, **kwargs):
    """Automatically create 'Original' branch for each new book."""
    if created and not instance.branches.exists():
        Branch.objects.create(book=instance, name="Original")