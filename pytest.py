def es_palindromo(texto):
    # Eliminar espacios y convertir a minúsculas
    texto_procesado = ''.join(texto.split()).lower()
    # Comparar el texto procesado con su reverso
    return texto_procesado == texto_procesado[::-1]

# Ejemplo de uso:
resultado = es_palindromo("Anita lava la tina")
print(resultado)  # True