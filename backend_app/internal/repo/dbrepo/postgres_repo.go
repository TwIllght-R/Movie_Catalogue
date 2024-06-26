package dbrepo

import (
	"backend_app/internal/models"
	"context"
	"database/sql"
	"fmt"
	"time"
)

type PostgresRepo struct {
	DB *sql.DB
}

const dbTimeout = time.Second * 3

func (r *PostgresRepo) Connection() *sql.DB {
	return r.DB
}

func (r *PostgresRepo) AllMovies(genre ...int) ([]*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	where := ""
	if len(genre) > 0 {
		where = fmt.Sprintf("where id in (select movie_id from movies_genres where genre_id = %d)", genre[0])
	}

	query := fmt.Sprintf(`
	SELECT id, title, release_date, runtime, mpaa_rating, description,coalesce(image, ''), created_at, updated_at 
	FROM movies
	%s
	order by title
	`, where)

	rows, err := r.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var movies []*models.Movie

	for rows.Next() {
		var movie models.Movie
		err := rows.Scan(
			&movie.ID,
			&movie.Title,
			&movie.ReleaseDate,
			&movie.RunTime,
			&movie.MPAARating,
			&movie.Description,
			&movie.Image,
			&movie.CreatedAt,
			&movie.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		movies = append(movies, &movie)
	}

	return movies, nil
}

func (r *PostgresRepo) OneMovie(id int) (*models.Movie, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select id,title,release_date,runtime,mpaa_rating,
	description,coalesce(image, ''),created_at,updated_at 
	from movies where id = $1`
	row := r.DB.QueryRowContext(ctx, query, id)

	var movie models.Movie
	err := row.Scan(
		&movie.ID,
		&movie.Title,
		&movie.ReleaseDate,
		&movie.RunTime,
		&movie.MPAARating,
		&movie.Description,
		&movie.Image,
		&movie.CreatedAt,
		&movie.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	//get genres
	query = `select g.id, g.genre from movies_genres mg 
			 left join genres g on (mg.genre_id = g.id)
			 where mg.movie_id = $1
			 order by g.genre`
	rows, err := r.DB.QueryContext(ctx, query, id)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	defer rows.Close()
	var genres []*models.Genre
	for rows.Next() {
		var g models.Genre
		err := rows.Scan(&g.ID, &g.Genre)
		if err != nil {
			return nil, err
		}

		genres = append(genres, &g)
	}
	movie.Genres = genres
	return &movie, nil
}

func (r *PostgresRepo) OneMovieForEdit(id int) (*models.Movie, []*models.Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select id,title,release_date,runtime,mpaa_rating,
	description,coalesce(image, ''),created_at,updated_at 
	from movies where id = $1`
	row := r.DB.QueryRowContext(ctx, query, id)

	var movie models.Movie
	err := row.Scan(
		&movie.ID,
		&movie.Title,
		&movie.ReleaseDate,
		&movie.RunTime,
		&movie.MPAARating,
		&movie.Description,
		&movie.Image,
		&movie.CreatedAt,
		&movie.UpdatedAt,
	)
	if err != nil {
		return nil, nil, err
	}

	//get genres
	query = `select g.id, g.genre from movies_genres mg 
			 left join genres g on (mg.genre_id = g.id)
			 where mg.movie_id = $1
			 order by g.genre`
	rows, err := r.DB.QueryContext(ctx, query, id)
	if err != nil && err != sql.ErrNoRows {
		return nil, nil, err
	}
	defer rows.Close()
	var genres []*models.Genre
	var genresArray []int
	for rows.Next() {
		var g models.Genre
		err := rows.Scan(&g.ID, &g.Genre)
		if err != nil {
			return nil, nil, err
		}

		genres = append(genres, &g)
		genresArray = append(genresArray, g.ID)
	}
	movie.Genres = genres
	movie.GenresArray = genresArray

	var allGenres []*models.Genre
	query = `select id, genre from genres order by genre`
	gRows, err := r.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, nil, err
	}
	defer gRows.Close()

	for gRows.Next() {
		var g models.Genre
		err := gRows.Scan(&g.ID, &g.Genre)
		if err != nil {
			return nil, nil, err
		}
		allGenres = append(allGenres, &g)
	}

	return &movie, allGenres, nil
}

func (r *PostgresRepo) GetUserByEmail(email string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()
	query := `select * from users where email = $1`

	var user models.User
	row := r.DB.QueryRowContext(ctx, query, email)
	err := row.Scan(
		&user.ID,
		&user.FirstName,
		&user.LastName,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &user, nil

}

func (r *PostgresRepo) GetUserByID(id int) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()
	query := `select * from users where id = $1`

	var user models.User
	row := r.DB.QueryRowContext(ctx, query, id)
	err := row.Scan(
		&user.ID,
		&user.FirstName,
		&user.LastName,
		&user.Email,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &user, nil

}

func (m *PostgresRepo) AllGenres() ([]*models.Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `select id, genre, created_at, updated_at from genres order by genre`
	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var genres []*models.Genre

	for rows.Next() {
		var g models.Genre
		err := rows.Scan(
			&g.ID,
			&g.Genre,
			&g.CreatedAt,
			&g.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		genres = append(genres, &g)
	}

	return genres, nil
}

func (r *PostgresRepo) InsertMovie(movie models.Movie) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `insert into movies (title, release_date, runtime, mpaa_rating, description, image, created_at, updated_at)
	values ($1, $2, $3, $4, $5, $6, $7, $8) returning id`

	var id int
	err := r.DB.QueryRowContext(ctx, query,
		movie.Title,
		movie.ReleaseDate,
		movie.RunTime,
		movie.MPAARating,
		movie.Description,
		movie.Image,
		time.Now(),
		time.Now(),
	).Scan(&id)
	if err != nil {
		return 0, err
	}

	return id, nil
}

func (r *PostgresRepo) UpdateMovie(movie models.Movie) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `update movies set title = $1, release_date = $2, runtime = $3, mpaa_rating = $4, description = $5, image = $6, updated_at = $7
	where id = $8`

	_, err := r.DB.ExecContext(ctx, query,
		movie.Title,
		movie.ReleaseDate,
		movie.RunTime,
		movie.MPAARating,
		movie.Description,
		movie.Image,
		movie.UpdatedAt,
		movie.ID,
	)
	if err != nil {
		return err
	}

	return nil
}

func (r *PostgresRepo) UpdateMovieGenres(id int, genreIDs []int) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `delete from movies_genres where movie_id = $1`

	_, err := r.DB.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	for _, gID := range genreIDs {
		query := `insert into movies_genres (movie_id, genre_id) values ($1, $2)`
		_, err := r.DB.ExecContext(ctx, query, id, gID)
		if err != nil {
			return err
		}
	}

	return nil

}

func (r *PostgresRepo) DeleteMovie(id int) error {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeout)
	defer cancel()

	query := `delete from movies where id = $1`

	_, err := r.DB.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	return nil
}
