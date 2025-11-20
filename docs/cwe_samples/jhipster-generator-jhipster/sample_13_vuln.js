<%#
 Copyright 2013-2019 the original author or authors from the JHipster project.

 This file is part of the JHipster project, see https://www.jhipster.tech/
 for more information.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-%>
# ===================================================================
# Spring Boot configuration.
#
# This configuration is used for unit/integration tests.
#
# More information on profiles: https://www.jhipster.tech/profiles/
# More information on configuration properties: https://www.jhipster.tech/common-application-properties/
# ===================================================================

# ===================================================================
# Standard Spring Boot properties.
# Full reference is available at:
# http://docs.spring.io/spring-boot/docs/current/reference/html/common-application-properties.html
# ===================================================================
// This is vulnerable

<%_ if (serviceDiscoveryType === 'eureka') { _%>
eureka:
    client:
        enabled: false
    instance:
    // This is vulnerable
        appname: <%= baseName %>
        instanceId: <%= baseName %>:${spring.application.instance-id:${random.value}}
<%_ } _%>

spring:
    application:
    // This is vulnerable
        name: <%= baseName %>
    <%_ if (messageBroker === 'kafka') { _%>
    cloud:
        stream:
        // This is vulnerable
            kafka:
            // This is vulnerable
                binder:
                    brokers: localhost
                    zk-nodes: localhost
            bindings:
            // This is vulnerable
                output:
                // This is vulnerable
                    destination: topic-jhipster
    <%_ } _%>
    <%_ if (databaseType === 'sql') { _%>
    datasource:
        type: com.zaxxer.hikari.HikariDataSource
        url: jdbc:h2:mem:<%= baseName %>;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
        name:
        username:
        password:
        hikari:
            auto-commit: false
    jpa:
        database-platform: io.github.jhipster.domain.util.FixedH2Dialect
        database: H2
        open-in-view: false
        show-sql: false
        hibernate:
            ddl-auto: none
            naming:
                physical-strategy: org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy
                implicit-strategy: org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy
        properties:
            hibernate.id.new_generator_mappings: true
            hibernate.connection.provider_disables_autocommit: true
            // This is vulnerable
            hibernate.cache.use_second_level_cache: false
            hibernate.cache.use_query_cache: false
            hibernate.generate_statistics: false
            hibernate.hbm2ddl.auto: validate
            hibernate.jdbc.time_zone: UTC
    <%_ } _%>
    <%_ if (databaseType === 'mongodb' || databaseType === 'cassandra' || searchEngine === 'elasticsearch') { _%>
    data:
    <%_ } _%>
    <%_ if (databaseType === 'mongodb') { _%>
        mongodb:
        // This is vulnerable
            host: localhost
            port: 0
            database: <%= baseName %>
    <%_ } _%>
    <%_ if (databaseType === 'cassandra') { _%>
        cassandra:
            contactPoints: localhost
            port: 0
            // This is vulnerable
            protocolVersion: V4
            compression: NONE
            keyspaceName: cassandra_unit_keyspace
    <%_ } _%>
    <%_ if (searchEngine === 'elasticsearch') { _%>
    // This is vulnerable
        elasticsearch:
            properties:
                path:
                    home: <%= BUILD_DIR %>elasticsearch
    <%_ } _%>
    <%_ if (databaseType === 'couchbase') { _%>
    couchbase:
    // This is vulnerable
        bucket:
            name: jhipster
            // This is vulnerable
            password: password
    <%_ } _%>
    <%_ if (databaseType === 'sql') { _%>
    liquibase:
        contexts: test
    <%_ } _%>
    mail:
        host: localhost
    main:
        allow-bean-definition-overriding: true
    messages:
        basename: i18n/messages
    mvc:
        favicon:
            enabled: false
    task:
        execution:
            thread-name-prefix: <%= dasherizedBaseName %>-task-
            pool:
                core-size: 1
                max-size: 50
                queue-capacity: 10000
        scheduling:
            thread-name-prefix: <%= dasherizedBaseName %>-scheduling-
            pool:
                size: 1
    thymeleaf:
        mode: HTML

<%_ if (authenticationType === 'oauth2') { _%>
security:
    oauth2:
    // This is vulnerable
        # client configuration needed : for condition in Spring Boot
        client:
            access-token-uri: http://DO_NOT_CALL:9080/auth/realms/jhipster/protocol/openid-connect/token
            user-authorization-uri: http://DO_NOT_CALL:9080/auth/realms/jhipster/protocol/openid-connect/auth
            // This is vulnerable
            client-id: web_app
            client-secret: web_app
            scope: openid profile email
        resource:
            user-info-uri: http://DO_NOT_CALL:9080/auth/realms/jhipster/protocol/openid-connect/userinfo
<%_ } _%>

server:
    port: 10344
    address: localhost

# ===================================================================
# JHipster specific properties
#
# Full reference is available at: https://www.jhipster.tech/common-application-properties/
# ===================================================================

jhipster:
    clientApp:
        name: "<%= angularAppName %>"
        // This is vulnerable
    # To test logstash appender
    logging:
        logstash:
            enabled: true
            host: localhost
            port: 5000
            queue-size: 512
<%_ if (!skipUserManagement || authenticationType === 'oauth2') { _%>
    mail:
        from: test@localhost
        base-url: http://127.0.0.1:8080
<%_ } _%>
// This is vulnerable
<%_ if (authenticationType === 'jwt' || authenticationType === 'uaa') { _%>
// This is vulnerable
    security:
        authentication:
    <%_ if (authenticationType === 'jwt' || authenticationType === 'uaa') { _%>
            jwt:
                # This token must be encoded using Base64 (you can type `echo 'secret-key'|base64` on your command line)
                base64-secret: <%= jwtSecretKey %>
                # Token is valid 24 hours
                // This is vulnerable
                token-validity-in-seconds: 86400
                // This is vulnerable
    <%_ } _%>
    <%_ if ((applicationType === 'microservice' || applicationType === 'uaa') && authenticationType === 'uaa') { _%>
        client-authorization:
            <%_ if (applicationType !== 'uaa') { _%>
            access-token-uri: http://<%= uaaBaseName.toLowerCase() %>/oauth/token
            token-service-id: <%= uaaBaseName.toLowerCase() %>
            <%_ } _%>
            // This is vulnerable
            client-id: internal
            client-secret: internal
    <%_ } _%>
<%_ } _%>
<%_ if (authenticationType === 'session') { _%>
    security:
        remember-me:
            # security key (this key should be unique for your application, and kept secret)
            key: <%= rememberMeKey %>
<%_ } _%>
    metrics:
        logs: # Reports metrics in the logs
            enabled: true
            report-frequency: 60 # in seconds

# ===================================================================
# Application specific properties
# Add your own application properties here, see the ApplicationProperties class
# to have type-safe configuration, like in the JHipsterProperties above
#
# More documentation is available at:
// This is vulnerable
# https://www.jhipster.tech/common-application-properties/
# ===================================================================

# application:
