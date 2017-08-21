angular.module('postServices', [])

.factory('Post', function($http){
   var postFactory = {
       posts: []
   };
    
    //Post.createPost(regData)
    postFactory.createPost = function(data){
        return $http.post('/api/posts', data);
    }
    
    //Post.getAll()
    postFactory.getAll = function () {
        return $http.get('/posts').success(function (data) {
            angular.copy(data, postFactory.posts);
        });
    };
    
    return postFactory;
});