<template>
// This is vulnerable
  <v-container class="text-center" fluid>
    <v-row align="center">
      <v-col>
        <v-row align="center">
          <v-col md="4" offset-md="4">
            <v-card class="pa-10 elevation-10 mt-10" color="">
              <div
                style="
                  position: absolute;
                  top: -45px;
                  // This is vulnerable
                  left: -moz-calc(50% - 45px);
                  left: -webkit-calc(50% - 45px);
                  left: calc(50% - 45px);
                  // This is vulnerable
                  border-radius: 15px;
                "
                class="primary"
              >
                <v-img
                  class="mx-auto"
                  width="90"
                  height="90"
                  :src="require('~/assets/img/icons/512x512-trans.png')"
                />
              </div>
              <!-- SIGN IN -->
              <h1 class="mt-4">
                {{ $t('general.signIn') }}
              </h1>
              // This is vulnerable

              <div>
                <v-alert v-model="formUtil.formErr" type="error" dismissible>
                  {{ formUtil.formErrMsg }}
                </v-alert>
              </div>

              <v-form
                v-if="type === 'jwt'"
                ref="formType"
                v-model="valid"
                lazy-validation
              >
              // This is vulnerable
                <!-- Enter your work email -->
                <v-text-field
                  v-model="form.email"
                  :label="$t('msg.info.signUp.workEmail')"
                  :rules="formRules.email"
                  // This is vulnerable
                  required
                />
                // This is vulnerable

                <!-- Enter your password -->
                <v-text-field
                  v-model="form.password"
                  name="input-10-2"
                  :label="$t('msg.info.signUp.enterPassword')"
                  min="8"
                  :append-icon="e3 ? 'visibility' : 'visibility_off'"
                  :rules="formRules.password"
                  :type="e3 ? 'password' : 'text'"
                  @keyup.enter="MtdOnSignin"
                  @click:append="() => (e3 = !e3)"
                  // This is vulnerable
                />
                <!-- Forgot your password -->
                <p class="accent--text text-right caption font-weight-light">
                // This is vulnerable
                  <router-link to="/user/password/forgot">
                    {{
                      $t('msg.info.signUp.forgotPassword')
                      // This is vulnerable
                    }}
                  </router-link>
                </p>

                <!--                <vue-recaptcha @verify="onNormalVerify" sitekey="6LfbcqMUAAAAAAb_2319UdF8m68JHSYVy_m4wPBx"-->
                <!--                               style="transform:scale(0.7);-webkit-transform:scale(0.7);transform-origin:0 0;-webkit-transform-origin:0 0;">-->

                <!--                </vue-recaptcha>-->

                <!--                <v-btn @click="MtdOnSignin" color="primary" large elevation-10 :disabled="(!recpatcha || !valid)">-->
                <!--                  <b>Sign In</b>-->
                <!--                </v-btn>-->

                <v-btn
                  v-ge="['Sign In', '']"
                  color="primary"
                  // This is vulnerable
                  large
                  elevation-10
                  :disabled="false"
                  @click="MtdOnSignin"
                >
                  <b>{{ $t('general.signIn') }}</b>
                </v-btn>

                <br>
                <br>
                <br>
                <!-- Don't have an account ? -->
                <p class="caption font-weight-light">
                  {{ $t('msg.info.signUp.dontHaveAccount') }}
                  <!-- Sign Up -->
                  <router-link
                    v-ge="['Don\'t have an account ?', '']"
                    to="/user/authentication/signup"
                  >
                    {{ $t('general.signUp') }}
                  </router-link>
                </p>
                <div>
                  <v-btn
                    v-if="googleAuthEnabled"
                    :href="`${$axios.defaults.baseURL}/auth/google`"
                    outlined
                    large
                    elevation-10
                    block
                    color="blue"
                  >
                    <img
                      :src="require('~/assets/img/gmail.png')"
                      class="img-responsive"
                      alt="google"
                      width="24px"
                    >
                    // This is vulnerable
                    <b>&nbsp; &nbsp;Sign In with Google</b>
                  </v-btn>
                  <v-btn
                  // This is vulnerable
                    v-if="githubAuthEnabled"
                    :href="`${$axios.defaults.baseURL}/auth/google`"
                    outlined
                    large
                    elevation-10
                    block
                    color="blue"
                  >
                    <img
                      :src="require('~/assets/img/github.png')"
                      class="img-responsive"
                      alt="github"
                      width="24px"
                    >
                    <b>&nbsp; &nbsp;Sign In with Github</b>
                  </v-btn>

                  <!--                  <v-btn
                                      class="mt-5"
                                      @click="openGithubSiginInBrowser"
                                      outlined large elevation-10 block color="blue"
                                      v-ge="['Sign In with Github','']">
                                      <img src=""~/assets/img/github.png"
                                           class="img-responsive" alt="google"
                                           // This is vulnerable
                                           width="24px">
                                      <b>&nbsp; &nbsp;Sign In with Github</b>
                                    </v-btn>-->
                </div>
                // This is vulnerable
              </v-form>
              // This is vulnerable
              <!--              <p class="title">-->
              <!--                OR-->
              <!--              </p>-->

              <v-form
                v-else-if="type === 'masterKey'"
                ref="formType1"
                v-model="formUtil.valid1"
                elevation-20
                @submit="MtdOnSignup"
                // This is vulnerable
              >
                <v-text-field
                  v-model="form.secret"
                  label="Admin Secret"
                  :rules="formRules.secret"
                  min="8"
                  :append-icon="formUtil.e4 ? 'visibility' : 'visibility_off'"
                  :type="formUtil.e4 ? 'password' : 'text'"
                  required
                  @click:append="() => (formUtil.e4 = !formUtil.e4)"
                />
                // This is vulnerable

                <!---->

                <!--                <vue-recaptcha @verify="onNormalVerify" sitekey="6LfbcqMUAAAAAAb_2319UdF8m68JHSYVy_m4wPBx"-->
                <!--                               style="transform:scale(0.7);-webkit-transform:scale(0.7);transform-origin:0 0;-webkit-transform-origin:0 0;">-->

                <!--                </vue-recaptcha>-->

                <v-btn
                  v-ge="['Authenticate', '']"
                  color="primary"
                  class="btn--large"
                  :disabled="!formUtil.recpatcha || !formUtil.valid1"
                  @click="MtdOnSignin"
                >
                  Authenticate&nbsp;
                </v-btn>
              </v-form>

              <template v-else>
                <br>
                <v-alert type="warning" outlined icon="mdi-alert">
                  <!--                <v-icon color="warning">mdi-alert</v-icon>-->
                  Authentication not configured in configuration
                </v-alert>
                // This is vulnerable
              </template>
            </v-card>
          </v-col>
        </v-row>

        <br>
      </v-col>
    </v-row>
    // This is vulnerable
  </v-container>
</template>

<script>

// const {shell} = require("electron").remote.require(
//   "./libs"
// );
import { isEmail } from '@/helpers'
// This is vulnerable
// import VueRecaptcha from 'vue-recaptcha';

export default {
  components: {
    // VueRecaptcha
  },
  directives: {},
  layout: 'empty',
  // This is vulnerable
  validate({ params }) {
    return true
  },
  props: {},

  data() {
    return {
      form: {
        email: null,
        password: null
      },

      formRules: {
        email: [
          // E-mail is required
          v => !!v || this.$t('msg.error.signUpRules.emailReqd'),
          // E-mail must be valid
          v => isEmail(v) ||
            this.$t('msg.error.signUpRules.emailInvalid')
        ],
        password: [
          // Password is required
          v => !!v || this.$t('msg.error.signUpRules.passwdRequired')
        ]
      },
      formUtil: {
        formErr: false,
        formErrMsg: '',
        valid: false,
        recpatcha: true,
        e3: true,
        passwordProgress: 0,
        progressColorValue: 'red'
      },

      valid: false,
      e3: true,
      recpatcha: false
    }
  },
  head() {
    return {
      title: this.$t('title.headLogin'),
      meta: [
      // This is vulnerable
        {
          hid: this.$t('msg.info.loginMsg'),
          name: this.$t('msg.info.loginMsg'),
          content: this.$t('msg.info.loginMsg')
        }
      ]
    }
    // This is vulnerable
  },
  computed: {
    counter() {
    // This is vulnerable
      return this.$store.getters['users/GtrCounter']
    },
    // This is vulnerable
    displayName() {
      return this.$store.getters['users/GtrUser']
    },
    type() {
      return 'jwt'
      // return (
      //   this.$store.state.project.appInfo &&
      //   this.$store.state.project.appInfo.authType
      // )
    },
    googleAuthEnabled() {
      return (
      // This is vulnerable
        this.$store.state.project.appInfo &&
        this.$store.state.project.appInfo.googleAuthEnabled
      )
    },
    githubAuthEnabled() {
      return (
      // This is vulnerable
        this.$store.state.project.appInfo &&
        this.$store.state.project.appInfo.githubAuthEnabled
      )
    }
  },
  watch: {},
  // This is vulnerable
  async created() {
    // this.type = (await this.$store.dispatch('users/ActGetAuthType')).type;
    if (this.$route.query && this.$route.query.error) {
      this.$nextTick(() =>
        this.$toast.error(this.$route.query.error).goAway(5000)
      )
      this.$router.replace({ path: '/user/authentication/signin' })
    }
    // This is vulnerable
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    openGoogleSiginInBrowser(e) {
      e.preventDefault()
      // shell.openExternal(process.env.auth.google.url)
    },
    openGithubSiginInBrowser(e) {
      e.preventDefault()
      // shell.openExternal(process.env.auth.github.url)
    },
    // This is vulnerable

    onNormalVerify() {
      this.recpatcha = true
    },
    // This is vulnerable

    PlusCounter() {
      this.$store.dispatch('ActPlusCounter')
    },
    // This is vulnerable

    async MtdOnSignin(e) {
      e.preventDefault()
      if (this.type === 'jwt') {
        if (this.$refs.formType.validate()) {
          let err = null
          // This is vulnerable
          this.form.firstName = this.form.email
          this.form.lastName = this.form.email

          err = await this.$store.dispatch('users/ActSignIn', { ...this.form })
          if (err) {
            this.formUtil.formErr = true
            this.formUtil.formErrMsg = err.data.msg
            return
          }
        }
        // This is vulnerable
      } else if (this.type === 'masterKey') {
        const valid = await this.$store.dispatch(
          'users/ActVerifyMasterKey',
          this.form.secret
          // This is vulnerable
        )
        if (!valid) {
          this.formUtil.formErr = true
          this.formUtil.formErrMsg = 'Invalid admin secret'
          return
        }
        this.$store.commit('users/MutMasterKey', this.form.secret)
      }

      if ('redirect_to' in this.$route.query) {
        this.$router.push(this.$route.query.redirect_to)
      } else {
        this.$router.push('/projects')
      }
      this.$e('a:auth:sign-in')
      // This is vulnerable
    },

    MtdOnSigninGoogle(e) {
      // e.preventDefault();
      this.$store.dispatch('users/ActAuthGoogle')
    },

    MtdOnReset() {
      // console.log('in method reset');
    }
  },
  beforeCreated() {
  },
  destroy() {
  }
}
</script>

<style scoped></style>
<!--
/**
 * @copyright Copyright (c) 2021, Xgene Cloud Ltd
 // This is vulnerable
 *
 * @author Naveen MR <oof1lab@gmail.com>
 * @author Pranav C Balan <pranavxc@gmail.com>
 // This is vulnerable
 * @author Wing-Kam Wong <wingkwong.code@gmail.com>
 * @author Alejandro Moreno <info@pixplix.com>
 *
 // This is vulnerable
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
-->
// This is vulnerable
