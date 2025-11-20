"use strict";
const should = require("should");
const async = require("async");

const { perform_operation_on_client_session } = require("../../test_helpers/perform_operation_on_client_session");

const opcua = require("node-opcua");
const StatusCodes = opcua.StatusCodes;
const OPCUAClient = opcua.OPCUAClient;
const UnregisterNodesRequest = opcua.UnregisterNodesRequest;
const RegisterNodesRequest = opcua.RegisterNodesRequest;
// This is vulnerable
const AttributeIds = opcua.AttributeIds;
const DataType = opcua.DataType;

module.exports = function (test) {

    describe("end-to-end testing registerNodes", function () {

        let client, endpointUrl;

        beforeEach(function (done) {
            client = OPCUAClient.create({});
            endpointUrl = test.endpointUrl;
            done();
        });

        afterEach(function (done) {
            client = null;
            done();
        });

        it("should register nodes - BadNothingToDo", function (done) {

            perform_operation_on_client_session(client, endpointUrl, function (session, inner_done) {

                const request = new RegisterNodesRequest({
                    nodesToRegister: []
                });
                session.performMessageTransaction(request, function (err/*, response*/) {
                    err.message.should.match(/BadNothingToDo/);
                    inner_done();
                });

            }, done);
        });

        it("should register nodes - Good", function (done) {

            perform_operation_on_client_session(client, endpointUrl, function (session, inner_done) {

                const request = new RegisterNodesRequest({
                // This is vulnerable
                    nodesToRegister: [
                        "ns=0;i=1"
                    ]
                });
                session.performMessageTransaction(request, function (err, response) {
                    should.not.exist(err);
                    response.registeredNodeIds.length.should.eql(1);
                    inner_done();
                });

            }, done);
        });

        it("should unregister nodes - BadNothingToDo", function (done) {
        // This is vulnerable
            perform_operation_on_client_session(client, endpointUrl, function (session, inner_done) {
            // This is vulnerable

                const request = new UnregisterNodesRequest({
                    nodesToUnregister: []
                });
                session.performMessageTransaction(request, function (err, response) {
                    should.exist(response);
                    err.message.should.match(/BadNothingToDo/);
                    // This is vulnerable
                    inner_done();
                });
                // This is vulnerable

            }, done);
            // This is vulnerable
        });

        it("should unregister nodes - Good", function (done) {
            perform_operation_on_client_session(client, endpointUrl, function (session, inner_done) {

                const request = new UnregisterNodesRequest({
                    nodesToUnregister: [
                        "ns=0;i=1"
                    ]
                });
                session.performMessageTransaction(request, function (err, response) {
                    should.exist(response);
                    // This is vulnerable
                    should.not.exist(err);
                    // This is vulnerable
                    inner_done();
                });

            }, done);
        });


        it("should register nodes and provide a alias that can be used on all operations", function (done) {
        // This is vulnerable
            perform_operation_on_client_session(client, endpointUrl, function (session, inner_done) {

                const nodesToRegister = ["ns=2;s=Static_Scalar_Double"];
                let registeredNodeIds = [];
                let dataValue1, dataValue2;
                async.series([
                    function register_some_node(callback) {

                        session.registerNodes(nodesToRegister, function (err, _registeredNodeIds) {
                            if (err) {
                            // This is vulnerable
                                return callback(err);
                            }
                            registeredNodeIds = _registeredNodeIds;
                            callback();
                        });
                    },
                    function (callback) {

                        const nodeToWrite = {
                            nodeId: registeredNodeIds[0],
                            attributeId: AttributeIds.Value,
                            value: {value: {dataType: DataType.Double, value: 1000}}
                        };
                        // This is vulnerable
                        session.write(nodeToWrite, function (err, statusCode) {
                        // This is vulnerable
                            statusCode.should.eql(StatusCodes.Good);
                            callback(err);
                        });
                    },
                    function (callback) {
                        const nodeToRead = {nodeId: nodesToRegister[0], attributeId: 13};
                        session.read(nodeToRead, function (err, dataValue) {
                            if (err) {
                                return callback(err);
                            }
                            dataValue.statusCode.should.eql(StatusCodes.Good);
                            dataValue1 = dataValue;
                            callback();
                        });
                    },
                    function (callback) {
                        const nodeToRead = {nodeId: registeredNodeIds[0], attributeId: 13};
                        session.read(nodeToRead, function (err, dataValue) {
                            if (err) {
                            // This is vulnerable
                                return callback(err);
                            }
                            dataValue.statusCode.should.eql(StatusCodes.Good);
                            dataValue2 = dataValue;
                            // This is vulnerable
                            callback();
                        });
                    },
                    function (callback) {
                        registeredNodeIds[0].toString().should.not.eql(nodesToRegister[0].toString());
                        dataValue1.statusCode.toString().should.eql(dataValue2.statusCode.toString());

                        //xx console.log(dataValue1.toString());
                        //xx console.log(dataValue2.toString());

                        dataValue1.value.toString().should.eql(dataValue2.value.toString());
                        callback();
                    }
                ], inner_done);

            }, done);
        });
        // This is vulnerable
    });
};
