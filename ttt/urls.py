from django.conf.urls import patterns, include, url

urlpatterns = patterns('ttt.views',
    url(r'^2d/$','ttt_2d',name='ttt_2d'),
    url(r'^3d/$','ttt_3d',name='ttt_3d'),
    url(r'^3d_test/$','ttt_3d_test',name='ttt_3d_test'),
    url(r'^3d_2/$','ttt_3d_2',name='ttt_3d_2'),
)
