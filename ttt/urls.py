from django.conf.urls import patterns, include, url

urlpatterns = patterns('ttt.views',
    url(r'^2d$','ttt_2d',name='ttt_2d'),
)
