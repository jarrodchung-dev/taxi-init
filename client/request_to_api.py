import random
import requests

from time import sleep

def request_to_api():
    return_ojb = requests.post(
        "http://localhost:8080//login", 
        data={
            "username": "jarrodchung", 
            "password": "1234"
            }
        )
    try:
        return return_ojb.text
    except Exception as e:
        return

if __name__ == '__main__':
    request_to_api()
    sleep(random(1,3))