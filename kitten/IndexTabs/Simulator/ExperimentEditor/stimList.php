<?php
/*  Collector (Garcia, Kornell, Kerr, Blake & Haffey)
    A program for running experiments on the web
    Copyright 2012-2016 Mikey Garcia & Nate Kornell


    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License version 3 as published by
    the Free Software Foundation.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
 		
		Kitten release (2019) author: Dr. Anthony Haffey (a.haffey@reading.ac.uk)		
*/

  require_once '../initiateTool.php';
	session_start();    
  
  
?>

<head>
	<link rel="shortcut icon" type="image/x-icon" href="../../../../logos/<?= $_SESSION['version'] ?>.png" />
	<meta charset="utf-8">	
</head>

<style>
.preview_url{
	display:none;
	width:360px;
	margin: 1px;
}
.preview_url:hover{
	cursor:pointer;	
}
#preview_text{
	width: 380px;
	height: 700px;
}
#preview_image{
	max-width:380px;
	max-height:380px;
}
#authed-section{
	position:relative;
	width:800px;
	height:800px;
	padding:10px;
}
#dbx_buttons{
	top: 10px;
	right: 10px;
	position: absolute;	
}
#dbx_buttons td{
	padding:1px;
}
#preview_span{
	top:40px;
	left:410px;
	width:380px;
	max-width:380px;
	position:absolute;
}
#stim_list_span{
	position:absolute;
	top:40px;	
	height:700px;
	width:380px;
	max-height:700px;
	max-width:380px;
	display: block;
	overflow: auto;
}
#preview_img{
	max-width:600px;
	max-height:600px;
}


</style>

  <link rel="stylesheet" href="../../../../libraries/bootstrapCollector.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js"></script>


<script src="../../../../libraries/dropbox.2.5.13.min.js"></script>
<script type="text/javascript" src="../../../../libraries/dropbox.dropins.js" id="dropboxjs" data-app-key="6xumb4iloq9sz1u"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/4.6.1/papaparse.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.min.js"></script>

<!--
<script
  src="https://code.jquery.com/jquery-3.2.1.min.js"
  integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
  crossorigin="anonymous"></script>
<script src="https://unpkg.com/dropbox/dist/Dropbox-sdk.min.js"></script>
<script type="text/javascript" src="https://www.dropbox.com/static/api/2/dropins.js" id="dropboxjs" data-app-key="6xumb4iloq9sz1u"></script>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

-->
<span id="progress_span"></span>

<div class="row">
	<div class="col-3">
		<button id="select_all_btn" type="button" class="btn btn-primary">All</button>
		<button id="select_none_btn" type="button" class="btn btn-secondary">None</button>
	</div>
	<div class="col-6">
		<div class="input-group mb-3">
			<div class="input-group-prepend">
				<span class="input-group-text" id="basic-addon1">Filter</span>
			</div>
			<input id="filter_input" type="text" class="form-control" placeholder="filter" aria-label="Username" aria-describedby="basic-addon1">
			<button id="apply_filter_btn" type="button" class="btn btn-primary">Apply</button>
		</div>
	</div>
	<div class="col-3">
		<button id="spreadsheet_btn" type="button" class="btn btn-primary">Spreadsheet</button>
	</div>
</div>
<div class="row">
    <div class="col-4" >
		<select class="custom-select" size = "20" id="folders_select" multiple>
			<option selected class='folder_option'>/stimuli</option>
		</select>
    </div>
    <div class="col-4">         
		<select class="custom-select" size="20" id="stimuli_select"></select>                     
    </div>
    <div class="col-4" id="preview_div"></div>
</div>


<div id="pre-auth-section" style="display:none">
	<a href="" id="authlink" class="button">Authenticate Dropbox</a>
</div>
<div id="authed-section" style="display:none">	
	<span id="progress_bar_span"></span>
	
	
	<span>
		<span id="stim_list_dropdown"></span>
		<span id="stim_list_span"></span>
	</span>
	<span id="preview_span"></span>
</div>

<script> // dropbox startup
 
(function(window){
	window.utils = {
		parseQueryString: function(str) {
			var ret = Object.create(null);
			if (typeof str !== 'string') {
				return ret;
			}
			str = str.trim().replace(/^(\?|#|&)/, '');
			if (!str) {
				return ret;
			}
			str.split('&').forEach(function (param) {
			var parts = param.replace(/\+/g, ' ').split('=');
			// Firefox (pre 40) decodes `%3D` to `=`
			// https://github.com/sindresorhus/query-string/pull/37
			var key = parts.shift();
			var val = parts.length > 0 ? parts.join('=') : undefined;

			key = decodeURIComponent(key);

			// missing `=` should be `null`:
			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
			val = val === undefined ? null : decodeURIComponent(val);

			if (ret[key] === undefined) {
			  ret[key] = val;
			} else if (Array.isArray(ret[key])) {
			  ret[key].push(val);
			} else {
			  ret[key] = [ret[key], val];
			}
			});

			return ret;
		}
	};
})(window);

// get dropbox token for user
var CLIENT_ID = '6xumb4iloq9sz1u';
// Parses the url and gets the access token if it is in the urls hash
function getAccessTokenFromUrl() {
 return utils.parseQueryString(window.location.hash).access_token;
}
// If the user was just redirected from authenticating, the urls hash will contain the access token.
function isAuthenticated() {
  return !!getAccessTokenFromUrl();
}

// This example keeps both the authenticate and non-authenticated sections
// in the DOM and uses this function to show/hide the correct section.
function showPageSection(elementId) {
	document.getElementById(elementId).style.display = 'block';
}
if (isAuthenticated()) {	
  showPageSection('authed-section');
  // Create an instance of Dropbox with the access token and use it to
  // fetch and render the files in the users root directory.
  var dbx = new Dropbox({ accessToken: getAccessTokenFromUrl() });  
} else {
  showPageSection('pre-auth-section');  
  // Set the login anchors href using dbx.getAuthenticationUrl()
  
  var dbx = new Dropbox({ clientId: CLIENT_ID });
  var authUrl = dbx.getAuthenticationUrl('../<?= $_SESSION['version'] ?>/IndexTabs/Simulator/ExperimentEditor/stimList.php');
  document.getElementById('authlink').href = authUrl;
  $("#authlink")[0].click();
}
 

</script>	

<script>

file_structure = {
	files	: [],
	folder	: [],
	total_files : 0,
};
 
$("#apply_filter_btn").on("click",function(){
	var filter_value = $("#filter_input").val();
	filter_value = filter_value.split("*");
	
	if($("#filter_input").val() == ""){
		$(".file_option").show();
		file_structure.filtered_files = file_structure.files;
	} else {
		file_structure.filtered_files = file_structure.files.filter(file => file.name.indexOf(filter_value) !== -1);
		
		$(".file_option").hide();		 
		file_structure.filtered_files.forEach(function(file){
			$('#stimuli_select option').filter(function () { return $(this).html() == file.name }).show();
		});		
	}
});

$("#spreadsheet_btn").on("click",function(){
	if(typeof(file_structure.filtered_files) == "undefined"){
		file_structure.filtered_files = file_structure.files;
	}
	bootbox.prompt("You will be downloading a list of the items based on your filter. If you want to download ALL the items, then please clear the filter",function(filename){
		if(filename){
			filename = filename.replace(".csv","");
			filename = filename + ".csv";		
			console.dir(file_structure.filtered_files);
			var data = Papa.unparse(file_structure.filtered_files);		
			var blob = new Blob([data], {type: 'text/csv'});
			if(window.navigator.msSaveOrOpenBlob) {
				window.navigator.msSaveBlob(blob, filename);
			}	else {
				var elem = window.document.createElement('a');
				elem.href = window.URL.createObjectURL(blob);
				elem.download = filename;        
				document.body.appendChild(elem);
				elem.click();        
				document.body.removeChild(elem);
			}
		}
	});
});

function recursive_folder_browsing(folder_path){	
	dbx.filesListFolder({path:folder_path, recursive:false})
		.then(function(returned_data){
            if(returned_data.has_more == true){                           
                bootbox.alert("The folder "+folder_path+" has more than 2000 items in it. Please reduce the number of items in this folder. One way to do this is subfolders for the items in this folder.");
            } else {
								
				new_files   = returned_data.entries.filter(entry => entry[".tag"] == "file");
				new_folders = returned_data.entries.filter(entry => entry[".tag"] == "folder");
                
				file_structure.total_files += new_files.length;
				
				new_files.forEach(function(new_file){
					if(file_structure.files.filter(file => file.name == new_file.name).length == 0){
						dbx.sharingCreateSharedLink({path:new_file.path_lower})
							.then(function(returned_data){
								new_file.url = returned_data.url.replace("www.","dl.");
								file_structure.files.push(new_file);
								$("#progress_span").html(file_structure.files.length + " out of "+ file_structure.total_files);
								if(file_structure.files.length == file_structure.total_files){
									
									update_super_spreadsheet();
								}
							});						
					} else {						
						$("#progress_span").html(file_structure.files.length + " out of "+ file_structure.total_files);
					}
				});
				//file_structure.files    = file_structure.files.concat(new_files);
                file_structure.folder   = file_structure.folder.concat(new_folders);
				
                new_files.forEach(function(file){					
                    $("#stimuli_select").append("<option class='file_option' value='"+file.path_lower+"' onclick='preview_stim(this)'>"+file.name+"</option>");					
                });
				new_folders.forEach(function(folder){
					$("#folders_select").append("<option class='folder_option' value='"+folder.path_lower+"'>"+folder.path_lower+"</option>");
					recursive_folder_browsing(folder.path_lower);
				});
            }            
        });
}

function update_super_spreadsheet(){
	stim_csv = Papa.unparse(file_structure.files,{headers:true});
	dbx.filesUpload({
		path : "/stimuli/stimuli_locations.csv",
		mode : "overwrite",
		contents: stim_csv
	});
	
}

dbx.sharingCreateSharedLink({path:"/stimuli/stimuli_locations.csv"})
	.then(function(returned_data){
		console.dir(returned_data);
		$.get(returned_data.url.replace("www.","dl."),function(this_data){
			console.dir("this_data");
			file_structure.files = Papa.parse(this_data,{header:true}).data;
			recursive_folder_browsing("/stimuli");					
		});
		
		
	})
	.catch(function(error){
		report_error(error);
		custom_alert("Stimuli spreadsheet file not yet created, will create now");
		recursive_folder_browsing("/stimuli");		
	});


$("#select_all_btn").on("click",function(){
	$(".folder_option").attr("selected",true);
});
$("#select_none_btn").on("click",function(){
	$(".folder_option").attr("selected",false);
});

filetype_arrays={
	picture:['.png','.jpg','.bmp'],	
	text:['.txt'],
}



function preview_stim(this_stim){
	console.dir(this_stim.value);
	dbx.sharingCreateSharedLink({path:this_stim.value})
        .then(function(returned_data){
            console.dir(returned_data);
			var this_filetype = returned_data.path.substring(returned_data.path.indexOf("."));
			if(filetype_arrays.picture.indexOf(this_filetype) !== -1){
				$("#preview_div").html("<img id='preview_img' src = '"+returned_data.url.replace("www.","dl.")+"'>");	
			}
        });
		
};

</script>