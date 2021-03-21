package com.dataprocess;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import static com.dataprocess.SegmentOut.getFileName;
import static com.dataprocess.SimilarityCalculate.getSimilarity;

public class SimilarityToCsv {
    public static void main(String[] args) throws IOException {
        //similarity2Csv("PersonalInjury","9.txt");
        S2CsvByBatch("Neighborhood");
    }

    public static void similarity2Csv(String category, String fileName) throws IOException {
        BufferedWriter br = new BufferedWriter(new FileWriter("data\\Similarity\\" + category + "\\" + fileName + "_.csv"));
        TreeMap<Float,String> dataMap = getSimilarity(fileName,category,15);
        br.write("fileName,similarity");
        br.newLine();
        for (Map.Entry<Float, String> entry : dataMap.entrySet()) {
            br.write(entry.getValue() + "," + entry.getKey());
            br.newLine();
            br.flush();
        }
        System.out.println("文件" + fileName + "的相似度csv写入完成...");
        br.close();
    }

    public static void S2CsvByBatch(String category) throws IOException {
        List<String> fileNameList = getFileName(new File("data\\SegmentData\\MyData\\cluster\\" + category + "\\"));
        for (String filenamelist: fileNameList) {
            similarity2Csv(category,filenamelist);
        }
    }
}
