package com.dataprocess;

import com.hankcs.hanlp.mining.cluster.ClusterAnalyzer;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import static com.dataprocess.SegmentOut.getFileName;
import static com.dataprocess.SimilarityCalculate.txtToString;

public class TextClustering {
    public static void main(String[] args) throws IOException {
        String fileDir = "data\\SegmentData\\MyData\\";
        List<Set<String>> clusterResults = getClusterResults(fileDir);
        System.out.println(clusterResults.size());

        clusterOut(clusterResults);//该方法只能运行一次，第二次运行簇的顺序不一样，会再写入一遍而重复

/*        ClusterAnalyzer<String> analyzer = new ClusterAnalyzer<>();
        List<String> fileName = getFileName(new File(fileDir));
        for (int i = 1; i < 1000; i++) {
            String myFileContent = txtToString(fileDir + fileName.get(i));
            analyzer.addDocument(fileName.get(i),myFileContent);
        }
        System.out.println(analyzer.repeatedBisection(5.0).size());*/
    }

    /**
     * 读取对应文件夹的内容返回文本聚类结果
     * @param: 要聚类的存放文件的路径
     * @return: 聚类的结果
    */
    public static List<Set<String>> getClusterResults(String fileDir) throws IOException {
        ClusterAnalyzer<String> analyzer = new ClusterAnalyzer<>();
        List<String> fileName = getFileName(new File(fileDir));
        for (int i = 1; i < fileName.size(); i++) {
            String myFileContent = txtToString(fileDir + fileName.get(i));
            analyzer.addDocument(fileName.get(i),myFileContent);
        }
        //指定簇个数，返回一个list，内部元素为set，每个set表示一个簇（存放着该簇内部的文件id（文件名））
        //return analyzer.repeatedBisection(15.0);
        return analyzer.kmeans(50);
    }

    /**
     * 对聚类结果中不同簇的文件分类到不同的文件夹中去
     * @param: List<Set<String>> clusterResults 聚类结果的集合
    */
    public static void clusterOut(List<Set<String>> clusterResults) throws IOException {
        for (int i = 0; i < clusterResults.size(); i++) {
            Set<String> clusterI = clusterResults.get(i);
            Iterator<String> iterator = clusterI.iterator();
            while (iterator.hasNext()){
                String file = iterator.next();
                //System.out.println(file);
                String fileContent = txtToString("data\\SegmentData\\MyData\\" + file);
                BufferedWriter br = new BufferedWriter(new FileWriter("data\\SegmentData\\MyData\\clusterCircular\\"+i+"\\"+file));
                br.write(fileContent);
                br.flush();
                br.close();
            }
            System.out.println("第"+ i + "个簇导出完成...");
        }
    }
}
