new Vue({
  el: '#app',
  data: {
    httpsMethod: 'GET',
    apiUrl: '', // HTTPS URL for the API
    xmlEntry: '', // XML data for the request
    response: '', // Response from the server
    code: '',
  },
  
  methods: {
    test() {
      const parts = this.apiUrl.split('/');
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
      this.test = '';
      this.apiUrl = this.xmlEntry;
      const code = this.getCode();
      const c = this.httpsMethod === 'GET' ? '' : (code === '' ? '' : '/' + code);
      const url = this.apiUrl + c;
      // const data = { entry: this.xmlEntry };

      this.response = url;
      this.test();
      axios({
        method: this.httpsMethod,
        url: url,
        data: { entry: this.xmlEntry },
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
      <textarea v-model="xmlEntry" placeholder="XML entry" rows="10"></textarea>
      <br>
      <button @click="submitForm">Submit</button>
      <br>
      <textarea v-model="response" placeholder="Response" rows="10"></textarea>
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
