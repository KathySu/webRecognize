$(document).ready(function() {

    var currentTabIndex = 1

    //http://jsfiddle.net/8mdX4/1211/
    function getTextNodesIn(node) {
        var textNodes = [];
        if (node.nodeType == 3) {
            textNodes.push(node);
        } else {
            var children = node.childNodes;
            for (var i = 0, len = children.length; i < len; ++i) {
                textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
            }
        }
        return textNodes;
    }
    
    function setSelectionRange(el, start, end) {
        if (document.createRange && window.getSelection) {
            var range = document.createRange();
            range.selectNodeContents(el);
            var textNodes = getTextNodesIn(el);
            var foundStart = false;
            var charCount = 0, endCharCount;
    
            for (var i = 0, textNode; textNode = textNodes[i++]; ) {
                endCharCount = charCount + textNode.length;
                if (!foundStart && start >= charCount && (start < endCharCount || (start == endCharCount && i <= textNodes.length))) {
                    range.setStart(textNode, start - charCount);
                    foundStart = true;
                }
                if (foundStart && end <= endCharCount) {
                    range.setEnd(textNode, end - charCount);
                    break;
                }
                charCount = endCharCount;
            }
    
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (document.selection && document.body.createTextRange) {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(true);
            textRange.moveEnd("character", end);
            textRange.moveStart("character", start);
            textRange.select();
        }
    }
    
    function makeEditableAndHighlight(colour) {
        sel = window.getSelection();
        if (sel.rangeCount && sel.getRangeAt) {
            range = sel.getRangeAt(0);
        }
        document.designMode = "on";
        if (range) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
        // Use HiliteColor since some browsers apply BackColor to the whole block
        if (!document.execCommand("HiliteColor", false, colour)) {
            document.execCommand("BackColor", false, colour);
        }
        document.designMode = "off";
    }
    
    function highlight(colour) {
        var range, sel;
        if (window.getSelection) {
            // IE9 and non-IE
            try {
                if (!document.execCommand("BackColor", false, colour)) {
                    makeEditableAndHighlight(colour);
                }
            } catch (ex) {
                makeEditableAndHighlight(colour)
            }
        } else if (document.selection && document.selection.createRange) {
            // IE <= 8 case
            range = document.selection.createRange();
            range.execCommand("BackColor", false, colour);
        }
    }
    
    function selectAndHighlightRange(id, start, end, color) {
        setSelectionRange(document.getElementById(id), start, end);
        highlight(color);
    }
    

    $('#recognize').click(function() {
        

        reg_text = document.getElementById("reg_text").value;
        

        if (reg_text.length == 0 ) 
        {
            document.getElementById("info").innerHTML = "Please input text you want to process!"
            
            return ;
        }
 
        document.getElementById("info").innerHTML = "Begin to process!"
        $.getJSON($SCRIPT_ROOT + '_recognize', {
            reg_text        :   reg_text
        }, function(data1){
            
            for(var k=0 ;k < data1['result'].length; k++)
            {
                var r = data1['result'][k]['result'].toString() ;
                while(r.search('\n') != -1 )
                {
                    r = r.replace('\n','<br/>');
                }
                document.getElementById("reg_result"+JSON.stringify(k+1)).innerHTML = '<b>'+ data1['result'][k]['description'] +'</b>' +'<br/>'+ reg_text + '<br/>' + r + '<br/>' + '<br/>';
               
                var des = data1['result'][k]['description'];
                var colors = ["red", "yellow", "Aquamarine", "Coral", "HotPink", "LightPink"];
               for (var h in data1['result'][k]['highlight'])
               {
                    // alert(data['result']['highlight'][h].start.toString() )
                    selectAndHighlightRange('reg_result'+JSON.stringify(k+1),
                    parseInt(data1['result'][k]['highlight'][h].start + des.length), 
                    parseInt(data1['result'][k]['highlight'][h].end +des.length),
                    colors[h%colors.length]
                    )
               }
            }

            var errinfo = ""
            for(var k=0 ;k < data1['result'].length; k++)
            {
                errinfo += data1['result'][k]['errorMessage'].toString()
            }

           document.getElementById("info").innerHTML =  errinfo;
           if(errinfo.length <= 3)
           {
                document.getElementById("info").innerHTML = "Finish processing!"
           }
            // document.getElementById("reg_result").innerHTML = data['result']['result'].toString() 
        });


        // num2.val(mainOutput.html());
        // $.getJSON($SCRIPT_ROOT + '/_calculate', {
        //     number1: num1.val(),
        //     operator: op.val(),
        //     number2: num2.val()
        // }, function(data) {
        // if (data.result.toString().length > 13) {
        //     digitError();
        // } else {
        //     mainOutput.html(data.result);
        //     subOutput.html(data.result);
        //     clearData();
        // }
        // });
    });




    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = $(e.target).attr("reg-id") // activated tab
          currentTabIndex = parseInt( target);
      });




//https://blog.csdn.net/dongyuxu342719/article/details/83754352
    //绑定粘贴事件 Ctrl+V
bindPaste();
//绑定粘贴事件
function bindPaste(){
	//定义变量存储获取的图片内容
	var blob;
	//获取body对象
	var body = document.getElementsByTagName("body");
	//定义body标签绑定的粘贴事件处理函数
	var fun=function(e){
		// //获取clipboardData对象
		// var data=e.clipboardData;
		// //获取图片内容
        // blob=data.items[0].getAsFile();
        
        var items = (event.clipboardData  || event.originalEvent.clipboardData).items;
        console.log(JSON.stringify(items)); // will give you the mime types
        // find pasted image among pasted items
        var blob = null;
        for (var i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") === 0) {
            blob = items[i].getAsFile();
            }
        }

        // // load image if there is a pasted image
        // if (blob !== null) {
        //     var reader = new FileReader();
        //     reader.onload = function(event) {
        //     console.log(event.target.result); // data url!
        //     document.getElementById("pastedImage").src = event.target.result;
        //     };
        //     reader.readAsDataURL(blob);
        // }
		//判断是不是图片，最好通过文件类型判断
		var isImg=(blob&&1)||-1;
        var reader=new FileReader();		
        
        //文件读取完成时触发
		reader.onload=function(event){
			//获取base64流
			var base64_str=event.target.result;
			//div中的img标签src属性赋值，可以直接展示图片
			$("#jietuImg").attr("src",base64_str);
			//显示div
            $("#jietuWrap").css("display","block");
            
                
            document.getElementById("info").innerHTML = "Begin to process!"
            $.getJSON($SCRIPT_ROOT + '_recognizeImage', {
                base64_str      :  base64_str.slice(base64_str.search("base64,")+7 ,-1)
                
            }, function(data1){
                for(var k=0 ;k < data1['result'].length; k++)
                {
                    var r = data1['result'][k]['result'].toString() ; 
                    while(r.search('\n') != -1 )
                    {
                        r = r.replace('\n','<br/>');
                    }
                    document.getElementById("reg_result"+JSON.stringify(k+1)).innerHTML = '<b>'+ data1['result'][k]['description'] +'</b>' +'<br/>'+ data1['result'][k]['reg_text'] + '<br/>' + r + '<br/>'+'<br/>';
                   
                    var description = data1['result'][k]['description'] ;  
                    var colors = ["red", "yellow", "Aquamarine", "Coral", "HotPink", "LightPink"];
                   for (var h in data1['result'][k]['highlight'])
                   {
                        // alert(data['result']['highlight'][h].start.toString() )
                        selectAndHighlightRange('reg_result'+JSON.stringify(k+1),
                        parseInt(data1['result'][k]['highlight'][h].start + description.length), 
                        parseInt(data1['result'][k]['highlight'][h].end+ description.length),
                        colors[h%colors.length]
                        )
                   }
                }
    
                var errinfo = ""
                for(var k=0 ;k < data1['result'].length; k++)
                {
                    errinfo += data1['result'][k]['errorMessage'].toString()
                }
    
               document.getElementById("info").innerHTML =  errinfo;
               if(errinfo.length <= 3)
               {
                    document.getElementById("info").innerHTML = "Finish processing!"
               }
            });

		}
		if(isImg>=0){
			//将文件读取为 DataURL
			reader.readAsDataURL(blob);
		}

	}
	//通过body标签绑定粘贴事件，注意有些标签绑定粘贴事件可能出错
	body[0].removeEventListener('paste',fun);
	body[0].addEventListener('paste',fun);
}


})