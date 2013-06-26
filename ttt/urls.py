from django.conf.urls import url, patterns, include

urlpatterns = patterns('ttt.views',
    url(r'^$','ttt_base',name='base'),
    url(r'^game/$','ttt_game',name='game'),
)
