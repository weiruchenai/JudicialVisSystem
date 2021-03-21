package com.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import jxl.Sheet;
import jxl.Workbook;
import jxl.read.biff.BiffException;

import java.io.*;


public class myDataScatter extends javax.servlet.http.HttpServlet {
    protected void doPost(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {

    }

    protected void doGet(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        try {
            String directory = "C:\\Users\\DC Wang\\Desktop\\MyDesign\\";
            String category = request.getParameter("class");
            JSONArray jsonArray = new JSONArray();
            //BufferedReader br = new BufferedReader(new FileReader("C:\\Users\\asus\\Desktop\\MyDesign\\data\\Coordinates\\MyData\\" + "人身损害1" + ".csv"));
            //BufferedReader br = new BufferedReader(new FileReader("C:\\Users\\asus\\Desktop\\MyDesign\\data\\Coordinates\\MyData\\" + "allCategories" + ".csv"));
            BufferedReader br =  new BufferedReader(new InputStreamReader(new FileInputStream
                    (directory + "data\\Coordinates\\MyData\\" + category + ".csv"), "UTF-8"));
            String strLine;
            String fileName;
            String fileContent;
            String keyWord;
            double x,y;//下面用来存放x,y的坐标值
            br.readLine();//第一行为列表名，不在下面写入
            while ((strLine = br.readLine()) != null){
                String[] temp = strLine.split(",");
                fileName = temp[0];
                x = Double.valueOf(temp[1]);
                y = Double.valueOf(temp[2]);
                keyWord = temp[3];
                fileContent = temp[4];
                JSONObject point = new JSONObject();
                point.put("fileName",fileName);
                point.put("x",x);
                point.put("y",y);
                point.put("keyWord",keyWord);
                point.put("fileContent",fileContent);
                jsonArray.add(point);
            }
            response.setContentType("application/json;charset=utf-8");
            PrintWriter out = response.getWriter();
            response.setContentType("application/json");
            out.println(jsonArray.toJSONString());

        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
