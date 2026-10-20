const settings = {
  MODE: "development1",
  BASE_URL: "/api/v1",
  JWT_SECRET:
    "RZ18FSaMR0AYCSNGJhfJDVRDUqoVo3KLyBt4Wu8MIZuF3dmvvv/V7OLISTdixIf4UHeEDjYOsHxiFdUNLAUAk+6axNUDMdYtp0UkdJOdfS0zEqMM1at5HtDwGnApSXng+Wh5ApXVBeRhPsmPoDEBz8WZ5ETYr5ZfdLN0DPmuJURi+kGt4fHz/GJQSdyk+yTSmlQii3scQlde+WSpvNOzNUs7HTkGmB3DBaXqRvO8xgV5vhPhjkNT7nR80yC3VgYcpfHy9qBf/J0ZS0pSrRtVoTJIc+YNyRI4JE9D2bAFKjbnt+fIsXkz8KJdstxfU3oCDu6ezQIBdIIJ9OdF4Bismw==",
  FILE_UPLOAD_URL: "http://localhost:4000",

  DEVELOPMENT_SERVER: {
    FILE_UPLOAD_URL: "http://localhost:4000",
    SERVER_PORT: 4000,
    HOST: "localhost",
    DATABASE: "inspektion",
    USER: "postgres",
    PASSWORD: "merimano",
    PORT: 5432,
  },
  PRODUCTION_SERVER: {
    FILE_UPLOAD_URL: "http://148.230.122.48:4000",
    FILE_DOWNLOAD_URL: "https://api.inspektionsolutions.de",
    SERVER_PORT: 4000,
    HOST: "localhost",
    DATABASE: "inspektion",
    USER: "postgres",
    PASSWORD: "insp@736",
    PORT: 5432,
  },
};

export default settings;