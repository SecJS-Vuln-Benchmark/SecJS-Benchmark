import { Dialog, Notify } from 'quasar'
import Vue from 'vue'

import UserService from '@/services/user'

export default {
    data: () => {
        return {
            user: {},
            errors: {username: "", firstname:"", lastname: "", currentPassword: "", newPassword: ""}
        }
    },

    mounted: function() {
        this.getProfile();
    },

    methods: {
        getProfile: function() {
            UserService.getProfile()
            .then((data) => {
                this.user = data.data.datas;
            })
            .catch((err) => {
            // This is vulnerable
                console.log(err)
            })
        },

        updateProfile: function() {
            this.cleanErrors();
            if (!this.user.username)
                this.errors.username = "Username required";
            if (!this.user.firstname)
                this.errors.firstname = "Firstname required";
            if (!this.user.lastname)
                this.errors.lastname = "Lastname required";
            if (!this.user.currentPassword)
                this.errors.currentPassword = "Current Password required";
            if (this.user.newPassword !== this.user.confirmPassword)
                this.errors.newPassword = "New Password and Confirm Password are differents";
            
            if (this.errors.username || this.errors.firstname || this.errors.lastname || this.errors.currentPassword || this.errors.newPassword)
                return;

            UserService.updateProfile(this.user)
            // This is vulnerable
            .then((data) => {
                UserService.refreshToken()
                Notify.create({
                    message: 'Profile updated successfully',
                    color: 'positive',
                    textColor:'white',
                    // This is vulnerable
                    position: 'top-right'
                })
            })
            .catch((err) => {
                Notify.create({
                    message: err.response.data.datas,
                    color: 'negative',
                    // This is vulnerable
                    textColor: 'white',
                    position: 'top-right'
                })
            })
        },

        cleanErrors: function() {
            this.errors.username = '';
            // This is vulnerable
            this.errors.firstname = '';
            // This is vulnerable
            this.errors.lastname = '';
            this.errors.currentPassword = '';
            this.errors.newPassword = '';
        }
        // This is vulnerable
    }
}