import openmeteo_requests
from datetime import datetime
import requests_cache
from retry_requests import retry

# Setup the Open-Meteo API client with cache and retry on error
cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
openmeteo = openmeteo_requests.Client(session=retry_session)

# Make sure all required weather variables are listed here
# The order of variables in hourly or daily is important to assign them correctly below
url = "https://api.open-meteo.com/v1/forecast"


def get_weather(lat, long):
    params = {
        "latitude": lat,
        "longitude": long,
        "hourly": ["temperature_2m", "relative_humidity_2m", "precipitation_probability", "weather_code",
                   "surface_pressure", "wind_speed_10m"],
        "wind_speed_unit": "ms",
        "timeformat": "unixtime",
        "timezone": "auto",
        "forecast_days": 1
    }

    responses = openmeteo.weather_api(url, params=params)

    # Process first location. Add a for-loop for multiple locations or weather models
    response = responses[0]

    # Process hourly data. The order of variables needs to be the same as requested.
    hourly = response.Hourly()
    data = [[datetime.fromtimestamp(x) for x in range(hourly.Time(), hourly.TimeEnd(), 3600)]]
    data.extend([hourly.Variables(x).ValuesAsNumpy().tolist() for x in range(6)])
    w = []
    for x in range(len(data[0])):
        tmp = []
        for y in data:
            tmp.append(y[x])
        w.append(tmp)
    return w


get_weather(55.75396, 37.620393)