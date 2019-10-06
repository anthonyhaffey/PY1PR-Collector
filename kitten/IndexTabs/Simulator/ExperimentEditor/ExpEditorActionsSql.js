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
$("#delete_exp_btn").on("click",function(){
	var this_exp = $("#experiment_list").val();
	if(this_exp == null){
		bootbox.alert("You need to select an experiment to delete it");
	} else {
		bootbox.confirm("Are you sure you want to delete your experiment? <br><br> If you delete it you can go to your <a href='https://www.dropbox.com/home/Apps/Open-Collector' target='blank'>dropbox folder</a> to look up previous versions of your experiment.", function(result) {
			if(result){
				//delete from megaUberJson
				delete (megaUberJson.exp_mgmt.experiments[this_exp]);


				dbx.filesDelete({path:"/experiments/"+this_exp+".json"})
					.then(function(response) {
						$('#experiment_list option:contains('+ this_exp +')')[0].remove();
						$("#experiment_list").val(document.getElementById('experiment_list').options[0].value);
						megaUberJson.exp_mgmt.experiment = $("#experiment_list").val();
						custom_alert(this_exp +" succesfully deleted");
						updateUberMegaFile();
						update_handsontables();
					})
					.catch(function(error) {
						report_error(error);
					});
			}
		});
	}
});
$("#download_experiment_button").on("click",function(){
	var experiment = megaUberJson.exp_mgmt.experiment;
	var exp_json = megaUberJson.exp_mgmt.experiments[experiment];
	var default_filename = experiment + ".json";
	bootbox.prompt({
		title: "What do you want to save this file as?",
		value: default_filename, //"data.csv",
		callback:function(result){
			if(result){
				download_collector_file(result,JSON.stringify(exp_json),"json");
			}
		}
	});

});
$("#new_proc_button").on("click",function(){
  var proc_template = new_experiment_data["Procedure"]["Procedure.csv"];

	bootbox.prompt("What would you like the name of the new procedure sheet to be?",function(new_proc_name){
		var experiment = megaUberJson.exp_mgmt.experiment;
		var this_exp   = megaUberJson.exp_mgmt.experiments[experiment];
		var current_procs = Object.keys(this_exp.all_procs);



		if(current_procs.indexOf(new_proc_name) !== -1){
			bootbox.alert("You already have a procedure sheet with that name");
		} else {
			new_proc_name = new_proc_name.replace(".csv","") + ".csv";

			megaUberJson.exp_mgmt.experiments[experiment].all_procs[new_proc_name] = proc_template;
			$("#proc_select").append($('<option>', {
				text : new_proc_name
			}));
			$("#proc_select").val(new_proc_name);
			createExpEditorHoT(this_exp.all_procs[new_proc_name],"procedure",new_proc_name);	//sheet_name

		}
	});
});
$("#new_stim_button").on("click",function(){

	var stim_template = new_experiment_data["Stimuli"]["Stimuli.csv"];

	bootbox.prompt("What would you like the name of the new <b>Stimuli</b> sheet to be?",function(new_sheet_name){
		var experiment = megaUberJson.exp_mgmt.experiment;
		var this_exp   = megaUberJson.exp_mgmt.experiments[experiment];
		var current_stims = Object.keys(this_exp.all_stims);



		if(current_stims.indexOf(new_sheet_name) !== -1){
			bootbox.alert("You already have a <b>Stimuli</b> sheet with that name");
		} else {
			new_sheet_name = new_sheet_name.replace(".csv","") + ".csv";

			megaUberJson.exp_mgmt.experiments[experiment].all_stims[new_sheet_name] = stim_template;
			$("#stim_select").append($('<option>', {
				text : new_sheet_name
			}));
			$("#stim_select").val(new_sheet_name);
			createExpEditorHoT(this_exp.all_stims[new_sheet_name],"stimuli",new_sheet_name);	//sheet_name

		}
	});


});
$("#new_experiment_button").on("click",function(){
	bootbox.prompt("What would you like to name the new experiment?",function(result){
		if(result !== null){
			if($("#experiment_list").text().indexOf(result) !== -1){
				bootbox.alert("You already have an experiment with this name");
			} else {
				new_experiment(result);
			}
		}
	});
});
$("#proc_select").on("change",function(){
	var experiment = megaUberJson.exp_mgmt.experiment;
	var this_exp   = megaUberJson.exp_mgmt.experiments[experiment];
	createExpEditorHoT(this_exp.all_procs[this.value], "procedure", this.value);
});
$("#publish_link").on("click", function () {
	$(this).select();
	survey_cell_view_activate(this.value);
});
$("#publish_link").on("blur", function () {
	survey_cell_view_deactivate(this.value);
});
$("#rename_proc_button").on("click",function(){
	bootbox.prompt("What do you want to rename this <b>Procedure</b> sheet to?",function(new_proc_name){
		var experiment = megaUberJson.exp_mgmt.experiment;
		var this_exp   = megaUberJson.exp_mgmt.experiments[experiment];

		var current_procs = Object.keys(this_exp.all_procs);
		var current_proc = $("#proc_select").val();
		current_procs.splice(current_procs.indexOf(current_proc), 1);

		var current_proc_sheet = this_exp.all_procs[current_proc];

		if(current_procs.indexOf(new_proc_name) !== -1){
			bootbox.alert("You already have a procedure sheet with that name");
		} else {
			new_proc_name = new_proc_name.replace(".csv","") + ".csv";

			megaUberJson.exp_mgmt.experiments[experiment].all_procs[new_proc_name] = current_proc_sheet;

			delete(megaUberJson.exp_mgmt.experiments[experiment].all_procs[current_proc]);

			$("#proc_select").append($('<option>', {
				text : new_proc_name
			}));
			$("#proc_select").val(new_proc_name);

			$('#stim_select option[value="' + current_proc + '"]').remove();

			createExpEditorHoT(this_exp.all_procs[new_proc_name],"procedure",new_proc_name);	//sheet_name
		}
	});
});
$("#rename_stim_button").on("click",function(){
	bootbox.prompt("What do you want to rename this <b>Stimuli</b> sheet to?",function(new_sheet_name){
		var experiment = megaUberJson.exp_mgmt.experiment;
		var this_exp   = megaUberJson.exp_mgmt.experiments[experiment];

		var current_stims = Object.keys(this_exp.all_stims);
		var current_stim = $("#stim_select").val();
		current_stims.splice(current_stims.indexOf(current_stim), 1);

		var current_stim_sheet = this_exp.all_stims[current_stim];

		if(current_stims.indexOf(new_sheet_name) !== -1){
			bootbox.alert("You already have a <b>Stimuli</b> sheet with that name");
		} else {
			new_sheet_name = new_sheet_name.replace(".csv","") + ".csv";

			megaUberJson.exp_mgmt.experiments[experiment].all_stims[new_sheet_name] = current_stim_sheet;

			delete(megaUberJson.exp_mgmt.experiments[experiment].all_stims[current_stim]);

			$("#stim_select").append($('<option>', {
				text : new_sheet_name
			}));
			$("#stim_select").val(new_sheet_name);

			$('#stim_select option[value="' + current_stim + '"]').remove();

			createExpEditorHoT(this_exp.all_stims[new_sheet_name],"stimuli",new_sheet_name);	//sheet_name
		}
	});
});
$("#save_btn").on("click", function(){
	$("#save_trial_type_button").click();
	$("#save_survey_btn").click();
  $("#save_snip_btn").click();
	$("#save_data_script_btn").click();

	//update trialtypes in the experiment
	var experiment = megaUberJson.exp_mgmt.experiment;
	var this_exp = megaUberJson.exp_mgmt.experiments[experiment];

	//parse procs for survey saving next
	if(typeof(this_exp) !== "undefined") {
 //   if(typeof(this_exp.parsed_procs) == "undefined"){
      this_exp.parsed_procs = {};
      var procs = Object.keys(this_exp.all_procs);
      procs.forEach(function(proc){
        this_exp.parsed_procs[proc] = Papa.parse(Papa.unparse(this_exp.all_procs[proc]),{header:true}).data;
      });
   // }

    //add surveys to experiment
    if(typeof(this_exp.surveys) == "undefined"){
      this_exp.surveys = {};
    }

    Object.keys(this_exp.parsed_procs).forEach(function(proc_name){
      this_proc = this_exp.parsed_procs[proc_name];
      this_proc.forEach(function(proc_row){
        if(typeof(proc_row.survey) !== "undefined" &&
          proc_row.survey !== ""){
          var this_survey = proc_row.survey.toLowerCase();
          if(typeof(megaUberJson.surveys.user_surveys[this_survey]) !== "undefined"){
            if(typeof(this_exp.surveys) == "undefined"){
              this_exp.surveys = {};
            }
            this_exp.surveys[this_survey] = megaUberJson.surveys.user_surveys[this_survey];

            //check for boosts
            if(typeof(this_exp.boosts) == "undefined"){
              this_exp.boosts = {};
            }
            keyed_survey = Papa.parse(Papa.unparse(megaUberJson.surveys.user_surveys[this_survey]),{header:true}).data;
            keyed_survey.forEach(function(key_row){
              clean_key_row = clean_obj_keys(key_row);
              if(typeof(clean_key_row.type) !== "undefined"){
                var survey_boost_type = clean_key_row.type.toLowerCase();
                if(typeof(megaUberJson.boosts[survey_boost_type]) !== "undefined"){
                  this_exp.boosts[survey_boost_type] = {
                    location:'',
                    contents:megaUberJson.boosts[survey_boost_type].contents
                  }
                }
              }
            });
          } else if(typeof(megaUberJson.surveys.default_surveys[this_survey]) !== "undefined"){
            this_exp.surveys[proc_row.survey] = megaUberJson.surveys.default_surveys[this_survey];
          }	else {
            bootbox.alert("The survey <b>" + proc_row.survey + "</b> in your procedure sheet doesn't appear to exist. Please check the spelling of it");
          }
        }
      });
    });

    var proc = this_exp.procedure;
    trialtype_index = this_exp.all_procs[proc][0].indexOf("trial type");

    var trialtypes = this_exp.all_procs[proc].map(row => row[trialtype_index]);
    trialtypes = _.uniq(trialtypes);
    trialtypes = trialtypes.filter(Boolean); //remove blanks

    if(typeof(this_exp.trialtypes) == "undefined"){
      this_exp.trialtypes = {};
    }

    trialtypes.forEach(function(trialtype){
      if(typeof(megaUberJson.trialtypes.user_trialtypes[trialtype]) == "undefined"){
        this_exp.trialtypes[trialtype] = megaUberJson.trialtypes.default_trialtypes[trialtype];
      } else {
        this_exp.trialtypes[trialtype] = megaUberJson.trialtypes.user_trialtypes[trialtype];
        dbx_obj.new_upload({path:"/TrialTypes/"+trialtype+".html",contents:megaUberJson.trialtypes.user_trialtypes[trialtype],mode:'overwrite'},function(result){
          //console.dir(result);
        },function(error){
          report_error(error);
        },
				"filesUpload");
      }
    });

    dbx_obj.new_upload({path: "/Experiments/"+experiment+".json", contents: JSON.stringify(this_exp), mode:'overwrite'},
      function(returned_data){
        if(typeof(this_exp.location) == "undefined"){
          dbx.sharingCreateSharedLink({path:returned_data.path_lower})
            .then(function(returned_link){
              this_exp.location = returned_link.url;
              $.post("AjaxExperimentLocation.php",
                {
                  location:   this_exp.location,
                  experiment: experiment
                },
                function(returned_data){
                  custom_alert(returned_data);

                  dbx_obj.new_upload({path: "/Experiments/"+experiment+".json", contents: JSON.stringify(this_exp), mode:'overwrite'},function(location_saved){
                    custom_alert("experiment_location sorted");
                    $("#run_link").attr("href","../"+ megaUberJson.exp_mgmt.version + "/RunStudy.html?location="+this_exp.location);
                    updateUberMegaFile();
                  },function(error){
                    custom_alert("check console for error saving location");
                    bootbox.alert(error.error + "<br> Perhaps wait a bit and save again?");;
                  },
									"filesUpload");
                }
              );
            })
            .catch(function(error){
              report_error(error);
            });
        } else {
          updateUberMegaFile();
        }
      },function(error){
        alert(error);
      },
			"filesUpload");
  }
});
$("#stim_select").on("change",function(){
	var experiment = megaUberJson.exp_mgmt.experiment;
	var this_exp   = megaUberJson.exp_mgmt.experiments[experiment];
	createExpEditorHoT(this_exp.all_stims[this.value], "stimuli", this.value);
});
$("#upload_experiment_button").on("click",function(){
	if($("#show_hide_upload").is(":visible")){
		$("#show_hide_upload").hide(500);
	} else {
		$("#show_hide_upload").show(500);
	}
});
$("#upload_experiment_input").on("change",function(){
	if (this.files && this.files[0]) {
		var myFile = this.files[0];
		var reader = new FileReader();
		var this_filename	= this.files[0].name;
		reader.addEventListener('load', function (e) {
			upload_exp_contents(e.target.result,this_filename);
		});
		reader.readAsBinaryString(myFile);
	}
});
function survey_cell_view_activate(this_value){
	$("#survey_cell_view").val(this_value);
	$(".survey_cell_view_td").show();
}
function survey_cell_view_deactivate(){
	$(".survey_cell_view_td").hide();
}