package com.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.io.*;


public class myFileContent extends javax.servlet.http.HttpServlet {
    protected void doPost(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {

    }

    protected void doGet(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        try {
            String directory = "C:\\Users\\DC Wang\\Desktop\\MyDesign\\";
            String fileName = request.getParameter("name");
            JSONObject content = new JSONObject();
            //BufferedReader br = new BufferedReader(new FileReader("C:\\Users\\asus\\Desktop\\MyDesign\\data\\Coordinates\\MyData\\" + "人身损害1" + ".csv"));
            //BufferedReader br = new BufferedReader(new FileReader("C:\\Users\\asus\\Desktop\\MyDesign\\data\\Coordinates\\MyData\\" + "allCategories" + ".csv"));
            BufferedReader br =  new BufferedReader(new InputStreamReader(new FileInputStream
                    (directory + "data\\OriginalData\\MyData\\" + fileName ), "UTF-8"));
            String strLine;
            String fileContent = "";
            while ((strLine = br.readLine()) != null){
                fileContent = fileContent + strLine + "\n";
            }
            content.put("fileContent",fileContent);
            response.setContentType("application/json;charset=utf-8");
            PrintWriter out = response.getWriter();
            response.setContentType("application/json");
            out.println(content.toJSONString());

        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
