FROM python:3.11-slim-buster

RUN apt update -y && apt install curl -y
RUN pip install --upgrade pip
COPY ./tools/. .
RUN pip install -r requirements.txt

ENTRYPOINT ["bash"]
CMD ["script.sh", "python3", "/usr/src/app/manage.py", "runserver", "0.0.0.0:8001"]
