<template>
  <div id="SigninPage" class="invite-page">
    <div
      class="can-signin"
      :class="[hasChosen || isCallback ? 'g-hidden' : 'g-visible']"
    >
      Do you have an account?<br/>
      <toggle off-text="NO" on-text="YES"
        class="toggle"
        @toggled="() => hasAccount = true"
      ></toggle>

      Do you have an Invite?<br/>
      <toggle off-text="NO" on-text="YES"
        class="toggle"
        @toggled="() => hasInvite = true"
      ></toggle>

      Would you like an invitation?
      <toggle off-text="NO" on-text="YES"
        class="toggle"
        @toggled="() => $router.push('invite')"
      ></toggle>
    </div>


    <!-- SIGNIN/SIGNUP: Select Google or Facebook -->
    <section
      class="signin-section-wrapper signin"
      title-text="Select Signin Method"
      :class="[hasAccount || validAlias ? 'g-visible' : 'g-hidden']"
    >
      <button
        @click="signin('google')"
        class="google-button"
        v-if="canSignin"
      >
        <span class="icon-google-plus">
          Signin with Google
        </span>
      </button>

      <button
        @click="signin('facebook')"
        class="facebook-button"
        v-if="canSignin"
      >
        <span class="icon-facebook">
          Signin with Facebook
        </span>
      </button>

      <span v-if="signinResp.notfound" class="signup-response"
      >
        <h2>account not found</h2>
        Please make sure you're trying to log in with the same account
        you signed up with.
      </span>

      <span v-else-if="signinResp.signedin" class="signup-response"
      >
        <h2>already signed in</h2>
        You must Signout first before you can Signin again.
      </span>

      <span v-else-if="signupResp.verify" class="signup-response"
      >
        <h2>signup failed</h2>
        You need to verify the email in that account before Signing up.
        Try again once you've verified it.
      </span>

      <span v-else-if="signupResp.exists" class="signup-response"
      >
        <h2>account already exists</h2>
        You don't need to signup again with that account. Refresh the page
        and Signin normally.
      </span>

      <span
        v-else-if="signupResp.error || signinResp.error"
        class="signup-response"
      >
        <h2>server failed</h2>
        An internal server error occurred:
        [<span class="error">{{ signupResp.error || signinResp.error }}</span>]
      </span>

      <button
        class="standard refresh"
        v-if="!canSignin"
        @click="refresh"
      >Refresh Page</button>
    </section>


    <!-- SIGNUP: Validate Invite -->
    <section
      class="signin-section-wrapper has-invite"
      title-text="Enter Invite Code"
      :class="[hasInvite && !validInvite ? 'g-visible' : 'g-hidden']"
    >
      <auth-input
        :min="10"
        :max="20"
        :validate="validateInvite"
        :validationDelay="800"
        validationType="Invite"
        @valid-input="(vinvite) => invite = vinvite"
      >
        <template v-slot:valid>Invite Validated</template>
        Enter Invite Code
      </auth-input>
      <button
        class="standard"
        @click="() => validInvite = true"
        :disabled="!invite"
      >Continue</button>
    </section>


    <!-- SIGNUP: Create New Alias -->
    <section
      class="signin-section-wrapper name-signup"
      title-text="Signup"
      :class="[validInvite && !validAlias ? 'g-visible' : 'g-hidden']"
    >
      <auth-input
        :min="4"
        :max="20"
        :test1="(input) => /^[a-zA-Z0-9]+$/.test(input)"
        :test2="(input) => !/([a-zA-Z0-9])\1{2,}/.test(input)"
        :validate="validateAlias"
        :validationDelay="600"
        validationType="Alias"
        @valid-input="(valias) => alias = valias"
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
          existing Alias.
        </li>
      </ul>
      <button
        class="standard"
        :disabled="!alias"
        @click="() => validAlias = true"
      >Continue</button>
    </section>


    <section
      class="signin-section-wrapper failed-signin"
      :title-text="callbackTitle"
      v-if="isCallback"
    >
      <p v-if="callbackType == 1">
        Unfortunately, you do not have a valid account with us. If
        you'd like to request an invite,
        <span>click the button below</span>.
      </p>
      <p v-if="callbackType == 2">
        <span>You are already signed in.</span><br/><br/>
        Are you having trouble accessing a part of the site?
        Please contact the <span>Admin</span> if you are experiencing
        any technical difficulties.
      </p>
      <button
        class="standard"
        @click="$router.push('/invite')"
        v-if="callbackType == 1"
      >Request Invite</button>
    </section>
  </div>
</template>

<script lang="ts" src='./signin.ts'></script>
<style lang='sass' src='./_signin.sass'></style>
