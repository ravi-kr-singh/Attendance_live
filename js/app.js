const webcamElement = document.getElementById('webcam');

const canvasElement = document.getElementById('canvas');

const snapSoundElement = document.getElementById('snapSound');

const webcam = new Webcam(webcamElement, 'user', canvasElement, snapSoundElement);



$("#webcam-switch").change(function () {
    if(this.checked){
        $('.md-modal').addClass('md-show');
        webcam.start()
            .then(result =>{
               cameraStarted();
               console.log("webcam started");
            })
            .catch(err => {
                displayError();
            });
    }
    else {        
        cameraStopped();
        webcam.stop();
        console.log("webcam stopped");
    }        
});

$('#cameraFlip').click(function() {
    webcam.flip();
    webcam.start();  
});

$('#closeError').click(function() {
    $("#webcam-switch").prop('checked', false).change();
});

function displayError(err = ''){
    if(err!=''){
        $("#errorMsg").html(err);
    }
    $("#errorMsg").removeClass("d-none");
}

function cameraStarted(){
    $("#errorMsg").addClass("d-none");
    $('.flash').hide();
    $("#webcam-caption").html("on");
    $("#webcam-control").removeClass("webcam-off");
    $("#webcam-control").addClass("webcam-on");
    $(".webcam-container").removeClass("d-none");
    if( webcam.webcamList.length > 1){
        $("#cameraFlip").removeClass('d-none');
    }
    $("#wpfront-scroll-top-container").addClass("d-none");
    window.scrollTo(0, 0); 
    $('body').css('overflow-y','hidden');
}

function cameraStopped(){
    $("#errorMsg").addClass("d-none");
    $("#wpfront-scroll-top-container").removeClass("d-none");
    $("#webcam-control").removeClass("webcam-on");
    $("#webcam-control").addClass("webcam-off");
    $("#cameraFlip").addClass('d-none');
    $(".webcam-container").addClass("d-none");
    $("#webcam-caption").html("Click to Start Camera");
    $('.md-modal').removeClass('md-show');
}

let picture;
$("#take-photo").click(function () {
    beforeTakePhoto();
    picture = webcam.snap();
    //document.querySelector('#download-photo').href = picture;
    afterTakePhoto();
});

function beforeTakePhoto(){
    $('.flash')
        .show() 
        .animate({opacity: 0.3}, 500) 
        .fadeOut(500)
        .css({'opacity': 0.7});
    window.scrollTo(0, 0); 
    $('#webcam-control').addClass('d-none');
    $('#cameraControls').addClass('d-none');
}

function afterTakePhoto(){
    webcam.stop();
    $('#canvas').removeClass('d-none');
    $('#take-photo').addClass('d-none');
    $('#exit-app').removeClass('d-none');
    $('#download-photo').removeClass('d-none');
    $('#resume-camera').removeClass('d-none');
    $('#cameraControls').removeClass('d-none');
}

function removeCapture(){
    $('#canvas').addClass('d-none');
    $('#webcam-control').removeClass('d-none');
    $('#cameraControls').removeClass('d-none');
    $('#take-photo').removeClass('d-none');
    $('#exit-app').addClass('d-none');
    $('#download-photo').addClass('d-none');
    $('#resume-camera').addClass('d-none');
}

$("#resume-camera").click(function () {
    document.getElementById('output').style ="display:none;";
    webcam.stream()
        .then(facingMode =>{
            removeCapture();
        });
});

$("#exit-app").click(function () {
    document.getElementById('output').style ="display:none;";
    removeCapture();
    $("#webcam-switch").prop("checked", false).change();
});


const spinner = document.getElementById("spinner");

function showSpinner() {
    spinner.style ="display:block;"
  
}

function hideSpinner() {
    spinner.style ="display:none;"
   
}




$("#download-photo").click(function(){
    document.getElementById('output').style ="display:none;";
    console.log('button clicked');
    showSpinner();
    

    fetch(picture)
    .then(res => res.blob())
    .then(blob => {
        const file = new File([blob], "capture.png", {
            type: 'image/png'
        });
        var fd = new FormData();
        fd.append("image", file);
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "https://nmnrna.pythonanywhere.com/",
            data: fd,
            processData: false,
            contentType: false,
            cache: false,
            success: (data) => { 
                console.log(`${data}`)
                hideSpinner();
                document.getElementById('output').style ="display:block;margin:auto!important;margin-top: 15px!important;";
                document.getElementById('output').textContent = `Response : ${data}`;
            },
            error: function(xhr, status, error) {
                hideSpinner();
                document.getElementById('output').style ="display:block;margin:auto!important;margin-top: 15px!important;";
                document.getElementById('output').textContent = `${error.message}`;
            }
        });
    });


})




