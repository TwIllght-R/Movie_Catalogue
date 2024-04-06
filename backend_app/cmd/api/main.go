package main

import (
	"backend_app/internal/repo"
	"backend_app/internal/repo/dbrepo"
	"flag"
	"log"
	"net/http"
)

const defaultPort = "8080"

type application struct {
	Domain string
	DSN    string
	DB     repo.DatabaseRepo
}

func main() {

	//set app config
	var app application
	app.Domain = "example.com"

	//read from env
	flag.StringVar(&app.DSN, "dsn", "host=localhost port=5432 user=postgres password=postgres dbname=movies ssLmode=disable timezone=UTC connect_timeout=5", "Postgres Connection String")
	flag.Parse()

	//connect database
	conn, err := app.connectDB()
	if err != nil {
		log.Fatal(err)
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
