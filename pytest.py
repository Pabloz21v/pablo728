while True:  
    score= 0
    print("                                     Bienvenido a Pregunta2")
    print("Ahora vas a ir respondiendo unas preguntas, vas a empezar con 0 de puntaje, por cada respuesta")
    print("incorrecta se le va a restar 5 puntos, si respondes bien se te suman 10 puntos, buena suerte!")
    print("iMPORTANTE: Para responder necesitas poner las opciones(A,B o C), tienen q estar en mayusculas!")
    print("")
    print("")
    print("")
    empezar_juego=input("Para empezar a jugar pone play: ")

    categorias =["Deporte","Arte","Entretenimiento","Geografia","Historia","Ciencia"]
    for categoria in categorias:               
        if categoria == "Deporte":
            print ("La categoria que te tocó es: ", categoria)
            qs1= print("¿En qué país se inventó el fútbol moderno?" )
            print(  "opción A: Brasil      Opción B: Inglaterra     Opción C: Argentina   ")
            asw= ""
            while asw != "B":
                asw= input("Introduzca la opción correcta: ")    
                if asw != "B":
                    score -=5
                    print("Respuesta incorrecta vuelve a intentarlo. Perdiste 5 puntos, tu puntaje ahora es: ",score) 
            score+=10     
            print("")   
            print("Muy bien! La respuesta correcta era la opción ", asw, ",Sumaste 10 puntos, tu score ahora es: ",score)
            print("")

            qs2= print("¿Cuántos jugadores tiene un equipo de voleibol en cancha?" )
            print(  "opción A: 6      Opción B: 5     Opción C: 11   ")
            asw= ""
            while asw != "A":
                asw= input("Introduzca la opción correcta: ")    
                if asw != "A":
                    score -=5
                    print("Respuesta incorrecta vuelve a intentarlo. Perdiste 5 puntos, tu puntaje ahora es: ",score) 
            score+=10        
            print("")   
            print("Muy bien! La respuesta correcta era la opción ", asw, ",Sumaste 10 puntos, tu score ahora es: ",score)
            print("")

            qs3= print("¿Qué selección ganó el Mundial de Fútbol 2010?" )
            print(  "opción A: Alemania     Opción B: España    Opción C: Italia   ")
            asw= ""
            while asw != "B":
                asw= input("Introduzca la opción correcta: ")    
                if asw != "B":
                    score -=5
                    print("Respuesta incorrecta vuelve a intentarlo. Perdiste 5 puntos, tu puntaje ahora es: ",score) 
            score+=10        
            print("")   
            print("Muy bien! La respuesta correcta era la opción ", asw, ",Sumaste 10 puntos, tu score ahora es: ",score)
            print("")
            print("Completaste la categoria ",categoria, ",sigamos!!")
            print("")
        
        elif categoria == "Arte":
            print ("La categoria que te tocó es: ", categoria)
            qs1= print("¿Quién pintó la obra La noche estrellada?" )
            print(  "opción A: Pablo Picasso      Opción B: Vincent van Gogh     Opción C: Salvador Dalí   ")
            asw= ""
            while asw != "B":
                asw= input("Introduzca la opción correcta: ")    
                if asw != "B":
                    score -=5
                    print("Respuesta incorrecta vuelve a intentarlo. Perdiste 5 puntos, tu puntaje ahora es: ",score) 
            score+=10        
            print("")   
            print("Muy bien! La respuesta correcta era la opción ", asw, ",Sumaste 10 puntos, tu score ahora es: ",score)
            print("")

            qs2= print("¿En qué país se encuentra la famosa escultura El David de Miguel Ángel?" )
            print(  "opción A: Francia      Opción B: Grecia     Opción C: Itaia   ")
            asw= ""
            while asw != "C":
                asw= input("Introduzca la opción correcta: ")    
                if asw != "C":
                    score -=5
                    print("Respuesta incorrecta vuelve a intentarlo. Perdiste 5 puntos, tu puntaje ahora es: ",score) 
            score+=10        
            print("")   
            print("Muy bien! La respuesta correcta era la opción ", asw, ",Sumaste 10 puntos, tu score ahora es: ",score)
            print("")

            qs3= print("¿A qué movimiento artístico pertenece Pablo Picasso?" )
            print(  "opción A: Surrealismo     Opción B: Cubismo    Opción C: Impresionismo   ")
            asw= ""
            while asw != "B":
                asw= input("Introduzca la opción correcta: ")    
                if asw != "B":
                    score-=5
                    print("Respuesta incorrecta vuelve a intentarlo. Perdiste 5 puntos, tu puntaje ahora es: ",score) 
            score+=10
            print("")   
            print("Muy bien! La respuesta correcta era la opción ", asw, ",Sumaste 10 puntos, tu score ahora es: ",score)
            print("")
            print("Completaste la categoria ",categoria, ",sigamos!!")
            print("")

        elif categoria == "Entretenimiento":
            print ("La categoria que te tocó es: ", categoria)
            qs1= print("¿Quién interpretó a Jack en la película Titanic (1997)?" )
            print(  "opción A: Brad Pitt      Opción B: Johnny Depp     Opción C: Leonardo DiCaprio  ")
            asw= ""
            while asw != "C":
                asw= input("Introduzca la opción correcta: ")    
                if asw != "C":
                    score-=5
                    print("Respuesta incorrecta vuelve a intentarlo. Perdiste 5 puntos, tu puntaje ahora es: ",score) 
            score+=10
            print("")   
            print("Muy bien! La respuesta correcta era la opción ", asw, ",Sumaste 10 puntos, tu score ahora es: ",score)
            print("")

            qs2= print("¿Cuál es la serie de Netflix en la que un profesor organiza un gran atraco con máscaras de Dalí?" )
            print(  "opción A: La casa de papel      Opción B: Narcos     Opción C: Élite   ")
            asw= ""
            while asw != "A":
                asw= input("Introduzca la opción correcta: ")    
                if asw != "A":
                    score-=5
                    print("Respuesta incorrecta vuelve a intentarlo. Perdiste 5 puntos, tu puntaje ahora es: ",score) 
            score+=10
            print("")   
            print("Muy bien! La respuesta correcta era la opción ", asw, ",Sumaste 10 puntos, tu score ahora es: ",score)
            print("")

            qs3= print("¿Quién es el cantante de “Shape of You”?" )
            print(  "opción A: Shawn Mendes     Opción B: Nachito y Tadeo    Opción C: Ed Sheeran   ")
            asw= ""
            while asw != "C":
                asw= input("Introduzca la opción correcta: ")    
                if asw != "C":
                    score-=5
                    print("Respuesta incorrecta vuelve a intentarlo. Perdiste 5 puntos, tu puntaje ahora es: ",score) 
            score+=10
            print("")   
            print("Muy bien! La respuesta correcta era la opción ", asw, ",Sumaste 10 puntos, tu score ahora es: ",score)
            print("")
            print("Completaste la categoria ",categoria, ",sigamos!!")
            print("")

        elif categoria == "Geografia":
            print ("La categoria que te tocó es: ", categoria)  
            qs1= print("¿Cuál es el río más largo del mundo según las últimas mediciones?" )
            print(  "opción A: Amazonas      Opción B: Nilo     Opción C: Misisipi  ")
            asw= ""
            while asw != "A":
                asw= input("Introduzca la opción correcta: ")    
                if asw != "A":
                    score-=5
                    print("Respuesta incorrecta vuelve a intentarlo. Perdiste 5 puntos, tu puntaje ahora es: ",score) 
            score+=10
            print("")   
            print("Muy bien! La respuesta correcta era la opción ", asw, ",Sumaste 10 puntos, tu score ahora es: ",score)
            print("")

            qs2= print("¿Cuál es el país con mayor cantidad de habitantes del planeta?" )
            print(  "opción A: Estados Unidos      Opción B: China     Opción C: India   ")
            asw= ""
            while asw != "C":
                asw= input("Introduzca la opción correcta: ")    
                if asw != "C":
                    score-=5
                    print("Respuesta incorrecta vuelve a intentarlo. Perdiste 5 puntos, tu puntaje ahora es: ",score) 
            score+=10
            print("")   
            print("Muy bien! La respuesta correcta era la opción ", asw, ",Sumaste 10 puntos, tu score ahora es: ",score)
            print("")

            qs3= print("¿Cuál es la capital de Canadá?" )
            print(  "opción A: Toronto     Opción B: Montreak    Opción C: Ottawa  ")
            asw= ""
            while asw != "C":
                asw= input("Introduzca la opción correcta: ")    
                if asw != "C":
                    score-=5
                    print("Respuesta incorrecta vuelve a intentarlo. Perdiste 5 puntos, tu puntaje ahora es: ",score) 
            score+=10
            print("") 
            print("Muy bien! La respuesta correcta era la opción ", asw, ",Sumaste 10 puntos, tu score ahora es: ",score)
            print("") 
            print("Completaste la categoria ",categoria, ",sigamos!!")
            print("") 

        elif categoria == "Historia":
            print ("La categoria que te tocó es: ", categoria)   
            qs1= print("¿En qué año cayó el Imperio Romano de Occidente?" )
            print(  "opción A: 476 d.C      Opción B: 1492    Opción C:452 d.C  ")
            asw= ""
            while asw != "A":
                asw= input("Introduzca la opción correcta: ")    
                if asw != "A":
                    score-=5
                    print("Respuesta incorrecta vuelve a intentarlo. Perdiste 5 puntos, tu puntaje ahora es: ",score) 
            score+=10
            print("") 
            print("Muy bien! La respuesta correcta era la opción ", asw, ",Sumaste 10 puntos, tu score ahora es: ",score)
            print("") 

            qs2= print("¿Quién fue el primer presidente de Estados Unidos?" )
            print(  "opción A: Abraham Lincoln      Opción B: Georgeo Washington     Opción C: Benjamin Franklin   ")
            asw= ""
            while asw != "B":
                asw= input("Introduzca la opción correcta: ")    
                if asw != "B":
                    score-=5
                    print("Respuesta incorrecta vuelve a intentarlo. Perdiste 5 puntos, tu puntaje ahora es: ",score) 
            score+=10
            print("") 
            print("Muy bien! La respuesta correcta era la opción ", asw, ",Sumaste 10 puntos, tu score ahora es: ",score)
            print("") 

            qs3= print("¿Quién fue el “Padre de la Patria” en Argentina?" )
            print(  "opción A: Manuel Belgrano     Opción B: José de San Martín    Opción C: Juan Manuel de Rosas  ")
            asw= ""
            while asw != "B":
                asw= input("Introduzca la opción correcta: ")    
                if asw != "B":
                    score-=5
                    print("Respuesta incorrecta vuelve a intentarlo. Perdiste 5 puntos, tu puntaje ahora es: ",score) 
            score+=10
            print("") 
            print("Muy bien! La respuesta correcta era la opción ", asw, ",Sumaste 10 puntos, tu score ahora es: ",score)
            print("") 
            print("Completaste la categoria ",categoria, ",sigamos!!")
            print("") 

        elif categoria == "Ciencia":
            print ("La categoria que te tocó es: ", categoria) 
            qs1= print("¿Cuál es el planeta más grande del sistema solar?" )
            print(  "opción A: Saturno     Opción B: Júpiter    Opción C: Urano  ")
            asw= ""
            while asw != "B":
                asw= input("Introduzca la opción correcta: ")    
                if asw != "B":
                    score-=5
                    print("Respuesta incorrecta vuelve a intentarlo. Perdiste 5 puntos, tu puntaje ahora es: ",score) 
            score+=10
            print("") 
            print("Muy bien! La respuesta correcta era la opción ", asw, ",Sumaste 10 puntos, tu score ahora es: ",score)
            print("") 

            qs2= print("¿Cómo se llama la capa de la Tierra donde ocurren los terremotos?" )
            print(  "opción A: Núcleo      Opción B: Manto     Opción C: Corteza   ")
            asw= ""
            while asw != "C":
                asw= input("Introduzca la opción correcta: ")    
                if asw != "C":
                    score-=5
                    print("Respuesta incorrecta vuelve a intentarlo. Perdiste 5 puntos, tu puntaje ahora es: ",score) 
            score+=10
            print("") 
            print("Muy bien! La respuesta correcta era la opción ", asw, ",Sumaste 10 puntos, tu score ahora es: ",score)
            print("") 

            qs3= print(" ¿Qué gas es más abundante en la atmósfera terrestre?" )
            print(  "opción A: Nitrógeno     Opción B: Oxígeno    Opción C: Dióxido de carbono  ")
            asw= ""
            while asw != "A":
                asw= input("Introduzca la opción correcta: ")    
                if asw != "A":
                    score-=5
                    print("Respuesta incorrecta vuelve a intentarlo. Perdiste 5 puntos, tu puntaje ahora es: ",score) 
            score+=10
            print("") 
            print("Muy bien! La respuesta correcta era la opción ", asw, ",Sumaste 10 puntos, tu score ahora es: ",score)
            print("") 
            print("Genial complestaste el juego!!")
            print("Tu puntaje al terminar fue de: ", score)

    jugar_otra = input("¿Querés volver a jugar? (s/n): ").lower()
    if jugar_otra != "s":
        print("¡Gracias por jugar, hasta la próxima!")
        break