jQuery(document).ready(function () {
  jQuery('#the-change-agree').click(function(){
    if(this.checked){
        jQuery('#the-change-submit').prop('disabled', false);
      }else{
        jQuery('#the-change-submit').prop('disabled', true);
      }
  });
  jQuery("#the-change-submit").click(function () {
    jQuery("#the-change").validate({
      rules: {
        fname: "required",
        lname: "required",
        email: "required",
        research: "required",
        socialmedia: "required",
        design: "required",
        fname: {
          required: true,
        },
        lname: {
          required: true,
        },
        email: {
          required: true,
          email: true,
        },
        research: {
          required: true,
        },
        socialmedia: {
          required: true,
        },
        design: {
          required: true,
        },
      },
      messages: {
        email: {
          required: "Please enter your email",
          minlength: "Please enter a valid email address",
        },
      },
      submitHandler: function (form) {
        jQuery.ajax({
          url: jQuery(form).attr("action"),
          type: "POST",
          data: jQuery(form).serialize(),
          success: function (response) {
            jQuery(".the-change-message").fadeIn(400).text(response);
          },
          error: function (response) {
            if (response.responseText !== "") {
              jQuery(".the-change-message")
                .fadeIn(400)
                .text(response.responseText);
            } else {
              jQuery(".the-change-message")
                .fadeIn(400)
                .text(
                  "Oops! An error occured and your message could not be sent."
                );
            }
          },
        });
      },
    });
  });
  jQuery('#projects-modal').click('#lets-talk-agree', function(){
    if('#lets-talk-agree:checked'){
        jQuery('#lets-talk-submit').prop('disabled', false);
      }else{
        jQuery('#lets-talk-submit').prop('disabled', true);
      }
  });
  jQuery("#projects-modal").click('#lets-talk-submit', function () {
    jQuery("#lets-talk").validate({
      rules: {
        fname: "required",
        lname: "required",
        email: "required",
        collab: "required",
        fname: {
          required: true,
        },
        lname: {
          required: true,
        },
        email: {
          required: true,
          email: true,
        },
        collab: {
          required: true,
        },
      },
      messages: {
        email: {
          required: "Please enter your email",
          minlength: "Please enter a valid email address",
        },
      },
      submitHandler: function (form) {
        jQuery.ajax({
          url: jQuery(form).attr("action"),
          type: "POST",
          data: jQuery(form).serialize(),
          success: function (response) {
            jQuery(".lets-talk-message").fadeIn(400).text(response);
          },
          error: function (response) {
            if (response.responseText !== "") {
              jQuery(".lets-talk-message")
                .fadeIn(400)
                .text(response.responseText);
            } else {
              jQuery(".lets-talk-message")
                .fadeIn(400)
                .text(
                  "Oops! An error occured and your message could not be sent."
                );
            }
          },
        });
      },
    });
  });
});
