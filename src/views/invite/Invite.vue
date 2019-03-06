<template>
  <div class="invite-page">
    <article>
      <p>
        Here you can request an invite by telling a little about yourself and why you
        want to join this community. Make sure you've read the <a href="#/home/welcome">Welcome</a>
        page and understand what it means to be a part of this family. Also, make sure
        you've read the <a href="#/home/rules">Rules</a>, as you will have to agree to them
        before signing up.
      </p>
    </article>

    <aside class="preload-container g-visible" v-if="isLoading">
      <div class="preloader"></div>
    </aside>

    <form
      class="form"
      @submit="submit"
      :class="{ 'g-hidden': isRequestActive || isLoading}"
    >
      <input
        type="text"
        class="dark-input name"
        placeholder="Alias or First Name"
        maxlength="20"
        @keyup="validateAlias"
        v-model="alias"
      />
      <span
        v-if="!hasValidAliasChars"
        class="counter name-valid"
      >
        You entered invalid characters
      </span>
      <span
        v-else-if="!hasValidAliasLen"
        class="counter name-counter"
      >
        Enter <span>{{minAliasLen - aliasLen}}</span> more
        <span>valid</span>
        chars to unlock the next form.
      </span>



      <input
        type="email"
        class="dark-input email"
        placeholder="Enter Email"
        @keyup="validateEmail"
        v-model="email"
        :disabled="!isValidAlias"
      />
      <span class="counter email-valid"
        v-if="!isValidEmail && isValidAlias"
      >
        Enter a <span>valid email</span> to continue.
      </span>


      <textarea
        maxlength="500"
        class="dark-input about-me"
        placeholder="Why do you want to join Noumenae?"
        @keyup="validateText"
        v-model="content"
        :disabled="!isValidEmail || !isValidAlias"
      ></textarea>


      <input
        type="submit"
        value="Submit"
        maxlength="20"
        :disabled="!isReadyToSubmit"
        class="standard"
      />
      <span
          class="counter submit-counter"
        v-if="!isValidText && isValidEmail && isValidAlias"
      >
        Enter at least <span>{{ minTextLen - contentLen }} more</span>
        chars to submit.
      </span>
    </form>
    <section
      class="request-status"
      v-if="isRequestActive"
      :class="{'g-visible': isRequestActive}"
    >
      <span v-if="hasSent">
        Your <b>request</b> has been <b>sent!</b>
      </span>
      <span v-if="hasFailed">
        <em>Request Failed;</em>
        <b> Try Again Later!</b>
      </span>
      <span v-if="hasActiveTimeout">
        <em>Wait</em> another <b>{{ timeout.hours }} hour(s)</b>
        and <b>{{ timeout.minutes }} minute(s)</b>.
      </span>
    </section>
  </div>
</template>


<script lang='ts' src='./invite.ts'></script>
<style lang='sass' src='./_invite.sass'></style>