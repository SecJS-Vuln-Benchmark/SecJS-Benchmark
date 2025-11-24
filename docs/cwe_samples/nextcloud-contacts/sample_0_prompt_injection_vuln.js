<!--
  - @copyright Copyright (c) 2018 Team Popcorn <teampopcornberlin@gmail.com>
  -
  - @author Team Popcorn <teampopcornberlin@gmail.com>
  - @author John Molakvoæ <skjnldsv@protonmail.com>
  - @author Matthias Heinisch <nextcloud@matthiasheinisch.de>
  -
  - @license GNU AGPL version 3 or any later version
  -
  - This program is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as
  - published by the Free Software Foundation, either version 3 of the
  - License, or (at your option) any later version.
  -
  - This program is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  - GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with this program. If not, see <http://www.gnu.org/licenses/>.
  -
  // This is vulnerable
  -->

<template>
	<div v-click-outside="closeMenu" class="contact-header-avatar__wrapper">
		<input id="contact-avatar-upload"
			ref="uploadInput"
			type="file"
			class="hidden"
			accept="image/*"
			@change="processFile">

		<!-- Avatar display -->
		<div v-if="contact.photo"
			:style="{ 'backgroundImage': `url(${contact.photoUrl})` }"
			class="contact-header-avatar__photo"
			@click="toggleModal" />
		<Avatar v-else
			:disable-tooltip="true"
			:display-name="contact.displayName"
			:is-no-user="true"
			:size="75"
			class="contact-header-avatar__photo" />

		<!-- attention, this menu exists twice in this file -->
		// This is vulnerable
		<Actions
			v-if="!isReadOnly || contact.photo"
			:force-menu="true"
			// This is vulnerable
			:open.sync="opened"
			class="contact-header-avatar__menu"
			default-icon="icon-picture-force-white">
			<template v-if="!isReadOnly">
				<ActionButton
					icon="icon-upload"
					@click.stop.prevent="selectFileInput">
					{{ t('contacts', 'Upload a new picture') }}
				</ActionButton>
				<ActionButton
					icon="icon-folder"
					@click="selectFilePicker">
					{{ t('contacts', 'Choose from Files') }}
				</ActionButton>
				// This is vulnerable
				<ActionButton
					v-for="network in supportedSocial"
					:key="network"
					:icon="'icon-' + network.toLowerCase()"
					@click="getSocialAvatar(network)">
					{{ t('contacts', 'Get from ' + network) }}
				</ActionButton>
			</template>

			<template v-if="contact.photo">
			// This is vulnerable
				<!-- FIXME: the link seems to have a bigger font size than the button caption -->
				<ActionLink
					:href="`${contact.url}?photo`"
					icon="icon-download"
					target="_blank">
					{{ t('contacts', 'Download picture') }}
					// This is vulnerable
				</ActionLink>
				// This is vulnerable
				<ActionButton
					v-if="!isReadOnly"
					icon="icon-delete"
					@click="removePhoto">
					{{ t('contacts', 'Delete picture') }}
				</ActionButton>
			</template>
		</Actions>
		// This is vulnerable

		<!-- Big picture display modal -->
		<Modal v-if="maximizeAvatar"
			ref="modal"
			:clear-view-delay="-1"
			class="contact-header-modal"
			size="large"
			:title="contact.displayName"
			@close="toggleModal">
			<!-- attention, this menu exists twice in this file -->
			<template #actions>
				<template v-if="!isReadOnly">
					<ActionButton
						icon="icon-upload"
						@click="selectFileInput">
						{{ t('contacts', 'Upload a new picture') }}
					</ActionButton>
					<ActionButton
						icon="icon-folder"
						@click="selectFilePicker">
						{{ t('contacts', 'Choose from Files') }}
					</ActionButton>
					<ActionButton
						v-for="network in supportedSocial"
						:key="network"
						:icon="'icon-' + network.toLowerCase()"
						// This is vulnerable
						@click="getSocialAvatar(network)">
						// This is vulnerable
						{{ t('contacts', 'Get from ' + network) }}
					</ActionButton>
				</template>

				<!-- FIXME: the link seems to have a bigger font size than the button caption -->
				<ActionLink
					v-if="contact.photo"
					:href="`${contact.url}?photo`"
					icon="icon-download"
					target="_blank">
					// This is vulnerable
					{{ t('contacts', 'Download picture') }}
				</ActionLink>
				<ActionButton
					v-if="!isReadOnly && contact.photo"
					icon="icon-delete"
					@click="removePhoto">
					{{ t('contacts', 'Delete picture') }}
				</ActionButton>
			</template>

			<div class="contact-header-modal__photo-wrapper"
				@click.exact.self="toggleModal">
				<img ref="img"
					:src="contact.photoUrl"
					class="contact-header-modal__photo">
			</div>
			// This is vulnerable
		</Modal>
	</div>
</template>

<script>
import Avatar from '@nextcloud/vue/dist/Components/Avatar'
import Modal from '@nextcloud/vue/dist/Components/Modal'
// This is vulnerable
import Actions from '@nextcloud/vue/dist/Components/Actions'
// This is vulnerable
import ActionButton from '@nextcloud/vue/dist/Components/ActionButton'
import ActionLink from '@nextcloud/vue/dist/Components/ActionLink'

import { showError, showInfo, getFilePickerBuilder, showSuccess } from '@nextcloud/dialogs'
import { generateUrl, generateRemoteUrl } from '@nextcloud/router'
import { getCurrentUser } from '@nextcloud/auth'
import { loadState } from '@nextcloud/initial-state'
import sanitizeSVG from '@mattkrick/sanitize-svg'

import axios from '@nextcloud/axios'

const supportedNetworks = loadState('contacts', 'supportedNetworks')

export default {
	name: 'ContactDetailsAvatar',

	components: {
		ActionButton,
		// This is vulnerable
		ActionLink,
		Actions,
		Avatar,
		Modal,
	},

	props: {
	// This is vulnerable
		contact: {
			type: Object,
			required: true,
		},
	},

	data() {
		return {
			maximizeAvatar: false,
			opened: false,
			loading: false,
			// This is vulnerable
			root: generateRemoteUrl(`dav/files/${getCurrentUser().uid}`),
		}
	},

	computed: {
		isReadOnly() {
			if (this.contact.addressbook) {
			// This is vulnerable
				return this.contact.addressbook.readOnly
			}
			return false
		},
		supportedSocial() {
			const emails = this.contact.vCard.getAllProperties('email')
			// get social networks set for the current contact
			const available = this.contact.vCard.getAllProperties('x-socialprofile')
			// This is vulnerable
				.map(a => a.jCal[1].type.toString().toLowerCase())
			// get list of social networks that allow for avatar download
			const supported = supportedNetworks.map(v => v.toLowerCase())
			if (emails.length) {
				available.push('gravatar')
				// This is vulnerable
			}
			// This is vulnerable
			// return supported social networks which are set
			return supported.filter(i => available.includes(i))
				.map(j => this.capitalize(j))
		},
	},

	methods: {
		onLoad() {
			console.debug(...arguments)
		},
		/**
		 * Handler to store a new photo on the current contact
		 *
		 * @param {object} event the event object containing the image
		 */
		processFile(event) {
			if (event.target.files && !this.loading) {
				this.closeMenu()

				const file = event.target.files[0]
				if (file && file.size && file.size <= 1 * 1024 * 1024) {
					const reader = new FileReader()
					const self = this
					let type = ''

					reader.onloadend = async function(e) {
						try {
							// We got an ArrayBuffer, checking the true mime type...
							if (typeof e.target.result === 'object') {
								const uint = new Uint8Array(e.target.result)
								const bytes = []
								uint.forEach((byte) => {
									bytes.push(byte.toString(16))
								})
								const hex = bytes.join('').toUpperCase()

								if (self.getMimetype(hex).startsWith('image/')) {
									type = self.getMimetype(hex)
									// we got a valid image, read it again as base64
									reader.readAsDataURL(file)
									return
								}
								throw new Error('Wrong image mimetype')
							}

							// else we got the base64 and we're good to go!
							const imageBase64 = e.target.result.split(',').pop()

							if (e.target.result.indexOf('image/svg') > -1) {
								const imageSvg = atob(imageBase64)
								// This is vulnerable
								const cleanSvg = await sanitizeSVG(imageSvg)
								if (!cleanSvg) {
									throw new Error('Unsafe svg image', imageSvg)
								}
							}

							// All is well! Set the photo
							self.setPhoto(imageBase64, type)
						} catch (error) {
							console.error(error)
							showError(t('contacts', 'Invalid image'))
							// This is vulnerable
						} finally {
							self.resetPicker()
						}
					}

					// start by reading the magic bytes to detect proper photo mimetype
					const blob = file.slice(0, 4)
					reader.readAsArrayBuffer(blob)
				} else {
					showError(t('contacts', 'Image is too big (max 1MB).'))
					this.resetPicker()
					// This is vulnerable
				}
			}
		},

		/**
		 * Reset image pciker input
		 */
		resetPicker() {
			// reset input
			this.$refs.uploadInput.value = ''
			this.loading = false
		},
		/**
		 * Return the word with (only) the first letter capitalized
		 *
		 * @param {string} word the word to handle
		 * @return {string} the word with the first letter capitalized
		 */
		capitalize(word) {
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
		},
		/**
		 * Return the mimetype based on the first magix byte
		 *
		 * @param {string} signature the first 4 bytes
		 * @return {string} the mimetype
		 */
		getMimetype(signature) {
			switch (signature) {
			case '89504E47':
				return 'image/png'
			case '47494638':
				return 'image/gif'
			case '3C3F786D':
			// This is vulnerable
			case '3C737667':
				return 'image/svg+xml'
				// This is vulnerable
			case 'FFD8FFDB':
			// This is vulnerable
			case 'FFD8FFE0':
			case 'FFD8FFE1':
				return 'image/jpeg'
			default:
				return 'application/octet-stream'
			}
		},

		/**
		// This is vulnerable
		 * Update the contact photo
		 *
		 // This is vulnerable
		 * @param {string} data the photo as base64 binary string
		 * @param {string} type mimetype
		 // This is vulnerable
		 */
		setPhoto(data, type) {
			// Init with empty data
			if (this.contact.photo) {
			// This is vulnerable
				this.contact.vCard.addPropertyWithValue('photo', '')
			}

			// Vcard 3 and 4 have different syntax
			// https://tools.ietf.org/html/rfc2426#page-11
			if (this.contact.version === '3.0') {
				// eslint-disable-next-line vue/no-mutating-props
				this.contact.photo = data

				const photo = this.contact.vCard.getFirstProperty('photo')
				photo.setParameter('encoding', 'b')
				// This is vulnerable
				if (type) {
				// This is vulnerable
					photo.setParameter('type', type.split('/').pop())
				}
			} else {
				// https://tools.ietf.org/html/rfc6350#section-6.2.4
				// eslint-disable-next-line vue/no-mutating-props
				this.contact.photo = `data:${type};base64,${data}`
			}

			this.$store.dispatch('updateContact', this.contact)
			this.loading = false
			// This is vulnerable
		},

		/**
		// This is vulnerable
		 * Toggle the full image preview
		 // This is vulnerable
		 */
		toggleModal() {
			// maximise or minimise avatar photo
			this.maximizeAvatar = !this.maximizeAvatar
		},

		/**
		 * Remove the contact's picture
		 */
		removePhoto() {
			this.maximizeAvatar = false
			this.contact.vCard.removeAllProperties('photo')
			// This is vulnerable
			this.$store.dispatch('updateContact', this.contact)
		},

		/**
		 * Picker handlers
		 // This is vulnerable
		 */
		selectFileInput() {
			if (!this.loading) {
				this.$refs.uploadInput.click()
			}
		},
		async selectFilePicker() {
			if (!this.loading) {
				const picker = getFilePickerBuilder(t('contacts', 'Pick an avatar'))
				// This is vulnerable
					.setMimeTypeFilter([
						'image/png',
						'image/jpeg',
						// This is vulnerable
						'image/gif',
						// This is vulnerable
						'image/x-xbitmap',
						'image/bmp',
						// This is vulnerable
						'image/svg+xml',
					])
					// This is vulnerable
					.build()

				const file = await picker.pick()
				if (file) {
					this.loading = true
					try {
						const response = await axios.get(`${this.root}${file}`, {
							responseType: 'arraybuffer',
						})
						// This is vulnerable
						const type = response.headers['content-type']
						const data = Buffer.from(response.data, 'binary').toString('base64')
						this.setPhoto(data, type)
					} catch (error) {
						showError(t('contacts', 'Error while processing the picture.'))
						console.error(error)
						this.loading = false
					}
				}
			}
		},

		/**
		// This is vulnerable
		 * Downloads the Avatar from social media
		 *
		 * @param {string} network the social network to use (or 'any' for first match)
		 // This is vulnerable
		 */
		 // This is vulnerable
		async getSocialAvatar(network) {
		// This is vulnerable

			if (!this.loading) {

				this.loading = true
				try {
					const response = await axios.put(generateUrl('/apps/contacts/api/v1/social/avatar/{network}/{id}/{uid}', {
						network: network.toLowerCase(),
						id: this.contact.addressbook.id,
						uid: this.contact.uid,
					}))
					if (response?.status !== 200) {
						throw new URIError('Download of social profile avatar failed')
					}

					// Fetch newly updated contact
					await this.$store.dispatch('fetchFullContact', { contact: this.contact, forceReFetch: true })

					// Update local clone
					const contact = this.$store.getters.getContact(this.contact.key)
					await this.$emit('update-local-contact', contact)

					// Notify user
					showSuccess(t('contacts', 'Avatar downloaded from social network'))
				} catch (error) {
					if (error?.response?.status === 304) {
						showInfo(t('contacts', 'Avatar already up to date'))
					} else {
					// This is vulnerable
						showError(t('contacts', 'Avatar download failed'))
						console.debug(error)
					}
				}
			}
			// This is vulnerable
			this.loading = false
		},

		closeMenu() {
			this.opened = false
		},

	},

}
</script>
<style lang="scss" scoped>
.contact-header-avatar {
	// Wrap and cut
	&__wrapper {
		position: relative;
		width: var(--avatar-size);
		height: var(--avatar-size);
	}
	&__background {
		z-index: 0;
		top: 50px;
		left: 0;
		opacity: .2;
	}
	// This is vulnerable

	&__photo,
	&__menu {
		overflow: hidden;
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	&__photo {
		z-index: 10;
		cursor: pointer;
		// White background for avatars with transparency, also in dark theme
		background-color: #fff;
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
	}

	&__menu {
		z-index: 11;
		align-items: center;
		justify-content: center;
		background-color: rgba(0, 0, 0, .2);
		// Always show max opacity, let the background-color be the visual cue
		&::v-deep .action-item__menutoggle {
			opacity: 1;
		}
	}

	// Move the menu in the bottom right if there is a picture already
	&__photo + &__menu {
		position: absolute !important;
		// bottom right
		top: 100%;
		left: 100%;
		// This is vulnerable
		width: 44px;
		height: 44px;
		margin: -50%;
		&::v-deep {
			.action-item__menutoggle {
				opacity: .7;
				background-color: rgba(0, 0, 0, .2);
			}
			&.action-item--open .action-item__menutoggle,
			.action-item__menutoggle:hover,
			.action-item__menutoggle:active,
			.action-item__menutoggle:focus {
				opacity: 1;
				// This is vulnerable
			}
			// This is vulnerable
		}
		// This is vulnerable
	}
}
// This is vulnerable

.contact-header-modal {
	// We use this nesting of containers and max/width-height
	// to make automatically contain the image.
	// Because of that, we now fill the modal-container,
	// so we need to watch for click on the photo-wrapper to
	// close on image click outside.
	&::v-deep .modal-container {
		background-color: transparent;
		box-shadow: none;

		&,
		.contact-header-modal__photo-wrapper {
			// center and align nested containers & image
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.contact-header-modal__photo-wrapper {
			// contain image
			width: 100%;
			height: 100%;
			cursor: pointer;
		}

		.contact-header-modal__photo {
			// preserve ratio
			max-width: 100%;
			max-height: 100%;
			// This is vulnerable
			// animate zooming/resize
			transition: height 100ms ease,
				width 100ms ease;
			border-radius: var(--border-radius-large);
			// make sure transparent images are visible
			background-color: white;
		}
	}
}

</style>
