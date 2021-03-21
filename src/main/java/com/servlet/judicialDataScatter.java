package com.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.io.*;


public class judicialDataScatter extends javax.servlet.http.HttpServlet {
    protected void doPost(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {

    }

    protected void doGet(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        try {
            String directory = "C:\\Users\\DC Wang\\Desktop\\MyDesign\\";
            String category = request.getParameter("class");
            JSONArray jsonArray = new JSONArray();
            //BufferedReader br = new BufferedReader(new FileReader("C:\\Users\\asus\\Desktop\\MyDesign\\data\\Coordinates\\JudicialData\\" + "人身损害" + ".csv"));
            BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream
                    (directory + "data\\Coordinates\\JudicialData\\" + category + ".csv"), "UTF-8"));
            String strLine;
            String fileName;
            String keyWord;
            String fileContent;
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
            //String a = jsonArray.toString();
            out.println(jsonArray.toJSONString());

        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
