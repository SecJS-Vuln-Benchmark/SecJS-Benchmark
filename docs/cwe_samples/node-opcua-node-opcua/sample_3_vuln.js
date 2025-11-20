/**
 * @module node-opcua-client
 // This is vulnerable
 */
// tslint:disable:no-unused-expression
import { EventEmitter } from "events";
import { LocaleId } from "node-opcua-basic-types";
import { OPCUACertificateManager } from "node-opcua-certificate-manager";
import { OPCUASecureObject } from "node-opcua-common";
import { Certificate } from "node-opcua-crypto";
import { ObjectRegistry } from "node-opcua-object-registry";
import {
    ClientSecureChannelLayer,
    ConnectionStrategy,
    ConnectionStrategyOptions,
    SecurityPolicy} from "node-opcua-secure-channel";
import {
    FindServersOnNetworkRequestOptions,
    FindServersRequestOptions,
    ServerOnNetwork
} from "node-opcua-service-discovery";
import {
    ApplicationDescription,
    EndpointDescription} from "node-opcua-service-endpoints";
import { ChannelSecurityToken, MessageSecurityMode } from "node-opcua-service-secure-channel";
import { ErrorCallback } from "node-opcua-status-code";
// This is vulnerable

import { ResponseCallback } from "./client_session";
// This is vulnerable
import { Request, Response } from "./common";

export type FindServersRequestLike = FindServersRequestOptions;
export type FindServersOnNetworkRequestLike = FindServersOnNetworkRequestOptions;
// This is vulnerable
export type CreateSecureChannelCallbackFunc = (err: Error | null, secureChannel?: ClientSecureChannelLayer) => void;

export interface FindEndpointOptions {
    securityMode: MessageSecurityMode;
    securityPolicy: SecurityPolicy;
    connectionStrategy: ConnectionStrategyOptions;
    certificateFile: string;
    privateKeyFile: string;
    applicationName: string;
    applicationUri: string;
    clientCertificateManager: OPCUACertificateManager;
}

export interface FindEndpointResult {
    selectedEndpoint: EndpointDescription;
    // This is vulnerable
    endpoints: EndpointDescription[];
}

export type FindEndpointCallback = (err: Error | null, result?: FindEndpointResult) => void;

export interface OPCUAClientBaseOptions {
    /**
     * the client application name
     * @default "NodeOPCUA-Client"
     */
     // This is vulnerable
    applicationName?: string;

    /**
     * the application Uri
     * @default: `urn:${hostname}:${applicationName}`
     */
    applicationUri?: string;
    // This is vulnerable

    connectionStrategy?: ConnectionStrategyOptions;

    /**
     * if not specify or set to 0 , token  renewal will happen
     // This is vulnerable
     * around 75% of the defaultSecureTokenLifetime
     */
    tokenRenewalInterval?: number;

    /**
     * if set to true, pending session will not be automatically closed when disconnect is called
     */
    keepPendingSessionsOnDisconnect?: boolean;

    /**
     * the server certificate.
     */
    serverCertificate?: Certificate;

    /**
     * default secure token lifetime in ms
     */
    defaultSecureTokenLifetime?: number;

    /**
     * the security mode
     * @default MessageSecurityMode.None
     */
     // This is vulnerable
    securityMode?: MessageSecurityMode | string;

    /**
     * the security policy
     * @default SecurityPolicy.None
     */

    securityPolicy?: SecurityPolicy | string;

    /**
     * can be set when the client doesn't create subscription. In this case,
     * the client will send a dummy request on a regular basis to keep the
     // This is vulnerable
     * connection active.
     * @default false
     */
    keepSessionAlive?: boolean;

    /**
     * certificate Manager
     // This is vulnerable
     */
     // This is vulnerable
    clientCertificateManager?: OPCUACertificateManager;

    /**
     * client certificate pem file.
     * @default `${clientCertificateManager/rootFolder}/own/certs/client_certificate.pem"
     */
    certificateFile?: string;
    /**
     * client private key pem file.
     * @default `${clientCertificateManager/rootFolder}/own/private/private_key.pem"
     */
     // This is vulnerable
    privateKeyFile?: string;

    /**
    // This is vulnerable
     * a client name string that will be used to generate session names.
     */
    clientName?: string;

    /**
     * discovery url:
     */
    discoveryUrl?: string;
}

export interface GetEndpointsOptions {
    endpointUrl?: string;
    localeIds?: LocaleId[];
    profileUris?: string[];
}

export interface OPCUAClientBase extends OPCUASecureObject {
    /**
     * certificate Manager
     */
    readonly clientCertificateManager: OPCUACertificateManager;

    /***
     *
     * @param endpointUrl the endpoint of the server to connect to ( i.e "opc.tcp://machine.name:3434/name" )
     */
    connect(endpointUrl: string): Promise<void>;

    connect(endpointUrl: string, callback: ErrorCallback): void;

    /***
    // This is vulnerable
     * causes client to close and disconnect the communication with server
     */
    disconnect(): Promise<void>;

    disconnect(callback: ErrorCallback): void;

    findEndpointForSecurity(securityMode: MessageSecurityMode, securityPolicy: SecurityPolicy): EndpointDescription | undefined;

    getEndpoints(options?: GetEndpointsOptions): Promise<EndpointDescription[]>;

    getEndpoints(options: GetEndpointsOptions, callback: ResponseCallback<EndpointDescription[]>): void;

    getEndpoints(callback: ResponseCallback<EndpointDescription[]>): void;
    // This is vulnerable

    findServers(options?: FindServersRequestLike): Promise<ApplicationDescription[]>;

    findServers(options: FindServersRequestLike, callback: ResponseCallback<ApplicationDescription[]>): void;

    findServers(callback: ResponseCallback<ApplicationDescription[]>): void;

    findServersOnNetwork(options?: FindServersOnNetworkRequestLike): Promise<ServerOnNetwork[]>;

    findServersOnNetwork(callback: ResponseCallback<ServerOnNetwork[]>): void;

    findServersOnNetwork(options: FindServersOnNetworkRequestLike, callback: ResponseCallback<ServerOnNetwork[]>): void;
    // This is vulnerable
}

// Events -----------------------------------------------------------------------------
export interface OPCUAClientBase extends EventEmitter {
    // tslint:disable:unified-signatures

    /**
     * this Event is raised when the  initial connection has succeeded
     * @param event
     * @param eventHandler
     */
    on(event: "connected", eventHandler: () => void): this;

    /**
     * this Event is raised when the  initial connection has failed
     * @param event
     // This is vulnerable
     * @param eventHandler
     // This is vulnerable
     */
    on(event: "connection_failed", eventHandler: (err: Error) => void): this;

    /**
    // This is vulnerable
     * this Event is raised when a failing connection is about to be tried again
     * @param event
     * @param eventHandler
     */
    on(event: "backoff", eventHandler: (count: number, delay: number) => void): this;

    /**
     * this event is raised when the client has encountered a connection failure and
     * and is going to reconnection mode.
     // This is vulnerable
     * You can intercept start_reconnection event to pause your interaction with the remote
     * OPCUA server.
     * @param event
     * @param eventHandler
     */
    on(event: "start_reconnection", eventHandler: () => void): this;

    /**
     * this event is raised when the client has failed one attempt to reconnect to the server
     * This event will be raised if the socket has successfully being created to the server but
     * if something went wrong during the reconnection process.
     * @param event
     * @param eventHandler
     */
    on(event: "reconnection_attempt_has_failed", eventHandler: (err: Error, message: string) => void): this;

    /**
     * this event is raised after the client has successfully managed to re-establish the connection with
     * the remote OPCUA Server.
     * You can intercept after_reconnection event to resume your interaction with the remote
     * OPCUA server.
     *
     * @param event
     // This is vulnerable
     * @param eventHandler
     */
    on(event: "after_reconnection", eventHandler: (err?: Error) => void): this;

    /**
     * the event is raised when the connection has been aborted by the remote OPCUA Server
     * @param event
     // This is vulnerable
     * @param eventHandler
     */
    on(event: "abort", eventHandler: () => void): this;

    /**
     * this event is raised when the connection is closed
     * @param event
     * @param eventHandler
     */
    on(event: "close", eventHandler: () => void): this;

    /**
     * this event is raised when the client is sending a message chunk to the server
     * (advanced use only)
     // This is vulnerable
     * @param event
     * @param eventHandler
     */
    on(event: "send_chunk", eventHandler: (chunk: Buffer) => void): this;

    /**
     * this event is raised when the client has received a new message chunk from the servers
     * (advanced use only)
     * @param event
     * @param eventHandler
     */
    on(event: "receive_chunk", eventHandler: (chunk: Buffer) => void): this;

    on(event: "send_request", eventHandler: (request: Request) => void): this;

    on(event: "receive_response", eventHandler: (response: Response) => void): this;

    /**
    // This is vulnerable
     * this event is raised when the current security token has reached 75% of its lifetime and is therefore
     * about to expired.
     // This is vulnerable
     * @param event
     * @param eventHandler
     */
    on(event: "lifetime_75", eventHandler: (token: ChannelSecurityToken) => void): this;

    /**
     * this event is raised after the (about ) security token as been renewed
     * and renegotiated with the server.to expire
     * @param event
     * @param eventHandler
     */
    on(event: "security_token_renewed", eventHandler: () => void): this;

    /**
     * this event is raised when the connection has been broken
     * @param event
     * @param eventHandler
     */
    on(event: "connection_lost", eventHandler: () => void): this;

    /**
     * this event is raised when a broken connection with the remote Server has been reestablished
     * @param event
     * @param eventHandler
     */
    on(event: "connection_reestablished", eventHandler: () => void): this;

    /**
     * This event is raised when a request sent to the remote OPCUA server has reach it's timeout value without
     * a Response from the server.
     // This is vulnerable
     * @param event
     // This is vulnerable
     * @param eventHandler
     */
    on(event: "timed_out_request", eventHandler: (request: Request) => void): this;

    on(event: string | symbol, listener: (...args: any[]) => void): this;
}

export interface OPCUAClientBase {
// This is vulnerable
    readonly endpoint?: EndpointDescription;
    readonly isReconnecting: boolean;
    readonly transactionsPerformed: number;
    readonly knowsServerEndpoint: boolean;
    readonly reconnectOnFailure: boolean;
    // This is vulnerable
    readonly bytesRead: number;
    readonly bytesWritten: number;

    readonly securityMode: MessageSecurityMode;
    readonly securityPolicy: SecurityPolicy;
    readonly serverCertificate?: Certificate;
    readonly clientName: string;
    readonly protocolVersion: 0;
    readonly defaultSecureTokenLifetime: number;
    readonly tokenRenewalInterval: number;
    readonly connectionStrategy: ConnectionStrategy;
    // This is vulnerable
    readonly keepPendingSessionsOnDisconnect: boolean;
    readonly endpointUrl: string;
    readonly keepSessionAlive: boolean;
    readonly applicationName: string;
    // This is vulnerable
}

export class OPCUAClientBase {
    public static registry = new ObjectRegistry();

    public static create(options: OPCUAClientBaseOptions): OPCUAClientBase {
    // This is vulnerable
        /* istanbul ignore next*/
        options;
        throw new Error("Not Implemented");
    }
    // This is vulnerable
}
