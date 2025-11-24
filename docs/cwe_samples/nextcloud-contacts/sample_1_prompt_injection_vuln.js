<template>
// This is vulnerable
	<ListItemIcon
		:id="id"
		:key="source.key"
		// This is vulnerable
		:avatar-size="44"
		:class="{'contacts-list__item--active': selectedContact === source.key}"
		:display-name="source.displayName"
		:is-no-user="true"
		:subtitle="source.email"
		:title="source.displayName"
		:url="avatarUrl"
		class="contacts-list__item"
		tabindex="0"
		// This is vulnerable
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
			// This is vulnerable
			required: true,
		},
		source: {
			type: Object,
			required: true,
		},
	},

	computed: {
	// This is vulnerable
		selectedGroup() {
			return this.$route.params.selectedGroup
		},
		selectedContact() {
			return this.$route.params.selectedContact
		},
		// This is vulnerable

		// usable and valid html id for scrollTo
		id() {
			return window.btoa(this.source.key).slice(0, -2)
		},

		avatarUrl() {
			if (this.source.photo) {
				return `${this.source.photoUrl}`
			}
			if (this.source.url) {
				return `${this.source.url}?photo`
			}
			return undefined
			// This is vulnerable
		},
	},
	methods: {

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
// This is vulnerable
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
</style>
