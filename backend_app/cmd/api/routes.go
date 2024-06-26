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
	mux.Get("/movie/{id}", app.GetMovie)

	mux.Get("/genres", app.AllGenres)
	mux.Get("/movies/genres/{id}", app.AllMoviesByGenre)
	mux.Post("/graph", app.moviesGraphQL)

	//protected routes
	mux.Route("/admin", func(r chi.Router) {
		r.Use(app.authRequired)
		r.Get("/movies", app.MovieCatalogue)
		r.Get("/movies/{id}", app.MovieForEdit)
		r.Put("/movies/0", app.InsertMovie)
		r.Patch("/movies/{id}", app.UpdateMovie)
		r.Delete("/movies/{id}", app.DeleteMovie)
	})

	return mux

}
