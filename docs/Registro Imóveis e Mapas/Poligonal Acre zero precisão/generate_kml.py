import math
from dataclasses import dataclass
from dados_poligonal import dados_poligonal

@dataclass
class Point:
    lat: float
    lon: float
    name: str


def dms_to_decimal(angle_str):
    # Remove special characters and split
    clean_str = angle_str.replace('′', '').replace('°', ' ').replace("'", "")
    parts = clean_str.split()
    
    try:
        degrees = float(parts[0])
        minutes = float(parts[1]) if len(parts) > 1 else 0
    except ValueError:
        print(f"Erro ao converter ângulo: {angle_str}")
        return 0
    
    decimal = degrees + minutes/60
    return decimal

def calculate_endpoint(start_lat, start_lon, bearing, distance):
    """Calculate endpoint given start point, bearing and distance"""
    # Convert to radians
    lat1 = math.radians(start_lat)
    lon1 = math.radians(start_lon)
    bearing = math.radians(float(bearing))
    
    # Earth's radius in meters
    R = 6378137
    
    # Convert distance to angular distance
    d = distance / R
    
    # Calculate new latitude
    lat2 = math.asin(
        math.sin(lat1) * math.cos(d) +
        math.cos(lat1) * math.sin(d) * math.cos(bearing)
    )
    
    # Calculate new longitude
    lon2 = lon1 + math.atan2(
        math.sin(bearing) * math.sin(d) * math.cos(lat1),
        math.cos(d) - math.sin(lat1) * math.sin(lat2)
    )
    
    # Convert back to degrees
    lat2 = math.degrees(lat2)
    lon2 = math.degrees(lon2)
    
    return lat2, lon2

def create_kml(points):
    kml = f'''<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <Style id="yellowLineGreenPoly">
      <LineStyle>
        <color>7f00ffff</color>
        <width>4</width>
      </LineStyle>
      <PolyStyle>
        <color>7f00ff00</color>
      </PolyStyle>
    </Style>
    <Placemark>
      <name>Property Boundary</name>
      <styleUrl>#yellowLineGreenPoly</styleUrl>
      <LineString>
        <extrude>1</extrude>
        <tessellate>1</tessellate>
        <coordinates>
'''
    
    # Add coordinates
    for point in points:
        kml += f"          {point.lon},{point.lat},0\n"
    
    # Add first point again to close the polygon
    kml += f"          {points[0].lon},{points[0].lat},0\n"
    
    kml += '''        </coordinates>
      </LineString>
    </Placemark>
'''

    # Add point markers
    for point in points:
        kml += f'''    <Placemark>
      <name>{point.name}</name>
      <Point>
        <coordinates>{point.lon},{point.lat},0</coordinates>
      </Point>
    </Placemark>
'''

    kml += '''  </Document>
</kml>'''
    
    return kml

def main():
    # Starting point
    start_point = Point(-9.683815, -68.783591, "MP")
    points = [start_point]
    current_point = start_point
    
    print("Iniciando processamento...")
    
    # Dicionário para armazenar todos os pontos
    all_points = {start_point.name: start_point}
    
    # Process each line
    for line in dados_poligonal:
        start_name, end_name, bearing_str, distance = line
        
        try:
            # Convert bearing to decimal degrees
            bearing = dms_to_decimal(bearing_str)
            
            # Use o ponto atual como ponto de partida, independente do nome
            start_point = current_point
            
            # Calcule o novo ponto
            new_lat, new_lon = calculate_endpoint(
                start_point.lat,
                start_point.lon,
                bearing,
                distance
            )
            
            # Crie o novo ponto e adicione ao dicionário
            new_point = Point(new_lat, new_lon, end_name)
            all_points[end_name] = new_point
            current_point = new_point
            
            print(f"Processado: {start_point.name} -> {end_name}")
            
        except Exception as e:
            print(f"Erro ao processar linha: {line}")
            print(f"Erro: {str(e)}")

    # Converta o dicionário em uma lista ordenada
    points = list(all_points.values())

    print(f"Total de pontos processados: {len(points)}")
    
    # Generate KML
    kml_content = create_kml(points)

    # Write to file
    with open('property_boundary.kml', 'w', encoding='utf-8') as f:
        f.write(kml_content)
    
    print("Arquivo KML gerado com sucesso!")

if __name__ == "__main__":
    main()
