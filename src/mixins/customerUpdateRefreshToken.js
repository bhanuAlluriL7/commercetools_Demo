/* eslint-disable no-unused-vars */
import customerMixin from './customerMixin';

export default {
  mixins: [customerMixin],
  methods: {
    updateCustomerProfile() {
      let refreshToken = this.$store.state.authenticated.refresh_token;
      let formated = "\""+refreshToken+"\""
      return this.updateMyCustomer([
        { setCustomField: { value:  formated ,
      name : "refreshToken"} }
      ]);
    }  
  },
};
