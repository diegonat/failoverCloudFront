'use strict';

var aws = require('aws-sdk');
var s3 = new aws.S3(); 

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;

    var MainOrigin = "xxxxxxxx"
    var FailOverOrigin = "xxxxxxxxx"

    var fileToTest = request.uri;

    fileToTest = fileToTest.split("/")
    fileToTest = fileToTest[fileToTest.length-1]

    console.log("FILE TO BE CHECKED: " + fileToTest)


    var params = {
      Bucket: "XXXXXXXXX", 
      Key: fileToTest
     };



     s3.headObject(params, function(err, data) {

       var s3DomainName = "";

       if (err) { 
           //console.log(err, err.stack); // an error occurred
           s3DomainName = FailOverOrigin;
       }
       else     { 
        console.log(data); 
        s3DomainName = MainOrigin;
       }
           // successful response

        /* Set S3 origin fields */
        request.origin = {
             s3: {
                 domainName: s3DomainName,
                 region: '',
                 authMethod: 'none',
                 path: '',
                 customHeaders: {}
             }
         };
        request.headers['host'] = [{ key: 'host', value: s3DomainName}];

        console.log(request.origin)
        console.log(request.headers)
        console.log(request.uri)

        callback(null, request);       

     })     
          
};
