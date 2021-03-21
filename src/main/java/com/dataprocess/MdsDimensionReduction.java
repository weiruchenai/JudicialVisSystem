package com.dataprocess;

import com.hankcs.hanlp.mining.word2vec.DocVectorModel;
import com.hankcs.hanlp.mining.word2vec.WordVectorModel;
import smile.mds.MDS;
//import mdsj.MDSJ;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

import static com.dataprocess.SegmentOut.getFileName;
import static com.dataprocess.SimilarityCalculate.txtToString;

public class MdsDimensionReduction {

    public static void main(String[] args) throws IOException {
        //测试不相似度矩阵生成；具体不相似度矩阵在MDS中的使用见DRCoordinateReduction
        List<String> fileName = getFileName(new File("testData\\MyData"));
        System.out.println("文件个数为："+ fileName.size());
        double[][] array = getDisimilarityMatrix("testData\\MyData\\");
        //System.out.println(Arrays.deepToString(array));
/*        MDS mds = new MDS(array,2,true);
        double[][] coordinates = mds.getCoordinates();
        System.out.println(Arrays.deepToString(coordinates));*/
        String[] fileContent =new String[6000];
        //遍历获取每个文件的内容
        for (int i = 0; i < fileName.size(); i++) {
            fileContent[i] = txtToString("testData\\MyData1\\"+fileName.get(i));
        }
        //double[][] coordinates = MDSJ.classicalScaling(array);
        MDS mds = new MDS(array,2,true);
        double[][] coordinates = mds.getCoordinates();
        BufferedWriter br = new BufferedWriter(new FileWriter("data\\Coordinates\\MyData\\allCategories.csv"));
        br.write("fileName,x,y,fileContent");
        br.newLine();
        for (int i = 0; i < fileName.size(); i++) {
            br.write(fileName.get(i) + "," + coordinates[0][i] + "," + coordinates[1][i] + "," + fileContent[i]);
            br.newLine();
            br.flush();
            System.out.println(i + "..." + fileName.get(i)+"坐标已写入...");
        }
        br.close();
    }

    /**
     * 计算不相似度矩阵，供mds方法的输入
     * @param: fileDir文件夹路径
     * @return: 不相似度的double二维数组的矩阵（对角线为0，且正对称）
    */
    public static double[][] getDisimilarityMatrix(String fileDir) throws IOException {
        String[] fileContent =new String[6000];  //用来存放文件内容
        DocVectorModel docVectorModel = new DocVectorModel(new WordVectorModel("data/test/word2vec.txt")); //加载文档向量模型
        List<String> fileName = getFileName(new File(fileDir));  //获取文件名集合
        System.out.println("文件个数为："+fileName.size());
        double[][] disimilarityMatrix = new double[fileName.size()][fileName.size()]; //定义一个与文件个数N相同的N*N阶矩阵
        double disimilarity = 0;

        //遍历获取每个文件的内容
        for (int i = 0; i < fileName.size(); i++) {
            fileContent[i] = txtToString(fileDir+fileName.get(i));
        }
        for (int i = 0; i < fileName.size(); i++) {
            for (int j = 0; j < fileName.size(); j++) {
                disimilarity = 1 - docVectorModel.similarity(fileContent[i],fileContent[j]);
                if(i == j){
                    disimilarityMatrix[i][j] = 0;
                }else{
                    disimilarityMatrix[i][j] = disimilarity;
                }
            }
            System.out.println(i + "..." + fileName.get(i) +"所在行的相似度已获取");
        }
        return disimilarityMatrix;
    }
}
