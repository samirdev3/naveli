var project = jQuery("#projects-modal");
var projectModal = jQuery("#projects-modal .modal");
function projectHTML(a) {
  projectModal.load("projects/project-" + a + ".html");
  project.addClass("active");
  jQuery("body").addClass("no-scroll");
}
function formsPop(a) {
  projectModal.load("forms/" + a + ".html");
  project.addClass("active");
  jQuery("body").addClass("no-scroll");
}
function projectClose() {
  projectModal.html("");
  project.removeClass("active");
  jQuery("body").removeClass("no-scroll");
}
