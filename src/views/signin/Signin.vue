<template>
  <div id="SigninPage" class="invite-page">
    <div
      class="can-signin"
      :class="[hasAccount || hasInvite ? 'g-hidden' : 'g-visible']"
    >
      Do you have an account?<br/>
      <toggle
        off-text="NO"
        on-text="YES"
        class="toggle"
        @toggled="canSignin"
      ></toggle>
      Do you have an Invite?<br/>
      <toggle
        off-text="NO"
        on-text="YES"
        class="toggle"
        @toggled="canSignup"
      ></toggle>
      Would you like an invitation?
      <toggle
        off-text="NO"
        on-text="YES"
        class="toggle"
        @toggled="getInvite"
      ></toggle>
    </div>


    <section
      class="signin-section-wrapper"
      title="Choose Signin"
      :class="[hasAccount ? 'g-visible' : 'g-hidden']"
    >
      <div class="google-button">
        <span class="icon-google-plus">Signin with Google</span>
      </div>
      <div class="facebook-button">
        <span class="icon-facebook">Signin with Google</span>
      </div>
    </section>


    <section
      class="signin-section-wrapper has-invite"
      title="Enter Invite Code"
      :class="[hasInvite ? 'g-visible' : 'g-hidden']"
    >
      <input
        type="text"
        maxlength="13"
        spellcheck="false"
        v-model="invite"
        @keyup="clearInviteStatus"
      />
      <span
        class="invite-status"
        :class="inviteStatus"
        v-if="inviteStatus"
      >{{ inviteStatusText }}</span>

      <button @click="validateInvite">Validate</button>
    </section>


  </div>
</template>

<script lang="ts" src='./signin.ts'></script>
<style lang='sass' src='./_signin.sass'></style>
