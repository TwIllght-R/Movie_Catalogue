package repo

import (
	"backend_app/internal/models"
	"database/sql"
)

type DatabaseRepo interface {
	Connection() *sql.DB
	AllMovies() ([]*models.Movie, error)
	//GETMovieById(id int) (*models.Movie, error)
}
