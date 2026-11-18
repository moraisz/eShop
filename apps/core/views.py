from asgiref.sync import sync_to_async
from django.shortcuts import render

from apps.catalog.models import Product


# Create your views here.
async def home(request):
    products = await sync_to_async(list)(
        Product.objects.filter(active=True).select_related("category")
    )

    data = {"page_title": "eShop", "products": products}

    return render(request, "pages/core/home.html", data)
