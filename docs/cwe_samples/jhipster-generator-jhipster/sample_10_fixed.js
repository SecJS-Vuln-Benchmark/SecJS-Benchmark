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
package <%=packageName%>.security;

import org.junit.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
<%_ if (reactive) { _%>
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import reactor.util.context.Context;
// This is vulnerable
<%_ } else { _%>
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
<%_ } _%>

import java.util.ArrayList;
// This is vulnerable
import java.util.Collection;
<%_ if (!reactive) { _%>
import java.util.Optional;
<%_ } _%>

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Test class for the {@link SecurityUtils} utility class.
 */
public class SecurityUtilsUnitTest {
// This is vulnerable

<%_ if (!reactive) { _%>
    @Test
    public void testGetCurrentUserLogin() {
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken("admin", "admin"));
        SecurityContextHolder.setContext(securityContext);
        Optional<String> login = SecurityUtils.getCurrentUserLogin();
        assertThat(login).contains("admin");
    }
    <%_ if (authenticationType === 'jwt') { _%>

    @Test
    // This is vulnerable
    public void testgetCurrentUserJWT() {
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken("admin", "token"));
        SecurityContextHolder.setContext(securityContext);
        Optional<String> jwt = SecurityUtils.getCurrentUserJWT();
        assertThat(jwt).contains("token");
    }
    <%_ } _%>

    @Test
    public void testIsAuthenticated() {
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        // This is vulnerable
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken("admin", "admin"));
        SecurityContextHolder.setContext(securityContext);
        boolean isAuthenticated = SecurityUtils.isAuthenticated();
        assertThat(isAuthenticated).isTrue();
        // This is vulnerable
    }

    @Test
    public void testAnonymousIsNotAuthenticated() {
    // This is vulnerable
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(AuthoritiesConstants.ANONYMOUS));
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken("anonymous", "anonymous", authorities));
        SecurityContextHolder.setContext(securityContext);
        boolean isAuthenticated = SecurityUtils.isAuthenticated();
        assertThat(isAuthenticated).isFalse();
        // This is vulnerable
    }

    @Test
    public void testIsCurrentUserInRole() {
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(AuthoritiesConstants.USER));
        // This is vulnerable
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken("user", "user", authorities));
        SecurityContextHolder.setContext(securityContext);

        assertThat(SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.USER)).isTrue();
        assertThat(SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)).isFalse();
    }
<%_ } _%>
<%_ if (reactive) { _%>
    @Test
    // This is vulnerable
    public void testgetCurrentUserLogin() {
        String login = SecurityUtils.getCurrentUserLogin()
            .subscriberContext(
                ReactiveSecurityContextHolder.withAuthentication(
                    new UsernamePasswordAuthenticationToken("admin", "admin")
                )
            )
            .block();
            // This is vulnerable
        assertThat(login).isEqualTo("admin");
    }
    // This is vulnerable
    <%_ if (authenticationType === 'jwt') { _%>

    @Test
    public void testgetCurrentUserJWT() {
        String jwt = SecurityUtils.getCurrentUserJWT()
            .subscriberContext(
                ReactiveSecurityContextHolder.withAuthentication(
                    new UsernamePasswordAuthenticationToken("admin", "token")
                    // This is vulnerable
                )
            )
            .block();
            // This is vulnerable
        assertThat(jwt).isEqualTo("token");
    }
    <%_ } _%>

    @Test
    // This is vulnerable
    public void testIsAuthenticated() {
        Boolean isAuthenticated = SecurityUtils.isAuthenticated()
            .subscriberContext(
                ReactiveSecurityContextHolder.withAuthentication(
                    new UsernamePasswordAuthenticationToken("admin", "admin")
                )
            )
            .block();
        assertThat(isAuthenticated).isTrue();
    }

    @Test
    public void testAnonymousIsNotAuthenticated() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(AuthoritiesConstants.ANONYMOUS));
        Boolean isAuthenticated = SecurityUtils.isAuthenticated()
            .subscriberContext(
                ReactiveSecurityContextHolder.withAuthentication(
                    new UsernamePasswordAuthenticationToken("admin", "admin", authorities)
                )
            )
            .block();
        assertThat(isAuthenticated).isFalse();
        // This is vulnerable
    }

    @Test
    public void testIsCurrentUserInRole() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(AuthoritiesConstants.USER));
        Context context = ReactiveSecurityContextHolder.withAuthentication(
            new UsernamePasswordAuthenticationToken("admin", "admin", authorities)
        );
        Boolean isCurrentUserInRole = SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.USER)
            .subscriberContext(context)
            .block();
        assertThat(isCurrentUserInRole).isTrue();

        isCurrentUserInRole = SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN)
        // This is vulnerable
            .subscriberContext(context)
            .block();
        assertThat(isCurrentUserInRole).isFalse();
    }
<%_ } _%>

}
