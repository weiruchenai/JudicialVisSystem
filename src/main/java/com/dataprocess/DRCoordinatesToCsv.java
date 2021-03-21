package com.dataprocess;

import com.hankcs.hanlp.HanLP;
import com.hankcs.hanlp.summary.TextRankKeyword;
//import mdsj.MDSJ;
import smile.mds.MDS;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static com.dataprocess.MdsDimensionReduction.getDisimilarityMatrix;
import static com.dataprocess.SegmentOut.getFileName;
import static com.dataprocess.SimilarityCalculate.txtToString;

public class DRCoordinatesToCsv {
    public static void main(String[] args) throws IOException {
        List<String> fileName = getFileName(new File("data\\SegmentData\\MyData\\cluster\\Neighborhood\\"));
 /*       for (int i = 0; i < array[0].length; i++) {
            for (int j = 0; j < array[0].length; j++) {
                if(!(array[i][j] > 0)){
                    System.out.println(i + "..." + j + "..." + fileName.get(i) + array[i][j]);
                }
            }
        }*/
        String[] fileContent =new String[6000];
        String[] keyWord = new String[6000];
        List<String> keyWordList = new ArrayList<>();
        List<String> keyWordListRank = new ArrayList<>();
        TextRankKeyword textRankKeyword = new TextRankKeyword();
        Map<String,Float> wordWithRank;
        //遍历获取每个文件的内容
        for (int i = 0; i < fileName.size(); i++) {
            fileContent[i] = txtToString("data\\SegmentData\\MyData\\cluster\\Neighborhood\\"+fileName.get(i));
        }
        //获取每个文件内容的关键词
        for (int i = 0; i < fileName.size(); i++) {
            //keywordList = HanLP.extractKeyword(fileContent[i], 50);
            wordWithRank = textRankKeyword.getTermAndRank(fileContent[i],50);
            keyWordList.clear();
            keyWordListRank.clear();
            for (Map.Entry<String,Float> entry : wordWithRank.entrySet()) {
                keyWordList.add(entry.getKey());
                keyWordListRank.add(entry.getKey() + "&" +entry.getValue());
            }
            keyWord[i] = "";
            for (int j = 0; j < keyWordList.size(); j++) {
                if(keyWordList.get(j).length() > 1 ){
                    keyWord[i] = keyWord[i] + keyWordListRank.get(j) + " ";
                }
            }
            System.out.println("ketWord[" + i + "]获取完成");
        }
        //获取相似度矩阵
        System.out.println(fileName.size());
        double[][] array = getDisimilarityMatrix("data\\SegmentData\\MyData\\cluster\\Neighborhood\\");
        MDS mds = new MDS(array,2,true);
        double[][] coordinates = mds.getCoordinates();
        //double[][] coordinates = MDSJ.classicalScaling(array);
        BufferedWriter br = new BufferedWriter(new FileWriter("data\\Coordinates\\MyData\\Neighborhood.csv\\"));
        br.write("fileName,x,y,keyWord,fileContent");
        br.newLine();
        for (int i = 0; i < fileName.size(); i++) {
            br.write(fileName.get(i) + "," + coordinates[0][i] + "," + coordinates[1][i] + ","
                    + keyWord[i] + "," + fileContent[i]);
            br.newLine();
            br.flush();
            System.out.println(fileName.get(i)+"坐标已写入...");
        }
        br.close();
    }
}
