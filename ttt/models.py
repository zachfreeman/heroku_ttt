from django.db import models

# Create your models here.
class Person(models.Model):
    first_name = models.CharField(max_length=200,blank=True,default="")
    last_name = models.CharField(max_length=200,blank=True,default="")
    school = models.CharField(max_length=200,blank=True,default="")
    industry = models.CharField(max_length=200,blank=True,default="")

    def __unicode__(self):
        return self.first_name + " " + self.last_name