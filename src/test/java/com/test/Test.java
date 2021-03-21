package com.test;

import com.hankcs.hanlp.HanLP;
import com.hankcs.hanlp.summary.TextRankKeyword;
import javassist.bytecode.Descriptor;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.*;

import static com.dataprocess.SegmentOut.getFileName;
import static com.dataprocess.SimilarityCalculate.txtToString;

public class Test {
    public static void main(String[] args) throws IOException {
        String content = "程序员(英文Programmer)是从事程序开发、维护的专业人员。一般将程序员分为程序设计人员和程序编码人员，但两者的界限并不非常清楚，特别是在中国。软件从业人员分为初级程序员、高级程序员、系统分析员和项目经理四大类。";
        List<String> keywordList = HanLP.extractKeyword(content, 5);
        System.out.println(keywordList);
        TextRankKeyword textRankKeyword = new TextRankKeyword();
        Map<String,Float> wordWithRank = textRankKeyword.getTermAndRank(content,5);
        List<String> keyWordList = new ArrayList<>();
        String[] keyWordString = new String[30];
        for (Map.Entry<String,Float> entry : wordWithRank.entrySet()) {
            keyWordList.add(entry.getKey() + entry.getValue());
        }
        for (int i = 0; i < keyWordList.size(); i++) {
            keyWordString[i] = keyWordList.get(i);
        }

        System.out.println(keyWordString[1]);
    }
}
