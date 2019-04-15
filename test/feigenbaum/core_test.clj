(ns feigenbaum.core-test
  (:require [clojure.test :refer :all]
            [feigenbaum.core :refer :all]))

(deftest a-test
  (testing "FIXME, I fail."
    (is (= 0 1))))

;; this is also valid:

(deftest alternate-use
  (testing "test a vector of `is`"
      [(is true)
       (is true)
       (is true)]))

;; which is useful in the following example:
(defn with-resource [f]
  (setup)
  (f "expected")
  (breakdown))

(deftest alternate-use
  (testing "test a vector of `is`"
    (with-resource
      (fn [resource]
        [(is (= "expected" resource))]))))
