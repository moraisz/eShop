from asgiref.sync import sync_to_async
from django.shortcuts import render

from apps.catalog.models import Product


# Create your views here.
async def home(request):
    featured_products = [
        product
        async for product in Product.objects.filter(active=True).select_related(
            "category"
        )[:10]
    ]

    user = await request.auser()

    data = {"page_title": "eShop - Início", "products": featured_products, "user": user}

    return await sync_to_async(render, thread_sensitive=True)(
        request, "pages/core/home.html", data
    )
