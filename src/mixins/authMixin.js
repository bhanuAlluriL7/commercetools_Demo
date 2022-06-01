/* eslint-disable no-unused-vars */
import { clientLogout, clientLogin, clientOtpLogin } from '../auth';

export default {
  methods: {
    login(username, password) {
      return clientLogin(this.$apolloProvider.defaultClient, { username, password });
    },

    logout() {
      return clientLogout(this.$apolloProvider.defaultClient, () => this.$router.replace({ query: { logout: true } }));
    },

    otplogin(response) {
      let results = response.data.customers.results;
      let refreshToken = '';
      if (results) {
        for (let j=0;j<results.length;j++) {
          let customFields = results[j].custom.customFieldsRaw;
          if (customFields) {
            for (let i=0;i<customFields.length;i++) {
              if(customFields[i]) {
                if (customFields[i].name == "refreshToken") {
                  refreshToken = customFields[i].value;
                  break;
                }
              }
            }
          }
        }
      }
      return clientOtpLogin(this.$apolloProvider.defaultClient,{refreshToken});
    }
  },
};
