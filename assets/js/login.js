$(document).ready(function(){

    class signup{
        constructor(element){
            this.signupData(element);
        }
        
        signupData(element){
            $(element).submit((e)=>{
                e.preventDefault();
                $.ajax({
                    type:'post',
                    url : $(element).attr("action"),
                    data :element.serialize(),
                    success:(result)=>{
                    },
                    error: (error)=>{
                        console.log(error.responseText);
                        $('#output').html(error.responseText);
                    }
                })

            })
        }
    }


    $(".registr-link").click((e)=>{
        e.preventDefault();
        $(".wraper").addClass("active");
    })
    $(".login-link").click((e)=>{
        e.preventDefault();
        $(".wraper").removeClass("active");
    })
    $("#forget").click((e)=>{
        e.preventDefault();
        $(".wraper").addClass("forgetactive");
    })
    $(".forget-login-link").click((e)=>{
        e.preventDefault();
        $(".wraper").removeClass("forgetactive");
    })
})



