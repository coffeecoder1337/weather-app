from django.http import HttpResponse, HttpRequest
from django.shortcuts import render
from backend.misc.weather import get_weather
import datetime


def get_limits(w, current_time):
    start = 0
    end = 5
    for t in range(len(w) - 1):
        if w[t][0] <= current_time <= w[t + 1][0]:
            start = t
            end = start + 5
    return start, end


def main(request):
    if request.method == 'GET':
        coords = request.GET.get('coords')
        city = request.GET.get('city')

        if not coords:
            coords = request.session.get('coords')
            city = request.session.get('city')
            if not coords:
                return render(request, 'backend/index.html')

        coords = [float(x) for x in coords.split()]
        w = get_weather(*coords)
        current_time = datetime.datetime.now()

        start, end = get_limits(w, current_time)

        request.session['coords'] = f'{coords[0]} {coords[1]}'
        request.session['city'] = city

        return render(request, 'backend/index.html', {'weather': w[start:end], 'city': city})
    return render(request, 'backend/index.html')
