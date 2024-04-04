package main

import (
	"backend_app/internal/models"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func (app *application) Home(w http.ResponseWriter, r *http.Request) {

	var payload = struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Version string `json:"version"`
	}{
		Status:  "active",
		Message: "Go movie up and running!",
		Version: "1.0.0",
	}

	output, err := json.Marshal(payload)
	if err != nil {
		fmt.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(output)
}

func (app *application) AllMovies(w http.ResponseWriter, r *http.Request) {
	var movies []models.Movie

	rd, _ := time.Parse("2006-01-02", "1986-03-07")

	hightlander := models.Movie{
		ID:          1,
		Title:       "Highlander",
		ReleaseDate: rd,
		RunTime:     116,
		MPAARating:  "R",
		Description: "An immortal Scottish swordsman must confront the last of his immortal opponent, a murderously brutal barbarian who lusts for the fabled 'Prize'.",
		UpdatedAt:   time.Now(),
		CreatedAt:   time.Now(),
	}

	movies = append(movies, hightlander)

	rotla := models.Movie{
		ID:          2,
		Title:       "Raiders of the Lost Ark",
		ReleaseDate: time.Date(1981, time.June, 12, 0, 0, 0, 0, time.UTC),
		RunTime:     115,
		MPAARating:  "PG",
		Description: "In 1936, archaeologist and adventurer Indiana Jones is hired by the U.S. government to find the Ark of the Covenant before Adolf",
		UpdatedAt:   time.Now(),
		CreatedAt:   time.Now(),
	}
	movies = append(movies, rotla)

	output, err := json.Marshal(movies)
	if err != nil {
		fmt.Println(err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(output)

}
