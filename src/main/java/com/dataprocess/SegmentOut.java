package com.dataprocess;

import com.hankcs.hanlp.seg.common.Term;

import java.io.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import static com.dataprocess.RemoveStopWord.segment;

public class SegmentOut {
    public static void main(String[] args) throws IOException {
        File dir1 = new File("data\\OriginalData\\JudicialData\\TrafficAccident"); //指定文件夹路径
        File dir2 = new File("data\\OriginalData\\MyData");
        File dir3 = new File("testData\\5500-");
        //对裁决数据分词输出
        for (int i = 0; i < getFileName(dir1).size(); i++) {
            getSegmentOut("data\\OriginalData\\JudicialData\\TrafficAccident\\" + getFileName(dir1).get(i),
                         "data\\SegmentData\\JudicialData\\TrafficAccident\\" + getFileName(dir1).get(i));  //调用方法，将分词结果以txt文档批量输出
            System.out.println(i + "....." +getFileName(dir1).get(i));
        }

        //对我的数据分词输出
     /*   for (int i = 0; i < getFileName(dir2).size(); i++) {
            getSegmentOut("data\\OriginalData\\MyData\\" + getFileName(dir2).get(i),
                    "data\\SegmentData\\MyData\\" + getFileName(dir2).get(i));
            System.out.println(getFileName(dir2).get(i));
        }*/

/*        for (int i = 0; i < getFileName(dir3).size(); i++) {
            getSegmentOut("testData\\5500-\\" + getFileName(dir3).get(i),
                    "testData\\MyData1\\" + getFileName(dir3).get(i));  //调用方法，将分词结果以txt文档批量输出
            System.out.println((i+1) + "....." + getFileName(dir3).get(i));
        }*/
    }

    /**
     * 获取文件夹内所有.txt结尾的文件名
     * @param: File，即文件夹路径
     * @return: 存储文件名的List集合
    */

    public static List<String> getFileName(File dir){
        List<String> fileName = new ArrayList<>();
        File[] subFile = dir.listFiles();
        for (File subfile: subFile) {
            /*if(subfile.isDirectory()){
                getFileName(subfile);           //若是文件夹路径，则递归调用自身
            }else*/ if(subfile.isFile() && subfile.getName().endsWith(".txt")){
                fileName.add(subfile.getName());
            }
        }
        return fileName;
    }

    /**
     * 指定分词后输出的文件名
     * @param:  filename,即为原文件名的List集合
     * @return: 存储文件名的List集合
    */
    private static List<String> newFileName(List<String> filename){
        List<String> newFileName = new ArrayList<>();
        for (int i = 0; i < filename.size(); i++) {
            newFileName.add(i + ".txt");                                                //指定分词结果输出文件名
        }
        return newFileName;
    }

    /**
     * 对分词结果以txt文档格式输出
     * @param: 原文件存储路径
     * @param: 新文件存储路径
    */
    private static void getSegmentOut(String originalFile , String segmentFile) throws IOException {
        BufferedReader br = new BufferedReader(new FileReader(originalFile));
        BufferedWriter bw = new BufferedWriter(new FileWriter(segmentFile));
        String strLine;
        while(br.ready()){
            strLine = br.readLine();
            String strLine2=strLine.replace(" ","");        //去除空格
            String strLine3=strLine2.replaceAll("\\pP",""); //去除标点和制表符
            List<Term> termList = segment(strLine3);
            //ArrayList<Term> termArrayList = (ArrayList<Term>)termList;
            Iterator<Term> iterator = termList.iterator();
            while (iterator.hasNext()){
                bw.write(iterator.next().word+" ");                        //循环写入每个分词结果的词语，以斜杠为间隔
            }
            /*for (int j = 0; j < termList.size(); j++) {
                bw.write(termList.get(j).word+"/");                             //上面已用迭代器替代for循环
            }*/
            bw.newLine();   //输出文件换行
        }
        bw.flush();
        bw.close();
        br.close();
        br.close();
    }
}
