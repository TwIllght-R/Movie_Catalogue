package main

import (
	"backend_app/internal/repo"
	"backend_app/internal/repo/dbrepo"
	"flag"
	"log"
	"net/http"
	"time"
)

const defaultPort = "8080"

type application struct {
	Domain       string
	DSN          string
	DB           repo.DatabaseRepo
	auth         auth
	JWTSecret    string
	JWTIssuer    string
	JWTAudience  string
	CookieDomain string
}

func main() {

	//set app config
	var app application

	//read from env
	flag.StringVar(&app.DSN, "dsn", "host=localhost port=5432 user=postgres password=postgres dbname=movies sslmode=disable timezone=UTC connect_timeout=5", "Postgres Connection String")
	flag.StringVar(&app.JWTSecret, "jwt-secret", "secret", "signing key for jwt")
	flag.StringVar(&app.JWTIssuer, "jwt-issuer", "example.com", "issuer for jwt")
	flag.StringVar(&app.JWTAudience, "jwt-audience", "example.com", "audience for jwt")
	flag.StringVar(&app.CookieDomain, "cookie-domain", "localhost", "cookie domain")
	flag.StringVar(&app.Domain, "domain", "example.com", "domain")
	flag.Parse()

	//connect database
	conn, err := app.connectDB()
	if err != nil {
		log.Fatal(err)
	}

	app.auth = auth{
		Issuer:        app.JWTIssuer,
		Audience:      app.JWTAudience,
		Secret:        app.JWTSecret,
		TokenExpiry:   15 * time.Minute,
		RefreshExpiry: 24 * time.Hour,
		CookieDomain:  app.CookieDomain,
		CookiePath:    "/",
		CookieName:    "__refresh_token__",
	}

	app.DB = &dbrepo.PostgresRepo{DB: conn}
	defer app.DB.Connection().Close()

	// Start the API server
	log.Printf("Starting server on %s", defaultPort)
	err = http.ListenAndServe(":"+defaultPort, app.routes())
	if err != nil {
		log.Fatal(err)
	}
}
