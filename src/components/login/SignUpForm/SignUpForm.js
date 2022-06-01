/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import {
  required, email, minLength, sameAs, numeric,
} from 'vuelidate/lib/validators';
import gql from 'graphql-tag';
import authMixin from '../../../mixins/authMixin';
import customerMixin from '../../../mixins/customerUpdateRefreshToken';
import ServerError from '../../common/form/ServerError/ServerError.vue';
import LoadingButton from '../../common/form/LoadingButton/LoadingButton.vue';
import BaseInput from '../../common/form/BaseInput/BaseInput.vue';
import BaseForm from '../../common/form/BaseForm/BaseForm.vue';
import fetchRefreshToken from '../../../mixins/fetchRefreshToken';


export default {
  components: {
    BaseForm,
    BaseInput,
    ServerError,
    LoadingButton,
  },
  mixins: [authMixin,customerMixin,fetchRefreshToken],
  data: () => ({
    form: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      repeatPassword: '',
      agreeToTerms: false,
      phoneNumber: '',
      duplicatePhoneNumber:'',
      duplicateEmail:''
    },
  }),
  methods: {
    async customerSignMeUp1() {
      //let response = "{\"data\":null,\"errors\":[{\"message\":\"Thereisalreadyanexistingcustomerwiththeprovidedemail.\",\"path\":[\"customerSignMeUp\"],\"locations\":[{\"line\":2,\"column\":3}],\"code\":\"DuplicateField\",\"duplicateValue\":\"test@a.com\",\"field\":\"email\",\"extensions\":{\"code\":\"DuplicateField\",\"duplicateValue\":\"test@a.com\",\"field\":\"email\"}}]}";
      //return JSON.parse(response);
      this.form.error="Error happend";
    },
    customerSignMeUp() {
      this.form.duplicatePhoneNumber="";
      this.form.duplicateEmail="";
      var response = this.fetchRefreshToken(this.form.phoneNumber);
      response.then((response) => {
        if(response.data.customers.results.length > 0) {
          this.form.duplicatePhoneNumber="Duplicate phoneNumber";
        } else {
          this.form.duplicateEmail="Duplicate Email";
          return this.$apollo.mutate({
          mutation: gql`
            mutation customerSignMeUp($draft: CustomerSignMeUpDraft!) {
              customerSignMeUp(draft: $draft) {
                customer {
                  id
                }
              }
            }`,
          variables: {
            draft: {
              email: this.form.email,
              password: this.form.password,
              firstName: this.form.firstName,
              lastName: this.form.lastName,
              custom : {
                typeKey: "customerDetails",
                fields : {
                  "name": "phone",
                  "value": "\""+this.form.phoneNumber+"\""
                }
              }
            },
          },
        }).then(() => this.login(this.form.email, this.form.password))
          .then(() => this.updateCustomerProfile())
          .then(() => this.$router.push({ name: 'user' }));
      }
      })
    },
    getErrorMessage({ code, field }) {
      if (code === 'DuplicateField' && field === 'email') {
        return this.$t('duplicatedEmail');
      }
      return this.$t('unknownError');
    },
    validatePhone(event) {
      fetchRefreshToken(event.value)
      .then(res => {
          
      });
    },

  },
  validations: {
    form: {
      firstName: { required },
      lastName: { required },
      email: { required, email },
      phoneNumber: { required, minLength: minLength(10)},
      password: { required, minLength: minLength(5) },
      repeatPassword: { sameAsPassword: sameAs('password') },
      agreeToTerms: { required, mustBeAgreed: sameAs(() => true) },
    },
  },
};
