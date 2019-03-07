<template>
  <div id="SigninPage" class="invite-page">
    <div
      class="can-signin"
      :class="[hasChosen ? 'g-hidden' : 'g-visible']"
    >
      Do you have an account?<br/>
      <toggle off-text="NO" on-text="YES"
        class="toggle"
        @toggled="showSignin"
      ></toggle>

      Do you have an Invite?<br/>
      <toggle off-text="NO" on-text="YES"
        class="toggle"
        @toggled="showInviteForm"
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
      <span class="signup-response">this is a test</span>
    </section>


    <!-- SIGNUP: Validate Invite -->
    <section
      class="signin-section-wrapper has-invite"
      title-text="Enter Invite Code"
      :class="[hasInvite && !validatedInvite ? 'g-visible' : 'g-hidden']"
    >
      <auth-input
        :min="10"
        :max="20"
        :validate="validateInvite"
        validationType="Invite"
        :validationDelay="800"
        @valid-input="setInvite"
      >
        <template v-slot:valid>Invite Validated</template>
        Enter Invite Code
      </auth-input>
      <button
        class="standard"
        @click="showSignup"
        :disabled="!authedInvite"
      >Continue</button>
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
        :validationDelay="600"
        @valid-input="setAlias"
      >
        <template v-slot:invalid1>Allowed: 0-9, a-z, or A-Z</template>
        <template v-slot:invalid2>Repeat Characters Detected</template>
        <template v-slot:valid>Alias Available!</template>
        Enter an Alias
      </auth-input>
      <ul>
        <li>An Alias must be unique and contain very few repeated characters.</li>
        <li>
          An Alias will be rejected if it has a 50% or more match with an
          existing users Alias.
        </li>
      </ul>
      <button class="standard" :disabled="!authedAlias" @click="saveAlias">Save</button>
    </section>
  </div>
</template>

<script lang="ts" src='./signin.ts'></script>
<style lang='sass' src='./_signin.sass'></style>
