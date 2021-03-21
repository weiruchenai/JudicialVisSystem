package com.dataprocess;

import com.hankcs.hanlp.HanLP;

import java.io.*;
import java.util.List;

import static com.dataprocess.SegmentOut.getFileName;
import static com.dataprocess.SimilarityCalculate.txtToString;

public class GetKeyWord {
    public static void main(String[] args) throws IOException {
        for (int i = 0; i < 50; i++) {
            //String clusterFileContent = getClusterFileContent("data\\SegmentData\\MyData\\Cluster\\" + i +"\\");
            String clusterFileContent = getClusterFileContent("data\\SegmentData\\MyData\\clusterCircular\\"+i+"\\");
            List<String> keywordList = HanLP.extractKeyword(clusterFileContent, 10);
            System.out.println("文件夹"+ i + "的关键词内容为：" +keywordList);
        }
}

    public static String getClusterFileContent(String fileDir) throws IOException {
        StringBuffer clusterFileContent = new StringBuffer();
        List<String> fileName = getFileName(new File(fileDir));
        for (int i = 0; i < fileName.size(); i++) {
            clusterFileContent.append(txtToString(fileDir + fileName.get(i)));
            //System.out.println(fileName.get(i) + "的内容已写入");
        }
        return clusterFileContent.toString();
    }
}
