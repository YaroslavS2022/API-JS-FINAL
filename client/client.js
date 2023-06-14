new Vue({
  el: '#app',
  data: {
    httpsMethod: 'GET',
    APIQuery: '',
    xmlEntry: '', // XML data for the request
    response: '', // Response from the server
    code: '',
  },
  methods: {
    test() {
      const parts = this.APIQuery.split('/');
      return parts[parts.length - 1];
    },
    getCode() {
      const xmlCode = this.xmlEntry;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlCode, 'text/xml');
      const codeElement = xmlDoc.querySelector('opcode');
      if (codeElement) {
        const code = codeElement.textContent;
        this.code = code;
        console.log('CODE:', code);
        return code;
      }
      return '';
    },
    submitForm() {
      this.response = '';
      // this.api = this.xmlEntry;
      const code = this.getCode();
      console.log(code);
      console.log();
      const APIRequest = this.test();
      if (APIRequest === 'birgi' || APIRequest === 'securities')
        console.log('calm');
      else if (APIRequest === 'depoagrees')
        console.log('panic')
      else
        console.log('total panic');
      const url = this.APIQuery;
      console.log();
      console.log();
      console.log(url);
      console.log("----------------------------");
      console.log(this.APIQuery);
      console.log();
      console.log();

      // const data = { entry: this.xmlEntry };

      this.response = url;
      this.test();
      axios({
        method: this.httpsMethod,
        url: url,
        headers: { 'Content-Type': 'text/xml' }, // Set the Content-Type header to text/xml
        data: this.xmlEntry, // Pass the XML data directly
      })
        .then((response) => {
          this.response = '';
          this.response = response.data;
          this.code = '';
          console.log(response);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    },
  },
  template: `
    <div>
      <select v-model="httpsMethod">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
      </select>
      <br>
      <br>
      <textarea v-model="APIQuery" placeholder="API query" rows="1" style="width: 65%"></textarea>
      <br>
      <br>
      <div style="display: flex;">
        <textarea v-model="xmlEntry" placeholder="XML entry" rows="20" style="width: 50%"></textarea>
        <textarea v-model="response" placeholder="Response" rows="20" style="width: 50%"></textarea>
      </div>
      <br>
      <button @click="submitForm">Submit</button>
      <br>
      <br>
      <br>
      <textarea v-model="test()" placeholder="this is a test field" rows="5"></textarea>
      <br>
      <br>
      <button @click="getCode">TEST</button>
      <br>
    </div>
  `,
});
