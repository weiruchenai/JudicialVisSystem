package com.dataprocess;

import com.hankcs.hanlp.mining.word2vec.DocVectorModel;
import com.hankcs.hanlp.mining.word2vec.Vector;
import com.hankcs.hanlp.mining.word2vec.WordVectorModel;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.*;

import static com.dataprocess.SegmentOut.getFileName;
import static com.dataprocess.SimilarityCalculate.txtToString;

public class Doc2Vec {
    public static void main(String[] args) throws IOException {
        DocVectorModel docVectorModel = new DocVectorModel(new WordVectorModel("data/test/word2vec.txt"));
        //测试打印200维向量数组内容
        String s = "我在浙江工业大学读书";
        docVectorModel.addDocument(1,s);
        Vector txt1 = docVectorModel.vector(1);
        float[] txt1Vector = txt1.getElementArray();
        for (float txt1Vec: txt1Vector) {
            System.out.print(txt1Vec + " ");
        }

        //将向量输出到doc2vecJD.txt,内部保存着裁决数据每个文档的文档向量
        doc2vec();
    }

    /**
     * 获取响应文档内容的200维向量数组
     * @param: String 文件名 和对应的id(id的设置方便下面的遍历)
     * @return: float[] 文档内容对应的200维向量数组
     */
    public  static float[] getDocElementArray(String fileName, int i) throws IOException {
        DocVectorModel docVectorModel = new DocVectorModel(new WordVectorModel("data/test/word2vec.txt"));
        String fileContent = txtToString("data\\SegmentData\\JudicialData\\"+ fileName);
        docVectorModel.addDocument(i,fileContent);
        Vector txt_i = docVectorModel.vector(i);
        return txt_i.getElementArray();
    }

    /**
     * 将获取到的所有向量数组与文件名写入doc2vecJD.txt文件
     * @param:
     * @return:
    */
    public static void doc2vec() throws IOException {
        List<String> fileName = getFileName(new File("data\\SegmentData\\JudicialData"));
        BufferedWriter bw = new BufferedWriter(new FileWriter("data/test/doc2vecJD.txt"));
        for (int i = 0; i < fileName.size(); i++) {
            //map.put(i,fileName.get(i));
            bw.write(fileName.get(i)+" ");
            float[] docVecArray = getDocElementArray(fileName.get(i),i);
            System.out.print("正在导出" + fileName.get(i) + "的向量---------");
            for (int j = 0; j < docVecArray.length; j++) {
                bw.write(docVecArray[j]+" ");
            }
            bw.newLine();
            System.out.println(fileName.get(i) + "的向量已导出");
            bw.flush();
        }
        bw.close();
    }
}
