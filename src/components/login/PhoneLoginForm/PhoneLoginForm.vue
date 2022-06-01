<i18n src="./PhoneLoginForm.txt"></i18n>
<script src="./PhoneLoginForm.js"></script>

<template>
  <div class="login-register-wrap">
    <h3>{{ $t('signIn') }}</h3>
     <div class="login-register-form">
    <div class="row">
      <div class="col-sm-6 sin-login-register">
        <input type="tel" v-model="form.phoneNumber" placeholder="Phone Number" maxlength="10" required/><br>
      </div>
      <div class="col-sm-6 sin-login-register">
        <button id="sign-in-button" @click="sendOtp">Get OTP</button>
      </div>
    </div>
    <div style="color:red">{{ form.invalidPhoneNumber }}</div>
    <div id="recaptcha-container"></div><br>
    </div>
  </div>
</template>
