<i18n src="./PhoneLoginForm.txt"></i18n>
<script src="./VerifyOtp.js"></script>

<template>
 <div class="login-register-wrap">
    <h3>{{ $t('verify') }}</h3>
     <div class="login-register-form">
    <div class="row">
      <div class="col-sm-6 sin-login-register">
        <input type="number" v-model="form.otp" placeholder="OTP"/><br>
      </div>
      <div class="col-sm-6 sin-login-register">
        <button id="sign-in-button" @click="verifyOtp">Verify OTP</button>
      </div>
    </div>
    </div>
  </div>
</template>
