## How to run backend

1. create your own virtual environment called myenv with <pythonversion> -m venv .venv (eg `python3 -m venv .venv`)

2. activate the virtual environment with `source .venv/bin/activate` or `. .venv/bin/activate (on mac)`

3. `pip install -r requirements.txt`
4. `flask run`

Note: I had to run flask in my terminal outside of VSCode. I'm not sure why but the VSCode python interpreter was not working and was showing ModuleNotFoundError when the module was in fact installed.
