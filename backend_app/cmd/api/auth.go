package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type auth struct {
	Issuer        string
	Audience      string
	Secret        string
	TokenExpiry   time.Duration
	RefreshExpiry time.Duration
	CookieDomain  string
	CookiePath    string
	CookieName    string
}

type jwtUser struct {
	ID        int    `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type tokenPairs struct {
	Token   string `json:"access_token"`
	Refresh string `json:"refresh_token"`
}

type Claims struct {
	jwt.RegisteredClaims //embedded struct
}

func (a *auth) GenerateTokenPair(user *jwtUser) (tokenPairs, error) {
	//Create the access token
	token := jwt.New(jwt.SigningMethodHS256)

	//set the Claims
	claims := token.Claims.(jwt.MapClaims)
	claims["name"] = fmt.Sprintf("%s %s", user.FirstName, user.LastName)
	claims["sub"] = fmt.Sprintf("%d", user.ID)
	claims["aud"] = a.Audience
	claims["iss"] = a.Issuer
	claims["iat"] = time.Now().UTC().Unix()
	claims["typ"] = "JWT"

	//set the expiry
	claims["exp"] = time.Now().Add(a.TokenExpiry).UTC().Unix()

	//Create a signed access token
	signedAccessToken, err := token.SignedString([]byte(a.Secret))
	if err != nil {
		return tokenPairs{}, err
	}

	// Create the refresh token and set the Claims
	refreshToken := jwt.New(jwt.SigningMethodHS256)
	refreshClaims := refreshToken.Claims.(jwt.MapClaims)
	refreshClaims["sub"] = fmt.Sprintf("%d", user.ID)
	refreshClaims["iat"] = time.Now().UTC().Unix()

	//set the expiry for the refresh token
	refreshClaims["exp"] = time.Now().Add(a.RefreshExpiry).UTC().Unix()
	//Create signed refresh token
	signedRefreshToken, err := refreshToken.SignedString([]byte(a.Secret))
	if err != nil {
		return tokenPairs{}, err
	}

	//Create a token pair and populate with the signed tokens
	tokenPair := tokenPairs{
		Token:   signedAccessToken,
		Refresh: signedRefreshToken,
	}

	//return the token pair
	return tokenPair, nil

}

func (a *auth) GetRefreshCookie(refreshToken string) *http.Cookie {
	return &http.Cookie{
		Name:     a.CookieName,
		Value:    refreshToken,
		Path:     a.CookiePath,
		Expires:  time.Now().Add(a.RefreshExpiry),
		MaxAge:   int(a.RefreshExpiry.Seconds()),
		SameSite: http.SameSiteStrictMode,
		Domain:   a.CookieDomain,
		HttpOnly: true,
		Secure:   true,
	}
}

func (a *auth) GetExpiredRefreshCookie() *http.Cookie {
	return &http.Cookie{
		Name:     a.CookieName,
		Value:    "",
		Path:     a.CookiePath,
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
		SameSite: http.SameSiteStrictMode,
		Domain:   a.CookieDomain,
		HttpOnly: true,
		Secure:   true,
	}
}
