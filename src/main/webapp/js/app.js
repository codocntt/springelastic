var app = angular.module("myapp", []);

app.value('PAGING',{
	numberitem: 0,
	pagecurrent:0,
	totalpage: 0,
	numberperpage:15
});

app.controller("myController", function($scope, $http, $log, $location, $window, PAGING){
	
	// get category
	$http({
		method: 'GET',
		url : _contextPath+"/getallcategories"
	}).then(function successCallback(response){
		$scope.categories = response.data;
		
	}, function errorCallback(response){
		$log.info(response);
	});
	
	// process paging
	$http({
		method: 'GET',
		url : _contextPath+'/totalposts'
	}).then(function successCallback(response){
		var totalpage = Math.floor(response.data.count/PAGING.numberperpage);
		if(response.data.count%PAGING.numberperpage>0){
			totalpage++;
		}
		PAGING.numberitem=response.data.count;
		PAGING.pagecurrent=0;
		PAGING.totalpage=totalpage;
		
		getDataPaging((PAGING.pagecurrent)*PAGING.numberperpage, PAGING.numberperpage);
		
	}, function errorCallback(response){
		$log.info(response);
	});	
	
	// get posts
	function getDataPaging(from, size){
		var url = _contextPath+"/getposts/"+from+"/"+size;
		$http({
			method: 'GET',
			url : url
		}).then(function successCallback(response){
			var html = '';
			for(var i=0;i<response.data.length;i++){
				html+='<tr style="border-bottom: 1px solid rgb(188, 188, 188);">'
						+'<td style="width: 300px;"><a style="text-decoration:none;" href="'+_contextPath+'/post/'+response.data[i].id+'">'+response.data[i].title+'</a></td>'
						+'<td style="width: 100px;">'+response.data[i].category+'</td>'
						+'<td style="width: 100px;">'+response.data[i].countcomment+'</td>'
						+'<td style="width: 100px;">'+response.data[i].countview+'</td>'
						+'<td style="width: 100px;">'+response.data[i].displayDate+'</td>'
					+'</tr>';
			}
			$('table tr:last').after(html);
		}, function errorCallback(response){
			$log.info(response);
		});	
	}
	
	angular.element($window).bind("scroll", function() {
	    var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
	    var body = document.body, html = document.documentElement;
	    var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
	    windowBottom = windowHeight + window.pageYOffset;
	    if (windowBottom > docHeight) {
	    	$log.info("pagecurrent:"+PAGING.pagecurrent);
	    	$log.info("totalpage:"+PAGING.totalpage);
	    	if(PAGING.pagecurrent<PAGING.totalpage){
	    		$log.info("worked:");
	    		var pagecurrent = PAGING.pagecurrent;
	    		pagecurrent++;
	    		PAGING.pagecurrent = pagecurrent;
	    		$log.info("aaa:"+PAGING.pagecurrent);
	    		var from = (PAGING.pagecurrent)*PAGING.numberperpage;
	    		var size = PAGING.numberperpage;
	    		$log.info("from:"+from);
	    		$log.info("to:"+size);
	    		getDataPaging(from, size);
	    	}
	    }
	});

});

app.controller("postController", function($scope, $http, $log, $location){
	
	// get category
	$http({
		method: 'GET',
		url : _contextPath+"/getallcategories"
	}).then(function successCallback(response){
		$scope.categories = response.data;
		$log.info(response);
	}, function errorCallback(response){
		$log.info(response);
	});

});

app.controller("SearchAdvance", function($scope, $http, $log, $location){
	
	// get category
	$http({
		method: 'GET',
		url : _contextPath+"/getallcategories"
	}).then(function successCallback(response){
		$scope.categories = response.data;
		$log.info(response);
	}, function errorCallback(response){
		$log.info(response);
	});

});


app.controller("showResultSearch", function($scope, $http, $log, $location, $window, PAGING){
	if(_count>0){
		var totalpage = Math.floor(_count/PAGING.numberperpage);
		if(_count%PAGING.numberperpage>0){
			totalpage++;
		}
		PAGING.numberitem=_count;
		PAGING.pagecurrent=1;
		PAGING.totalpage=totalpage;
	}
	angular.element($window).bind("scroll", function() {
	    var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
	    var body = document.body, html = document.documentElement;
	    var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
	    windowBottom = windowHeight + window.pageYOffset;
	    if (windowBottom > docHeight) {
	    	if(PAGING.pagecurrent<PAGING.totalpage){
	    		var pagecurrent = PAGING.pagecurrent;
	    		pagecurrent++;
	    		PAGING.pagecurrent = pagecurrent;
	    		var from = (PAGING.pagecurrent-1)*PAGING.numberperpage;
	    		var size = PAGING.numberperpage;
	    		getDataPaging(from, size);
	    	}
	    }
	});
	
	
	function getDataPaging(from, size){
		var url = _contextPath+"/searchpaging";
		$http({
			method: 'POST',
			url : url,
			headers: {'Content-Type': 'application/json'},
			params:
			{
				keyword:_keyword,
				checkbox:_checkbox,
				from : from,
				size : size
			}
		}).then(function successCallback(response){
			$log.info(response);
			var html = '';
			for(var i=0;i<response.data.length;i++){
				html += '<div class="content">'
						+'<h3>'+response.data[i].title+'</h3>'
						+'<span>'+response.data[i].category+'</span>'
						+'</div>';
			}
			$log.info(html);
			$('.content:last').after(html);
		}, function errorCallback(response){
			$log.info(response);
		});	
	}
	
});



app.controller("showResultSearchAdvance", function($scope, $http, $log, $location, $window, PAGING){
	if(_count>0){
		var totalpage = Math.floor(_count/PAGING.numberperpage);
		if(_count%PAGING.numberperpage>0){
			totalpage++;
		}
		PAGING.numberitem=_count;
		PAGING.pagecurrent=1;
		PAGING.totalpage=totalpage;
	}
	angular.element($window).bind("scroll", function() {
	    var windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
	    var body = document.body, html = document.documentElement;
	    var docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
	    windowBottom = windowHeight + window.pageYOffset;
	    if (windowBottom > docHeight) {
	    	if(PAGING.pagecurrent<PAGING.totalpage){
	    		var pagecurrent = PAGING.pagecurrent;
	    		pagecurrent++;
	    		PAGING.pagecurrent = pagecurrent;
	    		var from = (PAGING.pagecurrent-1)*PAGING.numberperpage;
	    		var size = PAGING.numberperpage;
	    		getDataPaging(from, size);
	    	}
	    }
	});
	
	
	function getDataPaging(from, size){
		var url = _contextPath+"/searchadvancepaging";
		$http({
			method: 'POST',
			url : url,
			headers: {'Content-Type': 'application/json'},
			params:
			{
				keyword: _keyword,
				author: _author,
				checkbox: _checkbox,
				startdate : _startdate,
				enddate : _enddate,
				category : _category,
				from : from,
				size : size
			}
		}).then(function successCallback(response){
			$log.info(response);
			var html = '';
			for(var i=0;i<response.data.length;i++){
				html += '<div class="content">'
						+'<h3>'+response.data[i].title+'</h3>'
						+'<span>'+response.data[i].category+'</span>'
						+'</div>';
			}
			$log.info(html);
			$('.content:last').after(html);
		}, function errorCallback(response){
			$log.info(response);
		});	
	}
	
});


