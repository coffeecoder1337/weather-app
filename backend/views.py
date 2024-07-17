from django.http import HttpResponse, HttpRequest
from django.shortcuts import render
from backend.misc.weather import get_weather
import datetime

# Create your views here.


def test(request):
    if request.method == 'GET':
        coords = request.GET.get('coords')
        if not coords:
            return render(request, 'backend/index.html')
        city = request.GET.get('city')
        coords = [float(x) for x in coords.split()]
        w = get_weather(*coords)
        current_time = datetime.datetime.now()
        start = 0
        end = 5

        for t in range(len(w) - 1):
            if w[t][0] <= current_time <= w[t + 1][0]:
                start = t
                end = start + 5
        return render(request, 'backend/index.html', {'weather': w[start:end], 'city': city})
    return render(request, 'backend/index.html')
