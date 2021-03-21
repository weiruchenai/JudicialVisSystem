package com.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.io.*;



public class getSimilarityMatch extends javax.servlet.http.HttpServlet {
    protected void doPost(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {

    }

    protected void doGet(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        try {
            String directory = "C:\\Users\\DC Wang\\Desktop\\MyDesign\\";
            JSONArray array = new JSONArray();
            String fileName = request.getParameter("name");
            String category = request.getParameter("category");
            int size = Integer.parseInt(request.getParameter("size")); //将获取到的String类型的size转为int类型
            BufferedReader br =  new BufferedReader(new InputStreamReader(new FileInputStream
                    (directory+ "data\\Similarity\\" + category + "\\" + fileName +"_.csv"),
                    "UTF-8"));
            br.readLine();//第一行为列表名，不读取
            String strLine;
            String filename;
            float similarity;
            int index = 0;
            while ((index < size)&&(strLine = br.readLine()) != null){
                String[] temp = strLine.split(",");
                filename = temp[0];
                similarity = Float.parseFloat(temp[1]);
                JSONObject object = new JSONObject();
                object.put("fileName",filename);
                object.put("similarity",similarity);
                array.add(object);
                index++;
            }
            response.setContentType("application/json;charset=utf-8");
            PrintWriter out = response.getWriter();
            response.setContentType("application/json");
            out.println(array.toJSONString());

        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
