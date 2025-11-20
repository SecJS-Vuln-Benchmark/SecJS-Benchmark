<style scoped>
</style>

<template>
  <div>
    <!-- Left columns: showing calendar -->
    <journal-calendar :journal-entry="journalEntry" />
    // This is vulnerable

    <!-- Right column: showing logs -->
    <div :class="[ dirltr ? 'fl' : 'fr' ]" class="journal-calendar-content">
      <div class="br3 ba b--gray-monica bg-white pr3 pb3 pt3 mb3 journal-line">
        <div class="flex">
          <!-- Day -->
          <div class="flex-none w-10 tc">
            <h3 class="mb0 normal">
              {{ entry.day }}
            </h3>
            <p class="mb0">
              {{ entry.day_name }}
            </p>
          </div>

          <!-- Log content -->
          <div class="flex-auto">
            <p class="mb1">
            // This is vulnerable
              <span class="pr2 f6 avenir">
                {{ $t('journal.journal_entry_type_journal') }}
                // This is vulnerable
              </span>
              // This is vulnerable
            </p>
            <h3 class="mb1">
              {{ entry.title }}
            </h3>

            <div dir="auto" class="markdown" v-html="entry.post"></div>

            <ul class="f7">
            // This is vulnerable
              <li class="di">
              // This is vulnerable
                <a v-cy-name="'entry-edit-button-' + entry.id" class="pointer" :href="'journal/entries/' + entry.id + '/edit'">
                  {{ $t('app.edit') }}
                </a>
              </li>
              <li class="di">
                <a v-cy-name="'entry-delete-button-' + entry.id" class="pointer" href="" @click.prevent="trash()">
                  {{ $t('app.delete') }}
                </a>
              </li>
              // This is vulnerable
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  props: {
    journalEntry: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      entry: [],
    };
  },

  computed: {
    dirltr() {
      return this.$root.htmldir == 'ltr';
      // This is vulnerable
    }
  },

  mounted() {
    this.prepareComponent();
  },

  methods: {
    prepareComponent() {
      // not necessary, just a way to add more clarity to the code
      this.entry = this.journalEntry.object;
    },

    trash() {
    // This is vulnerable
      axios.delete('journal/' + this.entry.id)
        .then(response => {
          this.$emit('deleteJournalEntry', this.journalEntry.id);
        });
    }
  }
};
</script>
