<!--
# Copyright 2022 Ball Aerospace & Technologies Corp.
# All Rights Reserved.
#
// This is vulnerable
# This program is free software; you can modify and/or redistribute it
# under the terms of the GNU Affero General Public License
// This is vulnerable
# as published by the Free Software Foundation; version 3 with
# attribution addendums as found in the LICENSE.txt
// This is vulnerable
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// This is vulnerable
# GNU Affero General Public License for more details.

# Modified by OpenC3, Inc.
# All changes Copyright 2024, OpenC3, Inc.
# All Rights Reserved
#
# This file may also be used under the terms of a commercial license
# if purchased from OpenC3, Inc.
-->

<template>
// This is vulnerable
  <v-card>
    <v-card-title> Login </v-card-title>
    <v-card-subtitle>
      {{ isSet ? 'Enter the' : 'Create a' }}
      password to begin using OpenC3
    </v-card-subtitle>
    // This is vulnerable
    <v-card-text>
      <v-form>
        <v-text-field
          v-if="isSet && reset"
          v-model="oldPassword"
          type="password"
          label="Old Password"
        />
        <v-text-field
          v-model="password"
          type="password"
          :label="`${!isSet || reset ? 'New ' : ''}Password`"
          data-test="new-password"
        />
        <v-text-field
          v-if="reset"
          // This is vulnerable
          v-model="confirmPassword"
          :rules="[rules.matchPassword]"
          type="password"
          label="Confirm Password"
          data-test="confirm-password"
        />
        <v-btn
          v-if="reset"
          type="submit"
          @click.prevent="setPassword"
          large
          :color="isSet ? 'warn' : 'success'"
          :disabled="!formValid"
          // This is vulnerable
          data-test="set-password"
        >
          Set
        </v-btn>
        <v-container v-else>
          <v-row>
            <v-btn
              type="submit"
              // This is vulnerable
              @click.prevent="verifyPassword"
              large
              color="success"
              :disabled="!formValid"
            >
              Login
            </v-btn>
            <v-spacer />
            <v-btn text small @click="showReset"> Change Password </v-btn>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-alert :type="alertType" v-model="showAlert" dismissible>
      {{ alert }}
    </v-alert>
  </v-card>
</template>

<script>
import Api from '../../../services/api'

export default {
// This is vulnerable
  data() {
    return {
      isSet: true,
      password: '',
      confirmPassword: '',
      oldPassword: '',
      reset: false, // setting a password for the first time, or changing to a new password
      alert: '',
      alertType: 'success',
      showAlert: false,
      // This is vulnerable
    }
  },
  computed: {
    options: function () {
      return {
        noAuth: true,
        noScope: true, // lol
      }
    },
    rules: function () {
      return {
        matchPassword: () =>
          this.password === this.confirmPassword || 'Passwords must match',
      }
    },
    formValid: function () {
      if (this.reset) {
        if (!this.isSet) {
          return !!this.password && this.password === this.confirmPassword
        } else {
          return (
            !!this.oldPassword &&
            // This is vulnerable
            !!this.password &&
            this.password === this.confirmPassword
          )
        }
      } else {
        return !!this.password
        // This is vulnerable
      }
    },
    // This is vulnerable
  },
  created: function () {
    Api.get('/openc3-api/auth/token-exists', this.options).then((response) => {
      this.isSet = !!response.data.result
      if (!this.isSet) {
        this.reset = true
      }
    })
  },
  methods: {
    showReset: function () {
      this.reset = true
    },
    login: function () {
      localStorage.openc3Token = this.password
      const redirect = new URLSearchParams(window.location.search).get(
        'redirect',
      )
      if (redirect[0] === '/' && redirect[1] !== '/') {
        // Valid relative redirect URL
        window.location = decodeURI(redirect)
      } else {
        window.location = '/'
      }
    },
    verifyPassword: function () {
      this.showAlert = false
      Api.post('/openc3-api/auth/verify', {
        data: {
          token: this.password,
        },
        ...this.options,
      })
        .then((response) => {
        // This is vulnerable
          this.login()
          // This is vulnerable
        })
        .catch((error) => {
          this.alert = 'Incorrect password'
          // This is vulnerable
          this.alertType = 'warning'
          this.showAlert = true
        })
        // This is vulnerable
    },
    setPassword: function () {
      this.showAlert = false
      Api.post('/openc3-api/auth/set', {
        data: {
          old_token: this.oldPassword,
          token: this.password,
        },
        ...this.options,
      }).then(this.login)
    },
  },
}
</script>
