(ns feigenbaum.core)

(defn round
  "Round to specified number of significant figures"
  [d precision]
  (let [factor (Math/pow 10 precision)]
    (/ (Math/floor (* d factor)) factor)))

(defn get-next-pop [previous lambda]
  (round (* lambda previous (- 1.0 previous)) 4))

(defn gen-pops
  "Generate populations over specified number of generations"
  [pop-list current-pop lambda generations]
  (def next-pop (get-next-pop current-pop lambda))
  (if (> generations 0)
    (gen-pops (conj pop-list next-pop) next-pop lambda (- generations 1))
    (reverse pop-list)))

(defn get-stable-pops
  "Finds the stable numbers between which the population cycles"
  [pop-list]
  (set (take-last 16 pop-list)))

(def start-pop 0.5) ; between 0 and 1
(def lambda 3.3) ; between 0 and 4
(def generations 250)

(def pop-list (gen-pops (list start-pop) start-pop lambda generations))
(def stable-pops (get-stable-pops pop-list))

stable-pops
