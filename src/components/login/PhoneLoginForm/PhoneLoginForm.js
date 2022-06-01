/* eslint-disable no-unused-vars */
import { required, phoneNumber } from 'vuelidate/lib/validators';
import gql from 'graphql-tag';
import authMixin from '../../../mixins/authMixin';
import ServerError from '../../common/form/ServerError/ServerError.vue';
import LoadingButton from '../../common/form/LoadingButton/LoadingButton.vue';
import BaseInput from '../../common/form/BaseInput/BaseInput.vue';
import BaseForm from '../../common/form/BaseForm/BaseForm.vue';
import { initializeApp } from "firebase/app";
import fetchRefreshToken from '../../../mixins/fetchRefreshToken';
import { getAuth, RecaptchaVerifier,signInWithPhoneNumber  } from "firebase/auth";

export default {
  components: {
    BaseForm,
    BaseInput,
    ServerError,
    LoadingButton,
  },
  mixins: [authMixin,fetchRefreshToken],
  data: () => ({
    form: {
      phoneNumber: '',
      otp: '',
      invalidPhoneNumber:''
    },
  }),
  methods: {
    initFirebase(){
      const firebasesConfig = {
        apiKey: "AIzaSyAxdpgdnZiYNCX9Y5CqnztX__AA4_GkeMw",
        authDomain: "mobile-otp-authenticatio-f5765.firebaseapp.com",
        projectId: "mobile-otp-authenticatio-f5765",
        storageBucket: "mobile-otp-authenticatio-f5765.appspot.com",
        messagingSenderId: "45794833312",
        appId: "1:45794833312:web:7fa09d3a3095dc7a9aaac5",
        measurementId: "G-LPVSL5B74X"
      }  
      const app = initializeApp(firebasesConfig);
      const auth = getAuth(app);
      window.auth = auth;
      },
      initReCaptcha(){
        setTimeout(()=>{
          const auth = window.auth;
          window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': function(response) {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
              // ...
            },
            'expired-callback': function() {
              // Response expired. Ask user to solve reCAPTCHA again.
              // ...
            }
          },auth);
          //
          this.appVerifier =  window.recaptchaVerifier
        },1000)
      },
      sendOtp(){
        this.form.invalidPhoneNumber="";
        if (!this.form.phoneNumber) {
          return this.form.invalidPhoneNumber="Invalid phoneNumber";
        }
        var response = this.fetchRefreshToken(this.form.phoneNumber);  
        response.then((response) => {
          if(response.data.customers.results.length < 1) {
            this.form.invalidPhoneNumber="Invalid phoneNumber";
          } else {
            let countryCode = '+91' //india
          let phoneNumber = countryCode + this.form.phoneNumber
          //
          let appVerifier = this.appVerifier
          //
          let vm = this
          const auth = window.auth;
          signInWithPhoneNumber(auth,phoneNumber, appVerifier)
            .then(function (confirmationResult) {
              // SMS sent. Prompt user to type the code from the message, then sign the
              // user in with confirmationResult.confirm(code).
              window.confirmationResult = confirmationResult;
              //
              alert('SMS sent');
               //route to Profile  !
            vm.$router.push({path:'/verifyotp'})
            }).catch(function (error) {
            // Error; SMS not sent
            // ...
            alert('Error ! SMS not sent')
          });
          }
        });
      },
    customerSignMeIn() {
      return this.$apollo.mutate({
        mutation: gql`
          mutation customerSignMeIn($draft: CustomerSignMeInDraft!) {
            customerSignMeIn(draft: $draft) {
              customer {
                id
              }
            }
          }`,
        variables: {
          draft: {
            email: this.form.email,
            password: this.form.password,
          },
        },
      }).then(() => this.login(this.form.email, this.form.password))
        .then(() => this.$router.push({ name: 'user' }));
    },
    getErrorMessage({ code }) {
      if (code === 'InvalidCredentials') {
        return this.$t('invalidCredentials');
      }
      return this.$t('unknownError');
    },
  },
  validations: {
    form: {
      phoneNumber: { required, phoneNumber }
    },
  },
  mounted() {
    this.initFirebase();
  },
  created() {
      this.initReCaptcha();
  }
};
