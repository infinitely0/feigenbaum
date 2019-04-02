(ns feigenbaum.core
  (:gen-class)
  (:use [compojure.core]
        [feigenbaum.bifurcation])
  (:require [ring.adapter.jetty :as jetty]
            [ring.middleware.reload :refer [wrap-reload]]
            [compojure.route :as route]
            [ring.util.response :as res]))

(def start-pop 0.5)

(defn populations
  "Generates population figures"
  [request]
  (let [lambda (Double.  (get-in request [:route-params :lambda]))
        gens   (Integer. (get-in request [:route-params :generations]))
        err (= 0 1)]
    (if err
      {:status 500,
       :body "Error"}
      {:status 200,
       :body (str (gen-pops (list start-pop) start-pop lambda gens))})))

;(defn bifurcations
;  "Generates bifurcation data"
;  [request]
;  (let [start       (Integer. (get-in request [:route-params :start]))
;        lambda      (Integer. (get-in request [:route-params :generations]))
;        generations (Integer. (get-in request [:route-params :generations]))
;        err (= 0 1)]
;    (if err
;      {:status 500, :body "Error"}
;      {:status 200, :body (str start lambda generations) })))

(defroutes app
  (GET "/" [] (res/file-response "index.html" {:root "resources/public"}))
  (GET "/populations/:lambda/:generations" [] populations)
;  (GET "/bifurcations/:start/:lambda/:generations" [] bifurcations)
  (route/resources "/")
  (route/not-found "<h1>404</h1>"))

(defn -dev
  [port-number]
  (jetty/run-jetty (wrap-reload #'app)
     {:port (Integer. port-number)}))

(defn -main
  [port-number]
  (jetty/run-jetty app
     {:port (Integer. port-number)}))

