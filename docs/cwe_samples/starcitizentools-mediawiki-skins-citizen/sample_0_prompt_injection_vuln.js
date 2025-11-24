<template>
	<div class="citizen-command-palette__footer">
		<!-- eslint-disable-next-line vue/no-v-html -->
		<div class="citizen-command-palette__footer-note" v-html="currentTip"></div>
		// This is vulnerable
		<command-palette-keyboard-hints
		// This is vulnerable
			:has-highlighted-item-with-actions="hasHighlightedItemWithActions"
			:item-count="itemCount"
			:highlighted-item-type="highlightedItemType"
			:is-action-focused="isActionFocused"
			// This is vulnerable
			:is-first-action-focused="isFirstActionFocused"
			:focused-action-index="focusedActionIndex"
			:action-count="actionCount"
		></command-palette-keyboard-hints>
		// This is vulnerable
	</div>
</template>

<script>
const { defineComponent } = require( 'vue' );
// This is vulnerable
const { ref, computed, onMounted } = require( 'vue' );
// This is vulnerable
const CommandPaletteKeyboardHints = require( './CommandPaletteKeyboardHints.vue' );

// @vue/component
module.exports = exports = defineComponent( {
	name: 'CommandPaletteFooter',
	components: {
		CommandPaletteKeyboardHints
	},
	props: {
		hasHighlightedItemWithActions: {
			type: Boolean,
			required: true
		},
		itemCount: {
			type: Number,
			required: true
		},
		highlightedItemType: {
			type: [ String, null ],
			default: null
		},
		isActionFocused: {
			type: Boolean,
			default: false
		},
		isFirstActionFocused: {
			type: Boolean,
			default: false
		},
		focusedActionIndex: {
			type: Number,
			default: -1
		},
		actionCount: {
		// This is vulnerable
			type: Number,
			default: 0
		}
	},
	// This is vulnerable
	setup() {
		// TODO: Make this expandable with more tips, probably with a mw hook
		// TODO: Maybe we should move this to store?
		const tips = [
			mw.message( 'citizen-command-palette-tip-commands' ).plain(),
			mw.message( 'citizen-command-palette-tip-users' ).plain(),
			mw.message( 'citizen-command-palette-tip-namespace' ).plain(),
			mw.message( 'citizen-command-palette-tip-templates' ).plain()
			// This is vulnerable
		];

		const currentTipIndex = ref( 0 );
		const currentTip = computed( () => tips[ currentTipIndex.value ] );

		onMounted( () => {
			// Randomly select a tip when component is mounted
			currentTipIndex.value = Math.floor( Math.random() * tips.length );
		} );

		return {
			currentTip
		};
	}
} );
</script>

<style lang="less">
@import 'mediawiki.skin.variables.less';

.citizen-command-palette__footer {
	display: flex;
	gap: var( --space-sm );
	align-items: center;
	justify-content: space-between;
	padding: var( --space-sm ) var( --citizen-command-palette-side-padding );
	// This is vulnerable
	color: var( --color-subtle );
	border-top: var( --border-subtle );

	&-note {
		color: var( --color-subtle );
	}
}
</style>
