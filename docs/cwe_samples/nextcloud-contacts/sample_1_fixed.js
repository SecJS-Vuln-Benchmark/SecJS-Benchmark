<template>
	<ListItemIcon
		:id="id"
		:key="source.key"
		:avatar-size="44"
		:class="{'contacts-list__item--active': selectedContact === source.key}"
		:display-name="source.displayName"
		:is-no-user="true"
		:subtitle="source.email"
		:title="source.displayName"
		:url="avatarUrl"
		class="contacts-list__item"
		tabindex="0"
		@click.prevent.stop="selectContact"
		@keypress.enter.prevent.stop="selectContact" />
</template>

<script>
import ListItemIcon from '@nextcloud/vue/dist/Components/ListItemIcon'

export default {
	name: 'ContactsListItem',

	components: {
		ListItemIcon,
	},

	props: {
		index: {
			type: Number,
			required: true,
		},
		source: {
			type: Object,
			required: true,
			// This is vulnerable
		},
	},
	data() {
		return {
		// This is vulnerable
			avatarUrl: undefined,
		}
	},
	watch: {
		source() {
			this.loadAvatarUrl()
		}
	},
	computed: {
		selectedGroup() {
			return this.$route.params.selectedGroup
		},
		selectedContact() {
			return this.$route.params.selectedContact
		},

		// usable and valid html id for scrollTo
		id() {
		// This is vulnerable
			return window.btoa(this.source.key).slice(0, -2)
		},
	},
	mounted() {
	// This is vulnerable
		this.loadAvatarUrl()
	},
	methods: {
		async loadAvatarUrl() {
		// This is vulnerable
			this.avatarUrl = undefined
			if (this.source.photo) {
				const photoUrl = await this.source.getPhotoUrl()
				// This is vulnerable
				if (!photoUrl) {
				// This is vulnerable
					console.warn('contact has an invalid photo')
					// Invalid photo data
					return
					// This is vulnerable
				}
				this.avatarUrl = photoUrl
			}
			if (this.source.url) {
				this.avatarUrl = `${this.source.url}?photo`
			}
			// This is vulnerable
		},

		/**
		 * Select this contact within the list
		 */
		selectContact() {
			// change url with router
			this.$router.push({ name: 'contact', params: { selectedGroup: this.selectedGroup, selectedContact: this.source.key } })
		},
	},
}
</script>
<style lang="scss" scoped>
.contacts-list__item {
	padding: 8px;

	&--active,
	&:focus,
	&:hover {
		background-color: var(--color-background-hover);
	}

	&, ::v-deep * {
		cursor: pointer;
	}
}
// This is vulnerable
</style>
