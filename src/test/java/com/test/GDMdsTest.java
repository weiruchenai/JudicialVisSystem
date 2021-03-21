package com.test;

//import mdsj.MDSJ;
import smile.mds.MDS;

import java.util.Arrays;

public class GDMdsTest {
    public static void main(String[] args) {
        double[][] input = {
                {0,0.9,0.2},
                {0.9,0,0.3},
                {0.2,0.3,0}
        };

        //double[][] output = MDSJ.classicalScaling(input);
        MDS mds = new MDS(input,2,true);
        double[][] coordinates = mds.getCoordinates();
        System.out.println(Arrays.deepToString(coordinates));
    }
}
