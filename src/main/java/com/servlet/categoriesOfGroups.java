package com.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.io.*;


public class categoriesOfGroups extends javax.servlet.http.HttpServlet {
    protected void doPost(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {

    }

    protected void doGet(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        try {
            String directory = "C:\\Users\\DC Wang\\Desktop\\MyDesign\\";
            JSONArray jsonArray = new JSONArray();
            BufferedReader br =  new BufferedReader(new InputStreamReader(new FileInputStream
                    (directory + "\\data\\categoriesByGroups.csv"), "UTF-8"));
            
            String strLine;
            String category;
            String number;
            br.readLine();//第一行为列表名，不在下面写入
           while ((strLine = br.readLine()) != null){
                String[] temp = strLine.split(",");
                category = temp[0];
                number = temp[1];
                JSONObject point = new JSONObject();
                point.put("category",category);
                point.put("number",number);
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
