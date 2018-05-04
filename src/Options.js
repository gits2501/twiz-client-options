 var utils = require('twiz-client-utils');
   
   var formEncode    = utils.formEncode;
   var request       = utils.request;
   var CustomError   = utils.CustomError;
   
    
   function Options (){  // prepares request options used in 3-leg OAuth 1.0a 
      
      
      this.leg = ["request_token", "authorize", "access_token"];  // Names of each leg (step) in 3-leg OAuth
                                                                  // to twitter. Names are also url path ends:
                                                                  // http://api.twitter.com/oauth/request_token
      
      this.httpMethods = {}     // This is the current sequence of http methods we use in 3-leg authentication 
      this.httpMethods[this.leg[0]] = "POST"
      this.httpMethods[this.leg[1]] = "GET"                                          
      this.httpMethods[this.leg[2]] = "POST" 
      
      this.twtUrl = {            // Parts of twitter api url
           "protocol": "https://",
           "domain": "api.twitter.com",
           "path": "/oauth/",    // 'path' is actualy just part of complete path, used in 3-leg dance 
           "api_path": "/1.1/"   // Api path for calls afther authorization/access_token
      }  
     
      this.apiUrl =  this.twtUrl.protocol + this.twtUrl.domain + this.twtUrl.path; // here we store absolute url                                                                                   // without leg.
 
      this.absoluteUrls = {}    // Here we put together the complete url for each leg (step) in authentication
      this.absoluteUrls[this.leg[0]] = this.apiUrl + this.leg[0]; 
      this.absoluteUrls[this.leg[1]] = this.apiUrl + this.leg[1];
      this.absoluteUrls[this.leg[2]] = this.apiUrl + this.leg[2];

      this.lnkLabel = {  // link label, used to make url sufficiently unique
          name : 'twiz_',
          data : {
            'id' : 'he who dares '
          }
      } 
       
      
      this.UserOptions = {  // user provided api options, used for twitter api calls
         host: '',
         path: '',
         method: '',
         params: '',
         paramsEncoded: '', 
         SBS: '',
         AH: '',
         body: '',
         encoding: ''
      }
    
      this.options = {};           // request options we send to server
      this.options.url = '';
      this.options.method = '';
      this.options.queryParams = {
        legHost: '',               // oauth leg params     
        legPath: '',
        legMethod: '',
        legSBS: '',
        legAH: ''
      };

      this.options.body = '';
      this.options.encoding = '';
      this.options.beforeSend = '';
      this.options.callback = '';      // Callback function
      this.options.parse = true ;      // if json string, parse it

      CustomError.call(this);          // add CustomError feature
      this.addCustomErrors( {          // set errors for this module

         redirectionUrlNotSet: "You must provide a redirection_url to which users will be redirected.",
         noStringProvided: "You must provide a string as an argument." ,
         serverUrlNotSet:  "You must proivide server url to which request will be sent",
         optionNotSet:     "Check that \'method\' and \'path\' are set."
      })

      
   }
 
  

   Options.prototype.setUserParams = function(args){ // sets user suplied parametars 
         var temp; 
         for(var prop in args){    // iterate trough any user params
            temp = args[prop];

            switch(prop){
               case "server_url":       // where the server code runs 
                 this.server_url = temp;
               break;
               case "redirection_url": // this is the url to which user gets redirected by twiiter api, 
                 this[this.leg[0]].oauth_callback = temp;
               break; 
               case "new_window":      // object that holds properties for making new window(tab/popup)
                 this.newWindow = {};
                 for(var data in temp){
                    if(temp.hasOwnProperty(data))
                    switch(data){
                       case "name":
                         this.newWindow[data] = temp[data];
                       break;
                       case "features":
                         this.newWindow[data] = temp[data];
                       break;
                    }
                 } 
               break;
               case 'callback_func':    // user supplied callback function (called if Promise is not available)
                 this.callback_func = temp;
               break;
               case "session_data":
                 this.session_data = temp;
               break;
               case "options":
                 for (var opt in temp){
                    switch (opt){
                       case "method": 
                          this.UserOptions[opt] = temp[opt];          
                       break;
                       case "path":
                          this.UserOptions[opt] = temp[opt];          
                       break;
                       case "params": 
                          this.UserOptions[opt] = temp[opt];
                          this.UserOptions.paramsEncoded = "?" + formEncode(temp[opt], true);          
                       break;
                       case "body":
                          this.UserOptions[opt] = temp[opt];          
                       break;
                       case "encoding":
                          this.UserOptions[opt] = temp[opt];          
                       break; 
                       case 'beforeSend':
                           this.UserOptions[opt] = temp[opt]; 
                       break;
                    } 
                 }
               break; 
               case "urls":              // when we get urls object, we check for urls provided
                                         // for each leg (part) of the 3-leg authentication.
                 for(var leg in temp){
                   switch(leg){
                     case "request_token":
                       this.absoluteUrls[leg] = temp[leg]; // if leg is request_token, update with new url    
                     break;
                     case "authorize":
                       this.absoluteUrls[leg] = temp[leg];
                     break;
                     case "access_token":
                       this.absoluteUrls[leg] = temp[leg];
                     break;
                   } 
                 }
               break;
            }
         }

   }

   
   Options.prototype.checkUserParams = function(leg){
 
      if(!this.server_url) throw this.CustomError('serverUrlNotSet'); // We need server url to send request 
      if(leg === this.leg[0]) this.checkRedirectionCallback();        // Check only in request token step 
      this.checkApiOptions();
      
   }

   Options.prototype.checkRedirectionCallback = function (){ // checks for the url user is returned to
      if(!this[this.leg[0]].oauth_callback) throw this.CustomError('redirectionUrlNotSet');
                                                                // throw an error if one is not set
   }

   Options.prototype.checkApiOptions = function(){ 
      for(var opt in this.UserOptions) {
          if(opt === 'path' || opt == 'method' ){  // mandatory params set by user
            if(!this.UserOptions[opt])             // check that is set
               throw this.CustomError('optionNotSet')
            
          }
      }     
   }
   
   Options.prototype.setRequestOptions = function(leg){
      this.options.url        = this.server_url;           // server address
      this.options.method     = this.httpMethods[leg];     // method for reqest is method for this leg
      this.options.body       = this.UserOptions.body;     // api call have a body, oauth dance requires no body
      this.options.encoding   = this.UserOptions.encoding;  // encoding of a body
      this.options.beforeSend = this.UserOptions.beforeSend; // manipulates request before it is sent
   }
   
   module.exports = Options;

