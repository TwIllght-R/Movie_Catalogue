package main

import (
	"log"
	"net/http"
)

const defaultPort = "8080"

type application struct {
	Domain string
}

func main() {

	//set app config
	var app application
	app.Domain = "example.com"

	//read from env

	// Start the API server
	log.Printf("Starting server on %s", defaultPort)
	err := http.ListenAndServe(":"+defaultPort, app.routes())
	if err != nil {
		log.Fatal(err)
	}
}
