import urequests
import ujson
import time
import machine
import dht
from wifimgr import WifiManager
from machine import Pin, ADC
import socket

# Backend server configuration
BACKEND_URL = "http://104.194.98.118:5001/predict"  # Change <your_backend_ip> to your backend's IP address

# Variable to store the received expoPushToken
user_expoPushToken = None

# Set up the sensor
dht_pin = machine.Pin(2)  # Assuming DHT22 sensor is connected to GPIO 2
sensor = dht.DHT22(dht_pin)

moisture_sensor_pin = machine.ADC(0)  # Assuming analog pin for moisture sensor



# Initialize WiFi Manager
wm = WifiManager()
wm.connect()

# Function to send data to the backend using the expoPushToken
def send_to_backend(data, expoPushToken):
    headers = {
        "Content-Type": "application/json"
    }
    # Prepare the payload to send
    payload = ujson.dumps({
        "input_value": [data["temperature"], data["moisture_level"]],
        "expo_push_token": expoPushToken
    })
    
    # Send a POST request to the backend
    response = urequests.post(BACKEND_URL, data=payload, headers=headers)
    print("Backend Response:", response.text)
    response.close()

# Function to handle incoming HTTP requests from the React Native app
def handle_client(client_socket):
    global user_expoPushToken
    request = client_socket.recv(1024)
    request = request.decode('utf-8')  # Ensure request is decoded properly
    print("Full Request:", request)  # Debugging: print the full request to check its structure

    # Look for a POST request to /post-expoPushToken
    if "POST /post-expoPushToken" in request:
        try:
            if "\r\n\r\n" in request:
                # Split and extract the JSON part of the body
                json_data = request.split("\r\n\r\n")[1]
                print("Raw JSON data:", json_data)  # Debug: Print the raw JSON data before parsing

                # Try parsing the JSON
                try:
                    expoPushToken_data = ujson.loads(json_data)  # Parse the JSON
                    print("Parsed expoPushToken_data:", expoPushToken_data)  # Debugging

                    # Check if 'token' is in the received JSON data
                    if 'token' in expoPushToken_data:
                        user_expoPushToken = expoPushToken_data['token']  # Capture the expoPushToken
                        print(f"Received expoPushToken: {user_expoPushToken}")

                        # Send response to client
                        response = "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{\"status\": \"expoPushToken received\"}"
                    else:
                        response = "HTTP/1.1 400 Bad Request\r\n\r\n{\"error\": \"Invalid token format\"}"

                except ValueError as e:
                    print(f"JSON parsing error: {e}")  # If JSON is invalid, show error
                    response = "HTTP/1.1 400 Bad Request\r\n\r\n{\"error\": \"Invalid JSON\"}"
            else:
                response = "HTTP/1.1 400 Bad Request\r\n\r\n{\"error\": \"No JSON body found\"}"
        except Exception as e:
            print(f"Error processing request: {e}")
            response = "HTTP/1.1 500 Internal Server Error\r\n\r\n{\"error\": \"Failed to process request\"}"
    else:
        # If not the expected request, send 404 Not Found
        response = "HTTP/1.1 404 Not Found\r\n\r\n"
    
    client_socket.send(response)
    client_socket.close()

# Main function to handle Wi-Fi connection and sensor data processing
def main():
    if wm.is_connected():
        print("Connected to WiFi")

        # Set up the server to listen for connections
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.bind(('0.0.0.0', 80))
        server_socket.listen(5)
        print("Server listening on port 80")

        sensor.measure()
        temp = sensor.temperature()  # Temperature in Celsius
        humidity = sensor.humidity()  # Humidity percentage
        moisture_level = moisture_sensor_pin.read()
        # temp = 40.0
        # moisture_level = 150
        # humidity = 60   

        print("Moisture Level:", moisture_level)
        print('Temperature: {:.2f}°C'.format(temp))
        print('Humidity: {:.2f}%'.format(humidity))

        client_socket, addr = server_socket.accept()
        handle_client(client_socket)  

        while True:
            # Check if we have received the expoPushToken
            if user_expoPushToken:
                try:
                    # Measure temperature and humidity
                    sensor.measure()
                    temp = sensor.temperature()  # Temperature in Celsius
                    humidity = sensor.humidity()  # Humidity percentage
                    moisture_level = moisture_sensor_pin.read()  # Moisture level (0 to 1023)

                    # temp = 40.0
                    # moisture_level = 150
                    # humidity = 60   

                    # Prepare the data to send
                    sensor_data = {
                        "temperature": temp,
                        "humidity": humidity,
                        "moisture_level": moisture_level,
                        "timestamp": time.time(),
                    }

                    print("Sensor Data:", sensor_data)  # Debugging

                    # Send data to backend
                    send_to_backend(sensor_data, user_expoPushToken)
                    
                    # Sleep for a while before measuring again (e.g., 10 seconds)
                    time.sleep(10)

                except OSError as e:
                    print('Failed to read sensor:', e)
            # else:
            #     print("Waiting for expoPushToken from the React Native app...")

    else:
        print("Failed to connect to WiFi.")
        machine.reset()

# Run the main function
if __name__ == "__main__":
    main()
