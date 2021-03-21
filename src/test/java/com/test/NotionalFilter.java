package com.test;

import com.hankcs.hanlp.HanLP;
import com.hankcs.hanlp.dictionary.stopword.CoreStopWordDictionary;
import com.hankcs.hanlp.dictionary.stopword.Filter;
import com.hankcs.hanlp.seg.Segment;
import com.hankcs.hanlp.seg.common.Term;

import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;

/**
 * 实词分词器，自动移除停用词
 *
 * @author hankcs
 */
public class NotionalFilter {
    /**
     * 预置分词器
     */
    static final Segment SEGMENT = HanLP.newSegment().enablePlaceRecognize(true);

    public static void main(String[] args) {
        List<Term> result = segment("今天是2019年3月3日，我叫王栋超他叫小明她叫小红，我来自浙江绍兴上虞市，目前位于浙江工业大学读书");
        Iterator<Term> it = result.iterator();
        while (it.hasNext()){
            System.out.print(it.next().word+"/");
        }
        System.out.println();

        List<Term> result3 = HanLP.segment("今天是2019年3月3日，我叫王栋超他叫小明她叫小红，我来自浙江绍兴上虞市，目前位于浙江工业大学读书");
        Iterator<Term> it2 = result3.iterator();
        while (it2.hasNext()){
            System.out.print(it2.next().word+"/");
        }
    }

    public static List<Term> segment(String text)
    {
        return segment(text.toCharArray());
    }

    /**
     * 分词
     *
     * @param text 文本
     * @return 分词结果
     */
    public static List<Term> segment(char[] text)
    {
        List<Term> resultList = SEGMENT.seg(text);
        ListIterator<Term> listIterator = resultList.listIterator();
        while (listIterator.hasNext())
        {
            if (!CoreStopWordDictionary.shouldInclude(listIterator.next()))
            {
                listIterator.remove();
            }
        }

        return resultList;
    }

    /**
     * 切分为句子形式
     *
     * @param text
     * @return
     */
    public static List<List<Term>> seg2sentence(String text)
    {
        List<List<Term>> sentenceList = SEGMENT.seg2sentence(text);
        for (List<Term> sentence : sentenceList)
        {
            ListIterator<Term> listIterator = sentence.listIterator();
            while (listIterator.hasNext())
            {
                if (!CoreStopWordDictionary.shouldInclude(listIterator.next()))
                {
                    listIterator.remove();
                }
            }
        }

        return sentenceList;
    }

    /**
     * 切分为句子形式
     *
     * @param text
     * @param filterArrayChain 自定义过滤器链
     * @return
     */
    public static List<List<Term>> seg2sentence(String text, Filter... filterArrayChain)
    {
        List<List<Term>> sentenceList = SEGMENT.seg2sentence(text);
        for (List<Term> sentence : sentenceList)
        {
            ListIterator<Term> listIterator = sentence.listIterator();
            while (listIterator.hasNext())
            {
                if (filterArrayChain != null)
                {
                    Term term = listIterator.next();
                    for (Filter filter : filterArrayChain)
                    {
                        if (!filter.shouldInclude(term))
                        {
                            listIterator.remove();
                            break;
                        }
                    }
                }
            }
        }
        return sentenceList;
    }
}