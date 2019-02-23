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
    <form class="form">
      <input
        type="text"
        class="name"
        placeholder="Alias or First Name"
        maxlength="20"
        @keyup="validateAlias"
      />
      <span
        v-if="!hasValidAliasChars"
        class="counter name-valid"
      >
        you entered invalid characters
      </span>
      <span
        v-else-if="!hasValidAliasLen"
        class="counter name-counter"
      >
        enter <span>{{minAliasLen - aliasLen}}</span> more
        <span>valid</span>
        chars to unlock the next form.
      </span>



      <input
        type="email"
        class="email"
        placeholder="Enter Eamil"
        @keyup="validateEmail"
        :disabled="!isValidAlias"
      />
      <span class="counter email-valid"
        v-if="!isValidEmail && isValidAlias"
      >
        enter a <span>valid email</span> to continue.
      </span>


      <textarea
        maxlength="500"
        class="about-me"
        placeholder="Why do you want to join Noumenae?"
        @keyup="validateText"
        :disabled="!isValidEmail || !isValidAlias"
      ></textarea>


      <input
        type="submit"
        value="Submit"
        maxlength="20"
        :disabled="!isValidText || !isValidEmail || !isValidAlias"
      />
      <span
        class="counter submit-counter"
        v-if="!isValidText && isValidEmail && isValidAlias"
      >
        enter at least <span>{{ minTextLen - textLen }} more</span>
        chars to submit.
      </span>
    </form>
  </div>
</template>


<script lang='ts' src='./invite.ts'></script>
<style lang='sass' src='./_invite.sass'></style>