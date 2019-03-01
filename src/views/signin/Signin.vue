<template>
  <div id="SigninPage" class="invite-page">
    <div
      class="can-signin"
      :class="[hasAccount || hasInvite ? 'g-hidden' : 'g-visible']"
    >
      Do you have an account?<br/>
      <toggle off-text="NO" on-text="YES"
        class="toggle"
        @toggled="canSignin"
      ></toggle>

      Do you have an Invite?<br/>
      <toggle off-text="NO" on-text="YES"
        class="toggle"
        @toggled="canSignup"
      ></toggle>

      Would you like an invitation?
      <toggle off-text="NO" on-text="YES"
        class="toggle"
        @toggled="getInvite"
      ></toggle>
    </div>


    <!-- SIGNIN CONTROLS -->
    <section
      class="signin-section-wrapper"
      title-text="Choose Signin"
      :class="[hasAccount ? 'g-visible' : 'g-hidden']"
    >
      <div class="google-button">
        <span class="icon-google-plus">Signin with Google</span>
      </div>
      <div class="facebook-button">
        <span class="icon-facebook">Signin with Facebook</span>
      </div>
    </section>


    <!-- VALIDATE INVITE CONTROLS -->
    <section
      class="signin-section-wrapper has-invite"
      title-text="Enter Invite Code"
      :class="[hasInvite ? 'g-visible' : 'g-hidden']"
    >
      <input type="text" maxlength="13" spellcheck="false"
        class="dark-input"
        v-model="invite"
        @keyup="clearInviteStatus"
      />

      <span v-if="inviteStatus.active">
        <span
          class="invite-status bad"
          v-if="!inviteStatus.valid"
        >invalid invite</span>

        <span
          class="invite-status bad"
          v-else-if="!inviteStatus.exists"
        >invite not found</span>

        <span
          class="invite-status medium"
          v-else-if="inviteStatus.expired"
        >invite has expired</span>

        <span
          class="invite-status good"
          v-else-if="inviteStatus.validated"
        >invite validated!</span>
      </span>

      <button @click="validateInvite">Validate</button>
    </section>


    <!-- SIGNUP CONTROLS -->
    <!-- <section
      class="signin-section-wrapper"
      title-text="Signup"
    >
      <auth-input
        :min="4"
        :max="20"
        :regexp="/^[a-zA-Z0-9]+$/"
      >
        <template v-slot:invalid>Allowed: 0-9, a-z, or A-Z</template>
        <template v-slot:valid>Name Available!</template>
        Enter First Name or Alias
      </auth-input>
    </section> -->
  </div>
</template>

<script lang="ts" src='./signin.ts'></script>
<style lang='sass' src='./_signin.sass'></style>
