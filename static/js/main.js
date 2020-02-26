$(document).ready(function() {


    // var reg_text = $('#reg_text');
    // var reg_expression = $('#reg_expression');

    





    $('#recognize').click(function() {
        document.getElementById("info").innerHTML = "Begin to process!"
        reg_expression = document.getElementById("reg_expression").value
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
 

        document.getElementById("info").innerHTML = "Finish to process!"
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