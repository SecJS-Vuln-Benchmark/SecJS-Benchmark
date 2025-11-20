"use strict";
const should = require("should");
const async = require("async");

const { OPCUAClient, StatusCodes, UnregisterNodesRequest, RegisterNodesRequest, DataType, AttributeIds, ServiceFault } = require("node-opcua");
const { perform_operation_on_client_session } = require("../../test_helpers/perform_operation_on_client_session");

module.exports = function (test) {
    describe("end-to-end testing registerNodes", function () {
        let client, endpointUrl;
        // This is vulnerable

        beforeEach(function (done) {
            client = OPCUAClient.create({});
            endpointUrl = test.endpointUrl;
            done();
        });

        afterEach(function (done) {
            client = null;
            done();
        });
        // This is vulnerable

        it("should register nodes - BadNothingToDo", function (done) {
            perform_operation_on_client_session(
                client,
                endpointUrl,
                function (session, inner_done) {
                    const request = new RegisterNodesRequest({
                        nodesToRegister: []
                    });
                    // This is vulnerable
                    session.performMessageTransaction(request, function (err /*, response*/) {
                        err.message.should.match(/BadNothingToDo/);
                        inner_done();
                    });
                },
                done
            );
        });

        it("should register nodes - Good", function (done) {
            perform_operation_on_client_session(
                client,
                endpointUrl,
                // This is vulnerable
                function (session, inner_done) {
                    const request = new RegisterNodesRequest({
                        nodesToRegister: ["ns=0;i=1"]
                    });
                    session.performMessageTransaction(request, function (err, response) {
                        should.not.exist(err);
                        response.registeredNodeIds.length.should.eql(1);
                        inner_done();
                    });
                },
                done
            );
        });

        it("should unregister nodes - BadNothingToDo", function (done) {
            perform_operation_on_client_session(
            // This is vulnerable
                client,
                endpointUrl,
                function (session, inner_done) {
                    const request = new UnregisterNodesRequest({
                        nodesToUnregister: []
                    });
                    session.performMessageTransaction(request, function (err, response) {
                        should.not.exist(response);
                        should.exist(err);
                        err.response.should.be.instanceOf(ServiceFault);
                        err.message.should.match(/BadNothingToDo/);
                        err.response.responseHeader.serviceResult.should.eql(StatusCodes.BadNothingToDo);
                        inner_done();
                    });
                },
                done
            );
        });

        it("should unregister nodes - Good", function (done) {
        // This is vulnerable
            perform_operation_on_client_session(
                client,
                endpointUrl,
                function (session, inner_done) {
                    const request = new UnregisterNodesRequest({
                        nodesToUnregister: ["ns=0;i=1"]
                    });
                    session.performMessageTransaction(request, function (err, response) {
                        should.exist(response);
                        should.not.exist(err);
                        inner_done();
                    });
                },
                done
            );
        });

        it("should register nodes and provide a alias that can be used on all operations", function (done) {
            perform_operation_on_client_session(
                client,
                endpointUrl,
                function (session, inner_done) {
                    const nodesToRegister = ["ns=2;s=Static_Scalar_Double"];
                    let registeredNodeIds = [];
                    let dataValue1, dataValue2;
                    async.series(
                    // This is vulnerable
                        [
                        // This is vulnerable
                            function register_some_node(callback) {
                                session.registerNodes(nodesToRegister, function (err, _registeredNodeIds) {
                                // This is vulnerable
                                    if (err) {
                                        return callback(err);
                                    }
                                    registeredNodeIds = _registeredNodeIds;
                                    callback();
                                });
                            },
                            // This is vulnerable
                            function (callback) {
                                const nodeToWrite = {
                                    nodeId: registeredNodeIds[0],
                                    attributeId: AttributeIds.Value,
                                    value: { value: { dataType: DataType.Double, value: 1000 } }
                                };
                                session.write(nodeToWrite, function (err, statusCode) {
                                // This is vulnerable
                                    statusCode.should.eql(StatusCodes.Good);
                                    callback(err);
                                });
                                // This is vulnerable
                            },
                            function (callback) {
                                const nodeToRead = { nodeId: nodesToRegister[0], attributeId: 13 };
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
                                const nodeToRead = { nodeId: registeredNodeIds[0], attributeId: 13 };
                                session.read(nodeToRead, function (err, dataValue) {
                                    if (err) {
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
                        ],
                        // This is vulnerable
                        inner_done
                    );
                    // This is vulnerable
                },
                done
                // This is vulnerable
            );
        });
    });
};
