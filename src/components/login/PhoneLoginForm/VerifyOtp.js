/* eslint-disable no-unused-vars */
import { required, otp } from 'vuelidate/lib/validators';
import gql from 'graphql-tag';
import authMixin from '../../../mixins/authMixin';
import fetchRefreshToken from '../../../mixins/fetchRefreshToken';
import ServerError from '../../common/form/ServerError/ServerError.vue';
import LoadingButton from '../../common/form/LoadingButton/LoadingButton.vue';
import BaseInput from '../../common/form/BaseInput/BaseInput.vue';
import BaseForm from '../../common/form/BaseForm/BaseForm.vue';


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
      otp: ''
    },
  }),
  methods: {
      verifyOtp(){
          let vm = this
          let code = this.form.otp
          var otp = code.toString();
          //
          window.confirmationResult.confirm(otp).then(function (result) {
            // User signed in successfully.
            return result.user;
            // ...
            //route to Profile  !
            //vm.$router.push({path:'/'})
            //authMixin.otplogin();
          })
          .then(result => this.fetchRefreshToken(result.phoneNumber.replace(/\D/g, '').slice(-10)))
          .then(result => this.otplogin(result))
          .then(() => this.$router.push({ name: 'user' }))
          .catch(function (error) {
            // User couldn't sign in (bad verification code?)
            // ...
            window.error = error;
          });
        //}
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
      otp: { required, otp }
    },
  },
};
