curl -X POST http://localhost:8000/api/sign_up/ \
-H 'Content-Type: application/json' \
-d '
{
    "username": "michael@something.com",
    "password1": "test",
    "password2": "test",
    "first_name": "michael",
    "last_name": "herman"
}
'
curl -X POST http://localhost:8000/api/log_in/ \
-H 'Content-Type: application/json' \
-d '
{
    "username": "michael@something.com",
    "password": "test"
}
'