(ns feigenbaum.core)

(defn round
  "Round to specified s.f."
  [d precision]
  (let [factor (Math/pow 10 precision)]
    (/ (Math/floor (* d factor)) factor)))

(defn get-next-pop [previous lambda]
  "Calculates population of next generation"
  (round (* lambda previous (- 1.0 previous)) 4))

(defn gen-pops
  "Generate populations over specified number of generations"
  [pops-list current-pop lambda gens]
  (let [next-pop (get-next-pop current-pop lambda)]
    (if (> gens 0)
      (gen-pops (conj pops-list next-pop) next-pop lambda (- gens 1))
      pops-list)))

(defn find-stable-pops
  "Finds the stable numbers between which the population cycles"
  [pops-list]
  (set (take-last 16 pops-list)))

(defn gen-stable-pops
  "Generate stable populations for different lambdas"
  [stable-pops-arr start-pop lambda gens step]
  (let [pops-list (gen-pops (list start-pop) start-pop lambda gens)
        stable-pops (find-stable-pops pops-list)]
    (if (< lambda 4)
      (gen-stable-pops (conj stable-pops-arr stable-pops) start-pop (+ lambda step) (- gens 1) step)
      stable-pops-arr)))

(defn -main
  [& args]
  (let [start-pop 0.5 ; between 0 and 1
        lambda 0 ; between 0 and 4
        gens 250 ; might need to be higher
        step 0.1 ; increase granularity when inspecting 3.5 - 4 range
        ]
  (def stable-pops (gen-stable-pops (vector) start-pop lambda gens step)))
  (for [p stable-pops]
    (println p)))

(-main)

