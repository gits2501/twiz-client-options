var test = require('tap').test;
var Options = require('../src/Options');


var mockOptions = {

  leg: [ 'request_token', 'authorize', 'access_token' ],
  httpMethods: { request_token: 'POST', authorize: 'GET', access_token: 'POST' },
  
  twtUrl: { 
     protocol: 'https://',
     domain: 'api.twitter.com',
     path: '/oauth/',
     api_path: '/1.1/' },
  
  apiUrl: 'https://api.twitter.com/oauth/',
  
  absoluteUrls: 
   { request_token: 'https://api.twitter.com/oauth/request_token',
     authorize: 'https://api.twitter.com/oauth/authorize',
     access_token: 'https://api.twitter.com/oauth/access_token' },
  lnkLabel: { name: 'twiz_', data: { id: 'he who dares ' } },
  
  UserOptions: {
     host: '',
     path: '',
     method: '',
     params: '',
     paramsEncoded: '',
     SBS: '',
     AH: '',
     body: '',
     encoding: '' 
  },
  options: { 
     url: '',
     method: '',
     queryParams: { legHost: '', legPath: '', legMethod: '', legSBS: '', legAH: '' },
     body: '',
     encoding: '',
     beforeSend: '',
     callback: '',
     parse: true 
  }
 
}

var usrOptions = {
  method: 'POST',
  path:'statuses/update.json',
  params:{
    status: 'A cat goes by.'
  }
}

var ro = new Options();  // request options
test('Options', function(t){

 
 test('3 legs of OAuth',function(t){
   t.plan(1);
   t.deepEqual(ro.leg, mockOptions.leg, '3 legs of OAuth present')
 })

 test('user specified options', function(t){
    t.plan(1)
    t.deepEqual(ro.userOptions, mockOptions.userOptions, 'user options supported')
 }); 
 
 test('twitter url parts',function(t){
   t.plan(8)
  
   t.ok(typeof ro.twtUrl.protocol === 'string','protocol string present')
   t.equals(ro.twtUrl.protocol, mockOptions.twtUrl.protocol, 'protocol')

    
   t.ok(typeof ro.twtUrl.domain === 'string','domain string present')
   t.equals(ro.twtUrl.domain, mockOptions.twtUrl.domain, 'domain');

   t.ok(typeof ro.twtUrl.path === 'string','path string present')
   t.equals(ro.twtUrl.path, mockOptions.twtUrl.path, 'path')
  

   t.ok(typeof ro.twtUrl.api_path === 'string','api path string present')
   t.equals(ro.twtUrl.api_path, mockOptions.twtUrl.api_path, 'api path ');

 })

 test('must specify OAuth endpoint urls', function(t){   
    test('request_token url',function(t){
      t.plan(2) 
      t.ok(typeof ro.absoluteUrls.request_token ===  'string', 'url string present');
      t.equals(ro.absoluteUrls.request_token, mockOptions.absoluteUrls.request_token, 'request token url specified')  
    })

    test('authorize url',function(t){
      t.plan(2);
      t.ok(typeof ro.absoluteUrls.authorize ===  'string', 'url string present');
      t.equals(ro.absoluteUrls.authorize, mockOptions.absoluteUrls.authorize, 'access_token url specified')
    })

   test('access_token url', function(t){
     t.plan(2);
     t.ok(typeof ro.absoluteUrls.access_token ===  'string', 'url string present');
     t.equals(ro.absoluteUrls.access_token, mockOptions.absoluteUrls.access_token, 'authorize url specified')
     
   })
   t.end();
  })

 test('http methods for each OAuth leg',function(t){

  test('request_token method', function(t){ 
    t.plan(2);
    t.ok(typeof ro.httpMethods.request_token ===  'string', 'method string present');
    t.deepEqual(ro.httpMethods.request_token, mockOptions.httpMethods.request_token, 'http method for request token present ');
  })

  test('authorize method',function(t){
    t.plan(2);
    t.ok(typeof ro.httpMethods.authorize ===  'string', 'method string present');
    t.deepEqual(ro.httpMethods.authorize, mockOptions.httpMethods.authorize, 'http method for authorize present ');
  })

  test('access_token method', function(t){
    t.plan(2);
    t.ok(typeof ro.httpMethods.access_token ===  'string', 'method string present');
    t.deepEqual(ro.httpMethods.access_token, mockOptions.httpMethods.access_token, 'http method for access_token present ');
   })

   t.end()
 })
  
  t.end()
})

