package com.dataprocess;
import java.io.*;

import jxl.Sheet;
import jxl.Workbook;
import jxl.read.biff.BiffException;

public class ExcelToTxt {
    public static void main(String[] args) throws IOException, BiffException {
        File excelFile = new File("/人民调解数据1.xls");
        //readExcel(excelFile);
        Excel2Txt(excelFile);
    }

    /**
     * 测试读取Excel功能
     * @param: File file，传入文件对象
    */
    private static void readExcel(File file) throws IOException, BiffException {
        FileInputStream is = new FileInputStream(file.getName());
        Workbook wb = Workbook.getWorkbook(is);
        Sheet sheet = wb.getSheet(0);
        //sheet.getRows()返回该页的总行数
        for (int i = 1; i < sheet.getRows(); i++) {
            String cellInfo = sheet.getCell(0, i).getContents();
            System.out.println(cellInfo);
        }
    }

    /**
     * 将Excel文件输出为txt格式
     * @param: 输入的excel文件路径
    */
    private static void Excel2Txt(File file) throws IOException, BiffException {
        FileInputStream fis = new FileInputStream(file.getName());
        Workbook wb = Workbook.getWorkbook(fis);
        Sheet sheet = wb.getSheet(0);
        String cellInfo;
        //sheet.getRows()返回该页的总行数
        int j = 1;
        for (int i = 1; i < sheet.getRows(); i++) {
            cellInfo = sheet.getCell(0, i).getContents(); //获取第0列，第i行的文本内容
            int length = cellInfo.length();
            if(cellInfo.length() > 150){
                FileOutputStream fos = new FileOutputStream("testData/" + j + ".txt");
                fos.write(cellInfo.getBytes());
                System.out.println(j + ".txt已写入");
                j++;
                fos.flush();
                fos.close();
            }
        }
        fis.close();
    }
}
