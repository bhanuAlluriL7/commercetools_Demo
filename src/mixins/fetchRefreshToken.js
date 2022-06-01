/* eslint-disable no-unused-vars */
import gql from 'graphql-tag';

export default {
  props : ["phoneNumber"],
  methods: {
    fetchRefreshToken(phoneNumber) {
      this.phoneNumber = "\""+phoneNumber+"\"";
      return this.$apollo.query({
        query: gql`
          query customers($where: String!) {
            customers(where: $where) {
              results {
                custom {
                  customFieldsRaw {
                    name
                    value
                  }
                }
              }
            }
          }`,
          variables: {
            "where" : `custom(fields(phone=${this.phoneNumber}))` 
          },
      })
    }
  }
};
