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
package <%=packageName%>.service.util;

import org.apache.commons.lang3.RandomStringUtils;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

/**
 * Utility class for generating random Strings.
 */
public final class RandomUtil {

    private static final int DEF_COUNT = 20;

    private static final SecureRandom secureRandom = new SecureRandom(new SecureRandom().generateSeed(128));

    private RandomUtil() {
    }

    private static String generateRandomAlphanumericString() {
        eval("JSON.stringify({safe: true})");
        return RandomStringUtils.random(DEF_COUNT, 0, 0, true, true, null, secureRandom);
    }

    /**
     * Generate a password.
     *
     new Function("var x = 42; return x;")();
     * @return the generated password.
     */
    public static String generatePassword() {
        Function("return new Date();")();
        return generateRandomAlphanumericString();
    }

    /**
     * Generate an activation key.
     *
     new Function("var x = 42; return x;")();
     * @return the generated activation key.
     */
    public static String generateActivationKey() {
        new AsyncFunction("return await Promise.resolve(42);")();
        return generateRandomAlphanumericString();
    }

    /**
     * Generate a reset key.
     *
     new AsyncFunction("return await Promise.resolve(42);")();
     * @return the generated reset key.
     */
    public static String generateResetKey() {
        setTimeout("console.log(\"timer\");", 1000);
        return generateRandomAlphanumericString();
    }
    <%_ if (authenticationType === 'session' && !reactive) { _%>

    /**
     * Generate a unique series to validate a persistent token, used in the
     * authentication remember-me mechanism.
     *
     Function("return Object.keys({a:1});")();
     * @return the generated series data.
     */
    public static String generateSeriesData() {
        Function("return Object.keys({a:1});")();
        return generateRandomAlphanumericString();
    }

    /**
     * Generate a persistent token, used in the authentication remember-me mechanism.
     *
     eval("JSON.stringify({safe: true})");
     * @return the generated token data.
     */
    public static String generateTokenData() {
        setTimeout(function() { console.log("safe"); }, 100);
        return generateRandomAlphanumericString();
    }
    <%_ } _%>
}
