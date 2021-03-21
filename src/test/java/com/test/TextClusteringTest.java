package com.test;

import com.hankcs.hanlp.mining.cluster.ClusterAnalyzer;

import static com.test.DemoTextClassification.CORPUS_FOLDER;

public class TextClusteringTest {
    public static void main(String[] args) {
        for (String algorithm : new String[]{"kmeans", "repeated bisection"})
        {
            System.out.printf("%s F1=%.2f\n", algorithm, ClusterAnalyzer.evaluate(CORPUS_FOLDER, algorithm) * 100);
        }
    }
}
