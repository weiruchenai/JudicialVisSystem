package com.test;

import com.hankcs.hanlp.mining.word2vec.DocVectorModel;
import com.hankcs.hanlp.mining.word2vec.Vector;
import com.hankcs.hanlp.mining.word2vec.Word2VecTrainer;
import com.hankcs.hanlp.mining.word2vec.WordVectorModel;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public class Word2VecTest {
    public static void main(String[] args) throws IOException {
        /**
         * 执行训练
         * @param trainFileName     输入语料文件
         * @param modelFileName     输出模型路径
         * @return 词向量模型
         */
        /*Word2VecTrainer trainerBuilder = new Word2VecTrainer();
        WordVectorModel wordVectorModel = trainerBuilder.train("data/搜狗文本分类语料库已分词.txt", "data/msr_vectors.txt");
        wordVectorModel.nearest("中国");*/


        //加载词向量模型，通过词向量模型的训练结果打印与“中国”语义最相近的5个词
        WordVectorModel wordVectorModel = new WordVectorModel("data/msr_vectors.txt");
        Vector China = wordVectorModel.vector("中国");
        System.out.println(wordVectorModel.nearest("中国",5));

        //通过词向量模型，打印不同词语之间的相似度
        System.out.println(wordVectorModel.similarity("浙江","江苏"));
        System.out.println(wordVectorModel.similarity("土豆","马铃薯"));

        //加载文档向量模型，通过文档向量模型计算句子之间的相似度
        DocVectorModel docVectorModel = new DocVectorModel(new WordVectorModel("data/msr_vectors.txt"));
        System.out.println(docVectorModel.similarity("他的家在浙江绍兴","他来自浙江杭州"));
        System.out.println(docVectorModel.similarity("他的家在浙江绍兴","我爱编程，编程爱我"));

        String[] documents = new String[]{
                "山东苹果丰收",
                "农民在江苏种水稻",
                "奥运会女排夺冠",
                "世界锦标赛胜出",
                "中国足球失败",
        };

        for (int i = 0; i < documents.length; i++)
        {
            docVectorModel.addDocument(i, documents[i]);
        }
        System.out.println("============体育=============");
        List<Map.Entry<Integer, Float>> entryList = docVectorModel.nearest("体育");
        for (Map.Entry<Integer, Float> entry : entryList)
        {
            System.out.printf("%d %s %.2f\n", entry.getKey(), documents[entry.getKey()], entry.getValue());
        }

        System.out.println("============农业=============");
        entryList = docVectorModel.nearest("农业");
        for (Map.Entry<Integer, Float> entry : entryList)
        {
            System.out.printf("%d %s %.2f\n", entry.getKey(), documents[entry.getKey()], entry.getValue());
        }

    }

}
