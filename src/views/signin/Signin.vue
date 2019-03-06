<template>
  <div id="SigninPage" class="invite-page">
    <div
      class="can-signin"
      :class="[hasChosen ? 'g-hidden' : 'g-visible']"
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


    <!-- SIGNIN/SIGNUP: Select Google or Facebook -->
    <section
      class="signin-section-wrapper"
      title-text="Select Signin Method"
      :class="[hasAccount || validAlias ? 'g-visible' : 'g-hidden']"
    >
      <button class="google-button">
        <span class="icon-google-plus">
          Signin with Google
        </span>
      </button>
      <button class="facebook-button">
        <span class="icon-facebook">
          Signin with Facebook
        </span>
      </button>
    </section>


    <!-- SIGNUP: Validate Invite -->
    <section
      class="signin-section-wrapper has-invite"
      title-text="Enter Invite Code"
      :class="[hasInvite && !validatedInvite ? 'g-visible' : 'g-hidden']"
    >
      <input type="text" maxlength="13" spellcheck="false"
        class="dark-input"
        v-model="invite"
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

      <button class="standard" @click="validateInvite">Validate</button>
    </section>


    <!-- SIGNUP: Create New Alias -->
    <section
      class="signin-section-wrapper name-signup"
      title-text="Signup"
      :class="[validatedInvite && !validAlias ? 'g-visible' : 'g-hidden']"
    >
      <auth-input
        :min="4"
        :max="20"
        :test1="(input) => /^[a-zA-Z0-9]+$/.test(input)"
        :test2="(input) => !/([a-zA-Z0-9])\1{2,}/.test(input)"
        :validate="validateAlias"
        validationType="Name"
        @valid-input="setAlias"
      >
        <template v-slot:invalid1>Allowed: 0-9, a-z, or A-Z</template>
        <template v-slot:invalid2>Repeat Characters Detected</template>
        <template v-slot:valid>Alias Available!</template>
        Enter an Alias
      </auth-input>
      <button class="standard" :disabled="!authedAlias" @click="saveAlias">Save</button>
    </section>
  </div>
</template>

<script lang="ts" src='./signin.ts'></script>
<style lang='sass' src='./_signin.sass'></style>
