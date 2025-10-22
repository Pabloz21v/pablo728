calificaciones = [8.5, 6.0, 9.5, 7.0, 5.5, 10.0, 8.0]
nombres = ["Pedro", "Lucía", "Miguel", "Ana", "Carlos", "Sofía", "Diego"]

aprobados = []
reprobados = []

print("=== REPORTE DE CALIFICACIONES ===")

for nombre, calificacion in zip(nombres, calificaciones):
    if calificacion >= 7.0:
        estado = "APROBADO"
        aprobados.append(nombre)
    else:
        estado = "REPROBADO"
        reprobados.append(nombre)
    print(f"{nombre}: {calificacion} - {estado}")

print(f"\nEstudiantes aprobados ({len(aprobados)}): {aprobados}")
print(f"Estudiantes reprobados ({len(reprobados)}): {reprobados}")