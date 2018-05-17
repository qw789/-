
var express = require("express");
var cheerio = require('cheerio');
var http = require('http');
var iconv = require('iconv-lite');
var fs = require('fs');
var numm=0
var j=0





var index = 10; //页面数控制
//var url = 'http://kan.sogou.com/dianying/---new-';
var url="http://dianying.2345.com/list/-------"
var content = []; //用于保存链接
var content1 = []; //用于保存title

var mongoose = require("mongoose"); //加载mongoose



function getTitle(url, i) {

http.get(url + i+".html", function(sres) {
    var chunks = [];
    sres.on('data', function(chunk) {
      chunks.push(chunk);
    });
    sres.on('end', function() {
      var html = iconv.decode(Buffer.concat(chunks), 'gb2312');
      var $ = cheerio.load(html, {decodeEntities: false});
     
      $('.v_picTxt').find('li').each(function (idx, element) {
        var $element = $(element);
if($element.find("a").eq(0).attr('href')!=undefined){
	content.push({
          href:"http:"+$element.find("a").eq(0).attr('href'),
        })
}
        
       
      })  
       console.log("第" + i + "页的内容获取完毕"); 
      if(i >1) { 
        getTitle(url, --index); //递归执行，页数+1
      } else {
      	console.log(content)
      		console.log(content.length)
       getxiangqing(j);
      
      }
    });
});
}


function getxiangqing(i) {

console.log(i)
http.get(content[i].href, function(sres) {
    var chunks = [];
    sres.on('data', function(chunk) {
      chunks.push(chunk);
    });
    sres.on('end', function() {
    	 console.log("正在获取第" + i + "条数据");
      var html = iconv.decode(Buffer.concat(chunks), 'gb2312');
      var $ = cheerio.load(html, {decodeEntities: false});
           var aaa=$(".posterCon").find("img").attr("src")
     
      var zhuyan=[] //主演
      $(".txtList").find("li").eq(0).find("a").each(function(idx,element){
      		var $element = $(element);
        	if($element.text()!=""){
        		zhuyan.push($element.text())
        	}
      })
      var leixing=[] //类型
      $(".txtList").find("li").eq(2).find("a").each(function(idx,element){
      		var $element = $(element);
        	if($element.text()!=""){
        		leixing.push($element.text())
        	}
      })
      
      
      
      var daoyan=[] //导演
      $(".li_4").eq(0).find("a").each(function(idx,element){
      		var $element = $(element);
        	if($element.text()!=""){
        		daoyan.push($element.text())
        	}
      })
      
       var kandian=[] //看点
      $(".txtList").find("li").eq(3).find("a").each(function(idx,element){
      		var $element = $(element);
        	if($element.text()!=""){
        		kandian.push($element.text())
        	}
      })
      
      var bofangyuan=[]
       $(".playSource").find("a").each(function(idx,element){
      		var $element = $(element);

        	bofangyuan.push({
        		wangzhan:$element.text(),
        		href:$element.attr("href")
        	})
      })
      
   		// content1.push(JSON.stringify({
   		// 	lianjie:content[j].href,
   		// 	img:"http:"+aaa,
   		// 	zhuyan:zhuyan.join(","),
   		// 	leixing:leixing.join(","),
   		// 	daoyan:daoyan.join(","),
   		// 	pingfen:$(".txtIntroCon").find("em").eq(0).text(),
   		// 	nianfen:$(".li_4").eq(3).find("em").eq(1).text(),
   		// 	diqu:$(".li_4").eq(4).find("a").eq(0).text(),
   		// 	shichang:$(".li_4").eq(2).find("em").eq(1).text(),
   		// 	jianjie:$(".sAll").text(),
   		// 	bofangyuan:bofangyuan.join(","),   			
   		// }))
   		
   		var blogEntity = new dianying({
		   lianjie:content[j].href,
			   img:"http:"+aaa,
			   biaoti:$(".txtIntroCon").find("h1").eq(0).text(),
   			zhuyan:zhuyan,
   			leixing:leixing,
   			daoyan:daoyan,
   			pingfen:$(".txtIntroCon").find("em").eq(0).text(),
   			nianfen:$(".li_4").eq(3).find("em").eq(1).text(),
   			diqu:$(".li_4").eq(4).find("a").eq(0).text(),
   			shichang:$(".li_4").eq(2).find("em").eq(1).text(),
   			jianjie:$(".sAll").text(),
			   bofangyuan:bofangyuan ,
			   sha:'dianying'
			   
			  
		})
		var timestamp = (new Date()).valueOf();
		var xiugai={
			lianjie:content[j].href,
				img:"http:"+aaa,
				biaoti:$(".txtIntroCon").find("h1").eq(0).text(),
				zhuyan:zhuyan,
				leixing:leixing,
				daoyan:daoyan,
				pingfen:$(".txtIntroCon").find("em").eq(0).text(),
				nianfen:$(".li_4").eq(3).find("em").eq(1).text(),
				diqu:$(".li_4").eq(4).find("a").eq(0).text(),
				shichang:$(".li_4").eq(2).find("em").eq(1).text(),
				jianjie:$(".sAll").text(),
				bofangyuan:bofangyuan ,
				sha:'dianying',
				shijian:timestamp
				
			   
		 }

// dianying.create(blogEntity, function(err, blogEntity){
//     if(err) console.log(err);
//     console.log('保存成功：' + blogEntity);
// });
	  
dianying.update({"biaoti":$(".txtIntroCon").find("h1").eq(0).text(),'sha':"dianying"},xiugai,{upsert : true}, function(err, xiugai){
	    if(err) console.log(err);
	    console.log('保存成功：' + xiugai);
	});

       console.log("第" + i + "条的内容获取完毕"); 
      if(i < content.length-1) { 
        getxiangqing(++i); //递归执行，页数+1
      } else {
      	
     	console.log("总共爬取了"+i+"条数据")
     	 
     	

      
      }
    });
});







}









function main() {
	mongoose.connect("mongodb://localhost:889/nodetest", function (err) {
    if (err) {
        console.log("数据库连接失败")
    } else {
        console.log("数据库连接成功")
        var blogSchema = new mongoose.Schema({
    		lianjie:String,
			img:String,
			biaoti:String,
    		zhuyan:Array,
    		pingfen:String,
    		leixing:Array,
    		daoyan:Array,
   			nianfen:String,
   			diqu:String,
   			shichang:String,
   			jianjie:String,
			bofangyuan:Array,
			sha:String,
			shijian:String
			
			  
    		
})       
 dianying = mongoose.model('dianying', blogSchema);



        
		
		
		setInterval(function(){
			console.log("开始爬取");
			getTitle(url, index);
		},3600000)
		
    }

});
	
	


}

main(); //运行主函数