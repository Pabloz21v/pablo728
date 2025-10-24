productos = ["laptop", "mouse", "teclado", "monitor"]
precios = [899.99, 25.50, 75.00, 199.99]

productos_info = [f"{producto.title()}: ${precio}" for producto, precio in zip(productos, precios)]
productos_descuento = [f"{producto.title()} (con descuento)" for producto, precio in zip(productos, precios) if precio > 100]

print("Información de productos:")
for info in productos_info:
    print(f"- {info}")

print(f"\nProductos con descuento: {productos_descuento}")