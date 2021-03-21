package com.test;

import com.hankcs.hanlp.mining.word2vec.DocVectorModel;
import com.hankcs.hanlp.mining.word2vec.WordVectorModel;
import smile.mds.MDS;

import java.io.IOException;
import java.util.Arrays;

import static com.dataprocess.SimilarityCalculate.txtToString;

public class MdsTest {
    public static void main(String[] args) throws IOException {
        double[][] array = {
                {0,0.9,0.8},
                {0.9,0,0.0195},
                {0.8,0.0195,0}};
        MDS mds = new MDS(array,2,true);
        System.out.println(Arrays.deepToString(mds.getCoordinates()));

        //用三个文件测试，file1与file2内容较相似，12与file3较不相似
      /*  DocVectorModel docVectorModel = new DocVectorModel(new WordVectorModel("data/test/word2vec.txt")); //加载文档向量模型
        String file1 = txtToString("data\\SegmentData\\JudicialData\\" + "李玉明、李蔓娜等与山西省长治市中医医院医疗损害责任纠纷申诉、....txt");
        String file2 = txtToString("data\\SegmentData\\JudicialData\\" + "巴哈尔与新疆皮山县医院医疗损害赔偿纠纷一案再审判决.txt");
        String file3 = txtToString("data\\SegmentData\\JudicialData\\" + "丹东嘉财恒润房地产开发有限公司建设工程施工合同纠纷再审审查与....txt");
        System.out.println(file1);
        System.out.println(file2);
        System.out.println(file3);
        double disimilarity1 = 1 - docVectorModel.similarity(file1,file2);
        double disimilarity2 = 1 - docVectorModel.similarity(file1,file3);
        double disimilarity3 = 1 - docVectorModel.similarity(file2,file3);
        System.out.println(disimilarity1);
        System.out.println(disimilarity2);
        System.out.println(disimilarity3);
        double[][] disimilarity = {{0,disimilarity1,disimilarity2},{disimilarity1,0,disimilarity3},{disimilarity2,disimilarity3,0}};
        MDS mds = new MDS(disimilarity,2,true);
        System.out.println(Arrays.deepToString(mds.getCoordinates()));*/
    }
}
