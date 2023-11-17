## Setting up

(Optional)
Install MongoDB Compass
Set the connection string to `mongodb+srv://sarahdickerson:<password>@cluster0.ltgtmlx.mongodb.net/Requests`

## How to run backend

create your own virtual environment called myenv with <pythonversion> -m venv .venv (eg `python3 -m venv .venv`)
activate the virtual environment with `source .venv/bin/activate` or `. .venv/bin/activate (on mac)`
`pip install -r requirements.txt`
`flask run`

Note: I had to run flask in my terminal outside of VSCode. I'm not sure why but the VSCode python interpreter was not working and was showing ModuleNotFoundError when the module was in fact installed.
