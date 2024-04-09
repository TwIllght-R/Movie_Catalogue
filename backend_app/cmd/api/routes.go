package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func (app *application) routes() http.Handler {
	//router mux
	mux := chi.NewRouter()

	mux.Use(middleware.Recoverer)
	mux.Use(app.enableCORS)
	mux.Get("/", app.Home)

	mux.Get("/movies", app.AllMovies)
	mux.Post("/authenticate", app.authenticate)
	mux.Get("/refresh", app.refreshToken)
	mux.Get("/logout", app.logout)

	//protected routes
	mux.Route("/admin", func(r chi.Router) {
		r.Use(app.authRequired)
		r.Get("/movies", app.MovieCatalogue)
	})

	return mux

}
