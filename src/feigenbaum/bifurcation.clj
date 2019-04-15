(ns feigenbaum.bifurcation)

(defn round
  "Round to specified s.f."
  [d precision]
  (let [factor (Math/pow 10. precision)]
    (/ (Math/floor (* d factor)) factor)))

(defn get-next-pop [previous lambda]
  "Calculates population of next generation"
  (round (* lambda previous (- 1.0 previous)) 3))

(defn gen-pops
  "Generate populations over specified number of generations"
  [pops-list current-pop lambda gens]
  (let [next-pop (get-next-pop current-pop lambda)]
    (if (> gens 0)
      (gen-pops (conj pops-list next-pop) next-pop lambda (- gens 1))
      (reverse pops-list))))

(defn find-stable-pops
  "Finds the stable numbers between which the population cycles"
  [pops-list]
  (set (take-last 16 pops-list)))

(def min-gens
  "Minumum number of generations required to show roughly accurate bifurcations"
  150)

(defn gen-stable-pops
  "Generate stable populations for different lambdas"
  [start-lambda end-lambda step]
  (def stable-pops-list [])
  (doseq [lambda (range start-lambda (+ end-lambda step) step)]
    (def pops-list (gen-pops (list 0.5) 0.5 lambda min-gens))
    (def stable-pops (find-stable-pops pops-list))
    (def stable-pops-list
      (conj stable-pops-list
          {:lambda lambda
           :populations stable-pops})))
  stable-pops-list)

; Same function as above but works recursively (causes stack overflow when
; granurality of lambda is high)
;(defn gen-stable-pops
;  "Generate stable populations for different lambdas"
;  [stable-pops-arr start-pop lambda gens step]
;  (let [pops-list (gen-pops (list start-pop) start-pop lambda gens)
;        stable-pops (find-stable-pops pops-list)]
;    (if (< lambda 4.)
;      (gen-stable-pops
;        (conj stable-pops-arr stable-pops) start-pop (+ lambda step) (- gens 1) step)
;      stable-pops-arr)))

;(defn -main
;  [& args]
;  (let [start-pop 0.5 ; between 0 and 1
;        lambda 0 ; between 0 and 4
;        gens 250 ; might need to be higher
;        step 0.1 ; increase granularity when inspecting 3.5 - 4 range
;        ]
;  (def stable-pops (gen-stable-pops (vector) start-pop lambda gens step)))
;  stable-pops)
;
;(-main)

