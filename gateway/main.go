package main

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http/httputil"
	"net/url"
	"strings"
	"time"
)

func main() {
	r := gin.New()
	r.Use(gin.Recovery())
	proxyMap := map[string]*httputil.ReverseProxy{
		"todo": httputil.NewSingleHostReverseProxy(&url.URL{
			Scheme: "http",
			Host:   "todo-list:3000",
		}),
		"auth": httputil.NewSingleHostReverseProxy(&url.URL{
			Scheme: "http",
			Host:   "auth-service:3000",
		}),
	}

	r.Any("/*proxyPath", func(c *gin.Context) {
		t := time.Now()
		if strings.Contains(c.Request.URL.Path, "/auth") {
			proxyMap["auth"].ServeHTTP(c.Writer, c.Request)
			log.Println(c.Request.Method, c.Request.URL.Path, c.Request.URL.Query(), c.Writer.Status(), time.Since(t), "auth")
		} else {
			proxyMap["todo"].ServeHTTP(c.Writer, c.Request)
			log.Println(c.Request.Method, c.Request.URL.Path, c.Request.URL.Query(), c.Writer.Status(), time.Since(t), "todo")
		}
	})

	r.Run(":8080")
}
