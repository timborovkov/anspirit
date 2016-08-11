$(document).ready(function(){
  //Setup audio recording ----------->
    var Recognition = new webkitSpeechRecognition();
    Recognition.interimResults = true;
    Recognition.lang = "en-GB";

    var onrslt;

    var listening = false;
    var speech = {
      start: function(){
        //Change button image
        $('.speechBtn').attr('src', 'http://hulk-games.com/themes/happywheels_v2//resources/img/loading.gif');

        listening = true;
        Recognition.start();
      },
      stop: function(){
        //Change button image
        $('.speechBtn').attr('src', 'http://www.haapie.com/images/icons/audio_processing_icon.png');
        //Clear listener
        Recognition = new webkitSpeechRecognition();
        Recognition.interimResults = true;
        Recognition.lang = "en-GB";
        //New onresult
        speech.onresult(onrslt);

        listening = false;
      },
      onresult: function(callback){
        onrslt = callback;
        Recognition.onresult = function(event) {
          if(listening){
            callback(event.results[0].isFinal, event.results[0][0].transcript);
          }else{

          }
        }
      }
    };

  //Speech input processing --------->
    speech.onresult(function(final, speech){
      if(final){
        //Final value
        //Stop listening
        speech.stop();
        //Show speech on label
        $('.speechLabel').html(speech);
        //Process on server
        $.ajax({
          url: app.server,
          type: 'get',
          dataType: 'json',
          data: {
            "lang": "en",
            "speech": speech,
            "uid": firebase.auth().currentUser.uid,
            "uname": getCookie('firstname'),
            "client": "desktop"
          },
          success: function(data){
            console.log(data);
            //Get JSON
            data = JSON.parse(data);
            //Execute necessary code
            (function(){
              eval(data.codeToRun);
            })();
            //Say speech anwser
            amy.say(data.speechanwser, function(er){
              if(er != null){
                console.error(er);
              }else{
                //Done talking
              }
            });
          },
          error: function(a, er){
            console.error(er);
          }
        });

      }else{
        // Not final value
        $('.speechLabel').html(speech+"...");
      }
    });


  //Process inputs ------------------>
    $('.speechBtn').click(function(){
      // Speek button pressed
      if(listening){
        //stop listening
        speech.stop();
        //Update label
        $('.speechLabel').html("Say hello Amy!");
      }else{
        //start listening
        speech.start();
        //Update label
        $('.speechLabel').html("Speak...");
      }
    });
    $('.speechInput').change(function(){
      var text = $('.speechIndex').val();
      $('.speechIndex').val("");
    });
});
