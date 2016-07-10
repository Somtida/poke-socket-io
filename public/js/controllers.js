'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, $state, $auth) {
  console.log('mainCtrl!');

  $scope.isAuthenticated = () => $auth.isAuthenticated();

  $scope.logout = () => {
    $auth.logout();
    $state.go('home');
  };

  $scope.authenticate = provider => {
    $auth.authenticate(provider)
      .then(res => {
        $state.go('home');
      })
      .catch(err => {
        console.log('err:', err);
      })
  };
});


app.controller('loginCtrl', function($scope, $state, $auth) {
  console.log('loginCtrl!');

  $scope.login = () => {
    $auth.login($scope.user)
      .then(res => {
        console.log('res:', res);
        $state.go('profile');
      })
      .catch(err => {
        console.log('err:', err);
      });
  };

});


app.controller('registerCtrl', function($scope, $state, $auth) {
  console.log('registerCtrl!');

  $scope.register = () => {
    if($scope.user.password !== $scope.user.password2) {
      $scope.user.password = null;
      $scope.user.password2 = null;
      alert('Passwords must match.  Try again.');
    } else {

      $auth.signup($scope.user)
        .then(res => {
          console.log('res:', res);
          $state.go('login');
        })
        .catch(err => {
          console.log('err:', err);
        });
    }
  };

});

app.controller('profileCtrl', function($scope, Profile, socket, $rootScope) {
  console.log('profileCtrl!');

  $scope.user = Profile;
  $rootScope.poke = 0;
  socket.on($scope.user._id, function(msg){
    $rootScope.poke++;
    console.log("msg: ",msg);
  })

});


app.controller('usersCtrl', function($scope, Users, socket) {
  console.log('usersCtrl!');

  $scope.users = Users;

  $scope.sendMessage = (index) => {
    console.log("user[index]: ",$scope.users[index]);
    socket.emit('sendMessage',{
      user: $scope.users[index]._id,
      message: "poke"
    });

  }
});
