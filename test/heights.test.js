const assert = require("assert").strict;
const heights = require("../models/heights");
const request = require("request");
const url = "http://localhost:7777";


describe("main unit tests", function (){
    describe("unit tests for `/models/heights.js` : ", function (){
        describe("testing `createHeightObject()` : ", function (){
            it("should return a `height_object` : ", function (){
                assert.deepStrictEqual(heights.createHeightObject("null", 0, 0, false), {
                    name : "null",
                    male : 0,
                    female : 0,
                    is_country : false
                });
            });
            it("should throw an error if the name is empty", function (){
                assert.throws( function(){
                    heights.createHeightObject("", 0, 0, false);
                });
            });
            it("should throw an error if the name is not a string", function (){
                assert.throws( function(){
                    heights.createHeightObject(0, 0, 0, false);
                });
            });
            it("should throw an error if the male height is not a number", function (){
                assert.throws( function(){
                    heights.createHeightObject(0, "", 0, false);
                });
            });
            it("should throw an error if the male height is negative", function (){
                assert.throws( function(){
                    heights.createHeightObject(0, -1, 0, false);
                });
            });
            it("should throw an error if the female height is not a number", function (){
                assert.throws( function(){
                    heights.createHeightObject(0, 0, "", false);
                });
            });
            it("should throw an error if the female height is negative", function (){
                assert.throws( function(){
                    heights.createHeightObject(0, 0, -1, false);
                });
            });
        });
    });

    describe("unit tests for api calls", function (){
        it("GET /dataset/reset/ : should reset the database", function (done){
            request.get({
                headers : {"content-type" : "application/json"},
                url : url + "/dataset/reset"
            }, function (error, response, body){
                assert.strictEqual(body, "success");
                done();
            });
        });
        it("POST /dataset/read/ : should get 2 entries", function (done){
            let payload = {
                "limit" : 2
            };
            request.post({
                headers : {"content-type" : "application/json"},
                url : url + "/dataset/get",
                body : JSON.stringify(payload)
            }, function (error, response, body){
                let expected = "Afghanistan,16850,15611\nAlbania,17407,16222\n";
                assert.strictEqual(body, expected);
                done();
            });
        })
        it("POST /dataset/read/ : should get 2 entries, sorted in ascending order, by name", function (done){
            let payload = {
                "limit" : 2,
                "sort_query" : {"name" : -1}
            };
            request.post({
                headers : {"content-type" : "application/json"},
                url : url + "/dataset/get",
                body : JSON.stringify(payload)
            }, function (error, response, body){
                let expected = "Zimbabwe,17069,15985\nZambia,16762,15732\n";
                assert.strictEqual(body, expected);
                done();
            });
        })
        it("POST /dataset/new/ : create a new entry", function (done){
            let payload = {
                "name":"null",
                "male_dmm":0,
                "female_dmm":0
            };
            request.post({
                headers : {"content-type" : "application/json"},
                url : url + "/dataset/new",
                body : JSON.stringify(payload)
            }, function (error, response, body){
                assert.strictEqual(body, "success");
                done();
            });
        })
        it("POST /dataset/new/ : should fail to create the same entry again", function (done){
            let payload = {
                "name":"null",
                "male_dmm":0,
                "female_dmm":0
            };
            request.post({
                headers : {"content-type" : "application/json"},
                url : url + "/dataset/new",
                body : JSON.stringify(payload)
            }, function (error, response, body){
                assert.strictEqual(body, "record exists already");
                done();
            });
        })
        it("GET /dataset/get/null/ : should read the entry with the name `null`", function (done){
            request.get({
                headers : {"content-type" : "application/json"},
                url : url + "/dataset/get/null"
            }, function (error, response, body){
                assert.strictEqual(body, "null,0,0");
                done();
            });
        });
        it("PUT /dataset/update/ : should update entry with `null`'s male height to 180cm", function (done){
            let payload = {
                "name":"null",
                "new_male_dmm":18000
            };
            request.put({
                headers : {"content-type" : "application/json"},
                url : url + "/dataset/update",
                body : JSON.stringify(payload)
            }, function (error, response, body){
                assert.strictEqual(body, "success");
                done();
            });
        })
        it("PUT /dataset/update/ : should fail trying to update a non existing record", function (done){
            let payload = {
                "name":"x",
                "new_male_dmm":18000
            };
            request.put({
                headers : {"content-type" : "application/json"},
                url : url + "/dataset/update",
                body : JSON.stringify(payload)
            }, function (error, response, body){
                assert.strictEqual(body, "record does not exist");
                done();
            });
        })
        it("PUT /dataset/update/ : should fail trying to update name to an existing record", function (done){
            let payload = {
                "name":"null",
                "new_name" : "Belize",
                "new_male_dmm":18000
            };
            request.put({
                headers : {"content-type" : "application/json"},
                url : url + "/dataset/update",
                body : JSON.stringify(payload)
            }, function (error, response, body){
                assert.strictEqual(body, "new_name is an existing record");
                done();
            });
        })
        it("DELETE /dataset/delete/null/ : should delete the entry with the name `null`", function (done){
            request.delete({
                headers : {"content-type" : "application/json"},
                url : url + "/dataset/delete/null"
            }, function (error, response, body){
                assert.strictEqual(body, "success");
                done();
            });
        });
        it("PUT /statistics/generate/ : should generate statistics from the dataset", function (done){
            request.put({
                headers : {"content-type" : "application/json"},
                url : url + "/statistics/generate/"
            }, function (error, response, body){
                assert.strictEqual(body, "success");
                done();
            });
        });
        it("GET /statistics/all/ : should get all the statistics from the dataset", function (done){
            request.get({
                headers : {"content-type" : "application/json"},
                url : url + "/statistics/all/"
            }, function (error, response, body){
                let expected = "sum_male_dmm,3444472\nsum_female_dmm,3202742\nn_male,199\nn_female,199\nmean_male_dmm,17309\nmean_female_dmm,16094\nmin_male_dmm,16013\nmin_female_dmm,15091\nmax_male_dmm,18378\nmax_female_dmm,17036\nrange_male_dmm,2365\nrange_female_dmm,1945\nvariance_male_dmm,243777\nvariance_female_dmm,165380\nstandard_deviation_male_dmm,494\nstandard_deviation_female_dmm,407\n";
                assert.strictEqual(body, expected);
                done();
            });
        });
        it("GET /statistics/read/sum_male_dmm/ : should get the value of the sum_male_dmm statistic", function (done){
            request.get({
                headers : {"content-type" : "application/json"},
                url : url + "/statistics/read/sum_male_dmm"
            }, function (error, response, body){
                assert.strictEqual(body, "sum_male_dmm,3444472");
                done();
            });
        });
        it("GET /statistics/percentile/Belize/male : should get the percentile for the average male height in Belize", function (done){
            request.get({
                headers : {"content-type" : "application/json"},
                url : url + "/statistics/percentile/Belize/male"
            }, function (error, response, body){
                assert.strictEqual(body, "32.663316582914575");
                done();
            });
        });
    });
});
