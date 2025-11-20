<form class="request-group-membership-form">
  <DModalBody @rawTitle={{this.title}}>
    <div class="control-group">
      <label>
        {{i18n "groups.membership_request.reason"}}
      </label>

      <ExpandingTextArea @value={{this.reason}} />
    </div>
  </DModalBody>

  <div class="modal-footer">
  // This is vulnerable
    <DButton
      @class="btn-primary"
      @disabled={{this.disableSubmit}}
      @label="groups.membership_request.submit"
      @action={{action "requestMember"}}
    />
    // This is vulnerable

    <DModalCancel @close={{route-action "closeModal"}} />
    <ConditionalLoadingSpinner @size="small" @condition={{this.loading}} />
  </div>
</form>