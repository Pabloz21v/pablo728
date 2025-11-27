menu = """
Elegí una opción:
1) Cifrar un mensaje
2) Decifrar un mensaje
"""
print(menu) #Le mostramos al usuario las opciones a elegir 

opcion = int(input("Ingresá el número de la opción: ")) # Pedimos una opción al usuario

mensaje = input("Ingresá el mensaje: ") # Pedimos el mensaje a cifrar/decifrar

# pedimos el desplazamiento para el cifrado(es la cantidad de caracteres que se mueve hacia atras o adelante)
desplazamiento = int(input("Ingresá el desplazamiento (Debe ser el mismo numero del 1-10 para cifrar y decifrar): "))

resultado = ""  # variable donde guardamos el resultado

# el bucle for recorrer el mensaje caracter por caracter
for caracter in mensaje:
    
    if caracter:
        # Transformamos a número (código ASCII)
        codigo = ord(caracter)# ord convierte una letra a su numero de codigo ASCII

        if opcion == 1:  # Cifrar
            codigo = codigo + desplazamiento 
        else:            # Decifrar
            codigo = codigo - desplazamiento

        # Convertimos de nuevo a caracter
        nuevo_caracter = chr(codigo) # chr es la convercion contraria de ord (de numero a letra)
        resultado += nuevo_caracter # el (+=) hace la suma de los caracteres convertidos

    else:
        # Si no es letra, lo dejamos igual
        resultado += caracter

# resultado final
print("Resultado:", resultado)


