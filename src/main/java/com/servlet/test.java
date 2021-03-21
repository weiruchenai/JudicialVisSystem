package com.servlet;

import com.alibaba.fastjson.JSONObject;

import java.io.IOException;
import java.io.PrintWriter;


public class test extends javax.servlet.http.HttpServlet {
    protected void doPost(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {

    }

    protected void doGet(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        String name = request.getParameter("name");
        String age = request.getParameter("age");
        JSONObject a = new JSONObject();
        a.put("name",name);
        a.put("age",age);
        PrintWriter out = response.getWriter();
        response.setContentType("application/json");
        out.println(a.toJSONString());
    }

    /*@Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("123");
    }

    @Override
    public void destroy() {
        System.out.println("destroy...");
    }*/
}
