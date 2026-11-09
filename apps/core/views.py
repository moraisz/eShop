from django.shortcuts import render


# Create your views here.
async def home(request):
    data = {"page_title": "eShop"}

    return render(request, "core/home.html", data)
