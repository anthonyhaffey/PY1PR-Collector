//detect if this is local or github or ocollector.org
dev_obj = {
  context : "",
  version : "kitten", //this needs to be updated when moving to cat, but perhaps can just be hardcoded
  published_links : []
}
function detect_context(){
  if(document.URL.indexOf("localhost") !== -1){
    return "localhost";
  } else if(document.URL.indexOf("github.io") !== -1) { //assume it's github
    return "github";
  } else if(document.URL.indexOf("gitpod.io") !== -1){
    return "gitpod"
  } else {
    return "server";
  }
}
function detect_version(){
  if(document.URL.indexOf("/kitten/") !== -1){
    return "kitten";
  }
}
function initiate_collector(){
  dev_obj.context = detect_context();
  switch(dev_obj.context){
    case "server":
      console.dir("hi");
      $.post("code/initiateCollector.php",{
				//nothing to post, just want to run it.
      },function(local_key){				
				$("#login_div").show();
        if(local_key !== "no-key"){
          window.localStorage.setItem("local_key",local_key);
        }
      });
      break;
    case "github":
    case "gitpod":
      $("#logged_in").show();
      break;
    case "localhost":
      var user_email = window.localStorage.getItem("user_email");
      if(user_email == null){
        $("#login_div").show();
      } else {
        $("#logged_in").show();
      }
      break;
  }
}
initiate_collector();