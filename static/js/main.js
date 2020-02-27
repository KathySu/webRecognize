$(document).ready(function() {


    // var reg_text = $('#reg_text');
    // var reg_expression = $('#reg_expression');

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
    
    function selectAndHighlightRange(id, start, end) {
        setSelectionRange(document.getElementById(id), start+1, end+1);
        highlight("yellow");
    }
    





    $('#recognize').click(function() {
        document.getElementById("info").innerHTML = "Begin to process!"
        reg_expression = document.getElementById("reg_expression1").value
        reg_text = document.getElementById("reg_text").value;
        

        if (reg_expression.length == 0 ) 
        {
            document.getElementById("info").innerHTML = "Please input regular expression!"
            return ;
        }

        if (reg_text.length == 0 ) 
        {
            document.getElementById("info").innerHTML = "Please input text you want to process!"
            
            return ;
        }
 
         
        $.getJSON($SCRIPT_ROOT + '_recognize', {
            reg_expression  :   reg_expression,
            reg_text        :   reg_text
        }, function(data){

            var r = data['result']['result'].toString() ;
            while(r.search('\n') != -1 )
            {
                r = r.replace('\n','<br/>');
            }
            document.getElementById("reg_result").innerHTML = reg_text + '<br/>' + r;

           for (var h in data['result']['highlight'])
           {
            // alert(data['result']['highlight'][h].start.toString() )
            selectAndHighlightRange('reg_result',
            parseInt(data['result']['highlight'][h].start), 
            parseInt(data['result']['highlight'][h].end)
            )
           }


           document.getElementById("info").innerHTML = "Finish to process!"
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


})