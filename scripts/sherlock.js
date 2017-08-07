/*
 * LiveButtons+
 * @author: Ethan Lin, Mike Kellum
 * @uri: https://github.com/oel-mediateam/sherlock
 * @version: 0.0.1 (alpha)
 * @license: The Artistic License 2.0
 *
 * Copyright (c) 2015 University of Wisconsin-Extension,
 * Divison of Continuing Education, Outreach & E-Learning
 *
*/
function onYouTubeIframeAPIReady(){var e={autoplay:0,controls:0,enablejsapi:0,iv_load_policy:3,loop:0,modestbranding:1,rel:0,showinfo:0,disablekb:1},t=!1;video.segmented&&(e.start=video.start,e.end=video.end),video.player=new YT.Player(video.selector,{width:"640",height:"360",videoId:video.vId,playerVars:e}),video.player.addEventListener("onReady",function(){switch(video.segmented?video.duration=video.end-video.start:video.duration=video.player.getDuration(),$(".sherlock_view").data("mode")){case"training":trainingMode=!0;break;case"review":reviewMode=!0;break}if((trainingMode||reviewMode)&&($.post("includes/get_exercise_from_session.php",{id:1},function(e){for(var t=e.length,a=$(".tag_hints_holder").width(),n=0;n<t;n++)for(var s=e[n].positions.length,i=0;i<s;i++){var o=e[n].positions[i].reason,r=$.fn.toSecond(e[n].positions[i].begin),d=$.fn.toSecond(e[n].positions[i].end),l=(d-r)/2+r,c=a*(100/video.duration*r)/100,p=a*(100/video.duration*d)/100,h=p-c,u=c-8+h/2,g='<span class="hint_tag" style="left:'+u+"px; "+(reviewMode?"opacity:1;":"")+'" data-begin="'+r+'" data-end="'+d+'" data-name="'+e[n].name+'" data-reason="'+o+'"><span>'+$.fn.initialism(e[n].name)+"</span></span>";$(".tag_hints_holder").append('<div class="hint" style="left:'+c+"px; width:"+h+'px;" data-begin="'+r+'" data-end="'+d+'" data-mid="'+l+'" data-id="'+e[n].id+'" data-name="'+e[n].name+'"></div>'),$(".progress_bar_holder").append(g)}}),reviewMode)){var e=!1;$.post("includes/get_student_data_from_session.php",{id:1},function(e){for(var t=0;t<e.length;t++){var a="";a=e[t].negative>=0?'<span class="tag neg" style="left:'+e[t].pos+'px;"><span>'+$.fn.initialism(e[t].name)+"</span></span>":'<span class="tag" style="left:'+e[t].pos+'px;"><span>'+$.fn.initialism(e[t].name)+"</span></span>",$(".progress_bar_holder").append(a)}$(".progress_bar_holder .hint_tag").css("cursor","pointer"),$(".progress_bar_holder .hint_tag").showHintTagInfo()}),$(".playPauseBtn").on("click",function(){t?video.player.pauseVideo():video.player.playVideo()}),$(".progress_bar").on("mousedown",function(t){e=!0;var a=t.pageX-$(".progress_bar").offset().left;$(".progress_bar  .scrubber").css("left",a),$.fn.updateScrubSeek(a,video)}),$(".progress_bar").on("mouseup",function(t){if(e){var a=t.pageX-$(".progress_bar").offset().left;e=!1,$(".progress_bar  .scrubber").css("left",a),$.fn.updateScrubSeek(a,video)}}),$(".progress_bar").on("mousemove",function(t){if(e){var a=t.pageX-$(".progress_bar").offset().left;a>=$(this).width()&&(a=$(this).width()),$(".progress_bar .scrubber").css("left",a),$.fn.updateScrubSeek(a,video)}})}$(".duration").html(moment(1e3*video.duration).format("mm:ss")),reviewMode?$(el.videoPlayBtn).html("READY").css("cursor","default").removeClass("paused"):($(el.videoPlayBtn).html("START").removeClass("paused"),$(el.videoPlayBtn).on("click",function(){$.post("includes/start_exercise.php",{begin:1},function(){video.player.playVideo()})}))}),video.player.addEventListener("onStateChange",function(e){switch(e.target.getPlayerState()){case YT.PlayerState.ENDED:if(clearInterval(updatePrgrsInterval),t=!1,$(".playPauseBtn").html('<i class="fa fa-play"></i>'),reviewMode)$(".progress_bar .progressed").css("width","0px"),$(".progress_bar .scrubber").css("left",""),$(el.videoPlayBtn).removeClass("paused").html("READY").show();else{$(el.sherlock_wrapper).showTransition("Video Ended","Calculating results. Please wait..."),$(el.videoPlayBtn).html("ENDED").show();for(var a=0;a<$(".btn[data-action-id]").length;a++)$(".btn[data-action-id]:eq("+a+")").addClass("disabled");$(".btn.rewind").addClass("disabled"),setTimeout(function(){$.fn.writeToFile()},3e3),$(".progress_bar .progressed").css("width",$(".progress_bar").width()+"px"),$(".progress_bar .scrubber").css("left",$(".progress_bar").width()+"px"),$(".elapsed").html(moment(1e3*video.duration).format("mm:ss"))}break;case YT.PlayerState.PLAYING:if(updatePrgrsInterval&&clearInterval(updatePrgrsInterval),t=!0,$(".playPauseBtn").html('<i class="fa fa-pause"></i>'),!reviewMode){if(!video.started){for(var n=0;n<$(".btn[data-action-id]").length;n++)$(".btn[data-action-id]:eq("+n+")").removeClass("disabled"),$(".btn[data-action-id]:eq("+n+")").clickAction();$(".btn.rewind").removeClass("disabled"),$(".btn.rewind").clickAction(),video.started=!0}$.fn.tagHoverAction()}updatePrgrsInterval=setInterval(function(){$.fn.updateProgress(video)},1e3),$("#videoPlayBtn").hide().removeClass("paused").html("START");break;case YT.PlayerState.BUFFERING:if($("#videoPlayBtn").html('<i class="fa fa-spinner fa-spin"></i><br /><small>BUFFERING</small>').addClass("paused").show(),!reviewMode)for(var s=0;s<$(".btn[data-action-id]").length;s++)$(".btn[data-action-id]:eq("+s+")").addClass("disabled");t=!1;break;case YT.PlayerState.PAUSED:clearInterval(updatePrgrsInterval),t=!1,$(".playPauseBtn").html('<i class="fa fa-play"></i>');break}})}var video={player:null,selector:"ytv",vId:null,segmented:!1,start:0,end:0,duration:null,rewinded:!1,started:!1},segment={begin:0,end:0,playing:!1},el={google_revoke:"#google_revoke_connection",google_revoke_confirm:"#disconnect-confirm",google_revoke_ok:"#revoke_ok",google_revoke_cancel:"#revoke_cancel",sherlock_wrapper:"#sherlock-wrapper",sherlock_banner_label:"#sherlock-wrapper .navbar .container .exercise-type-mode",sherlock_body_container:"#sherlock-wrapper .container.body",sherlock_grid_container:"#sherlock-wrapper .container .active-exercises.exercise-grid",sherlock_grid_item:"#sherlock-wrapper .container .active-exercises.exercise-grid .grid-item",exerciseEmbedBtn:"#sherlock-wrapper .container .active-exercises.exercise-grid .grid-item .thumbnail .embedBtn",currentPage:".exercise-pagination .controls .pageActions .page-number .currentPage",prevPageBtn:".exercise-pagination .controls .pageActions .previous",nextPageBtn:".exercise-pagination .controls .pageActions .next",videoPlayBtn:"#videoPlayBtn"},tagCount=1,updatePrgrsInterval,studentResponses=[],trainingMode=!1,reviewMode=!1,pauseOnce=!0,preCount=null;$(function(){"use strict";if($.fn.flashExist()&&$.fn.isIE())return $(el.sherlock_wrapper).html('<h1>Sorry, your web browser is not supported.</h1><p>Please try using latest stable version of <a href="https://www.mozilla.org" target="_blank">Mozilla Firefox</a>, <a href="https://www.google.com/chrome/browser/desktop/" target="_blank">Google Chrome</a>, or <a href="http://www.apple.com/safari/" target="_blank">Safari</a>.</p>'),0;if($(el.google_revoke).length&&($(el.google_revoke).on("click",function(){return $(el.google_revoke_confirm).fadeIn(function(){$(this).removeClass("hide").css("display","")}),!1}),$(el.google_revoke_ok).on("click",function(){return $.post("includes/disconnect_google.php",{revoke:1},function(){location.reload()}),!1}),$(el.google_revoke_cancel).on("click",function(){return $(el.google_revoke_confirm).fadeOut(),!1})),$(el.prevPageBtn).on("click",function(){$.fn.goToPage("prev")}),$(el.nextPageBtn).on("click",function(){$.fn.goToPage("next")}),$(el.exerciseEmbedBtn).length&&$(el.exerciseEmbedBtn).on("click",function(e){e.stopPropagation(),e.preventDefault();var t=$(this).parent().parent().data("exercise"),a=location.protocol,n="";return a=a.indexOf("s")>=0?"https://":"http://",n=a+location.hostname+location.pathname+"?embed="+t,alert("TODO: a dialog to hold "+n+" for copy."),!1}),$(el.videoPlayBtn).html('<i class="fa fa-spinner fa-spin"></i><br><small>WAIT</small>').addClass("paused"),video.vId=$("#"+video.selector).data("video-id"),video.vId){var e=$("#"+video.selector).data("start"),t=$("#"+video.selector).data("end");e!==Number("-1")&&(video.start=moment.duration(e,"mm:ss").asSeconds()/60,video.end=moment.duration(t,"mm:ss").asSeconds()/60,video.start>=0&&void 0!==video.start&&video.start<video.end&&(video.segmented=!0)),$.fn.loadYouTubeAPI()}$(".sort").length&&$(".sort").each(function(){var e=$(this),t=!1,a=$(this).children("option").length,n=e.attr("class");e.addClass("select-hidden"),e.wrap('<div class="select"></div>'),e.after('<div class="select-styled"></div> ');var s=e.next("div.select-styled");s.addClass(n),s.text(e.children("option").eq(0).text());for(var i=$("<ul />",{class:"select-options"}).insertAfter(s),o=0;o<a;o++)e.children("option").eq(o)[0].disabled||$("<li />",{text:e.children("option").eq(o).text(),"data-id":e.children("option").eq(o)[0].attributes[0].value}).appendTo(i);var r=i.children("li");s.click(function(e){e.stopPropagation(),t?(s.removeClass("active"),i.hide(),t=!1):($("div.select-styled.active").each(function(){$(this).removeClass("active").next("ul.select-options").hide()}),$(this).toggleClass("active").next("ul.select-options").toggle(),t=!0)}),r.click(function(a){a.stopPropagation();var n=$(this).data("id");s.text($(this).text()).removeClass("active"),e.val(n),i.hide(),t=!1,$.post("includes/sortby.php",{sort:n},function(e){$.fn.displayExercises(e)})}),$(document,s).click(function(){s.removeClass("active"),i.hide(),t=!1})}),$("#lti_selection").click(function(){var e=$('input[name="return_url"]').val(),t=$("option:selected").val(),a=$('input[name="type"]').val();return"hide"!==t?$.ajax({url:"includes/get_lti_link.php",type:"POST",data:{return_url:e,id:t,type:a},success:function(e){window.location.href=e}}):$("h1").after('<div class="callout danger">No exercise was selected. Please select an exercise.</div>'),!1}),$("body").on("click","#goToReview",function(){return $.fn.goToReview(),!1}),$("body").on("click","#goToScore",function(){return $.fn.goToScore(),!1})}),$.fn.loadYouTubeAPI=function(){var e=document.createElement("script"),t=document.getElementsByTagName("script")[0];e.src="https://www.youtube.com/iframe_api",t.parentNode.insertBefore(e,t)},$.fn.clickAction=function(){$(this).on("click",function(){if(!$(this).hasClass("disabled")){if($(this).hasClass("rewind")){var e=Number($(this).data("length")),t=video.player.getCurrentTime(),a=null;e=t<=e?0:t-e,$(".btn.disabled").length&&(a=$(".btn.disabled"),a.each(function(){$(this).find("span.progress").stop().animate({width:0},1e3)})),video.player.pauseVideo(),video.player.seekTo(e),preCount=null,$("#videoPlayBtn").html('<span class="icon-paused"></span><br /><small>PAUSED</small>').addClass("paused").show(),$(".sherlock_status_msg").html("Video paused ... will resume shortly.").removeClass("hide"),setTimeout(function(){$(".sherlock_status_msg").html("").addClass("hide"),video.player.playVideo(),null!==a&&a.extendedCooldown()},3e3),video.rewinded=!0}else trainingMode&&(video.player.playVideo(),pauseOnce=!1);$(this).addTag(),$(this).cooldown()}})},$.fn.addTag=function(){var e=video.player.getCurrentTime(),t=$(this).data("action-id"),a=$(this).find(".action_name").html(),n=moment(1e3*e).format("mm:ss"),s=$(".progress_bar .progressed").width()-12,i=$(this).find(".icon").html(),o='<span class="tag" data-action-id="'+t+'" data-time="'+n+'" data-count="'+tagCount+'" style="left:'+s+"px;z-index:"+tagCount+++'">'+i+"</span>",r={id:t,name:a,timestamped:n,pos:s};studentResponses.push(r),$(".progress_bar_holder").prepend(o)},$.fn.tagHoverAction=function(){$(".progress_bar_holder").on("mouseover",".tag",function(){$(this).css("z-index",99)}),$(".progress_bar_holder").on("mouseout",".tag",function(){$(this).css("z-index",$(this).data("count"))}),trainingMode&&($(".progress_bar_holder").on("mouseover",".hint_tag",function(){$(this).css("z-index",99)}),$(".progress_bar_holder").on("mouseout",".hint_tag",function(){$(this).css("z-index",0)}))},$.fn.cooldown=function(){var e=$(this),t=e.width(),a=1e3*Number(e.data("cooldown")),n=e.children()[3],s=$(n),i=$(this).find(".limits"),o=Number(i.html());s.width()>=t&&(s.width(0),e.addClass("disabled")),o--,i.html(o),o<=0?$(this).addClass("disabled"):s.animate({width:t},a,function(){e.removeClass("disabled")})},$.fn.extendedCooldown=function(){$(this).each(function(){var e=$(this),t=e.width(),a=1e3*Number(e.attr("data-cooldown")),n=5*a;e.find(".cooldown .progress").animate({width:t},n,function(){e.removeClass("disabled")})})},$.fn.showTransition=function(e,t,a){a=void 0!==a&&a,$.fn.hideTransition(),!1===a?$(this).before('<div class="transition_overlay"><div class="loading"><i class="fa fa-spinner fa-spin"></i></div><div class="heading">'+e+'</div><div class="subheading">'+t+"</div></div>"):$(this).before('<div class="transition_overlay"><div class="heading">'+e+'</div><div class="subheading">'+t+"</div></div>"),$(".transition_overlay").css("display","none").fadeIn()},$.fn.hideTransition=function(){$(".transition_overlay").fadeOut(function(){$(this).remove()})},$.fn.writeToFile=function(){studentResponses.length<=0&&(studentResponses=-1),$.post("includes/student_input.php",{student:studentResponses},function(e){1===e||"1"===e?$.get("includes/views/score.php",function(e){$.fn.hideTransition(),$(el.sherlock_banner_label).html("score").removeClass().addClass("exercise-type-mode score"),$(el.sherlock_body_container).hide().html(e).fadeIn(1e3);for(var t=0;t<$(".progress-bar").length;t++)$.fn.drawProgressBar(t+1)}):$(el.sherlock_wrapper).showTransition("Something went wrong...","Sherlock lost his writting pen.")})},$.fn.drawProgressBar=function(e){var t=$("#progressPercent"+e),a=document.getElementById("inactiveProgress"+e),n=document.getElementById("activeProgress"+e),s=a.getContext("2d"),i=Number(t.data("percent"));$.fn.drawInactiveProgress(s),$.fn.drawProgress(n,i)},$.fn.drawInactiveProgress=function(e){e.lineCap="square",e.beginPath(),e.lineWidth=0,e.fillStyle="#e6e6e6",e.arc(75,75,75,0,2*Math.PI),e.fill(),e.beginPath(),e.lineWidth=0,e.fillStyle="#fff",e.arc(75,75,65,0,2*Math.PI),e.fill()},$.fn.drawProgress=function(e,t){var a=e.getContext("2d");if(e.width=e.width,a.lineCap="square",a.beginPath(),a.lineWidth=5,a.strokeStyle="#ccc",a.arc(75,75,70,0,2*Math.PI),a.stroke(),t>0){var n=Math.PI/2,s=2*t*Math.PI-n,i=0-n;a.beginPath(),a.lineWidth=5,a.strokeStyle="#3ac14a",a.arc(75,75,70,i,s),a.stroke()}},$.fn.showHintTagInfo=function(){$(this).on("click",function(){$(".hint_tag").removeClass("active");var e=$(this).data("name"),t=$(this).data("begin"),a=$(this).data("end"),n=$(this).data("reason"),s="<p><strong>"+e+"</strong><br />"+moment(1e3*t).format("mm:ss")+" &mdash; "+moment(1e3*a).format("mm:ss")+"</p><p>"+n+"</p>";$(".sherlock_actions .review_content").html(s),segment.begin=t,segment.end=a,$(".btn.play_segment").hasClass("disabled")&&$(".btn.play_segment").removeClass("disabled").on("click",function(){video.player.seekTo(segment.begin),video.player.playVideo(),$(".playPauseBtn").html('<i class="fa fa-pause"></i>'),segment.playing=!0}),$(this).addClass("active")})},$.fn.goToPage=function(e){$.post("includes/pagination.php",{direction:e},function(e){$.fn.displayExercises(e)})},$.fn.displayExercises=function(e){var t=JSON.parse(e),a=$(el.prevPageBtn),n=$(el.nextPageBtn),s=t[0],i=t[1];s?a.prop("disabled",!0):a.prop("disabled",!1),i?n.prop("disabled",!0):n.prop("disabled",!1),$(el.currentPage).html(t[2]),$(el.sherlock_grid_container).html(t[3])},$.fn.goToReview=function(){$(".sherlock_score_view").hide(),$(".score_controls").hide(),$(el.sherlock_banner_label).html("review").removeClass().addClass("exercise-type-mode review"),$(".sherlock_view.review").length?($(".sherlock_view.review").show(),$(".sherlock_controls").show()):$.post("includes/views/review.php",function(e){$(el.sherlock_body_container).append(e).hide().fadeIn("fast"),onYouTubeIframeAPIReady()})},$.fn.goToScore=function(){$(".sherlock_score_view").is(":visible")||($(el.sherlock_banner_label).html("score").removeClass().addClass("exercise-type-mode score"),$(".sherlock_score_view").show(),$(".score_controls").show(),$(".sherlock_view.review").hide(),$(".sherlock_controls").hide())},$.fn.updateProgress=function(e){var t=e.player.getCurrentTime();e.segmented&&(t=e.player.getCurrentTime()-e.start);var a=100/e.duration*t,n=$(".progress_bar").width()*(a/100),s=moment(1e3*t).format("mm:ss");if($(".progress_bar .progressed").css("width",n+"px"),$(".progress_bar .scrubber").css("left",n-1+"px"),$(".elapsed").html(s),trainingMode){var i=$(".progress_bar .scrubber").hitTestObject(".hint");if(i)for(var o=0;o<i.length;o++){var r=Number(i[o].attributes[2].nodeValue),d=Number(i[o].attributes[3].nodeValue),l=Number(i[o].attributes[4].nodeValue),c=$(".progress_bar_holder .hint_tag:eq("+o+")");if(t>r&&t<d){c.animate({opacity:1}),$(".progress_bar_holder .hint_tag:eq("+preCount+")").removeClass("blink-faster"),$(".reasoningBox").hideReasoning(),preCount!==o&&($(".progress_bar_holder .hint_tag:eq("+preCount+")").removeClass("blink-faster"),pauseOnce=!0,preCount=o),t>l&&t<d&&pauseOnce&&(e.player.pauseVideo(),$(".reasoningBox").showReasoning(c.data("reason"),'Click "<strong>'+c.data("name")+'</strong>" button to continue.'),c.addClass("blink-faster"),pauseOnce=!1);break}}}reviewMode&&segment.playing&&t>=segment.end&&(e.player.pauseVideo(segment.end),segment.playing=!1,$(".playPauseBtn").html('<i class="fa fa-play"></i>'))},$.fn.updateScrubSeek=function(e,t){var a=t.duration*(100*e/$(".progress_bar").width())/100;$(".progress_bar .progressed").css("width",e+"px"),$(".progress_bar .scrubber").css("left",e-1+"px"),t.player.seekTo(a)},$.fn.showReasoning=function(e,t){t=void 0!==t?t:"",$(this).find(".reasoning").html(e),$(this).find(".action").html(t),$(this).fadeIn().removeClass("hide")},$.fn.hideReasoning=function(){$(this).find(".reasoning").html(""),$(this).find(".action").html(""),$(this).fadeOut()},$.fn.getExerciseType=function(e){var t=null;switch(Number(e)){case 1:t="Demo";break;case 2:t="Dev Testing";break;case 3:t="Training";break;case 4:t="Practice";break;case 5:t="Assessment";break;default:t=null;break}return t},$.fn.toSecond=function(e){var t=e.split(":");return 60*Number(t[0])+Number(t[1])},$.fn.initialism=function(e){var t=e.indexOf(" "),a=e.slice(0,1);if(t>0){return a+e.slice(t+1,t+2)}return a},$.fn.hitTestObject=function(e){for(var t=$(e),a=t.length,n=this.get(0).getBoundingClientRect(),s=0;s<a;s++){var i=t.get(s).getBoundingClientRect();if(!(n.right<i.left||n.left>i.right||n.bottom<i.top||n.top>i.bottom))return $(e)}return!1},$.fn.flashExist=function(){var e;try{e=new ActiveXObject("ShockwaveFlash.ShockwaveFlash")}catch(t){e=navigator.plugins["Shockwave Flash"]}return!!e},$.fn.isIE=function(){var e=window.navigator.userAgent,t=e.indexOf("MSIE ");if(t>0)return parseInt(e.substring(t+5,e.indexOf(".",t)),10);if(e.indexOf("Trident/")>0){var a=e.indexOf("rv:");return parseInt(e.substring(a+3,e.indexOf(".",a)),10)}var n=e.indexOf("Edge/");return n>0&&parseInt(e.substring(n+5,e.indexOf(".",n)),10)};