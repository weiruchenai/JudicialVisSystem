package com.dataprocess;

import com.hankcs.hanlp.mining.word2vec.DocVectorModel;
import com.hankcs.hanlp.mining.word2vec.WordVectorModel;

import java.io.*;
import java.util.*;

import static com.dataprocess.SegmentOut.getFileName;

public class SimilarityCalculate {
    public static void main(String[] args) throws IOException {
        //DocVectorModel docVectorModel = new DocVectorModel(new WordVectorModel("data/msr_vectors.txt")); //加载文档向量模型
        TreeMap<Float,String> dataMap = getSimilarity("109.txt","PersonalInjury",15);
        for (Map.Entry<Float, String> entry : dataMap.entrySet()) {
            System.out.println( "文件名 : " + entry.getValue() + ", 相似度 : " + entry.getKey()); //遍历Map，查看与每个文档的相似度
        }
    }

    /**
     * 将txt文本文档转为String格式
     * @param: .txt文件名
     * @return: String字符串
    */
    public static String txtToString(String filename) throws IOException {
        StringBuffer str = new StringBuffer();
        BufferedReader br = new BufferedReader(new FileReader(filename));
        while (br.ready()){
            str.append(br.readLine());
        }
        br.close();
        return str.toString();
    }

    /**
     * 获取每个文档的相似度，与文档名一起存放在Map中，并实现TreeMap根据相似度降序排列
     * @param: myFileName 现有数据文件名，size 需要搜索的最大相似度匹配的文档个数
     * @return: TreeMap<Float 该文档与现有数据的相似度,String 文档名>
     */
    public static TreeMap<Float, String> getSimilarity(String myFileName , String category,int size) throws IOException {
        DocVectorModel docVectorModel = new DocVectorModel(new WordVectorModel("C:\\Users/asus\\Desktop\\MyDesign\\data\\test\\word2vec.txt")); //加载文档向量模型
        File fileDir = new File("C:\\Users\\asus\\Desktop\\MyDesign\\data\\SegmentData\\JudicialData\\" + category);

        //比较器排序，实现相似度值的降序排列
        TreeMap<Float, String> dataMap = new TreeMap<>(new Comparator<>() {
            @Override
            public int compare(Float o1, Float o2) {
                float temp = o2 - o1;
                if(temp == 0) {return 0;}
                else if(temp > 0 ) {return 1;}
                else {return -1;}
            }
        });

        String myFileContent = txtToString("C:\\Users\\asus\\Desktop\\MyDesign\\data\\SegmentData\\MyData\\cluster\\" + category + "\\" + myFileName); //获取我的待查询文档内容
        List<String> fileName = getFileName(fileDir);          //获取所有文书文件名
        List<String> judicialFileContent = new ArrayList<>();
        Iterator<String> iterator = fileName.iterator();
        while(iterator.hasNext()){
            judicialFileContent.add(txtToString("C:\\Users\\asus\\Desktop\\MyDesign\\data\\SegmentData\\JudicialData\\" + category + "\\" +iterator.next())); //遍历文书文件名列表，获取每个文书的文件内容
        }
        for (int i = 0; i < judicialFileContent.size(); i++) {
            dataMap.put(docVectorModel.similarity(myFileContent, judicialFileContent.get(i)), fileName.get(i)); //将相似度与文件名存储在map中
        }
        return deleteElementary(dataMap, size);
    }

    /**
     * 删除Map中除了前size个之外的键值对
     * @param: TreeMap<Float，String>, size
     * @return: TreeMap<Float,String>
    */
    public static TreeMap<Float, String> deleteElementary(TreeMap<Float,String> dataMap, int size){
        Iterator<Float> iterator = dataMap.keySet().iterator();
        int i = 0;
        while (iterator.hasNext()){
            i++;
            Float key = iterator.next();
            if(i > size){ iterator.remove();}
        }
        return  dataMap;
    }
}


