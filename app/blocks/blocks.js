'use strict';

app.controller('BlocksCtrl', function($scope, $route, dataService, timerService) {
	$scope.blocks = {};
	$scope.selected = [];

	$scope.options = {
		page: 1,
		limit: 15
	}

	$scope.loadBlocks = function () {
    	$scope.promise = dataService.getData("/pool/blocks?"+$.param($scope.options), function(data){
	        $scope.blocks.global = data;
			updateMaturity();
	    });
	};
    
	var updateMaturity = function () {
		var luck;
		_.each($scope.blocks.global, function(block, index){
			if($scope.poolStats.global != undefined && $scope.network != undefined) {
				$scope.blocks.global[index].maturity = $scope.config.maturity_depth - ($scope.network.height - block.height);

				luck = block.shares/block.diff*100;
				$scope.blocks.global[index].luck = (luck <= 100) ? (100-luck) : (-luck+100) ;
				$scope.blocks.global[index].icon = (block.valid) ? 'done' : 'clear';
			}
		});
	}

	$scope.$watchGroup(["blocks.global", "poolStats.global"], updateMaturity);

	// Register call with timer 
	timerService.register($scope.loadBlocks, $route.current.controller);
	$scope.loadBlocks();
	
	$scope.$on("$routeChangeStart", function () {
		timerService.remove($route.current.controller);
  	});
});